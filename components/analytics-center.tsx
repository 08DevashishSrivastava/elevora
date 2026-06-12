'use client'

import React, { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react'

// Data for each analytics tab
const analyticsData = {
  traffic: {
    title: 'Organic Search Traffic',
    subtitle: 'Growth after Elevora SEO deployment',
    metric: '342,800+',
    increase: '+210% YoY Growth',
    icon: Users,
    color: '#3b82f6', // Electric Blue
    glowColor: 'rgba(59, 130, 246, 0.2)',
    chartData: [
      { name: 'Month 1', value: 45000 },
      { name: 'Month 2', value: 58000 },
      { name: 'Month 3', value: 89000 },
      { name: 'Month 4', value: 120000 },
      { name: 'Month 5', value: 185000 },
      { name: 'Month 6', value: 240000 },
      { name: 'Month 7', value: 310000 },
      { name: 'Month 8', value: 342800 },
    ]
  },
  conversions: {
    title: 'PPC Conversion Optimization',
    subtitle: 'Paid acquisition conversion rate over time',
    metric: '4.82%',
    increase: '+145% Efficiency Lift',
    icon: TrendingUp,
    color: '#7c3aed', // Royal Purple
    glowColor: 'rgba(124, 58, 237, 0.2)',
    chartData: [
      { name: 'Month 1', value: 1.8 },
      { name: 'Month 2', value: 2.1 },
      { name: 'Month 3', value: 2.9 },
      { name: 'Month 4', value: 3.2 },
      { name: 'Month 5', value: 3.8 },
      { name: 'Month 6', value: 4.1 },
      { name: 'Month 7', value: 4.5 },
      { name: 'Month 8', value: 4.82 },
    ]
  },
  revenue: {
    title: 'Client Net Revenue Generated',
    subtitle: 'Cumulative ROI across marketing channels',
    metric: '$14.2M+',
    increase: '$4.2M Added This Quarter',
    icon: DollarSign,
    color: '#10b981', // Emerald green
    glowColor: 'rgba(16, 185, 129, 0.2)',
    chartData: [
      { name: 'Month 1', value: 1.2 },
      { name: 'Month 2', value: 2.5 },
      { name: 'Month 3', value: 4.1 },
      { name: 'Month 4', value: 6.3 },
      { name: 'Month 5', value: 8.9 },
      { name: 'Month 6', value: 10.8 },
      { name: 'Month 7', value: 12.5 },
      { name: 'Month 8', value: 14.2 },
    ]
  },
  brand: {
    title: 'Social Share of Voice (SOV)',
    subtitle: 'Brand awareness indexing vs key competitors',
    metric: '72%',
    increase: '#1 Ranked in Category',
    icon: Award,
    color: '#ec4899', // Pink
    glowColor: 'rgba(236, 72, 153, 0.2)',
    chartData: [
      { name: 'Month 1', value: 15 },
      { name: 'Month 2', value: 22 },
      { name: 'Month 3', value: 35 },
      { name: 'Month 4', value: 48 },
      { name: 'Month 5', value: 52 },
      { name: 'Month 6', value: 61 },
      { name: 'Month 7', value: 68 },
      { name: 'Month 8', value: 72 },
    ]
  }
}

export default function AnalyticsCenter() {
  const [activeTab, setActiveTab] = useState<keyof typeof analyticsData>('traffic')
  const current = analyticsData[activeTab]
  const IconComponent = current.icon

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
      {/* Background glow circle that shifts color with active tab */}
      <div 
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: current.glowColor }}
      />
      <div 
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: current.glowColor }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Toggles */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">Live Performance Command Center</span>
            <h3 className="text-2xl font-bold tracking-tight text-white">How We Scale Brands</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Explore live analytics projections showing real growth paths mapped from actual Elevora campaigns.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 my-6">
            {(Object.keys(analyticsData) as Array<keyof typeof analyticsData>).map((key) => {
              const item = analyticsData[key]
              const TabIcon = item.icon
              const isActive = activeTab === key

              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-3.5 w-full text-left p-3.5 rounded-2xl border transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/5 border-white/10 text-white shadow-xl shadow-black/40' 
                      : 'bg-transparent border-transparent text-zinc-400 hover:bg-white/2 hover:text-zinc-200'
                  }`}
                >
                  <div 
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                      isActive 
                        ? 'border-white/20' 
                        : 'border-white/5 bg-white/2'
                    }`}
                    style={{ color: isActive ? item.color : undefined }}
                  >
                    <TabIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold">{item.title}</div>
                    <div className="text-[10px] text-zinc-500 truncate mt-0.5">{item.increase}</div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Current Stat Box */}
          <div className="p-5 rounded-2xl bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-sm">
            <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase">CURRENT METRIC INDEX</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-3xl font-extrabold text-white tracking-tight">{current.metric}</span>
              <span className="text-xs font-mono" style={{ color: current.color }}>{current.increase}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">{current.subtitle}</p>
          </div>
        </div>

        {/* Right Chart display */}
        <div className="lg:col-span-8 flex flex-col justify-between min-h-[300px] md:min-h-[400px] relative">
          
          {/* Header of Chart */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">PERFORMANCE METRIC SHIELD</span>
              <h4 className="text-lg font-bold text-white mt-0.5">{current.title}</h4>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 border border-white/5 rounded-full px-2.5 py-1 bg-white/2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: current.color }} />
              Active Campaign
            </div>
          </div>

          {/* Recharts Wrapper */}
          <div className="flex-1 w-full h-full relative" style={{ minHeight: '260px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full absolute inset-0"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={current.chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id={`grad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={current.color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={current.color} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      stroke="#52525b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10} 
                    />
                    <YAxis 
                      stroke="#52525b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      dx={-10}
                      tickFormatter={(v) => {
                        if (activeTab === 'revenue') return `$${v}M`
                        if (activeTab === 'conversions') return `${v}%`
                        if (activeTab === 'traffic') return v >= 100000 ? `${v/1000}k` : v
                        return `${v}%`
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0a0a',
                        borderColor: 'rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontFamily: 'monospace'
                      }}
                      itemStyle={{ color: current.color }}
                      formatter={(v: any) => {
                        if (activeTab === 'revenue') return [`$${v} Million`, 'Net Revenue']
                        if (activeTab === 'conversions') return [`${v}%`, 'Conversion Rate']
                        if (activeTab === 'traffic') return [v.toLocaleString(), 'Sessions']
                        return [`${v}%`, 'Index']
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={current.color}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill={`url(#grad-${activeTab})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-6 pt-4 border-t border-white/5">
            <span>START: AUDIT LAUNCH</span>
            <span>END: SCALE OPTIMAL</span>
          </div>

        </div>

      </div>
    </div>
  )
}
