import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Helper to check admin authorization
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

// GET: Fetch slots for a date
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get('date') // Expecting YYYY-MM-DD

    if (!dateStr) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // Set date to YYYY-MM-DDT00:00:00.000Z
    const queryDate = new Date(`${dateStr}T00:00:00.000Z`)

    const slots = await prisma.slot.findMany({
      where: {
        date: queryDate,
      },
      include: {
        appointment: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    return NextResponse.json(slots)
  } catch (error) {
    console.error('Error fetching slots:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Bulk generate slots (Admin Only)
export async function POST(req: Request) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { date, startTime, endTime, intervalMinutes } = await req.json()

    if (!date || !startTime || !endTime || !intervalMinutes) {
      return NextResponse.json(
        { error: 'Missing parameters: date, startTime, endTime, intervalMinutes' },
        { status: 400 }
      )
    }

    const targetDate = new Date(`${date}T00:00:00.000Z`)
    const interval = parseInt(intervalMinutes, 10)

    // Parse start and end times into minutes of the day
    const parseTimeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    }

    let currentMinutes = parseTimeToMinutes(startTime)
    const endMinutes = parseTimeToMinutes(endTime)

    if (currentMinutes >= endMinutes) {
      return NextResponse.json(
        { error: 'Start time must be before end time' },
        { status: 400 }
      )
    }

    const formatMinutesToTime = (totalMinutes: number) => {
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    const createdSlots = []

    while (currentMinutes + interval <= endMinutes) {
      const startSlot = formatMinutesToTime(currentMinutes)
      const endSlot = formatMinutesToTime(currentMinutes + interval)

      // Avoid creating duplicate slots on the same date/time
      const existing = await prisma.slot.findFirst({
        where: {
          date: targetDate,
          startTime: startSlot,
        },
      })

      if (!existing) {
        const slot = await prisma.slot.create({
          data: {
            date: targetDate,
            startTime: startSlot,
            endTime: endSlot,
            isAvailable: true,
          },
        })
        createdSlots.push(slot)
      }

      currentMinutes += interval
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${createdSlots.length} slots for ${date}`,
      slots: createdSlots,
    })
  } catch (error) {
    console.error('Error generating slots:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
