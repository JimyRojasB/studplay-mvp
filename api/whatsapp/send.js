import { getTwilioClient, tieneSecretoValido } from '../_lib/twilioClient.js'

// Vercel Serverless Function: expone POST /api/whatsapp/send para producción.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método no permitido' })
    return
  }
  if (!tieneSecretoValido(req)) {
    res.status(401).json({ success: false, error: 'No autorizado' })
    return
  }

  const { to, message } = req.body || {}
  if (!to || !message) {
    res.status(400).json({ success: false, error: 'Faltan campos: to, message' })
    return
  }

  try {
    const msg = await getTwilioClient().messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to,
      body: message,
    })
    res.json({ success: true, sid: msg.sid })
  } catch (error) {
    console.error('Twilio error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
