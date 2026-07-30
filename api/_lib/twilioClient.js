import twilio from 'twilio'

let client

// Cliente Twilio singleton (server-only: el SID/token nunca deben llegar al navegador).
export function getTwilioClient() {
  if (!client) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  }
  return client
}

// Guard para /send y /test: sin esto, cualquiera que descubra la URL pública
// podría usar nuestra cuenta de Twilio como relay para mandar WhatsApp a
// cualquier número. El caller debe mandar el header x-internal-secret.
export function tieneSecretoValido(req) {
  const secret = process.env.INTERNAL_API_SECRET
  if (!secret) return false
  return req.headers['x-internal-secret'] === secret
}

// Valida que el webhook realmente venga de Twilio (firma HMAC con el auth token).
export function validarFirmaTwilio(req) {
  const signature = req.headers['x-twilio-signature']
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!authToken || !signature) return false

  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const url = `${protocol}://${host}${req.originalUrl || req.url}`

  return twilio.validateRequest(authToken, signature, url, req.body || {})
}

export async function enviarPreguntaWhatsApp(phoneNumber, curso, pregunta, opciones) {
  const mensaje =
    `📚 STUDPLAY | Tienes ${curso} pronto.\n\n` +
    `${pregunta}\n\n` +
    `A) ${opciones.A}\n` +
    `B) ${opciones.B}\n` +
    `C) ${opciones.C}\n\n` +
    `Responde con A, B o C`

  return getTwilioClient().messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${phoneNumber}`,
    body: mensaje,
  })
}
