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

// GET: List all appointments (Admin Only)
export async function GET(req: Request) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const appointments = await prisma.appointment.findMany({
      include: {
        slot: true,
        payment: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a pending appointment (Patient checkout phase)
export async function POST(req: Request) {
  try {
    const { patientName, patientEmail, patientPhone, notes, slotId } = await req.json()

    if (!patientName || !patientEmail || !patientPhone || !slotId) {
      return NextResponse.json(
        { error: 'Missing required booking fields: patientName, patientEmail, patientPhone, slotId' },
        { status: 400 }
      )
    }

    // Check if the slot is available
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    })

    if (!slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      )
    }

    if (!slot.isAvailable) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please select another slot.' },
        { status: 409 }
      )
    }

    // Use a transaction to block slot and create appointment
    const result = await prisma.$transaction(async (tx) => {
      // 1. Mark slot as unavailable
      const updatedSlot = await tx.slot.update({
        where: { id: slotId },
        data: { isAvailable: false },
      })

      // 2. Create the appointment
      const appointment = await tx.appointment.create({
        data: {
          patientName,
          patientEmail,
          patientPhone,
          notes,
          status: 'PENDING',
          date: slot.date,
          slotId: slot.id,
        },
      })

      return appointment
    })

    return NextResponse.json({
      success: true,
      appointment: result,
    })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
