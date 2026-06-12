'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Target, Search, Globe, Zap, LineChart, 
  ChevronRight, Menu, X, ArrowUpRight, Check, Award, 
  TrendingUp, Users, DollarSign, Trophy, ArrowRight, 
  Star, MessageSquare, Shield, Download, Mail, Phone, MapPin, Calendar
} from 'lucide-react'

// Dynamic client-only imports to prevent SSR hydration mismatches
const Agency3D = dynamic(() => import('@/components/agency-3d'), { ssr: false })
const AnalyticsCenter = dynamic(() => import('@/components/analytics-center'), { ssr: false })
const RoiCalculator = dynamic(() => import('@/components/roi-calculator'), { ssr: false })
const Scheduler = dynamic(() => import('@/components/scheduler'), { ssr: false })


// Core configurations
const services = [
  {
    icon: Sparkles,
    title: 'Strategic Brand Elevation',
    description: 'We craft iconic brand identities, guidelines, and market positioning that command premium authority in your industry.',
    perks: ['Market Positioning Research', 'Brand Guidelines & Asset Kits', 'Competitor Share of Voice Analysis'],
    color: 'from-purple-500 to-indigo-600',
    delay: 0.1
  },
  {
    icon: Target,
    title: 'High-Intent Paid Acquisition',
    description: 'Data-driven Google Ads, Meta Ads, and LinkedIn campaigns optimized for pipeline generation and lowest customer acquisition cost.',
    perks: ['Conversion-Focused Ad Copy', 'Precision Demographics Targeting', 'Daily Budget & Keyword Bidding'],
    color: 'from-blue-500 to-indigo-500',
    delay: 0.2
  },
  {
    icon: Search,
    title: 'Search Authority Scaling (SEO)',
    description: 'Dominate organic search for high-value transactional keywords. We construct authoritative backlinks and structural page optimizations.',
    perks: ['Transactional Keyword Mapping', 'Premium Backlink Networks', 'Core Web Vitals Technical Audits'],
    color: 'from-emerald-500 to-teal-500',
    delay: 0.3
  },
  {
    icon: Globe,
    title: 'Futuristic WebGL & UX Design',
    description: 'Captivate prospects with immersive, fast-loading, 3D interactive web experiences engineered to maximize landing page conversions.',
    perks: ['Immersive Three.js / WebGL Visuals', 'Ultra-Responsive Mobile Layouts', 'A/B Tested User Flow Designs'],
    color: 'from-pink-500 to-rose-500',
    delay: 0.4
  },
  {
    icon: Zap,
    title: 'Conversion Rate Optimization',
    description: 'Turn your current traffic into active customers. We deploy heatmaps, user session recordings, and custom landing page builders.',
    perks: ['Dynamic Form Optimizations', 'Click & Scroll Heatmap Analysis', 'High-Impact Call to Actions'],
    color: 'from-amber-500 to-orange-500',
    delay: 0.5
  },
  {
    icon: LineChart,
    title: 'Omni-Channel Scale Consulting',
    description: 'Unified marketing automation, CRM integration, email nurture sequences, and fractional CMO strategies to build long-term growth pipelines.',
    perks: ['CRM Lead Scoring Automations', 'Omni-Channel Attribution Mapping', 'Fractional CMO Growth Frameworks'],
    color: 'from-cyan-500 to-blue-600',
    delay: 0.6
  }
]

