'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, FileText, CreditCard, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Slot {
  id: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

export default function BookingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  // Form states
  const [patientName, setPatientName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [notes, setNotes] = useState('')

  // Generate date options for the next 7 days (excluding Sundays)
  const dateOptions = React.useMemo(() => {
    const options = []
    const start = new Date()
    for (let i = 0; i < 8; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      // 0 = Sunday
      if (d.getDay() !== 0) {
        const dateString = d.toISOString().split('T')[0]
        const displayString = d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
        options.push({ value: dateString, label: displayString })
      }
    }
    return options
  }, [])

  // Auto-select first date on mount
  useEffect(() => {
    if (dateOptions.length > 0 && !selectedDate) {
      setSelectedDate(dateOptions[0].value)
    }
  }, [dateOptions, selectedDate])

  // Fetch slots whenever the date changes
  useEffect(() => {
    if (!selectedDate) return

    async function fetchSlots() {
      setLoadingSlots(true)
      setSelectedSlotId('')
      try {
        const res = await fetch(`/api/slots?date=${selectedDate}`)
        if (res.ok) {
          const data = await res.json()
          setSlots(data)
        }
      } catch (error) {
        console.error('Failed to load slots:', error)
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [selectedDate])

  // Handle booking form submission and proceed to payment
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlotId || !patientName || !patientEmail || !patientPhone) {
      alert('Please fill out all required fields and select a slot.')
      return
    }

    setBookingLoading(true)
    try {
      // 1. Create appointment in DB (status: PENDING, slot marked as isAvailable = false)
      const appointmentRes = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientEmail,
          patientPhone,
          notes,
          slotId: selectedSlotId,
        }),
      })

      const appointmentData = await appointmentRes.json()

      if (!appointmentRes.ok) {
        throw new Error(appointmentData.error || 'Failed to book slot')
      }

      const appointmentId = appointmentData.appointment.id

      // 2. Create Razorpay order
      const orderRes = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId }),
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      // 3. Trigger Razorpay Checkout
      if (orderData.isMock) {
        // Mock gateway flow for testing/local development
        handleMockCheckout(orderData.orderId, appointmentId)
      } else {
        // Real Razorpay gateway flow
        triggerRazorpayCheckout(orderData, appointmentId)
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred during booking. Please try again.')
      setBookingLoading(false)
    }
  }

  // Real Razorpay Checkout modal trigger
  const triggerRazorpayCheckout = (orderData: any, appointmentId: string) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Dr. Jane Smith Clinic',
      description: 'Clinic Consultation Fee',
      order_id: orderData.orderId,
      handler: async function (response: any) {
        // Verify payment on backend
        try {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyRes.ok) {
            router.push(`/confirmation/${appointmentId}`)
          } else {
            alert('Payment verification failed: ' + verifyData.error)
            setBookingLoading(false)
          }
        } catch (error) {
          console.error(error)
          alert('Error verifying payment.')
          setBookingLoading(false)
        }
      },
      prefill: {
        name: orderData.appointment.patientName,
        email: orderData.appointment.patientEmail,
        contact: orderData.appointment.patientPhone,
      },
      theme: {
        color: '#06b6d4',
      },
      modal: {
        ondismiss: function () {
          setBookingLoading(false)
        },
      },
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  }

  // Mock checkout handler
  const handleMockCheckout = async (orderId: string, appointmentId: string) => {
    // Simulate slight lag for realistic loader
    setTimeout(async () => {
      try {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpayOrderId: orderId,
            razorpayPaymentId: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
            razorpaySignature: 'mock_signature_approved',
          }),
        })
        if (verifyRes.ok) {
          router.push(`/confirmation/${appointmentId}`)
        } else {
          alert('Mock payment verification failed')
          setBookingLoading(false)
        }
      } catch (error) {
        console.error(error)
        alert('Error in mock verification')
        setBookingLoading(false)
      }
    }, 1500)
  }

  const selectedSlot = slots.find(s => s.id === selectedSlotId)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col py-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-3xl px-4 relative z-10 flex-1 flex flex-col justify-center">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-right">
            <span className="block text-sm font-bold tracking-tight bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">Dr. Jane Smith Clinic</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Secure Scheduler</span>
          </div>
        </div>

        {/* Custom Visual Stepper Indicator */}
        <div className="flex items-center justify-center mb-8 max-w-xs mx-auto">
          <div className="flex items-center w-full">
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 1 
                  ? 'bg-teal-500 text-slate-950 ring-4 ring-teal-950' 
                  : 'bg-emerald-500 text-slate-950 font-bold'
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-[10px] uppercase font-mono tracking-wider mt-2 font-semibold ${
                step === 1 ? 'text-teal-400' : 'text-slate-400'
              }`}>Select Slot</span>
            </div>
            {/* Divider Line */}
            <div className="flex-1 h-0.5 bg-slate-900 mx-2 -mt-5">
              <div className="h-full bg-teal-500 transition-all duration-300" style={{ width: step > 1 ? '100%' : '0%' }} />
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 2 
                  ? 'bg-teal-500 text-slate-950 ring-4 ring-teal-950' 
                  : 'bg-slate-900 border border-slate-800 text-slate-600'
              }`}>
                2
              </div>
              <span className={`text-[10px] uppercase font-mono tracking-wider mt-2 font-semibold ${
                step === 2 ? 'text-teal-400' : 'text-slate-600'
              }`}>Details</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <Card className="border-slate-900 bg-slate-950/80 backdrop-blur-md shadow-2xl flex-1 flex flex-col">
          <CardHeader className="border-b border-slate-900/50 pb-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-slate-200">
                  {step === 1 ? 'Select a Time Slot' : 'Patient Information'}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  {step === 1 
                    ? 'Choose an available appointment slot from the calendar.' 
                    : 'Provide patient details and process securely.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6 flex-1 flex flex-col"
                >
                  {/* Stepper Date Picker */}
                  <div className="space-y-3">
                    <Label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-teal-400" />
                      1. SELECT DATE
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {dateOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSelectedDate(opt.value)}
                          className={`p-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                            selectedDate === opt.value
                              ? 'border-teal-500/50 bg-teal-950/20 text-teal-400 shadow-md shadow-teal-500/5'
                              : 'border-slate-900 bg-slate-900/30 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="uppercase text-[9px] tracking-wider text-slate-500">
                            {opt.label.split(',')[0]}
                          </span>
                          <span>{opt.label.split(',')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slot Selection */}
                  <div className="space-y-3 flex-1 flex flex-col">
                    <Label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      2. AVAILABLE SLOTS
                    </Label>
                    
                    {loadingSlots ? (
                      <div className="flex-1 flex items-center justify-center py-12">
                        <div className="w-8 h-8 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-12 border border-dashed border-slate-900 rounded-2xl bg-slate-900/10">
                        <p className="text-slate-500 text-sm">No slots generated for this day.</p>
                        <p className="text-xs text-slate-600 mt-1">Please ask the clinic administrator to create slots.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {slots.map((slot) => {
                          const isBooked = !slot.isAvailable
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedSlotId(slot.id)}
                              className={`p-3.5 rounded-xl border text-xs font-semibold transition-all flex justify-center items-center ${
                                isBooked
                                  ? 'border-slate-950 bg-slate-950/20 text-slate-700 cursor-not-allowed line-through'
                                  : selectedSlotId === slot.id
                                  ? 'border-teal-500/50 bg-teal-950/20 text-teal-400 shadow-md shadow-teal-500/5'
                                  : 'border-slate-900 bg-slate-900/30 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {slot.startTime} - {slot.endTime}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleBookingSubmit}
                  className="space-y-5 flex-1"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-teal-500" />
                        PATIENT NAME
                      </Label>
                      <Input
                        required
                        type="text"
                        placeholder="e.g. John Doe"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="bg-slate-900/50 border-slate-900 rounded-xl h-10 text-sm focus:border-teal-500/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-teal-500" />
                        EMAIL ADDRESS
                      </Label>
                      <Input
                        required
                        type="email"
                        placeholder="john.doe@example.com"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        className="bg-slate-900/50 border-slate-900 rounded-xl h-10 text-sm focus:border-teal-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-teal-500" />
                      PHONE NUMBER (FOR WHATSAPP)
                    </Label>
                    <Input
                      required
                      type="tel"
                      placeholder="e.g. 919876543210 (with country code)"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="bg-slate-900/50 border-slate-900 rounded-xl h-10 text-sm focus:border-teal-500/50"
                    />
                    <span className="block text-[10px] text-slate-600 font-mono">Include country code without + or spaces (e.g. 91 for India).</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-teal-500" />
                      SYMPTOMS / BRIEF NOTES
                    </Label>
                    <textarea
                      placeholder="Optional. Describe your symptoms or reason for visit."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="flex min-h-[80px] w-full rounded-xl border border-slate-900 bg-slate-900/50 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                    />
                  </div>

                  {/* Summary Card */}
                  {selectedSlot && (
                    <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/30 flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-400" />
                        <div>
                          <span className="font-semibold text-slate-300">Selected Schedule:</span>
                          <span className="block text-xs text-slate-500 mt-0.5">
                            {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {selectedSlot.startTime}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-slate-300 block">Consultation Fee:</span>
                        <span className="text-teal-400 font-bold">₹500.00</span>
                      </div>
                    </div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="border-t border-slate-900/50 pt-6 flex justify-between gap-4">
            {step === 1 ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/')}
                  className="border-slate-800 text-slate-400 hover:text-white rounded-xl h-10 px-4"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!selectedSlotId}
                  onClick={() => setStep(2)}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl h-10 px-5 border-0 shadow-lg shadow-teal-500/10 font-semibold"
                >
                  Next: Add Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  disabled={bookingLoading}
                  onClick={() => setStep(1)}
                  className="border-slate-800 text-slate-400 hover:text-white rounded-xl h-10 px-4"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
                <Button
                  disabled={bookingLoading}
                  onClick={handleBookingSubmit}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl h-10 px-6 border-0 shadow-lg shadow-teal-500/15 font-bold flex items-center justify-center"
                >
                  {bookingLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="mr-1.5 w-4 h-4" />
                      Pay Fee & Confirm (₹500)
                    </>
                  )}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
