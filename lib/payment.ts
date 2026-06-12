import Razorpay from 'razorpay'
import crypto from 'crypto'

const keyId = process.env.RAZORPAY_KEY_ID || ''
const keySecret = process.env.RAZORPAY_KEY_SECRET || ''

// Expose a helper to check if Razorpay is configured
export const isRazorpayConfigured = !!(keyId && keySecret)

let razorpayInstance: Razorpay | null = null

try {
  if (isRazorpayConfigured) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  }
} catch (error) {
  console.error('Failed to initialize Razorpay instance:', error)
}

export async function createRazorpayOrder(amountInRupees: number, appointmentId: string) {
  const amount = Math.round(amountInRupees * 100) // Convert to paise

  if (!isRazorpayConfigured || !razorpayInstance) {
    // Return a mocked order for testing/local development
    console.log('Using Mock Razorpay Order Creator')
    const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`
    return {
      id: mockOrderId,
      amount,
      currency: 'INR',
      receipt: appointmentId,
      status: 'created',
      isMock: true,
    }
  }

  try {
    const order = await razorpayInstance.orders.create({
      amount,
      currency: 'INR',
      receipt: appointmentId,
      notes: {
        appointmentId,
      },
    })
    return {
      ...order,
      isMock: false,
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  if (!isRazorpayConfigured || razorpayOrderId.startsWith('order_mock_')) {
    // If mocking, always verify successfully
    console.log('Using Mock Razorpay Signature Verification')
    return true
  }

  try {
    const body = razorpayOrderId + '|' + razorpayPaymentId
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex')

    return expectedSignature === razorpaySignature
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error)
    return false
  }
}
