import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-12345'

export interface AdminPayload {
  userId: string
  email: string
  role: string
}

export function generateToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload
  } catch (error) {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
