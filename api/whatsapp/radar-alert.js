import { enviarPreguntaWhatsApp } from '../_lib/twilioClient.js'
import {
  puedeEnviarAutomatico,
  registrarEnvioAutomatico,
  guardarPreguntaPendiente,
} from '../_lib/quizState.js'

// Vercel Serverless Function: POST /api/whatsapp/radar-alert
// Llamada automáticamente por ProcrastinationRadar.jsx desde el navegador
// (sin secreto, porque debe poder dispararse solo). El límite de 1 envío
// por número por hora acota el riesgo mientras no haya login real.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método no permitido' })
    return
  }

  const { phone, curso, pregunta, opciones, correcta, explicacion } = req.body || {}
  if (!phone || !curso || !pregunta || !opciones || !correcta) {
    res.status(400).json({ success: false, error: 'Faltan campos' })
    return
  }

  if (!puedeEnviarAutomatico(phone)) {
    res.status(429).json({ success: false, error: 'Ya se envió un recordatorio a este número hace poco' })
    return
  }

  try {
    await enviarPreguntaWhatsApp(phone, curso, pregunta, opciones)
    registrarEnvioAutomatico(phone)
    guardarPreguntaPendiente(`whatsapp:${phone}`, { curso, correcta, explicacion })
    res.json({ success: true })
  } catch (error) {
    console.error('Twilio error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
