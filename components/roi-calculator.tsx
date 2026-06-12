'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Percent, Zap, TrendingUp, ChevronRight } from 'lucide-react'

export default function RoiCalculator() {
  // Slider states
  const [traffic, setTraffic] = useState(25000)
  const [conversionRate, setConversionRate] = useState(1.5)
  const [orderValue, setOrderValue] = useState(150)

  // Calculations
  const currentMonthlyRevenue = traffic * (conversionRate / 100) * orderValue

  // Elevora impact assumptions: 
  // 1. Traffic increases by 45% (x1.45)
  // 2. Conversion rate increases by 75% (x1.75) due to CRO & High-Intent traffic
  const elevoraTraffic = Math.round(traffic * 1.45)
  const elevoraConversionRate = Math.min(Number((conversionRate * 1.75).toFixed(2)), 100)
  const elevoraMonthlyRevenue = elevoraTraffic * (elevoraConversionRate / 100) * orderValue

  const monthlyNetGrowth = elevoraMonthlyRevenue - currentMonthlyRevenue
  const annualNetGrowth = monthlyNetGrowth * 12
  const roiMultiplier = ((elevoraMonthlyRevenue - currentMonthlyRevenue) / (currentMonthlyRevenue || 1) * 100).toFixed(0)

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val)
  }

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
      
      {/* Glow effect in bg */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">ROI Calculator</span>
            <h3 className="text-2xl font-bold text-white mt-1">Estimate Your Growth Potential</h3>
            <p className="text-sm text-zinc-400 mt-2">
              Adjust the metrics below based on your current business benchmarks to see the estimated revenue lift.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            {/* Slider 1: Traffic */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                  Monthly Web Traffic
                </label>
                <span className="font-mono text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded text-xs">
                  {formatNumber(traffic)} Visitors
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="250000"
                step="1000"
                value={traffic}
                onChange={(e) => setTraffic(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-zinc-800 appearance-none cursor-pointer accent-blue-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>2,000</span>
                <span>125,000</span>
                <span>250,000+</span>
              </div>
            </div>

            {/* Slider 2: Conversion Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                  Current Conversion Rate
                </label>
                <span className="font-mono text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded text-xs">
                  {conversionRate}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="8"
                step="0.1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-zinc-800 appearance-none cursor-pointer accent-purple-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>0.1%</span>
                <span>4.0%</span>
                <span>8.0%</span>
              </div>
            </div>

            {/* Slider 3: Average Order Value */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                  Average Customer Contract / Order Value
                </label>
                <span className="font-mono text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded text-xs">
                  {formatCurrency(orderValue)}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="2500"
                step="10"
                value={orderValue}
                onChange={(e) => setOrderValue(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-zinc-800 appearance-none cursor-pointer accent-blue-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>$10</span>
                <span>$1,250</span>
                <span>$2,500</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-[11px] text-zinc-400 leading-relaxed font-sans">
            <span className="text-yellow-500 font-semibold uppercase mr-1">Assumption Model:</span>
            Calculations reflect a modest 45% lift in web sessions and an 80% boost in conversion efficiency via high-intent search optimization & conversion-focused page rebuilds.
          </div>
        </div>

        {/* Right Side: Projections Output */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-purple-950/20 to-blue-950/25 p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden">
          
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />

          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">ELEVORA GROWTH INDEX</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-sm font-semibold text-emerald-400">+{roiMultiplier}% Performance Lift</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs text-zinc-400">Current Monthly Revenue</span>
                <span className="text-sm font-mono text-zinc-300 font-medium">{formatCurrency(currentMonthlyRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs text-zinc-400">Elevora Monthly Revenue</span>
                <span className="text-sm font-mono text-white font-semibold">{formatCurrency(elevoraMonthlyRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs text-zinc-400">Optimized Traffic / CVR</span>
                <span className="text-xs font-mono text-zinc-300">{formatNumber(elevoraTraffic)} / {elevoraConversionRate}%</span>
              </div>
            </div>

            <div className="pt-4 space-y-1">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">ESTIMATED NET REVENUE INCREASE</span>
              <div className="text-3xl font-extrabold text-white tracking-tight leading-none">
                {formatCurrency(monthlyNetGrowth)} <span className="text-xs text-zinc-400 font-normal">/ mo</span>
              </div>
              <div className="text-sm text-zinc-400 mt-1">
                Equates to <span className="text-emerald-400 font-semibold">{formatCurrency(annualNetGrowth)}</span> annually
              </div>
            </div>
          </div>

          <div className="pt-8">
            <a href="#strategy-call">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 border border-white/10"
              >
                Claim This Growth Strategy
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}
