import { getTwilioClient, tieneSecretoValido } from '../_lib/twilioClient.js'

// Vercel Serverless Function: expone POST /api/whatsapp/test para producción.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método no permitido' })
    return
  }
  if (!tieneSecretoValido(req)) {
    res.status(401).json({ success: false, error: 'No autorizado' })
    return
  }

  const { phone } = req.body || {}
  if (!phone) {
    res.status(400).json({ success: false, error: 'Falta el campo phone' })
    return
  }

  try {
    await getTwilioClient().messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${phone}`,
      body:
        '📚 STUDPLAY | Tienes Historia del Perú en 3 días.\n\n' +
        '¿En qué año se proclamó la independencia del Perú?\n\n' +
        'A) 1819\nB) 1821\nC) 1824\n\n' +
        'Responde con A, B o C',
    })
    res.json({ success: true, message: 'Mensaje enviado' })
  } catch (e) {
    console.error('Twilio error:', e)
    res.status(500).json({ success: false, error: e.message })
  }
}
