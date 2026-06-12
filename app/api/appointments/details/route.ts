import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        slot: true,
        payment: true,
      },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Return filtered public fields for security
    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone,
        notes: appointment.notes,
        status: appointment.status,
        date: appointment.date.toISOString().split('T')[0],
        startTime: appointment.slot.startTime,
        endTime: appointment.slot.endTime,
        payment: appointment.payment
          ? {
              status: appointment.payment.status,
              amount: appointment.payment.amount / 100,
              currency: appointment.payment.currency,
              razorpayOrderId: appointment.payment.razorpayOrderId,
              razorpayPaymentId: appointment.payment.razorpayPaymentId,
            }
          : null,
      },
    })
  } catch (error) {
    console.error('Error fetching public appointment details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
