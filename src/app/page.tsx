'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Eye,
  TrendingUp,
  Package,
  Clock,
  AlertTriangle,
  DollarSign,
  Globe,
  Users,
  Target,
  Database,
  Leaf,
  Truck,
  ShieldCheck,
  Wallet,
  GraduationCap,
  X,
  ChevronRight,
  Play,
  Check,
  ArrowRight,
  Zap,
  Lock,
  Layers,
  BarChart3,
  Cpu,
  Network,
  FileCheck,
  Settings,
  Building2,
  Briefcase,
  Sparkles,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  MessageCircle,
  Menu,
  Server,
  Cloud,
  Shield,
  Activity,
  PieChart,
  LineChart,
  Box,
  AlertCircle,
  Gauge,
  Compass,
  RefreshCw,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  Radio,
  Timer,
  Warehouse,
  Ship,
  Plane,
  Container,
  Route,
  Map,
  FileText,
  ClipboardCheck,
  Lightbulb,
  ChevronDown,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Pain Points Data
const painPoints = [
  {
    id: 1,
    icon: Eye,
    title: 'Visibility Gaps',
    brief: 'Lack of real-time visibility across the supply chain network',
    details: 'Our Control Tower solution provides end-to-end visibility across your entire supply chain. Real-time tracking of shipments, inventory levels, and supplier performance metrics all in one unified dashboard. Eliminate blind spots and make data-driven decisions with confidence.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    icon: TrendingUp,
    title: 'Demand Forecasting',
    brief: 'Difficulty predicting demand accurately',
    details: 'AI-powered demand planning uses machine learning algorithms to analyze historical data, market trends, and external factors. Achieve up to 95% forecast accuracy and reduce stockouts by 40%. Our models continuously learn and adapt to changing market conditions.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    icon: Package,
    title: 'Inventory Management',
    brief: 'Balancing stock levels with service requirements',
    details: 'Smart inventory optimization dynamically adjusts safety stock levels based on demand variability, lead times, and service level targets. Reduce carrying costs by 25% while maintaining 99% service levels. Multi-echelon optimization across your entire network.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    icon: Clock,
    title: 'Lead-Time Variability',
    brief: 'Unreliable delivery times and supply chain delays',
    details: 'Predictive lead time analytics identify delays before they happen. Real-time alerts for potential disruptions, alternative routing suggestions, and automated rescheduling. Reduce lead time variability by 35% and improve on-time delivery rates.',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    id: 5,
    icon: AlertTriangle,
    title: 'Supply Chain Disruption',
    brief: 'Vulnerability to pandemics, geopolitical events, natural disasters',
    details: 'Risk Intelligence Center monitors global events and predicts potential disruptions. Scenario planning tools help you prepare for contingencies. Supplier risk assessments and alternative sourcing recommendations ensure business continuity.',
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 6,
    icon: DollarSign,
    title: 'Cost-to-Serve',
    brief: 'Understanding and managing true costs across the chain',
    details: 'Activity-based costing models provide granular visibility into true costs. Identify hidden costs, optimize routes, and make profitable product-mix decisions. Reduce total cost-to-serve by 15-20% with data-driven optimization.',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 7,
    icon: Globe,
    title: 'Global Pipeline Complexity',
    brief: 'Managing extended global supply networks',
    details: 'Unified platform for managing complex global operations. Multi-currency, multi-language, multi-timezone support. Customs documentation automation, trade compliance, and duty optimization across 150+ countries.',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 8,
    icon: Users,
    title: 'Supplier Relationship',
    brief: 'Building trust and collaboration with suppliers',
    details: 'Supplier Collaboration Hub enables seamless communication and data sharing. Performance scorecards, collaborative forecasting, and joint business planning tools. Build strategic partnerships that drive mutual value.',
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 9,
    icon: Target,
    title: 'Customer Service Excellence',
    brief: 'Meeting perfect order requirements (OTIF - On Time In Full)',
    details: 'End-to-end order orchestration ensures perfect order fulfillment. Real-time order tracking, proactive exception management, and automated customer communications. Achieve 99.7% OTIF performance.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 10,
    icon: Database,
    title: 'Information Silos',
    brief: 'Lack of integration across supply chain partners',
    details: 'Unified data platform breaks down information silos. API-first architecture integrates with ERP, WMS, TMS, and partner systems. Real-time data synchronization ensures everyone works from the same truth.',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 11,
    icon: Leaf,
    title: 'Sustainability',
    brief: 'Reducing environmental impact and carbon footprint',
    details: 'Carbon tracking across the entire supply chain. Sustainability scorecards for suppliers, route optimization for emissions reduction, and circular economy support. Meet ESG goals while reducing costs.',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 12,
    icon: Truck,
    title: 'Last Mile Delivery',
    brief: 'Efficient final delivery to customers',
    details: 'Dynamic route optimization reduces last-mile costs by 20%. Real-time delivery tracking, proof of delivery, and customer communication. Integrate with major carriers and crowdsourced delivery networks.',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 13,
    icon: ShieldCheck,
    title: 'Counterfeiting & Traceability',
    brief: 'Product authenticity and provenance',
    details: 'Blockchain-powered traceability ensures product authenticity. Immutable records from source to consumer. QR code verification, digital certificates, and anti-counterfeiting alerts.',
    color: 'from-slate-500 to-gray-500'
  },
  {
    id: 14,
    icon: Wallet,
    title: 'Working Capital',
    brief: 'Tied up capital in inventory and receivables',
    details: 'Cash flow optimization through inventory reduction and payment term management. Dynamic discounting, supply chain finance integration, and working capital analytics. Free up millions in working capital.',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    id: 15,
    icon: GraduationCap,
    title: 'Talent Gap',
    brief: 'Shortage of skilled supply chain professionals',
    details: 'Intuitive interface reduces training time by 60%. Built-in best practices, guided workflows, and AI-assisted decision making. Empower your team to perform like supply chain experts.',
    color: 'from-cyan-500 to-blue-500'
  }
]

