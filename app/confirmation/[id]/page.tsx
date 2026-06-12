'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, Calendar, Clock, CreditCard, User, ClipboardList, Printer, Home, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface AppointmentDetails {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  notes: string
  status: string
  date: string
  startTime: string
  endTime: string
  payment: {
    status: string
    amount: number
    currency: string
    razorpayOrderId: string
    razorpayPaymentId: string
  } | null
}

export default function ConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    async function fetchDetails() {
      try {
        const res = await fetch(`/api/appointments/details?id=${id}`)
        const data = await res.json()
        if (res.ok) {
          setAppointment(data.appointment)
        } else {
          setError(data.error || 'Failed to load appointment details.')
        }
      } catch (err) {
        console.error(err)
        setError('Connection error. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-xl font-bold mb-2">Booking Not Found</h1>
        <p className="text-sm text-slate-500 text-center max-w-sm mb-6">
          {error || 'We could not locate this appointment record.'}
        </p>
        <Link href="/">
          <Button className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl">
            Return to Home
          </Button>
        </Link>
      </div>
    )
  }

  const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto max-w-2xl px-4 relative z-10">
        
        {/* Animated Checkmark and Success Header */}
        <div className="text-center space-y-4 mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 shadow-lg shadow-teal-500/5"
          >
            <CheckCircle2 className="w-9 h-9 text-teal-400" />
          </motion.div>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-1.5"
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-200">Appointment Confirmed!</h1>
            <p className="text-xs text-slate-500">
              Your consultation is successfully scheduled. A confirmation has been sent via WhatsApp.
            </p>
          </motion.div>
        </div>

        {/* Details Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-slate-900 bg-slate-950/80 backdrop-blur-md shadow-2xl overflow-hidden mb-6">
            <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-indigo-500" />
            <CardHeader className="border-b border-slate-900/50 pb-5">
              <CardTitle className="text-sm font-mono text-teal-400 tracking-wider uppercase">Receipt Details</CardTitle>
              <CardDescription className="text-[10px] font-mono text-slate-500 uppercase">
                ID: {appointment.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Grid detail entries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="space-y-1">
                  <span className="text-slate-500 text-xs block font-medium">PATIENT NAME</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {appointment.patientName}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 text-xs block font-medium">CONTACT</span>
                  <span className="font-semibold text-slate-300 font-mono">
                    {appointment.patientPhone}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 text-xs block font-medium">DATE</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {formattedDate}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 text-xs block font-medium">TIME SLOT</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {appointment.startTime} - {appointment.endTime}
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/30 flex justify-between items-center text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-teal-400" />
                  <div>
                    <span className="font-semibold text-slate-300">Payment Status</span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5 uppercase">
                      ID: {appointment.payment?.razorpayPaymentId || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                    PAID SUCCESS
                  </span>
                  <span className="block font-bold text-slate-200 mt-1">₹500.00</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3 pt-2 border-t border-slate-900/50">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-teal-400" />
                  PRE-CONSULTATION CHECKLIST
                </h4>
                <ul className="text-xs text-slate-500 space-y-2 pl-1 list-disc list-inside">
                  <li>Please arrive at the clinic at least 10 minutes prior to your slot.</li>
                  <li>Bring your past cardiology records, prescriptions, and test reports.</li>
                  <li>Avoid strenuous physical activities or caffeine 1 hour before testing.</li>
                  <li>Show this digital confirmation screen at the entry reception.</li>
                </ul>
              </div>

            </CardContent>

            <CardFooter className="border-t border-slate-900/50 pt-5 pb-5 bg-slate-900/10 flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="border-slate-800 text-slate-400 hover:text-white rounded-xl h-9 px-3.5 text-xs font-semibold"
              >
                <Printer className="mr-1.5 w-3.5 h-3.5" />
                Print Receipt
              </Button>
              <Link href="/">
                <Button className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white rounded-xl h-9 px-4 text-xs font-semibold flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5" />
                  Return Home
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
        
      </div>
    </div>
  )
}
