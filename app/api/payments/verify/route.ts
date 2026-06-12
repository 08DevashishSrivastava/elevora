import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRazorpaySignature } from '@/lib/payment'
import { sendWhatsAppConfirmation } from '@/lib/whatsapp'

export async function POST(req: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing payment signature verification parameters' },
        { status: 400 }
      )
    }

    // Cryptographic signature check
    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    if (!isValid) {
      // Mark payment as failed
      await prisma.payment.update({
        where: { razorpayOrderId },
        data: { status: 'FAILED' },
      })
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Atomic database update inside transaction
    const appointment = await prisma.$transaction(async (tx) => {
      // 1. Update Payment status to SUCCESS
      const payment = await tx.payment.update({
        where: { razorpayOrderId },
        data: {
          status: 'SUCCESS',
          razorpayPaymentId,
          razorpaySignature,
        },
      })

      // 2. Update Appointment status to CONFIRMED
      const appt = await tx.appointment.update({
        where: { id: payment.appointmentId },
        data: { status: 'CONFIRMED' },
        include: { slot: true },
      })

      return appt
    })

    // Formatting date and time for communication
    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const timeRange = `${appointment.slot.startTime} - ${appointment.slot.endTime}`

    // Trigger WhatsApp notification asynchronously (or fire-and-forget)
    try {
      await sendWhatsAppConfirmation(
        appointment.patientPhone,
        appointment.patientName,
        formattedDate,
        timeRange,
        'PAID'
      )
    } catch (whatsappErr) {
      console.error('Failed to trigger WhatsApp notification:', whatsappErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and appointment confirmed successfully.',
      appointmentId: appointment.id,
    })
  } catch (error) {
    console.error('Error in payment verification API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