const caseStudies = [
  {
    id: 1,
    title: 'Aura Premium E-Commerce',
    category: 'E-Commerce',
    metric: '+600% Revenue Lift',
    subTitle: 'From $40k/mo to $280k/mo in 6 months',
    strategy: 'We rebuilt their landing pages with interactive WebGL elements and paired them with high-intent Search Campaigns and custom checkout page optimization.',
    results: ['Traffic increased by 140%', 'Conversion Rate jumped from 1.2% to 3.8%', 'Annualized run rate reached $3.36M']
  },
  {
    id: 2,
    title: 'ScribeAI SaaS Platform',
    category: 'SaaS',
    metric: '4.8% to 11.2% CVR',
    subTitle: 'Onboarding optimization & pipeline setup',
    strategy: 'Deployed A/B testing models on their registration flow, simplified value propositions, and integrated automated interactive tutorials for trial sign-ups.',
    results: ['2.3x increase in signup velocity', 'Customer Acquisition Cost decreased by 38%', 'Increased trial-to-paid conversion by 22%']
  },
  {
    id: 3,
    title: 'Vertex Enterprise B2B',
    category: 'B2B',
    metric: '-52% CPA Drop',
    subTitle: 'Google Ads efficiency restructuring',
    strategy: 'Audited their legacy Google Ads account, removed high-cost low-intent keywords, mapped negative search queries, and built custom landing pages for high-ticket clients.',
    results: ['High-value sales pipeline tripled', 'Ad spend waste reduced by $18k/month', 'Sales team booking velocity rose by 85%']
  }
]

const processSteps = [
  {
    step: '01',
    title: 'Growth Intelligence Audit',
    desc: 'We analyze your website code, organic search patterns, ads footprint, and key competitor indexing to locate immediate revenue leaks.'
  },
  {
    step: '02',
    title: 'Conversion Blueprint',
    desc: 'We compile a tailored digital strategy detailing UX mockups, target keyword lists, ad creatives, and high-impact landing page paths.'
  },
  {
    step: '03',
    title: 'Omni-Channel Deployment',
    desc: 'Our developer and marketing pods deploy high-converting landing pages, set up precision target ads, and execute technical SEO.'
  },
  {
    step: '04',
    title: 'Continuous Scaling',
    desc: 'Weekly performance updates, multivariate A/B testing, and pipeline reviews to continuously increase ROI and scale budgets safely.'
  }
]

const testimonials = [
  {
    quote: "Elevora did what three other agencies failed to do. They did not just bring us traffic — they completely transformed how we capture leads. Our revenue has grown from $120k to over $450k per month since we started.",
    author: "Marcella Vance",
    role: "VP of Growth, Aura E-Commerce",
    rating: 5,
    tag: "E-Commerce Scale"
  },
  {
    quote: "The 3D interactive landing page Elevora built for us immediately distinguished our brand from boring competitors. It is not just eye-candy; our page conversion rate leaped from 4% to over 11% within weeks.",
    author: "Tariq Henderson",
    role: "Founder, ScribeAI",
    rating: 5,
    tag: "SaaS Launch"
  },
  {
    quote: "Their team treats our marketing budget like their own. The precision targeting audits alone saved us thousands of dollars a month, while boosting our enterprise B2B sales bookings dramatically.",
    author: "Sarah Jenks",
    role: "Marketing Director, Vertex Security",
    rating: 5,
    tag: "B2B Enterprise"
  }
]

