import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function getAdminFromRequest(req: Request) {
  const cookieHeader = req.headers.get('cookie') || ''
  const tokenCookie = cookieHeader
    .split(';')
    .find((c) => c.trim().startsWith('admin_token='))

  if (!tokenCookie) return null
  const token = tokenCookie.split('=')[1]
  const decoded = verifyToken(token)
  if (decoded && decoded.role === 'ADMIN') {
    return decoded
  }
  return null
}

export async function GET(req: Request) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 1. Total appointments count
    const totalAppointments = await prisma.appointment.count()

    // 2. Total revenue (sum of successful payments)
    const payments = await prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true },
    })
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount / 100, 0) // Convert paise to INR

    // 3. Status breakdown
    const pendingCount = await prisma.appointment.count({ where: { status: 'PENDING' } })
    const confirmedCount = await prisma.appointment.count({ where: { status: 'CONFIRMED' } })
    const cancelledCount = await prisma.appointment.count({ where: { status: 'CANCELLED' } })
    const completedCount = await prisma.appointment.count({ where: { status: 'COMPLETED' } })

    // 4. Slots availability statistics
    const totalSlots = await prisma.slot.count()
    const bookedSlots = await prisma.slot.count({ where: { isAvailable: false } })
    const availableSlots = totalSlots - bookedSlots

    // 5. Monthly revenue timeline data (for graph)
    const monthlyRevenue = [
      { name: 'Jan', revenue: 15000 },
      { name: 'Feb', revenue: 22000 },
      { name: 'Mar', revenue: 18000 },
      { name: 'Apr', revenue: 27000 },
      { name: 'May', revenue: totalRevenue > 0 ? totalRevenue : 35000 }, // Fallback to demo data
    ]

    // 6. Recent appointments list
    const recentAppointments = await prisma.appointment.findMany({
      include: {
        slot: true,
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    })

    return NextResponse.json({
      success: true,
      metrics: {
        totalAppointments,
        totalRevenue,
        pendingCount,
        confirmedCount,
        cancelledCount,
        completedCount,
        availableSlots,
        totalSlots,
      },
      monthlyRevenue,
      recentAppointments: recentAppointments.map(appt => ({
        id: appt.id,
        patientName: appt.patientName,
        patientEmail: appt.patientEmail,
        patientPhone: appt.patientPhone,
        status: appt.status,
        date: appt.date.toISOString().split('T')[0],
        time: `${appt.slot.startTime} - ${appt.slot.endTime}`,
        paymentStatus: appt.payment?.status || 'PENDING',
        amount: appt.payment ? appt.payment.amount / 100 : 0,
      })),
    })
  } catch (error) {
    console.error('Error calculating dashboard analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
