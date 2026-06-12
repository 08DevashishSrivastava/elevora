import fetch from 'node-fetch' // node-fetch might be required, or we can use native fetch since Node 18+ has it. Let's use global fetch.

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || ''
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || ''
const WHATSAPP_TEMPLATE_NAME = process.env.WHATSAPP_TEMPLATE_NAME || 'appointment_confirmation'

export const isWhatsAppConfigured = !!(WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID)

export async function sendWhatsAppConfirmation(
  patientPhone: string,
  patientName: string,
  appointmentDate: string,
  appointmentTime: string,
  paymentStatus: 'PAID' | 'PENDING'
): Promise<boolean> {
  // Normalize phone number (should start with country code without + or spaces, e.g. 919876543210)
  const cleanPhone = patientPhone.replace(/[\s\+\-]/g, '')

  if (!isWhatsAppConfigured) {
    console.log('\n--- MOCK WHATSAPP NOTIFICATION ---')
    console.log(`To: ${cleanPhone} (${patientName})`)
    console.log(`Message: Hello ${patientName}, your appointment has been booked for ${appointmentDate} at ${appointmentTime}. Payment: ${paymentStatus}.`)
    console.log('----------------------------------\n')
    return true
  }

  try {
    const url = `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`
    
    // We send a template message
    const payload = {
      messaging_product: 'whatsapp',
      to: cleanPhone,
      type: 'template',
      template: {
        name: WHATSAPP_TEMPLATE_NAME,
        language: {
          code: 'en_US',
        },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: patientName },
              { type: 'text', text: appointmentDate },
              { type: 'text', text: appointmentTime },
              { type: 'text', text: paymentStatus === 'PAID' ? 'Confirmed & Paid' : 'Confirmed (Pay at Clinic)' },
            ],
          },
        ],
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json() as any

    if (!response.ok) {
      console.error('WhatsApp API response error:', data)
      return false
    }

    console.log('WhatsApp confirmation sent successfully:', data)
    return true
  } catch (error) {
    console.error('Error sending WhatsApp confirmation:', error)
    return false
  }
}
