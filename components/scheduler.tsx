'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, ChevronLeft, ChevronRight, Check, Sparkles, Send } from 'lucide-react'

// Generate dates for scheduling calendar (next 7 days starting tomorrow)
const generateDates = () => {
  const dates = []
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // Starting tomorrow
  for (let i = 1; i <= 8; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    // Skip Sundays
    if (d.getDay() === 0) continue
    dates.push({
      dayName: daysOfWeek[d.getDay()],
      dayNum: d.getDate(),
      monthName: months[d.getMonth()],
      fullDate: d,
    })
  }
  return dates.slice(0, 5) // return next 5 business days
}

const timeSlots = [
  '10:00 AM - 10:45 AM EST',
  '11:30 AM - 12:15 PM EST',
  '02:00 PM - 02:45 PM EST',
  '03:30 PM - 04:15 PM EST',
  '05:00 PM - 05:45 PM EST'
]

export default function Scheduler() {
  const dates = generateDates()
  
  // Form states
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formStep, setFormStep] = useState(1) // 1: Date/Time, 2: Details, 3: Success

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    spend: '$5,000 - $15,000 / mo'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.company) {
      alert('Please fill in required fields.')
      return
    }
    setFormStep(3)
  }

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel rounded-3xl p-6 md:p-10 relative overflow-hidden border border-white/10 shadow-2xl">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* STEP 1: Date & Time Picker */}
        {formStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {/* Context Column */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Free 1-on-1 Consultation
                </span>
                <h3 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Design Your <br />
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Scale Blueprint</span>
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Book a free 45-minute growth strategy session. Our director of growth will analyze your brand presence, SEO rankings, and paid ads to map out a customized marketing roadmap.
                </p>
              </div>

              <div className="mt-8 space-y-3.5 border-t border-white/5 pt-6 text-xs text-zinc-400">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 font-bold">1</div>
                  <span>Select Date and Time Slot</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 font-bold">2</div>
                  <span>Share Business Details</span>
                </div>
              </div>
            </div>

            {/* Selector Column */}
            <div className="md:col-span-7 space-y-6">
              {/* Date selection grid */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Choose a Date
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {dates.map((d, index) => {
                    const isSelected = selectedDate === index
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedDate(index)
                          setSelectedTime(null) // Reset time slot on date change
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                            ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                            : 'bg-white/2 border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-200'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-semibold font-mono tracking-wider">{d.dayName}</span>
                        <span className="text-lg font-bold my-0.5">{d.dayNum}</span>
                        <span className="text-[9px] font-mono text-zinc-500">{d.monthName}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time selection slot list */}
              {selectedDate !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Available Time Slots ({dates[selectedDate].monthName} {dates[selectedDate].dayNum})
                  </h4>
                  <div className="flex flex-col gap-2">
                    {timeSlots.map((time, idx) => {
                      const isSelected = selectedTime === time
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedTime(time)}
                          className={`flex justify-between items-center px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                              : 'bg-white/2 border-white/5 text-zinc-300 hover:border-white/10 hover:bg-white/3'
                          }`}
                        >
                          <span>{time}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-white border-white' : 'border-zinc-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-blue-600 stroke-[3px]" />}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Next button */}
              {selectedDate !== null && selectedTime !== null && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-2"
                >
                  <button
                    onClick={() => setFormStep(2)}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 border border-white/10"
                  >
                    Confirm Date & Time
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Lead Capture Details Form */}
        {formStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl mx-auto space-y-6"
          >
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFormStep(1)} 
                className="p-2 bg-white/5 border border-white/10 rounded-lg text-zinc-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest">Selected Slot</span>
                <div className="text-xs text-zinc-300 font-mono">
                  {dates[selectedDate!].dayName}, {dates[selectedDate!].monthName} {dates[selectedDate!].dayNum} @ {selectedTime}
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white">Share Your Business Objectives</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Business Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. john@yourcompany.com"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Elevate Inc."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="e.g. https://yourcompany.com"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Current Monthly Marketing Budget</label>
                <select
                  name="spend"
                  value={formData.spend}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option>$5,000 - $15,000 / mo</option>
                  <option>$15,000 - $50,000 / mo</option>
                  <option>$50,000 - $100,000 / mo</option>
                  <option>$100,000+ / mo</option>
                  <option>We are just getting started</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 border border-white/10"
                >
                  Schedule Free Strategy Call
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 3: Success Screen */}
        {formStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto text-center space-y-6 py-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8 stroke-[3px]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Your Call is Booked!</h3>
              <p className="text-sm text-zinc-400">
                A calendar invitation with a video meeting link has been sent to <span className="text-white font-semibold">{formData.email}</span>.
              </p>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-2xl p-5 text-left space-y-3.5">
              <div className="text-[10px] font-mono text-purple-400 tracking-wider uppercase">STRATEGY CALL DETAILS</div>
              <div className="text-sm space-y-1.5">
                <div className="text-zinc-400">Client: <span className="text-white font-medium">{formData.name} ({formData.company})</span></div>
                <div className="text-zinc-400">Time: <span className="text-white font-mono">{dates[selectedDate!].monthName} {dates[selectedDate!].dayNum}, {dates[selectedDate!].dayName} @ {selectedTime}</span></div>
                <div className="text-zinc-400">Host: <span className="text-purple-400 font-medium">Elevora Growth Advisory Team</span></div>
              </div>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Prior to our call, we will conduct a full technical SEO audit and digital visibility assessment on your website. Please make sure to check your spam/promotions folder if you don't receive our calendar invitation within 5 minutes.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedDate(null)
                  setSelectedTime(null)
                  setFormStep(1)
                }}
                className="text-xs text-zinc-400 hover:text-white underline font-mono"
              >
                Schedule another slot
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
