import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, hashPassword, generateToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if any admin exists in the database
    let admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })

    // If no admin exists, seed a default admin for convenience
    if (!admin) {
      const defaultPasswordHash = await hashPassword('password123')
      admin = await prisma.user.create({
        data: {
          email: 'admin@clinic.com',
          passwordHash: defaultPasswordHash,
          name: 'Dr. Jane Smith',
          role: 'ADMIN',
        },
      })
      console.log('Seeded default admin user: admin@clinic.com / password123')
    }

    // Query for the specific login user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isMatch = await comparePassword(password, user.passwordHash)
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