// Solutions Data
const solutions = [
  {
    id: 1,
    icon: Network,
    title: 'Supply Chain Control Tower',
    description: 'Real-time visibility dashboard for end-to-end supply chain monitoring',
    capabilities: ['Global shipment tracking', 'Exception management & alerts', 'Performance analytics', 'Supplier scorecards'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    icon: Cpu,
    title: 'AI Demand Planning',
    description: 'Machine learning forecasting with 95%+ accuracy',
    capabilities: ['Multi-level forecasting', 'External data integration', 'Scenario planning', 'Automatic model selection'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    icon: Package,
    title: 'Smart Inventory Optimization',
    description: 'Dynamic stock management across your network',
    capabilities: ['Multi-echelon optimization', 'Safety stock calculation', 'Service level optimization', 'Slow-moving inventory alerts'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    icon: Lock,
    title: 'Blockchain Traceability',
    description: 'Immutable supply chain records for authenticity',
    capabilities: ['End-to-end traceability', 'Digital certificates', 'Anti-counterfeiting', 'Quality verification'],
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 5,
    icon: Shield,
    title: 'Risk Intelligence Center',
    description: 'Predictive risk analytics for supply chain resilience',
    capabilities: ['Real-time risk monitoring', 'Supplier risk assessment', 'Disruption prediction', 'Contingency planning'],
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 6,
    icon: Users,
    title: 'Supplier Collaboration Hub',
    description: 'Network integration for seamless partner collaboration',
    capabilities: ['Supplier portal', 'Collaborative forecasting', 'Document sharing', 'Performance management'],
    color: 'from-teal-500 to-cyan-500'
  }
]

// Animated Counter Component
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    
    // Cleanup: cancel animation frame on unmount
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isInView, end, duration])

  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

// Particle Background Component
function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-500/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            opacity: 0
          }}
          animate={{
            x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
            y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  )
}

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ChainFlow
            </span>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-8">
            {['Solutions', 'Platform', 'Pricing', 'Resources'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-slate-300 hover:text-white transition-colors relative group"
                whileHover={{ y: -2 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
              Request Demo
            </Button>
          </div>

          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-6 space-y-4">
              {['Solutions', 'Platform', 'Pricing', 'Resources'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-slate-300 hover:text-white py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <Button variant="ghost" className="w-full text-slate-300">Sign In</Button>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600">Request Demo</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <ParticleBackground />
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/supply-chain-network.png"
          alt="Supply Chain Network"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950" />
      </div>

      {/* Animated Network Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {[...Array(10)].map((_, i) => (
          <motion.line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Blockchain-Powered Supply Chain Intelligence
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Supply Chain Intelligence.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Redefined.
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A blockchain-powered ecosystem delivering unprecedented visibility, speed, and trust.
            <span className="text-cyan-400"> 100x faster</span> than traditional systems with
            <span className="text-blue-400"> military-grade security</span>.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg group">
              Request Demo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 px-8 py-6 text-lg group">
              <Play className="mr-2 w-5 h-5" />
              Watch Platform Video
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { value: 99.7, suffix: '%', label: 'Order Accuracy' },
              { value: 40, suffix: '%', label: 'Cost Reduction' },
              { value: 2.3, suffix: 's', label: 'Transaction Speed' },
              { value: 150, suffix: '+', label: 'Countries Served' }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  <AnimatedCounter end={stat.value * 10} suffix={stat.suffix} />
                </div>
                <div className="text-slate-400 text-sm sm:text-base mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1.5 h-3 bg-cyan-500 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Pain Points Section
function PainPointsSection() {
  const [selectedPainPoint, setSelectedPainPoint] = useState<typeof painPoints[0] | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="solutions" className="py-20 lg:py-32 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-red-500/10 text-red-400 border-red-500/20">
            Industry Challenges
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Tackling Supply Chain&apos;s
            <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent"> Biggest Pain Points</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We&apos;ve identified and built solutions for the 15 most critical challenges facing modern supply chains.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {painPoints.map((point, index) => (
            <motion.div
              key={point.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card
                className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group h-full"
                onClick={() => setSelectedPainPoint(point)}
              >
                <CardHeader className="p-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${point.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <point.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg group-hover:text-cyan-400 transition-colors">
                    {point.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-slate-400 text-sm line-clamp-2">{point.brief}</p>
                  <div className="flex items-center text-cyan-400 text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedPainPoint} onOpenChange={() => setSelectedPainPoint(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
          {selectedPainPoint && (
            <>
              <DialogHeader>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedPainPoint.color} flex items-center justify-center mb-4`}>
                  <selectedPainPoint.icon className="w-8 h-8 text-white" />
                </div>
                <DialogTitle className="text-2xl">{selectedPainPoint.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-slate-400 mb-4">{selectedPainPoint.brief}</p>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="text-cyan-400 font-semibold mb-2">Our Solution</h4>
                  <p className="text-slate-300 text-sm">{selectedPainPoint.details}</p>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600">
                  See How It Works
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

// Solutions Platform Section
function SolutionsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="platform" className="py-20 lg:py-32 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
            Platform Solutions
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Comprehensive Solutions for
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"> Modern Supply Chains</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            An integrated suite of tools designed to optimize every aspect of your supply chain operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 h-full overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                  <div className="absolute bottom-4 left-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center shadow-lg`}>
                      <solution.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
                <CardHeader className="p-6">
                  <CardTitle className="text-white text-xl group-hover:text-purple-400 transition-colors">
                    {solution.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <ul className="space-y-2">
                    {solution.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-center text-slate-300 text-sm">
                        <Check className="w-4 h-4 text-cyan-500 mr-2 flex-shrink-0" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Optimization Assessment Section
function AssessmentSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const assessmentCategories = [
    {
      id: 'inventory',
      title: 'Inventory Management',
      icon: Package,
      questions: [
        'How accurate is your demand forecasting?',
        'Do you have real-time inventory visibility across all locations?',
        'How often do you experience stockouts?'
      ]
    },
    {
      id: 'planning',
      title: 'Planning & Scheduling',
      icon: Calendar,
      questions: [
        'How integrated is your sales and operations planning?',
        'Can you quickly adjust plans when demand changes?',
        'How automated is your production scheduling?'
      ]
    },
    {
      id: 'supplier',
      title: 'Supplier Coordination',
      icon: Users,
      questions: [
        'Do you have real-time visibility into supplier performance?',
        'How quickly can you identify alternative suppliers?',
        'How collaborative is your supplier relationship?'
      ]
    },
    {
      id: 'logistics',
      title: 'Logistics Visibility',
      icon: Truck,
      questions: [
        'Can you track shipments in real-time across all modes?',
        'How proactive are your exception management processes?',
        'Do you have end-to-end supply chain visibility?'
      ]
    },
    {
      id: 'disruption',
      title: 'Disruption Response',
      icon: AlertTriangle,
      questions: [
        'How quickly can you respond to supply disruptions?',
        'Do you have contingency plans for critical suppliers?',
        'Can you simulate different disruption scenarios?'
      ]
    }
  ]

  const calculateMaturity = () => {
    const total = Object.values(answers).reduce((sum, val) => sum + val, 0)
    const maxPossible = Object.keys(answers).length * 5
    return Math.round((total / maxPossible) * 100)
  }

  const getMaturityLevel = (score: number) => {
    if (score >= 80) return { level: 'Advanced', color: 'text-green-400', description: 'Your supply chain is well-optimized with strong visibility and resilience.' }
    if (score >= 60) return { level: 'Developing', color: 'text-yellow-400', description: 'Good foundation but opportunities exist to enhance visibility and planning.' }
    if (score >= 40) return { level: 'Basic', color: 'text-orange-400', description: 'Significant gaps in visibility, planning, and coordination exist.' }
    return { level: 'Initial', color: 'text-red-400', description: 'Major improvements needed across all supply chain dimensions.' }
  }

  const estimateLosses = (score: number) => {
    const baseLoss = 5000000 // $5M base
    const inefficiencyFactor = (100 - score) / 100
    return Math.round(baseLoss * inefficiencyFactor * (1 + Math.random() * 0.5))
  }

  const getRoadmap = (score: number) => {
    if (score < 40) {
      return [
        { priority: 1, action: 'Implement real-time data visibility', impact: 'Critical for all downstream improvements' },
        { priority: 2, action: 'Establish demand planning baseline', impact: 'Foundation for inventory optimization' },
        { priority: 3, action: 'Create supplier performance scorecards', impact: 'Enables strategic sourcing decisions' }
      ]
    } else if (score < 60) {
      return [
        { priority: 1, action: 'Deploy inventory orchestration platform', impact: 'Reduce carrying costs by 15-25%' },
        { priority: 2, action: 'Implement transport routing optimization', impact: 'Lower logistics costs 10-20%' },
        { priority: 3, action: 'Build scenario planning capabilities', impact: 'Improve disruption response time' }
      ]
    } else {
      return [
        { priority: 1, action: 'Deploy AI-driven demand sensing', impact: 'Achieve 95%+ forecast accuracy' },
        { priority: 2, action: 'Implement control tower for end-to-end visibility', impact: 'Proactive exception management' },
        { priority: 3, action: 'Enable supplier collaboration network', impact: 'Reduce lead times by 20-30%' }
      ]
    }
  }

  const maturity = calculateMaturity()
  const maturityInfo = getMaturityLevel(maturity)

  if (showResults) {
    return (
      <section id="assessment" className="py-20 lg:py-32 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Your Results
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Supply Chain Maturity Assessment
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Maturity Score */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-cyan-400" />
                    Maturity Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className={`text-6xl font-bold ${maturityInfo.color} mb-2`}>{maturity}%</div>
                    <div className={`text-2xl font-semibold ${maturityInfo.color} mb-4`}>{maturityInfo.level}</div>
                    <p className="text-slate-400">{maturityInfo.description}</p>
                  </div>
                  <Progress value={maturity} className="h-3 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500" />
                </CardContent>
              </Card>

              {/* Estimated Losses */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-red-400" />
                    Estimated Annual Losses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-5xl font-bold text-red-400 mb-2">
                      ${(estimateLosses(maturity) / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-slate-400 mb-4">
                      Due to supply chain inefficiencies, visibility gaps, and suboptimal planning
                    </p>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left">
                      <p className="text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 inline mr-2" />
                        Potential savings of <strong>${((estimateLosses(maturity) * 0.4) / 1000000).toFixed(1)}M - ${((estimateLosses(maturity) * 0.6) / 1000000).toFixed(1)}M</strong> achievable through optimization
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Optimization Roadmap */}
            <Card className="bg-slate-800/50 border-slate-700/50 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-purple-400" />
                  Recommended Optimization Roadmap
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Based on your assessment, here&apos;s your prioritized action plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRoadmap(maturity).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {item.priority}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{item.action}</h4>
                        <p className="text-slate-400 text-sm">{item.impact}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8"
                onClick={() => { setShowResults(false); setAnswers({}); setCurrentStep(0) }}
              >
                Retake Assessment
                <RefreshCw className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  const currentCategory = assessmentCategories[currentStep]

  return (
    <section id="assessment" className="py-20 lg:py-32 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
            Free Assessment
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Supply Chain
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Maturity Assessment</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Discover your supply chain&apos;s strengths and gaps in 5 minutes. Get a personalized optimization roadmap.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Progress</span>
            <span>{Math.round((currentStep / assessmentCategories.length) * 100)}%</span>
          </div>
          <Progress value={(currentStep / assessmentCategories.length) * 100} className="h-2 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500" />
        </div>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <currentCategory.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">{currentCategory.title}</CardTitle>
                <CardDescription className="text-slate-400">
                  Category {currentStep + 1} of {assessmentCategories.length}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentCategory.questions.map((question, qIndex) => (
              <div key={qIndex} className="space-y-3">
                <p className="text-white font-medium">{question}</p>
                <div className="flex gap-2">
                  {['Not at all', 'Minimal', 'Moderate', 'Good', 'Excellent'].map((option, oIndex) => (
                    <button
                      key={oIndex}
                      onClick={() => setAnswers({ ...answers, [`${currentCategory.id}-${qIndex}`]: oIndex + 1 })}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
                        answers[`${currentCategory.id}-${qIndex}`] === oIndex + 1
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {oIndex + 1}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Not at all</span>
                  <span>Excellent</span>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-6 pt-0 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="border-slate-600 text-slate-300"
            >
              Previous
            </Button>
            {currentStep === assessmentCategories.length - 1 ? (
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                onClick={() => setShowResults(true)}
              >
                See Results
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </section>
  )
}

// Scenario Simulator Section
function SimulatorSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  const [scenarios, setScenarios] = useState({
    supplierDelay: 0,
    tariffIncrease: 0,
    warehouseCapacity: 100,
    inventoryBuffer: 50,
    routeDisruption: 0
  })

  const calculateImpact = () => {
    const baseService = 98
    const baseCost = 100
    const baseSpeed = 100

    const serviceImpact = -(
      scenarios.supplierDelay * 0.8 +
      scenarios.tariffIncrease * 0.2 +
      scenarios.routeDisruption * 1.5 -
      scenarios.inventoryBuffer * 0.1 -
      scenarios.warehouseCapacity * 0.02
    )

    const costImpact = (
      scenarios.supplierDelay * 1.2 +
      scenarios.tariffIncrease * 2 +
      scenarios.routeDisruption * 3 +
      scenarios.inventoryBuffer * 0.5 -
      scenarios.warehouseCapacity * 0.1
    )

    const speedImpact = -(
      scenarios.supplierDelay * 1.5 +
      scenarios.routeDisruption * 2
    )

    return {
      serviceLevel: Math.max(60, Math.min(100, baseService + serviceImpact)),
      costIncrease: Math.max(0, costImpact),
      fulfillmentSpeed: Math.max(40, Math.min(100, baseSpeed + speedImpact))
    }
  }

  const impact = calculateImpact()

  const sliders = [
    { key: 'supplierDelay', label: 'Supplier Delay (days)', icon: Clock, min: 0, max: 30, color: 'from-orange-500 to-red-500' },
    { key: 'tariffIncrease', label: 'Tariff Increase (%)', icon: DollarSign, min: 0, max: 25, color: 'from-yellow-500 to-orange-500' },
    { key: 'warehouseCapacity', label: 'Warehouse Capacity (%)', icon: Warehouse, min: 50, max: 100, color: 'from-green-500 to-emerald-500' },
    { key: 'inventoryBuffer', label: 'Inventory Buffer (days)', icon: Package, min: 0, max: 90, color: 'from-blue-500 to-cyan-500' },
    { key: 'routeDisruption', label: 'Route Disruptions', icon: Route, min: 0, max: 5, color: 'from-red-500 to-rose-500' }
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
            Interactive Simulator
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Scenario
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"> Impact Simulator</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Adjust conditions to see real-time impact on your supply chain performance.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700/50 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Scenario Variables
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Adjust the sliders to simulate different supply chain conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {sliders.map((slider) => (
                  <div key={slider.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <slider.icon className="w-4 h-4 text-slate-400" />
                        <span className="text-white text-sm">{slider.label}</span>
                      </div>
                      <span className="text-cyan-400 font-medium">{scenarios[slider.key as keyof typeof scenarios]}</span>
                    </div>
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      value={scenarios[slider.key as keyof typeof scenarios]}
                      onChange={(e) => setScenarios({ ...scenarios, [slider.key]: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Impact Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700/50 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Real-Time Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Level */}
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Service Level
                    </span>
                    <span className={`font-bold ${impact.serviceLevel >= 90 ? 'text-green-400' : impact.serviceLevel >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {impact.serviceLevel.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={impact.serviceLevel} className="h-2 bg-slate-600 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500" />
                </div>

                {/* Cost Impact */}
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Cost Increase
                    </span>
                    <span className={`font-bold ${impact.costIncrease <= 5 ? 'text-green-400' : impact.costIncrease <= 15 ? 'text-yellow-400' : 'text-red-400'}`}>
                      +{impact.costIncrease.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(100, impact.costIncrease * 3)} className="h-2 bg-slate-600 [&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-red-500" />
                </div>

                {/* Fulfillment Speed */}
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Fulfillment Speed
                    </span>
                    <span className={`font-bold ${impact.fulfillmentSpeed >= 85 ? 'text-green-400' : impact.fulfillmentSpeed >= 65 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {impact.fulfillmentSpeed.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={impact.fulfillmentSpeed} className="h-2 bg-slate-600 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500" />
                </div>

                {/* Risk Summary */}
                <div className={`p-4 rounded-lg border ${
                  impact.serviceLevel >= 85 && impact.costIncrease <= 10
                    ? 'bg-green-500/10 border-green-500/30'
                    : impact.serviceLevel >= 70 || impact.costIncrease <= 20
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`w-5 h-5 mt-0.5 ${
                      impact.serviceLevel >= 85 && impact.costIncrease <= 10
                        ? 'text-green-400'
                        : impact.serviceLevel >= 70 || impact.costIncrease <= 20
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`} />
                    <div>
                      <h4 className="text-white font-medium">Risk Assessment</h4>
                      <p className="text-slate-400 text-sm mt-1">
                        {impact.serviceLevel >= 85 && impact.costIncrease <= 10
                          ? 'Supply chain is resilient under current conditions. Continue monitoring key metrics.'
                          : impact.serviceLevel >= 70 || impact.costIncrease <= 20
                          ? 'Moderate risk detected. Consider increasing inventory buffers or diversifying suppliers.'
                          : 'High risk! Immediate action required. Activate contingency plans and expedite alternative sourcing.'}
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Get Detailed Analysis
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Executive Dashboard Demo Section
function DashboardDemoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeWidget, setActiveWidget] = useState<string | null>(null)

  const kpiData = [
    { label: 'Inventory Health', value: 94.2, change: 2.3, trend: 'up', icon: Package },
    { label: 'On-Time Delivery', value: 96.8, change: 1.1, trend: 'up', icon: Truck },
    { label: 'Stockout Risk', value: 3.2, change: -0.8, trend: 'down', icon: AlertTriangle },
    { label: 'Expedite Spend', value: 127, unit: 'K', change: -15, trend: 'down', icon: DollarSign }
  ]

  const shipments = [
    { id: 'SHP-2847', origin: 'Shanghai', destination: 'Los Angeles', status: 'In Transit', progress: 67, eta: '2 days' },
    { id: 'SHP-2848', origin: 'Rotterdam', destination: 'New York', status: 'Customs', progress: 85, eta: '1 day' },
    { id: 'SHP-2849', origin: 'Singapore', destination: 'Chicago', status: 'Delayed', progress: 45, eta: '5 days' },
    { id: 'SHP-2850', origin: 'Hamburg', destination: 'Miami', status: 'Delivered', progress: 100, eta: 'Completed' }
  ]

  const supplierPerformance = [
    { name: 'Alpha Manufacturing', score: 95, trend: 'up' },
    { name: 'Pacific Components', score: 88, trend: 'stable' },
    { name: 'EuroSource Ltd', score: 72, trend: 'down' },
    { name: 'AsiaTech Solutions', score: 91, trend: 'up' }
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
            Executive Dashboard
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Unified Command
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"> View</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            One dashboard for inventory health, demand changes, shipment risk, supplier performance, and cost-to-serve.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-slate-800/50 border-b border-slate-700/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold">ChainFlow Control Tower</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Live
                </div>
                <span className="text-slate-400 text-sm">Last updated: Just now</span>
              </div>
            </div>

            <div className="p-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {kpiData.map((kpi, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 bg-slate-700/30 rounded-lg cursor-pointer transition-all ${
                      activeWidget === kpi.label ? 'ring-2 ring-cyan-500/50' : 'hover:bg-slate-700/50'
                    }`}
                    onMouseEnter={() => setActiveWidget(kpi.label)}
                    onMouseLeave={() => setActiveWidget(null)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <kpi.icon className="w-4 h-4 text-slate-400" />
                      {kpi.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      ) : kpi.trend === 'down' ? (
                        <ArrowDownRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {kpi.value}{kpi.unit || '%'}
                    </div>
                    <div className="text-slate-400 text-sm">{kpi.label}</div>
                    <div className={`text-xs mt-1 ${kpi.trend === 'down' && kpi.label !== 'Stockout Risk' && kpi.label !== 'Expedite Spend' ? 'text-red-400' : 'text-green-400'}`}>
                      {kpi.change > 0 ? '+' : ''}{kpi.change}% vs last period
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Shipment Tracking */}
                <div className="lg:col-span-2 bg-slate-700/20 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Ship className="w-4 h-4 text-cyan-400" />
                    Active Shipments
                  </h3>
                  <div className="space-y-3">
                    {shipments.map((shipment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Container className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="text-white text-sm font-medium">{shipment.id}</div>
                            <div className="text-slate-400 text-xs">{shipment.origin} → {shipment.destination}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-medium px-2 py-1 rounded ${
                            shipment.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                            shipment.status === 'Delayed' ? 'bg-red-500/20 text-red-400' :
                            shipment.status === 'Customs' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {shipment.status}
                          </div>
                          <div className="text-slate-400 text-xs mt-1">ETA: {shipment.eta}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supplier Performance */}
                <div className="bg-slate-700/20 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    Supplier Performance
                  </h3>
                  <div className="space-y-3">
                    {supplierPerformance.map((supplier, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">{supplier.name}</span>
                          <span className={`text-sm font-medium ${
                            supplier.score >= 90 ? 'text-green-400' :
                            supplier.score >= 80 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {supplier.score}
                          </span>
                        </div>
                        <Progress value={supplier.score} className="h-1.5 bg-slate-600 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Best Next Actions */}
              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-cyan-400" />
                  Recommended Actions
                </h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">Expedite SHP-2849</div>
                      <div className="text-slate-400 text-xs">5-day delay risk to Chicago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">Review EuroSource</div>
                      <div className="text-slate-400 text-xs">Performance dropped to 72%</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">Optimize SKUs 1420-1435</div>
                      <div className="text-slate-400 text-xs">Potential 12% cost savings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

// Three Promises Section
function ThreePromisesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const promises = [
    {
      icon: Eye,
      title: 'Better Visibility',
      description: 'Real-time, end-to-end visibility across your entire supply chain network. Know where everything is, at all times.',
      metrics: ['99.9% tracking accuracy', 'Sub-second updates', '150+ countries covered'],
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Target,
      title: 'Better Decisions',
      description: 'AI-powered insights and recommendations that help you make faster, smarter supply chain decisions.',
      metrics: ['95% forecast accuracy', '85% faster planning', '60% fewer errors'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingDown,
      title: 'Better Economics',
      description: 'Reduce costs, optimize working capital, and improve your bottom line with intelligent automation.',
      metrics: ['40% cost reduction', '25% inventory savings', '$2M+ average ROI'],
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
            Our Promise
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Optimize Your Supply Chain for
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"> Cost, Speed, and Resilience</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Three promises that drive everything we build.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {promises.map((promise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="bg-slate-800/50 border-slate-700/50 h-full hover:border-cyan-500/50 transition-all group">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${promise.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <promise.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{promise.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {promise.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {promise.metrics.map((metric, i) => (
                      <li key={i} className="flex items-center text-slate-300 text-sm">
                        <Check className="w-4 h-4 text-cyan-500 mr-2 flex-shrink-0" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Blockchain Section
function BlockchainSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    { icon: Zap, title: 'Automated Payments', description: 'Smart contracts execute payments automatically when conditions are met' },
    { icon: FileCheck, title: 'Digital Bill of Lading', description: 'Paperless documentation with instant verification' },
    { icon: ShieldCheck, title: 'Quality Verification', description: 'Immutable quality records from source to destination' },
    { icon: Settings, title: 'Compliance Automation', description: 'Automated regulatory checks and documentation' }
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/blockchain-network.png"
          alt="Blockchain Network"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-orange-500/10 text-orange-400 border-orange-500/20">
              Blockchain Technology
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Trust at the Speed of
              <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent"> Blockchain</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Our blockchain infrastructure provides immutable, transparent, and lightning-fast transactions
              that revolutionize supply chain operations.
            </p>

            {/* Speed Comparison */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
              <div className="text-center mb-4">
                <span className="text-slate-400 text-sm">Transaction Speed Comparison</span>
              </div>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-400">2.3s</div>
                  <div className="text-slate-500 text-sm">ChainFlow</div>
                </div>
                <div className="text-slate-600">vs</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-500">3-5 days</div>
                  <div className="text-slate-500 text-sm">Traditional</div>
                </div>
              </div>
              <Progress value={100} className="h-2 mt-4 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4"
                >
                  <feature.icon className="w-6 h-6 text-orange-400 mb-2" />
                  <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                  <p className="text-slate-500 text-xs mt-1">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Blockchain Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Animated blocks */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${(i % 3) * 35}%`,
                    top: `${Math.floor(i / 3) * 50}%`
                  }}
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: [
                      '0 0 20px rgba(251, 146, 60, 0.3)',
                      '0 0 40px rgba(251, 146, 60, 0.6)',
                      '0 0 20px rgba(251, 146, 60, 0.3)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Box className="w-10 h-10 text-orange-400" />
                  </div>
                </motion.div>
              ))}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="blockGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <line x1="35%" y1="25%" x2="0%" y2="25%" stroke="url(#blockGradient)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="35%" y1="25%" x2="70%" y2="25%" stroke="url(#blockGradient)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="17%" y1="25%" x2="17%" y2="75%" stroke="url(#blockGradient)" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Pricing Section
function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
            Pricing Plans
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Solutions for
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"> Every Scale</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From growing businesses to global enterprises, we have a plan that fits your needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Member */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-b from-slate-800/80 to-slate-800/50 border-green-500/50 h-full relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Get Started</Badge>
              </div>
              <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500/20 to-transparent w-1/2 h-full" />
              <CardHeader className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-2xl">Member</CardTitle>
                    <span className="text-green-400 text-sm">For Individuals</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$10</span>
                  <span className="text-slate-400 ml-2">/month</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 lg:p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  {[
                    '1 user account',
                    'Supply chain visibility',
                    'Basic analytics dashboard',
                    'Demand forecasting (read-only)',
                    'Risk monitoring alerts',
                    'Community support',
                    'Knowledge base access',
                    'Monthly product updates'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center text-slate-300">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <a
                    href={process.env.NEXT_PUBLIC_STRIPE_MEMBERSHIP_LINK ?? 'https://buy.stripe.com/eVqdRb7Zqfzt8I3cOW3oA00'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Subscribe Now
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Business */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-b from-slate-800/80 to-slate-800/50 border-cyan-500/50 h-full relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Most Popular</Badge>
              </div>
              <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500/20 to-transparent w-1/2 h-full" />
              <CardHeader className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-2xl">Business Solutions</CardTitle>
                    <span className="text-cyan-400 text-sm">For Growing Companies</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$499</span>
                  <span className="text-slate-400 ml-2">/month</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 lg:p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  {[
                    'Up to 50 users',
                    'Standard integrations',
                    'Email support',
                    'Core platform modules',
                    'Cloud deployment',
                    'Standard API access',
                    'Knowledge base access',
                    'Monthly training webinars'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center text-slate-300">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enterprise */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-b from-slate-800/80 to-slate-800/50 border-slate-700/50 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500/20 to-transparent w-1/2 h-full" />
              <CardHeader className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-2xl">Enterprise Solutions</CardTitle>
                    <span className="text-purple-400 text-sm">For Global Organizations</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">Custom</span>
                  <span className="text-slate-400 ml-2">pricing</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 lg:p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  {[
                    'Unlimited users across organization',
                    'Custom integrations & APIs',
                    'Dedicated account manager',
                    'White-label options available',
                    'Full API access & webhooks',
                    'On-premise deployment option',
                    '24/7 priority support',
                    'Custom training programs'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center text-slate-300">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Technology Stack Section
function TechStackSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const techStack = [
    { name: 'Next.js', icon: 'N', description: 'React Framework' },
    { name: 'TypeScript', icon: 'TS', description: 'Type Safety' },
    { name: 'PostgreSQL', icon: 'PG', description: 'Primary Database' },
    { name: 'Redis', icon: 'R', description: 'Caching Layer' },
    { name: 'AWS', icon: 'AWS', description: 'Cloud Infrastructure' },
    { name: 'Docker', icon: 'D', description: 'Containerization' }
  ]

  const securityBadges = [
    { name: 'SOC 2', description: 'Type II Compliant' },
    { name: 'ISO 27001', description: 'Certified' },
    { name: 'GDPR', description: 'Compliant' },
    { name: 'HIPAA', description: 'Ready' }
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
            Technology
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Built on
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"> Modern Infrastructure</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Enterprise-grade technology stack with security and reliability at its core.
          </p>
        </motion.div>

        {/* Tech Stack Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center hover:border-blue-500/50 transition-all group"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold group-hover:scale-110 transition-transform">
                {tech.icon}
              </div>
              <div className="text-white font-medium text-sm">{tech.name}</div>
              <div className="text-slate-500 text-xs">{tech.description}</div>
            </div>
          ))}
        </motion.div>

        {/* Security & Reliability */}
        <motion.div
          className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Security & Compliance</h3>
              <p className="text-slate-400 mb-6">
                Your data is protected by enterprise-grade security measures and our platform meets the most stringent compliance requirements.
              </p>
              <div className="flex flex-wrap gap-3">
                {securityBadges.map((badge, index) => (
                  <div key={index} className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2">
                    <div className="text-white font-semibold text-sm">{badge.name}</div>
                    <div className="text-slate-400 text-xs">{badge.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                99.99%
              </div>
              <div className="text-slate-400 mt-2">Uptime Guarantee</div>
              <div className="text-slate-500 text-sm">SLA backed availability</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Live Demo Section
function LiveDemoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeTab, setActiveTab] = useState('tracking')

  const tabs = [
    { id: 'tracking', label: 'Shipment Tracking', icon: Truck },
    { id: 'inventory', label: 'Inventory Heatmap', icon: PieChart },
    { id: 'forecast', label: 'Demand Forecast', icon: LineChart },
    { id: 'blockchain', label: 'Blockchain Feed', icon: Box }
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
            Live Demo
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            See It in
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Action</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Experience real-time supply chain intelligence with our interactive demo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 overflow-hidden">
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-slate-700/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Demo Content */}
            <div className="p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'tracking' && (
                  <motion.div
                    key="tracking"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid md:grid-cols-3 gap-4"
                  >
                    {[
                      { id: 'SHP-001', from: 'Shanghai', to: 'Los Angeles', status: 'In Transit', progress: 65 },
                      { id: 'SHP-002', from: 'Hamburg', to: 'New York', status: 'Customs', progress: 45 },
                      { id: 'SHP-003', from: 'Tokyo', to: 'London', status: 'Delivered', progress: 100 }
                    ].map((shipment) => (
                      <div key={shipment.id} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium">{shipment.id}</span>
                          <Badge className={shipment.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-cyan-500/20 text-cyan-400'}>
                            {shipment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-slate-400 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          {shipment.from} → {shipment.to}
                        </div>
                        <Progress value={shipment.progress} className="h-2" />
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'inventory' && (
                  <motion.div
                    key="inventory"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-4 md:grid-cols-6 gap-2"
                  >
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg"
                        style={{
                          backgroundColor: `rgba(${Math.random() > 0.5 ? '34, 197, 94' : '239, 68, 68'}, ${0.2 + Math.random() * 0.6})`
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {activeTab === 'forecast' && (
                  <motion.div
                    key="forecast"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-end justify-between h-48 px-4">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((height, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <motion.div
                            className="w-6 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t"
                            initial={{ height: 0 }}
                            animate={{ height: height * 2 }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                          />
                          <span className="text-xs text-slate-500">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-8 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-cyan-500" />
                        <span className="text-slate-400">Actual Demand</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-purple-500" />
                        <span className="text-slate-400">Forecast</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'blockchain' && (
                  <motion.div
                    key="blockchain"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3 max-h-[350px] overflow-y-auto"
                  >
                    {[
                      { hash: '0x7a8b...3f2e', type: 'Payment', time: '2 mins ago', status: 'Confirmed' },
                      { hash: '0x9c2d...5e1a', type: 'Quality Check', time: '5 mins ago', status: 'Confirmed' },
                      { hash: '0x4f6g...8c9d', type: 'Shipment', time: '12 mins ago', status: 'Confirmed' },
                      { hash: '0x2h3i...6j7k', type: 'Payment', time: '18 mins ago', status: 'Confirmed' },
                      { hash: '0x8l9m...1n2o', type: 'Customs', time: '25 mins ago', status: 'Confirmed' }
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <Box className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <div className="text-white font-mono text-sm">{tx.hash}</div>
                            <div className="text-slate-500 text-xs">{tx.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500/20 text-green-400">{tx.status}</Badge>
                          <div className="text-slate-500 text-xs mt-1">{tx.time}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const stats = [
    { value: '500+', label: 'Enterprise Clients' },
    { value: '50M+', label: 'Shipments Tracked' },
    { value: '$2B+', label: 'Cost Savings' },
    { value: '45', label: 'Countries' }
  ]

  const logos = [
    'Fortune 100 Retailer', 'Global Logistics Leader', 'Top 10 Manufacturer', 
    'Leading Pharma', 'Tech Giant', 'Automotive Leader'
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
            Trusted Globally
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Powering the World&apos;s
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Best Supply Chains</span>
          </h2>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-slate-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Client Logos */}
        <motion.div
          className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-center text-slate-500 mb-6 text-sm">Trusted by industry leaders worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-slate-700/30 rounded-lg text-slate-400 font-medium hover:text-white hover:bg-slate-700/50 transition-all cursor-pointer"
              >
                {logo}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial Quote */}
        <motion.div
          className="mt-16 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <blockquote className="text-xl sm:text-2xl text-slate-300 italic leading-relaxed">
            &quot;ChainFlow transformed our supply chain operations. We achieved a 40% reduction in logistics costs 
            and improved our on-time delivery rate to 99.2%. The ROI was evident within the first quarter.&quot;
          </blockquote>
          <div className="mt-6">
            <div className="text-white font-semibold">Sarah Chen</div>
            <div className="text-slate-400">VP of Supply Chain, Fortune 100 Retailer</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section id="contact" className="py-20 lg:py-32 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="grid lg:grid-cols-2 gap-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Form Side */}
          <div>
            <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
              Get Started
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Request a Demo
            </h2>
            <p className="text-slate-400 mb-8">
              See how ChainFlow can transform your supply chain operations. Our team will provide a personalized demo tailored to your needs.
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Request Submitted!</h3>
                <p className="text-slate-400">Our team will contact you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                    <Input id="name" placeholder="John Smith" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-slate-300">Company</Label>
                    <Input id="company" placeholder="Acme Corp" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 mt-1" required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-slate-300">Work Email</Label>
                    <Input id="email" type="email" placeholder="john@company.com" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 mt-1" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="size" className="text-slate-300">Company Size</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-1">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1-50">1-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="interest" className="text-slate-300">Interest Area</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-1">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="visibility">Supply Chain Visibility</SelectItem>
                        <SelectItem value="demand">Demand Planning</SelectItem>
                        <SelectItem value="inventory">Inventory Optimization</SelectItem>
                        <SelectItem value="blockchain">Blockchain Traceability</SelectItem>
                        <SelectItem value="risk">Risk Management</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message" className="text-slate-300">Additional Notes</Label>
                  <Textarea id="message" placeholder="Tell us about your supply chain challenges..." className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 mt-1 min-h-[100px]" />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Demo'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            )}
          </div>

          {/* Info Side */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Schedule a Call</h3>
                  <p className="text-slate-400 text-sm">Book a 30-min consultation</p>
                </div>
              </div>
              <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                View Available Slots
              </Button>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300">sales@chainflow.io</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300">+1 (888) 555-0123</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300">San Francisco, CA | London, UK | Singapore</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-medium">24/7 Support Available</span>
              </div>
              <p className="text-slate-400 text-sm">
                Our global support team is always ready to assist you, no matter your timezone.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  const footerLinks = {
    Product: ['Features', 'Integrations', 'Pricing', 'Changelog', 'Roadmap'],
    Resources: ['Documentation', 'API Reference', 'Blog', 'Case Studies', 'Whitepapers'],
    Company: ['About Us', 'Careers', 'Partners', 'Press', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Security', 'GDPR', 'Cookies']
  }

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ChainFlow
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-4 max-w-xs">
              Transforming global supply chains with intelligent, blockchain-powered solutions.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-slate-400 text-sm">24/7 Agent Available</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-sm">
            © 2024 ChainFlow. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />
      <HeroSection />
      <ThreePromisesSection />
      <AssessmentSection />
      <SimulatorSection />
      <DashboardDemoSection />
      <PainPointsSection />
      <SolutionsSection />
      <BlockchainSection />
      <PricingSection />
      <TechStackSection />
      <LiveDemoSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
