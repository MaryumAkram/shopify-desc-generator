import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import {
  Sparkles,
  Zap,
  Target,
  RefreshCw,
  ShoppingBag,
  Star,
  CheckCircle,
  ArrowRight,
  Brain,
  Search,
  Copy,
  ChevronDown,
  AlertCircle,
  Moon,
  Sun,
  Download
} from 'lucide-react'
import { motion } from 'framer-motion'
import './App.css'

function App() {
  const [productName, setProductName] = useState('')
  const [productFeatures, setProductFeatures] = useState('')
  const [tone, setTone] = useState('')
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const generateDescription = async () => {
    setError('')
    
    if (!productName.trim()) {
      setError('Please enter a product name')
      return
    }
    
    if (!tone) {
      setError('Please select a tone')
      return
    }

    setIsGenerating(true)
    
    try {
      // Call Azure OpenAI API for real description generation
      const response = await fetch('http://localhost:5000/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          productFeatures,
          tone,
          language
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate description')
      }

      const data = await response.json()
      setGeneratedDescription(data.description)
    } catch (error) {
      console.error('Error generating description:', error)
      
      // Fallback to mock descriptions if API fails
      const descriptions = {
        en: {
          professional: `Introducing the ${productName} - a premium solution designed for discerning customers who value quality and performance. ${productFeatures ? `Featuring ${productFeatures.toLowerCase()}, ` : ''}this exceptional product combines innovative design with practical functionality. Crafted with attention to detail and built to last, it represents the perfect balance of style and substance. Experience the difference that quality makes with this outstanding addition to your collection.`,
          casual: `Meet the ${productName} - your new favorite thing! ${productFeatures ? `With ${productFeatures.toLowerCase()}, ` : ''}this awesome product is exactly what you've been looking for. It's super easy to use, looks great, and just works perfectly. Whether you're treating yourself or finding the perfect gift, this is definitely a winner. Get ready to love it!`,
          luxury: `Discover the exquisite ${productName} - an embodiment of sophistication and refined taste. ${productFeatures ? `Meticulously crafted with ${productFeatures.toLowerCase()}, ` : ''}this distinguished piece represents the pinnacle of luxury and exclusivity. Each detail has been carefully considered to deliver an unparalleled experience that exceeds the highest expectations. Indulge in the extraordinary with this remarkable masterpiece.`
        },
        es: {
          professional: `Presentamos el ${productName} - una solución premium diseñada para clientes exigentes que valoran la calidad y el rendimiento. ${productFeatures ? `Con ${productFeatures.toLowerCase()}, ` : ''}este producto excepcional combina diseño innovador con funcionalidad práctica. Elaborado con atención al detalle y construido para durar, representa el equilibrio perfecto entre estilo y sustancia.`,
          casual: `¡Conoce el ${productName} - tu nueva cosa favorita! ${productFeatures ? `Con ${productFeatures.toLowerCase()}, ` : ''}este increíble producto es exactamente lo que has estado buscando. Es súper fácil de usar, se ve genial y funciona perfectamente. Ya sea que te consientas o busques el regalo perfecto, ¡definitivamente es un ganador!`,
          luxury: `Descubre el exquisito ${productName} - una encarnación de sofisticación y gusto refinado. ${productFeatures ? `Meticulosamente elaborado con ${productFeatures.toLowerCase()}, ` : ''}esta pieza distinguida representa el pináculo del lujo y la exclusividad. Cada detalle ha sido cuidadosamente considerado para ofrecer una experiencia sin igual.`
        },
        fr: {
          professional: `Découvrez le ${productName} - une solution premium conçue pour les clients exigeants qui valorisent la qualité et la performance. ${productFeatures ? `Doté de ${productFeatures.toLowerCase()}, ` : ''}ce produit exceptionnel combine un design innovant avec une fonctionnalité pratique. Fabriqué avec attention aux détails et conçu pour durer, il représente l'équilibre parfait entre style et substance.`,
          casual: `Rencontrez le ${productName} - votre nouvelle chose préférée! ${productFeatures ? `Avec ${productFeatures.toLowerCase()}, ` : ''}ce produit génial est exactement ce que vous cherchiez. Il est super facile à utiliser, a l'air génial et fonctionne parfaitement. Que vous vous fassiez plaisir ou que vous trouviez le cadeau parfait, c'est définitivement un gagnant!`,
          luxury: `Découvrez l'exquis ${productName} - une incarnation de sophistication et de goût raffiné. ${productFeatures ? `Méticuleusement conçu avec ${productFeatures.toLowerCase()}, ` : ''}cette pièce distinguée représente le summum du luxe et de l'exclusivité. Chaque détail a été soigneusement considéré pour offrir une expérience inégalée.`
        }
      }
      
      const langDescriptions = descriptions[language] || descriptions.en
      setGeneratedDescription(langDescriptions[tone] || langDescriptions.professional)
      setError('Using offline mode - Azure AI temporarily unavailable')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDescription)
  }

  const downloadDescription = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedDescription], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${productName.replace(/\s+/g, '_')}_description.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const features = [
    {
      icon: <Target className="h-6 w-6" aria-label="Target icon" />,
      title: "Tone Selector",
      description: "Adapt your brand voice with professional, casual, or luxury tones"
    },
    {
      icon: <Search className="h-6 w-6" aria-label="Search icon" />,
      title: "SEO Keywords",
      description: "Rank higher with smart, search-optimized content"
    },
    {
      icon: <RefreshCw className="h-6 w-6" aria-label="Refresh icon" />,
      title: "Regenerate Button",
      description: "Get different variations until you find the perfect description"
    },
    {
      icon: <ShoppingBag className="h-6 w-6" aria-label="Shopping bag icon" />,
      title: "Built for Shopify",
      description: "Optimized specifically for e-commerce product pages"
    },
    {
      icon: <Zap className="h-6 w-6" aria-label="Lightning icon" />,
      title: "Lightning Fast",
      description: "Generate descriptions in seconds, not hours"
    },
    {
      icon: <Sparkles className="h-6 w-6" aria-label="Sparkles icon" />,
      title: "100% Free",
      description: "No hidden costs, no subscriptions, completely free to use"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Shopify Store Owner",
      content: "Cut my writing time by 90%! Love the tone selector - it perfectly matches my brand voice.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Product Marketer",
      content: "Descriptions are clean, SEO-friendly, and ready to go. This tool is a game-changer!",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "E-commerce Manager",
      content: "Finally, a tool that understands Shopify! No more generic AI responses.",
      rating: 5
    }
  ]

  const faqs = [
    {
      question: "Is it really free?",
      answer: "Yes! Our AI Product Description Generator is completely free to use. No hidden costs, no subscriptions, no credit card required."
    },
    {
      question: "How is this different from ChatGPT?",
      answer: "Unlike generic AI tools, we're specifically optimized for Shopify product descriptions. No prompt crafting needed - just enter your product details and get professional, SEO-optimized descriptions instantly."
    },
    {
      question: "Can I use this for any Shopify store?",
      answer: "Absolutely! Our tool works with any Shopify store, regardless of your plan or theme. The generated descriptions are compatible with all Shopify product pages."
    },
    {
      question: "Do you save my data?",
      answer: "We respect your privacy. Product information you enter is only used to generate descriptions and is not stored or shared with third parties."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDarkMode}
          className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="h-4 w-4" aria-label="Sun icon" />
          ) : (
            <Moon className="h-4 w-4" aria-label="Moon icon" />
          )}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <Sparkles className="h-3 w-3 mr-1" aria-label="Sparkles icon" />
              Built on Azure AI · No Signup Needed
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Generate SEO-Optimized Product Descriptions
              <span className="text-blue-600"> in Seconds</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered Shopify content assistant that boosts your sales and saves time.
              Create compelling, search-optimized product descriptions instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Try It Free
                <ArrowRight className="ml-2 h-4 w-4" aria-label="Arrow right icon" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Generate perfect product descriptions in just 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Brain className="h-8 w-8" aria-label="Brain icon" />, title: "Enter Details", desc: "Product name & features" },
              { icon: <Target className="h-8 w-8" aria-label="Target icon" />, title: "Select Tone", desc: "Choose your brand voice" },
              { icon: <Sparkles className="h-8 w-8" aria-label="Sparkles icon" />, title: "Get Description", desc: "SEO-rich content ready" },
              { icon: <Copy className="h-8 w-8" aria-label="Copy icon" />, title: "Copy & Use", desc: "Push to Shopify instantly" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try It Now</h2>
            <p className="text-lg text-gray-600">See the magic happen in real-time</p>
          </div>
          <Card className="p-4 sm:p-6">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="font-semibold mb-4">Product Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <Input
                      placeholder="e.g., Wireless Bluetooth Headphones"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Key Features (Optional)</label>
                    <Textarea
                      placeholder="e.g., noise cancellation, 30-hour battery, premium leather"
                      value={productFeatures}
                      onChange={(e) => setProductFeatures(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual & Friendly</SelectItem>
                        <SelectItem value="luxury">Luxury & Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-600">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button
                    onClick={generateDescription}
                    disabled={!productName.trim() || !tone || isGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" aria-label="Loading spinner" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" aria-label="Sparkles icon" />
                        Generate Description
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Generated Description</h3>
                <div className="bg-gray-50 border rounded-lg p-4 min-h-[200px] relative dark:bg-gray-800 dark:border-gray-700">
                  {generatedDescription ? (
                    <>
                      <p className="text-gray-800 leading-relaxed dark:text-gray-200">{generatedDescription}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="absolute top-2 right-2"
                        aria-label="Copy description to clipboard"
                      >
                        <Copy className="h-4 w-4" aria-label="Copy icon" />
                      </Button>
                    </>
                  ) : (
                    <p className="text-gray-500 italic dark:text-gray-400">Your generated description will appear here...</p>
                  )}
                </div>
                {generatedDescription && (
                  <>
                    <div className="mt-4 flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm" onClick={generateDescription} aria-label="Regenerate description">
                        <RefreshCw className="mr-2 h-4 w-4" aria-label="Refresh icon" />
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadDescription} aria-label="Download description">
                        <Download className="mr-2 h-4 w-4" aria-label="Download icon" />
                        Download
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" aria-label="Use description in Shopify">
                        Use in Shopify
                      </Button>
                    </div>
                    
                    {/* Shopify Product Preview */}
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3 text-sm text-gray-600 dark:text-gray-400">Shopify Preview</h4>
                      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-gray-400" aria-label="Product placeholder" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-lg mb-2 dark:text-white">{productName || 'Product Name'}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{generatedDescription}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-lg font-bold text-green-600">$99.99</span>
                              <Badge variant="secondary" className="text-xs">In Stock</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600">Everything you need to create compelling product descriptions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-blue-600 mb-2">{feature.icon}</div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600">Join thousands of satisfied Shopify store owners</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4" role="img" aria-label={`${testimonial.rating} star rating`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use This Tool Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Tool?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Saves Time", desc: "No more writing from scratch - generate descriptions in seconds" },
              { title: "Built for Shopify", desc: "Not generic AI - specifically optimized for e-commerce" },
              { title: "Better than ChatGPT", desc: "No prompt crafting needed - just enter product details" },
              { title: "Azure-Powered", desc: "Scalable, secure, and reliable AI infrastructure" }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} 
                      aria-label={openFaq === index ? "Collapse answer" : "Expand answer"}
                    />
                  </div>
                </CardHeader>
                {openFaq === index && (
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Product Descriptions?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Shopify store owners who save hours every week
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3" aria-label="Start generating product descriptions now">
            Start Generating Now
            <ArrowRight className="ml-2 h-4 w-4" aria-label="Arrow right icon" />
          </Button>
          <p className="text-blue-200 mt-4">No login. No code. Just results.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">AI Description Generator</h3>
              <p className="text-gray-400">
                Powered by Azure AI to help Shopify store owners create better product descriptions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">How it Works</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Product Description Generator. Built with Azure AI.</p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA */}
      <div className="fixed bottom-4 right-4 z-50 hidden sm:block">
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg" aria-label="Try the product description generator for free">
          Try Free Now
          <ArrowRight className="ml-2 h-4 w-4" aria-label="Arrow right icon" />
        </Button>
      </div>
    </div>
  )
}

export default App

