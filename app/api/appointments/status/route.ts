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

export async function PATCH(req: Request) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { appointmentId, status } = await req.json()

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'Appointment ID and status are required' },
        { status: 400 }
      )
    }

    // Validate status values
    const allowedStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // If status is CANCELLED, we release the slot back to AVAILABLE!
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedAppt = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status },
      })

      if (status === 'CANCELLED') {
        await tx.slot.update({
          where: { id: appointment.slotId },
          data: { isAvailable: true },
        })
      }

      return updatedAppt
    })

    return NextResponse.json({
      success: true,
      appointment: result,
    })
  } catch (error) {
    console.error('Error updating appointment status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
