import twilio from 'twilio'
import { validarFirmaTwilio } from '../_lib/twilioClient.js'
import { verPreguntaPendiente, eliminarPreguntaPendiente } from '../_lib/quizState.js'

// Vercel Serverless Function: Twilio llama aquí cuando el estudiante responde
// por WhatsApp. Vercel parsea automáticamente el body x-www-form-urlencoded
// que manda Twilio en req.body.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }
  if (!validarFirmaTwilio(req)) {
    res.status(403).send('Firma inválida')
    return
  }

  const from = req.body?.From || ''
  const body = req.body?.Body || ''
  const respuesta = body.trim().toUpperCase()

  let replyMessage = ''
  const pendiente = verPreguntaPendiente(from)

  if (!['A', 'B', 'C'].includes(respuesta)) {
    replyMessage = 'Responde con A, B o C para contestar la pregunta.'
  } else if (!pendiente) {
    replyMessage = 'No tengo una pregunta pendiente para ti ahora mismo. Abre STUDPLAY para ver tu progreso.'
  } else if (respuesta === pendiente.correcta) {
    replyMessage = `✅ Correcto! +15 XP ganados. Tu racha sigue activa. Abre STUDPLAY para ver tu ranking.\n\n💡 ${pendiente.explicacion}`
    eliminarPreguntaPendiente(from)
    // TODO: actualizar XP en la base de datos (requiere asociar el número de WhatsApp a un usuario)
  } else {
    replyMessage = `❌ No era esa. La respuesta correcta es ${pendiente.correcta}. +5 XP por intentarlo.\n\n💡 ${pendiente.explicacion}`
    eliminarPreguntaPendiente(from)
  }

  const twiml = new twilio.twiml.MessagingResponse()
  twiml.message(replyMessage)

  res.setHeader('Content-Type', 'text/xml')
  res.status(200).send(twiml.toString())
}
