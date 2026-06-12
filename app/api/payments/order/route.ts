import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createRazorpayOrder } from '@/lib/payment'

const APPOINTMENT_FEE_INR = 500 // ₹500 standard appointment fee

export async function POST(req: Request) {
  try {
    const { appointmentId } = await req.json()

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { slot: true },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check if there is an existing payment
    let payment = await prisma.payment.findUnique({
      where: { appointmentId },
    })

    let order

    if (payment && payment.status === 'SUCCESS') {
      return NextResponse.json(
        { error: 'This appointment is already paid' },
        { status: 400 }
      )
    }

    // Create the order using Razorpay SDK helper
    order = await createRazorpayOrder(APPOINTMENT_FEE_INR, appointment.id)

    // Save or update payment details in database
    if (payment) {
      payment = await prisma.payment.update({
        where: { appointmentId },
        data: {
          razorpayOrderId: order.id,
          amount: Math.round(APPOINTMENT_FEE_INR * 100),
          status: 'PENDING',
        },
      })
    } else {
      payment = await prisma.payment.create({
        data: {
          appointmentId: appointment.id,
          razorpayOrderId: order.id,
          amount: Math.round(APPOINTMENT_FEE_INR * 100),
          currency: 'INR',
          status: 'PENDING',
        },
      })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      isMock: order.isMock,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
      appointment: {
        id: appointment.id,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone,
        date: appointment.date,
        time: `${appointment.slot.startTime} - ${appointment.slot.endTime}`,
      },
    })
  } catch (error) {
    console.error('Error in payment order api:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