export default function ElevoraHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [caseFilter, setCaseFilter] = useState<'All' | 'SaaS' | 'E-Commerce' | 'B2B'>('All')
  const [selectedCase, setSelectedCase] = useState<typeof caseStudies[0] | null>(null)
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  // Auto-scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const filteredCases = caseStudies.filter(
    (c) => caseFilter === 'All' || c.category === caseFilter
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Background Interactive Lighting Elements */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute top-2/3 left-1/3 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Futuristic Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/70 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 shadow-lg shadow-purple-600/25 border border-white/20">
              <Sparkles className="h-5 w-5 text-white animate-spin-slow" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 blur-sm opacity-50 -z-10" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">ELEVORA</span>
              <span className="block text-[8px] font-mono tracking-widest uppercase text-purple-400 font-semibold">Brand Growth Labs</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#about" className="hover:text-white transition-colors">Performance Index</a>
            <a href="#services" className="hover:text-white transition-colors">Our Matrix</a>
            <a href="#calculator" className="hover:text-white transition-colors">ROI Calculator</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Case Studies</a>
            <a href="#process" className="hover:text-white transition-colors">Our Formula</a>
          </nav>

          {/* Header CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#strategy-call">
              <button className="h-10 px-5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold tracking-wide transition-all duration-300">
                Book Scale Call
              </button>
            </a>
            <a href="#downloads">
              <button className="h-10 px-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold tracking-wide shadow-lg shadow-purple-600/15 border border-white/10 flex items-center gap-1.5 transition-all">
                Download Code
                <Download className="w-3.5 h-3.5" />
              </button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <a href="#downloads" className="p-2 bg-white/5 border border-white/10 rounded-xl text-zinc-300">
              <Download className="w-4 h-4" />
            </a>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-white/5 border border-white/10 rounded-xl text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-lg px-4 py-6 space-y-4"
            >
              <nav className="flex flex-col gap-4 text-sm font-medium text-zinc-400">
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-2">Performance Index</a>
                <a href="#services" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-2">Our Matrix</a>
                <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-2">ROI Calculator</a>
                <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-2">Case Studies</a>
                <a href="#process" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-2">Our Formula</a>
              </nav>
              <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                <a href="#strategy-call" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold">
                    Book Scale Call
                  </button>
                </a>
                <a href="#downloads" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
                    Download Code
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-400 text-xs font-semibold font-mono tracking-wider">
                  <Trophy className="w-3.5 h-3.5" />
                  ELEVATING BRANDS. DRIVING GROWTH.
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
                  We Turn Businesses <br />
                  <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent text-glow-purple">
                    Into Brands People Remember
                  </span>
                </h1>
                
                <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl">
                  Elevora helps businesses generate more leads, increase sales, build powerful brands, and dominate their market through strategic digital marketing.
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <a href="#strategy-call">
                  <button className="h-12 px-7 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl shadow-xl shadow-purple-600/20 border border-white/15 text-sm font-semibold flex items-center gap-2 group transition-all duration-300">
                    Get Free Strategy Call
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
                <a href="#portfolio">
                  <button className="h-12 px-7 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-semibold transition-all">
                    View Case Studies
                  </button>
                </a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/5"
              >
                <div className="space-y-1">
                  <span className="block text-2xl md:text-3xl font-extrabold text-white tracking-tight">500+</span>
                  <span className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500">Projects Delivered</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-2xl md:text-3xl font-extrabold text-purple-400 tracking-tight">98%</span>
                  <span className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500">Client Satisfaction</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-2xl md:text-3xl font-extrabold text-blue-400 tracking-tight">$10M+</span>
                  <span className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500">Revenue Generated</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-2xl md:text-3xl font-extrabold text-white tracking-tight">100+</span>
                  <span className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500">Businesses Scaled</span>
                </div>
              </motion.div>
            </div>

            {/* Right 3D Visualizer */}
            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full relative z-10"
              >
                <Agency3D />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* LIVE ANALYTICS SECTION */}
      <section id="about" className="py-16 md:py-24 border-t border-white/5 bg-[#0a0a0a]/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-400 uppercase tracking-widest font-semibold">
              <LineChart className="w-3.5 h-3.5" />
              Elevora Analytics Core
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Data Systems Driving Massive Revenue Lift
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              We do not rely on vanity impressions. We track pipeline velocity, search equity, and customer conversion benchmarks.
            </p>
          </div>

          <AnalyticsCenter />
        </div>
      </section>

      {/* CORE SERVICES MATRIX */}
      <section id="services" className="py-20 md:py-28 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-blue-400 uppercase tracking-widest font-semibold">
              <Zap className="w-3.5 h-3.5" />
              Our Scale Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Unified Growth Machine
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              Unlock omni-channel growth. We align brand development, user experience, and targeted performance advertising.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item.delay }}
                className="group p-8 rounded-2xl bg-[#0e0e0e] border border-white/5 hover:border-white/15 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                {/* Hover gradient background mask */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />

                <div className="space-y-6">
                  {/* Icon Wrapper */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} p-[1px] flex items-center justify-center shadow-lg`}>
                    <div className="w-full h-full rounded-[15px] bg-[#0c0c0c] flex items-center justify-center group-hover:scale-95 transition-transform duration-300">
                      <item.icon className="w-5.5 h-5.5 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Perks Checklist */}
                <div className="pt-6 mt-6 border-t border-white/5 space-y-2.5">
                  {item.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR SECTION */}
      <section id="calculator" className="py-16 md:py-24 border-t border-white/5 bg-[#0a0a0a]/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-purple-400 uppercase tracking-widest font-semibold">
              <DollarSign className="w-3.5 h-3.5" />
              Real Value Projection
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Calculate Your Revenue Lift
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              Input your traffic and deal size. Check how much budget optimization and UX conversion upgrades could unlock.
            </p>
          </div>

          <RoiCalculator />
        </div>
      </section>

      {/* CASE STUDIES PORTFOLIO */}
      <section id="portfolio" className="py-20 md:py-28 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                <Award className="w-3.5 h-3.5" />
                Case Studies
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Our Proven Milestones
              </h2>
            </div>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {(['All', 'SaaS', 'E-Commerce', 'B2B'] as const).map((filter) => {
                const isActive = caseFilter === filter
                return (
                  <button
                    key={filter}
                    onClick={() => setCaseFilter(filter)}
                    className={`px-4 py-2.5 rounded-full border transition-all duration-300 ${
                      isActive 
                        ? 'bg-purple-600 border-purple-500 text-white shadow-md' 
                        : 'bg-white/2 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCases.map((study) => (
                <motion.div
                  key={study.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group flex flex-col justify-between bg-[#0e0e0e] border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-all duration-300 relative"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-zinc-400">
                        {study.category}
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <div className="space-y-2">
                      <div className="text-2xl font-extrabold text-white font-mono tracking-tight group-hover:text-purple-400 transition-colors">
                        {study.metric}
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {study.title}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {study.subTitle}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                    <button 
                      onClick={() => setSelectedCase(study)}
                      className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                    >
                      Inspect Blueprint
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Case Study Overlay Modal */}
        <AnimatePresence>
          {selectedCase && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-lg bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl"
              >
                {/* Radial Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                <button 
                  onClick={() => setSelectedCase(null)}
                  className="absolute top-6 right-6 p-2 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono bg-purple-950/40 border border-purple-500/20 px-2.5 py-1 rounded-full text-purple-400 uppercase tracking-widest font-semibold">
                      {selectedCase.category} Strategy Blueprint
                    </span>
                    <h3 className="text-2xl font-extrabold text-white mt-4">{selectedCase.title}</h3>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{selectedCase.metric}</div>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase text-zinc-500 tracking-wider">THE STRATEGY</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {selectedCase.strategy}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-white/5">
                    <h4 className="text-xs font-mono uppercase text-zinc-500 tracking-wider">VERIFIED RESULTS</h4>
                    <ul className="space-y-2">
                      {selectedCase.results.map((res, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedCase(null)
                        const el = document.getElementById('strategy-call')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/20"
                    >
                      Book Free Consultation Call
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* THE GROWTH ENGINE FORMULA (PROCESS) */}
      <section id="process" className="py-16 md:py-24 border-t border-white/5 bg-[#0a0a0a]/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-purple-400 uppercase tracking-widest font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              Our Implementation Path
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Elevora Growth Formula
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              We execute in sprints, tracking benchmarks to remove latency and keep acquisition budgets scaling efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 relative">
            {/* Background connectors for desktop */}
            <div className="hidden sm:block absolute top-10 left-8 right-8 h-[1px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-transparent -z-10" />

            {processSteps.map((step, idx) => (
              <div key={idx} className="space-y-4 relative">
                {/* Step Num Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#0e0e0e] border border-white/10 flex items-center justify-center font-mono text-lg font-bold text-white shadow-xl shadow-black/40">
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{step.step}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-md font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 md:py-28 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-purple-950/15 via-[#0e0e0e] to-blue-950/10 p-8 sm:p-12 border border-white/5 relative overflow-hidden">
            
            {/* Background glowing rings */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-8 space-y-6">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-purple-400 uppercase tracking-widest font-semibold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Client Endorsements
                </span>
                
                {/* Carousel text */}
                <div className="relative min-h-[120px] md:min-h-[140px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={testimonialIdx}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <p className="text-md sm:text-lg text-zinc-200 italic leading-relaxed">
                        "{testimonials[testimonialIdx].quote}"
                      </p>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {testimonials[testimonialIdx].author}
                        </div>
                        <div className="text-xs text-zinc-500 font-mono mt-0.5">
                          {testimonials[testimonialIdx].role}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Selector / Status */}
              <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center gap-4 bg-white/2 border border-white/5 p-6 rounded-2xl">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <div className="text-center md:text-right">
                  <div className="text-sm font-bold text-white font-mono uppercase tracking-tight">Verified Trust</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Audit Score: 100/100</div>
                </div>
                {/* Dots */}
                <div className="flex gap-2.5 mt-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIdx(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        testimonialIdx === i ? 'bg-purple-500 w-5' : 'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* STRATEGY CALL SCHEDULER WIDGET */}
      <section id="strategy-call" className="py-20 md:py-28 border-t border-white/5 bg-[#0a0a0a]/70 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/5 to-blue-600/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-purple-400 uppercase tracking-widest font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              Strategic Booking Panel
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Dominate Your Market?
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              Book your slot. We will compile a custom SEO & Paid Ad campaign blueprint for your website.
            </p>
          </div>

          <Scheduler />
        </div>
      </section>

      {/* DOWNLOAD SOURCE CODE SECTION */}
      <section id="downloads" className="py-16 border-t border-white/5 bg-[#070707] relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-purple-400 shadow-xl">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Download Codebase Package</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Review the code directly. Click below to download the complete source code of this Elevora platform, packaged in a single ZIP folder containing Next.js, Framer Motion, and Tailwind templates.
              </p>
            </div>
            <div className="pt-2">
              <a href="/elevora-source.zip" download>
                <button className="px-6 py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-sm shadow-xl flex items-center justify-center gap-2 mx-auto transition-all">
                  Get Source ZIP Folder
                  <Download className="w-4 h-4 text-black" />
                </button>
              </a>
              <span className="block text-[10px] text-zinc-500 font-mono mt-3">File size: ~2.8 MB | Includes full Next.js structure</span>
            </div>
          </div>
        </div>
      </section>

      {/* FUTURISTIC FOOTER */}
      <footer className="py-16 border-t border-white/5 bg-[#0a0a0a] text-zinc-500 font-mono text-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Brand column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-extrabold text-white tracking-tight">ELEVORA</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                Premium, conversion-focused growth marketing agency. We engineer immersive 3D experiences, deploy advanced SEO models, and scale PPC performance.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Capabilities</h4>
              <ul className="space-y-2 text-zinc-500 text-[11px]">
                <li><a href="#services" className="hover:text-purple-400 transition-colors">Strategic Brand Elevation</a></li>
                <li><a href="#services" className="hover:text-purple-400 transition-colors">High-Intent Paid PPC</a></li>
                <li><a href="#services" className="hover:text-purple-400 transition-colors">Search Authority SEO</a></li>
                <li><a href="#services" className="hover:text-purple-400 transition-colors">WebGL Interactive UX</a></li>
              </ul>
            </div>

            {/* Contacts */}
            <div className="space-y-3 font-sans">
              <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">Contact Labs</h4>
              <ul className="space-y-2 text-zinc-500 text-[11px]">
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>growth@elevora.agency</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>+1 (800) 555-ELEV</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span>742 Glowing Node Rd, San Francisco, CA</span>
                </li>
              </ul>
            </div>

            {/* Security Audit */}
            <div className="space-y-4 font-sans">
              <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider font-semibold">Security Check</h4>
              <div className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[10px] text-zinc-400 leading-normal">
                  <span className="text-white font-medium block">Fully Verified Source Code</span>
                  Static analysis check passed. Code ready for Next.js build compilation.
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-600 gap-4">
            <span>© 2026 Elevora Brand Growth Labs Inc. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#downloads" className="hover:text-white transition-colors">Source Code</a>
              <a href="#calculator" className="hover:text-white transition-colors">ROI Index</a>
              <a href="#strategy-call" className="hover:text-white transition-colors">Schedule Strategy Call</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
