'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, BarChart3, Calendar as CalendarIcon, Users, Clock, Plus, 
  Trash2, LogOut, Lock, Mail, Check, RefreshCw, Clipboard, ArrowUpRight, CheckSquare, XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Metrics {
  totalAppointments: number
  totalRevenue: number
  pendingCount: number
  confirmedCount: number
  cancelledCount: number
  completedCount: number
  availableSlots: number
  totalSlots: number
}

interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  date: string
  time: string
  paymentStatus: string
  amount: number
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'slots' | 'patients'>('overview')

  // Dashboard states
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [dashboardLoading, setDashboardLoading] = useState(true)

  // Workload states
  const [workloadDate, setWorkloadDate] = useState(new Date().toISOString().split('T')[0])
  const [workloadSlots, setWorkloadSlots] = useState<any[]>([])
  const [workloadLoading, setWorkloadLoading] = useState(false)

  // Slot generator form states
  const [slotDate, setSlotDate] = useState('')
  const [slotStart, setSlotStart] = useState('09:00')
  const [slotEnd, setSlotEnd] = useState('17:00')
  const [slotInterval, setSlotInterval] = useState('30')
  const [slotLoading, setSlotLoading] = useState(false)
  const [slotMsg, setSlotMsg] = useState('')

  // Search filter for patients
  const [searchTerm, setSearchTerm] = useState('')

  const fetchWorkloadSlots = async (date: string) => {
    if (!date) return
    setWorkloadLoading(true)
    try {
      const res = await fetch(`/api/slots?date=${date}`)
      if (res.ok) {
        const data = await res.json()
        setWorkloadSlots(data)
      }
    } catch (err) {
      console.error('Failed to load workload slots:', err)
    } finally {
      setWorkloadLoading(false)
    }
  }

  // Check login state on mount
  useEffect(() => {
    // Basic cookie check or fetch analytics to check auth status
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setDashboardLoading(true)
    try {
      const res = await fetch('/api/admin/analytics')
      if (res.ok) {
        const data = await res.json()
        setMetrics(data.metrics)
        setAppointments(data.recentAppointments)
        setIsLoggedIn(true)
        // Fetch workload slots for the currently selected workload date
        fetchWorkloadSlots(workloadDate)
      } else {
        setIsLoggedIn(false)
      }
    } catch (err) {
      setIsLoggedIn(false)
    } finally {
      setDashboardLoading(false)
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setIsLoggedIn(true)
        fetchAnalytics()
      } else {
        setAuthError(data.error || 'Authentication failed.')
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  // Pre-fill demo logins to speed up testing
  const handleQuickDemoLogin = () => {
    setEmail('admin@clinic.com')
    setPassword('password123')
  }

  const handleLogout = async () => {
    // Simple signout by clearing cookie - we can call route or clear local state
    // For simplicity, we delete the token and reload
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    setIsLoggedIn(false)
  }

  const handleGenerateSlots = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slotDate) {
      setSlotMsg('Please select a date.')
      return
    }
    setSlotLoading(true)
    setSlotMsg('')
    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: slotDate,
          startTime: slotStart,
          endTime: slotEnd,
          intervalMinutes: slotInterval,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSlotMsg(data.message || 'Slots generated successfully!')
        // Refresh slot statistics
        fetchAnalytics()
      } else {
        setSlotMsg(data.error || 'Failed to generate slots.')
      }
    } catch (err) {
      setSlotMsg('Failed to connect to API.')
    } finally {
      setSlotLoading(false)
    }
  }

  const handleUpdateStatus = async (apptId: string, nextStatus: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    // Send status updates - normally we have an API route.
    // Let's create a quick status change endpoint inside appointments, but here we can mock or trigger it!
    // Wait, let's create a simple status update API inside app/api/appointments/status/route.ts!
    try {
      const res = await fetch('/api/appointments/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId: apptId, status: nextStatus }),
      })
      if (res.ok) {
        // Refresh dashboard data
        fetchAnalytics()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update status')
      }
    } catch (error) {
      console.error(error)
      alert('Error updating status.')
    }
  }

  // Filter patients/appointments based on search
  const filteredAppointments = appointments.filter(appt => 
    appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.patientPhone.includes(searchTerm) ||
    appt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // RENDER: LOGIN GATEWAY
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 shadow-lg shadow-teal-500/10">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-200">
              Clinical Control Panel
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Please authenticate using admin credentials to access scheduling and revenue metrics.
            </p>
          </div>

          <Card className="border-slate-900 bg-slate-950/80 backdrop-blur-md shadow-2xl">
            <form onSubmit={handleLoginSubmit}>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-bold text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-teal-400" />
                  Administrator Sign In
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {authError && (
                  <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-500 text-xs font-semibold">
                    {authError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    EMAIL ADDRESS
                  </Label>
                  <Input
                    required
                    type="email"
                    placeholder="admin@clinic.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-900/50 border-slate-900 rounded-xl focus:border-teal-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    PASSWORD
                  </Label>
                  <Input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-900/50 border-slate-900 rounded-xl focus:border-teal-500/50"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3.5 pt-2">
                <Button
                  disabled={authLoading}
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl h-10 border-0 font-semibold shadow-lg shadow-teal-500/10"
                >
                  {authLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    'Authenticate Dashboard'
                  )}
                </Button>
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="text-[10px] text-slate-500 hover:text-teal-400 font-mono tracking-wider transition-colors py-1 underline underline-offset-4"
                >
                  LOAD DEMO ADMIN CREDENTIALS
                </button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    )
  }

  // RENDER: DASHBOARD PANEL
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-900 bg-slate-950 flex flex-col">
        {/* Sidebar Logo */}
        <div className="p-6 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 shadow-md">
              <Heart className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-200">Jane Smith</span>
              <span className="block text-[8px] uppercase font-mono tracking-widest text-slate-600">Admin Panel</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="md:hidden p-1.5 rounded-lg border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Options */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-teal-950/25 border border-teal-500/20 text-teal-400'
                : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Overview Analytics
          </button>

          <button
            onClick={() => setActiveTab('slots')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'slots'
                ? 'bg-teal-950/25 border border-teal-500/20 text-teal-400'
                : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Clock className="w-4 h-4" />
            Slots Manager
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'patients'
                ? 'bg-teal-950/25 border border-teal-500/20 text-teal-400'
                : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Users className="w-4 h-4" />
            Patients & Log
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900 hidden md:block">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white px-3 py-2 text-xs font-semibold rounded-xl transition-all bg-slate-950"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 md:p-10 bg-slate-950 overflow-y-auto">
        {dashboardLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Page Title & Refresh */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-200 uppercase">
                  {activeTab === 'overview' && 'Clinical Overview'}
                  {activeTab === 'slots' && 'Clinic Slot Generation'}
                  {activeTab === 'patients' && 'Patient Records Log'}
                </h1>
                <p className="text-xs text-slate-500">
                  {activeTab === 'overview' && 'Review aggregate metrics and clinical data.'}
                  {activeTab === 'slots' && 'Bulk create consultation intervals for any date.'}
                  {activeTab === 'patients' && 'Search and transition booking workflow folders.'}
                </p>
              </div>
              <button 
                onClick={fetchAnalytics}
                className="p-2 border border-slate-900 bg-slate-900/30 hover:border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'overview' && metrics && (
              <div className="space-y-8">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Total Appointments */}
                  <Card className="border-slate-900 bg-slate-950 p-6 flex flex-col justify-between h-28">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Total Appointments</span>
                      <Users className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-200 mt-2">{metrics.totalAppointments}</span>
                  </Card>

                  {/* Revenue */}
                  <Card className="border-slate-900 bg-slate-950 p-6 flex flex-col justify-between h-28">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Total Revenue</span>
                      <BarChart3 className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-200 mt-2">₹{metrics.totalRevenue}</span>
                  </Card>

                  {/* Available Slots */}
                  <Card className="border-slate-900 bg-slate-950 p-6 flex flex-col justify-between h-28">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Available Slots</span>
                      <Clock className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-extrabold text-slate-200">{metrics.availableSlots}</span>
                      <span className="text-xs text-slate-600">/ {metrics.totalSlots}</span>
                    </div>
                  </Card>

                  {/* Confirmed Appointments */}
                  <Card className="border-slate-900 bg-slate-950 p-6 flex flex-col justify-between h-28">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Confirmed</span>
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-200 mt-2">{metrics.confirmedCount}</span>
                  </Card>

                </div>

                {/* Graph and Recent List Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Graph (Custom SVG layout for stability) */}
                  <div className="lg:col-span-7 p-6 rounded-xl border border-slate-900 bg-slate-950 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900/50">
                      <h3 className="text-sm font-bold text-slate-300 uppercase">Monthly Revenue Projection</h3>
                      <span className="text-[10px] font-mono text-teal-400">₹500 / Consult</span>
                    </div>
                    
                    {/* SVG Bar Chart */}
                    <div className="h-64 flex items-end justify-between pt-6 px-4">
                      {[15, 22, 18, 27, 35].map((val, idx) => {
                        const heights = ['h-[35%]', 'h-[50%]', 'h-[40%]', 'h-[65%]', 'h-[85%]']
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
                        return (
                          <div key={idx} className="flex flex-col items-center gap-3 w-12 group">
                            <div className="text-[10px] font-mono text-slate-600 group-hover:text-teal-400 font-bold transition-colors">₹{val}k</div>
                            <div className={`w-8 bg-gradient-to-t from-indigo-950 to-teal-500/60 group-hover:to-teal-400 rounded-t-md transition-all duration-300 ${heights[idx]}`} />
                            <span className="text-xs text-slate-500 font-mono">{months[idx]}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Quick Appointments Feed */}
                  <div className="lg:col-span-5 p-6 rounded-xl border border-slate-900 bg-slate-950 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900/50">
                      <h3 className="text-sm font-bold text-slate-300 uppercase">Recent Activity Feed</h3>
                      <span className="text-xs text-teal-500 font-semibold">{appointments.length} Total</span>
                    </div>
                    
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                      {appointments.length === 0 ? (
                        <div className="py-12 text-center text-xs text-slate-600">No appointments recorded yet.</div>
                      ) : (
                        appointments.map((appt) => (
                          <div key={appt.id} className="p-3 rounded-lg border border-slate-900 bg-slate-900/20 flex items-center justify-between text-xs">
                            <div className="space-y-1">
                              <span className="font-semibold text-slate-300 block">{appt.patientName}</span>
                              <span className="text-[10px] text-slate-500 font-mono block uppercase">{appt.time}</span>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                appt.status === 'CONFIRMED' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                                appt.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                appt.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                                {appt.status}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* Doctor Workload & Daily Timeline Grid */}
                <div className="p-6 rounded-xl border border-slate-900 bg-slate-950 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900/50">
                    <div>
                      <h3 className="text-sm font-bold text-slate-300 uppercase">Doctor Daily Schedule & Workload Index</h3>
                      <p className="text-xs text-slate-500 mt-1">Review occupancy rate, slot density, and complete daily consultations.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="text-xs text-slate-400 font-semibold uppercase">Inspection Date:</Label>
                      <input 
                        type="date"
                        value={workloadDate}
                        onChange={(e) => {
                          setWorkloadDate(e.target.value)
                          fetchWorkloadSlots(e.target.value)
                        }}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-teal-500/50 font-mono"
                      />
                    </div>
                  </div>

                  {/* Workload Indicator Stats */}
                  {workloadSlots.length > 0 ? (
                    (() => {
                      const total = workloadSlots.length
                      const booked = workloadSlots.filter(s => !s.isAvailable).length
                      const available = total - booked
                      const occupancy = Math.round((booked / total) * 100)
                      let statusText = "No Workload"
                      let statusColor = "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      if (occupancy > 0 && occupancy <= 40) {
                        statusText = "Light Workload"
                        statusColor = "bg-teal-500/10 text-teal-400 border-teal-500/20"
                      } else if (occupancy > 40 && occupancy <= 75) {
                        statusText = "Optimal Workload"
                        statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      } else if (occupancy > 75) {
                        statusText = "Heavy Workload (Near Capacity)"
                        statusColor = "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-900 bg-slate-900/10">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Occupancy Rate</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-extrabold text-slate-200">{occupancy}%</span>
                              <div className="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-500" style={{ width: `${occupancy}%` }} />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Load Index Status</span>
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor}`}>
                              {statusText}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Booked slots</span>
                            <span className="text-base font-bold text-slate-200">{booked} / {total} Total</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Remaining Available</span>
                            <span className="text-base font-bold text-slate-200">{available} Free Slots</span>
                          </div>
                        </div>
                      )
                    })()
                  ) : null}

                  {/* Workload Time-Grid List */}
                  {workloadLoading ? (
                    <div className="py-12 flex justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
                    </div>
                  ) : workloadSlots.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-slate-900 rounded-xl bg-slate-900/5">
                      <p className="text-xs text-slate-500">No consultation slots generated for {new Date(workloadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.</p>
                      <button 
                        onClick={() => {
                          setSlotDate(workloadDate)
                          setActiveTab('slots')
                        }}
                        className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold font-mono tracking-wider mt-2 hover:underline"
                      >
                        CREATE SLOTS IN GENERATOR →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {workloadSlots.map((slot) => {
                        const appt = slot.appointment
                        return (
                          <div 
                            key={slot.id} 
                            className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              !slot.isAvailable 
                                ? 'bg-slate-900/20 border-slate-900' 
                                : 'bg-slate-950 border-dashed border-slate-900 hover:border-slate-800'
                            }`}
                          >
                            {/* Time and Status */}
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-slate-400" />
                              </div>
                              <div>
                                <span className="text-xs font-mono font-bold text-slate-300 block">{slot.startTime} - {slot.endTime}</span>
                                <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold mt-1 border ${
                                  !slot.isAvailable 
                                    ? appt?.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                      appt?.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                      appt?.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    : 'bg-slate-500/10 text-slate-500 border-slate-800/50'
                                }`}>
                                  {!slot.isAvailable ? `BOOKED (${appt?.status || 'PENDING'})` : 'AVAILABLE'}
                                </span>
                              </div>
                            </div>

                            {/* Patient Info Details */}
                            {!slot.isAvailable && appt ? (
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-2 border-l border-slate-900/80">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] uppercase font-mono text-slate-600 font-bold block">Patient</span>
                                  <span className="text-xs font-semibold text-slate-300 block">{appt.patientName}</span>
                                </div>
                                <div className="space-y-0.5 font-mono">
                                  <span className="text-[9px] uppercase font-mono text-slate-600 font-bold block">Contact</span>
                                  <span className="text-[11px] text-slate-400 block">{appt.patientPhone}</span>
                                </div>
                                {appt.notes && (
                                  <div className="space-y-0.5 sm:col-span-2 md:col-span-1">
                                    <span className="text-[9px] uppercase font-mono text-slate-600 font-bold block">Symptoms / Notes</span>
                                    <span className="text-[11px] text-slate-400 truncate block max-w-[200px]">{appt.notes}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex-1 text-xs text-slate-600 italic px-2">
                                Empty slot. Patient can select this time online.
                              </div>
                            )}

                            {/* Action Operations */}
                            {!slot.isAvailable && appt && appt.status === 'CONFIRMED' && (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}
                                  className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold hover:bg-emerald-500/20 transition-colors"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(appt.id, 'CANCELLED')}
                                  className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-bold hover:bg-rose-500/20 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT: SLOTS MANAGER */}
            {activeTab === 'slots' && (
              <div className="max-w-2xl">
                <Card className="border-slate-900 bg-slate-950 shadow-2xl">
                  <form onSubmit={handleGenerateSlots}>
                    <CardHeader className="border-b border-slate-900 pb-5">
                      <CardTitle className="text-base font-bold text-slate-200">Bulk Generation Parameters</CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Choose a target date and scheduling boundaries. The engine automatically creates discrete booking intervals.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      
                      {slotMsg && (
                        <div className="p-3 rounded-lg border border-teal-500/20 bg-teal-500/5 text-teal-400 text-xs font-semibold">
                          {slotMsg}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 font-semibold">TARGET CLINIC DATE</Label>
                        <Input
                          required
                          type="date"
                          value={slotDate}
                          onChange={(e) => setSlotDate(e.target.value)}
                          className="bg-slate-900/50 border-slate-900 rounded-xl h-10"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-500 font-semibold">START TIME (24 HOUR)</Label>
                          <Input
                            required
                            type="text"
                            placeholder="09:00"
                            value={slotStart}
                            onChange={(e) => setSlotStart(e.target.value)}
                            className="bg-slate-900/50 border-slate-900 rounded-xl h-10 font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-500 font-semibold">END TIME (24 HOUR)</Label>
                          <Input
                            required
                            type="text"
                            placeholder="17:00"
                            value={slotEnd}
                            onChange={(e) => setSlotEnd(e.target.value)}
                            className="bg-slate-900/50 border-slate-900 rounded-xl h-10 font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 font-semibold">SLOT INTERVAL DURATION (MINUTES)</Label>
                        <select
                          value={slotInterval}
                          onChange={(e) => setSlotInterval(e.target.value)}
                          className="flex h-10 w-full rounded-xl border border-slate-900 bg-slate-900/50 px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        >
                          <option value="15">15 Minutes</option>
                          <option value="30">30 Minutes</option>
                          <option value="45">45 Minutes</option>
                          <option value="60">60 Minutes</option>
                        </select>
                      </div>

                    </CardContent>
                    <CardFooter className="border-t border-slate-900 pt-5 flex justify-end">
                      <Button
                        disabled={slotLoading}
                        type="submit"
                        className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl h-10 px-5 border-0 font-semibold shadow-lg shadow-teal-500/10"
                      >
                        {slotLoading ? (
                          <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        ) : (
                          <>
                            <Plus className="mr-1.5 w-4 h-4" />
                            Generate Slot Group
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>
            )}

            {/* TAB CONTENT: PATIENTS & APPOINTMENTS LOG */}
            {activeTab === 'patients' && (
              <div className="space-y-6">
                
                {/* Search Bar */}
                <div className="max-w-md">
                  <Input
                    type="text"
                    placeholder="Search by patient name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-900/50 border-slate-900 rounded-xl h-10 text-sm focus:border-teal-500/50"
                  />
                </div>

                {/* Log list */}
                <Card className="border-slate-900 bg-slate-950 shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-500 font-semibold tracking-wider font-mono">
                          <th className="p-4">PATIENT</th>
                          <th className="p-4">DATE & TIME</th>
                          <th className="p-4">STATUS</th>
                          <th className="p-4">PAYMENT</th>
                          <th className="p-4 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAppointments.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-xs text-slate-600">
                              No records matching criteria found.
                            </td>
                          </tr>
                        ) : (
                          filteredAppointments.map((appt) => (
                            <tr key={appt.id} className="border-b border-slate-900/50 hover:bg-slate-900/10">
                              <td className="p-4 space-y-0.5">
                                <span className="font-semibold text-slate-200 block">{appt.patientName}</span>
                                <span className="text-[10px] text-slate-500 font-mono block">{appt.patientEmail}</span>
                                <span className="text-[10px] text-slate-500 font-mono block">{appt.patientPhone}</span>
                              </td>
                              <td className="p-4 font-mono">
                                <span className="block text-slate-300 font-semibold">{appt.date}</span>
                                <span className="block text-[10px] text-slate-500 uppercase">{appt.time}</span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  appt.status === 'CONFIRMED' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                                  appt.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                  appt.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {appt.status}
                                </span>
                              </td>
                              <td className="p-4 space-y-0.5">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  appt.paymentStatus === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                  {appt.paymentStatus}
                                </span>
                                <span className="block text-[10px] text-slate-400">₹{appt.amount}</span>
                              </td>
                              <td className="p-4 text-right space-y-1">
                                {appt.status === 'CONFIRMED' && (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}
                                      className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-semibold hover:bg-emerald-500/20"
                                    >
                                      Mark Completed
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStatus(appt.id, 'CANCELLED')}
                                      className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-semibold hover:bg-rose-500/20"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                                {appt.status === 'PENDING' && (
                                  <span className="text-[10px] text-slate-600 block italic">Awaiting Checkout</span>
                                )}
                                {appt.status === 'COMPLETED' && (
                                  <span className="text-[10px] text-emerald-500 block font-semibold">Completed Session</span>
                                )}
                                {appt.status === 'CANCELLED' && (
                                  <span className="text-[10px] text-rose-500 block font-semibold">Cancelled Session</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

          </div>
        )}
      </main>

    </div>
  )
}
