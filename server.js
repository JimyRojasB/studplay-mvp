import fs from 'node:fs/promises'
import express from 'express'
import { Transform } from 'node:stream'
import twilio from 'twilio'
import { callGemini, GeminiProxyError } from './api/_lib/gemini.js'
import { getTwilioClient, tieneSecretoValido, validarFirmaTwilio, enviarPreguntaWhatsApp } from './api/_lib/twilioClient.js'
import {
  puedeEnviarAutomatico,
  registrarEnvioAutomatico,
  guardarPreguntaPendiente,
  verPreguntaPendiente,
  eliminarPreguntaPendiente,
} from './api/_lib/quizState.js'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'
const ABORT_DELAY = 10000

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

// Create http server
const app = express()

// Proxy IA (misma lógica que la Serverless Function de Vercel en api/ai.js)
app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ extended: false }))

app.post('/api/ai', async (req, res) => {
  try {
    const { systemPrompt, userPrompt } = req.body || {}
    const { result } = await callGemini({ systemPrompt, userPrompt })
    res.status(200).json({ result })
  } catch (err) {
    const status = err instanceof GeminiProxyError ? err.status : 502
    res.status(status).json({ error: 'IA no disponible' })
  }
})

// WhatsApp (Twilio Sandbox)
app.post('/api/whatsapp/send', async (req, res) => {
  if (!tieneSecretoValido(req)) {
    return res.status(401).json({ success: false, error: 'No autorizado' })
  }
  const { to, message } = req.body || {}
  if (!to || !message) {
    return res.status(400).json({ success: false, error: 'Faltan campos: to, message' })
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
})

app.post('/api/whatsapp/webhook', (req, res) => {
  if (!validarFirmaTwilio(req)) {
    return res.status(403).send('Firma inválida')
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
  res.type('text/xml').send(twiml.toString())
})

app.post('/api/whatsapp/radar-alert', async (req, res) => {
  const { phone, curso, pregunta, opciones, correcta, explicacion } = req.body || {}
  if (!phone || !curso || !pregunta || !opciones || !correcta) {
    return res.status(400).json({ success: false, error: 'Faltan campos' })
  }
  if (!puedeEnviarAutomatico(phone)) {
    return res.status(429).json({ success: false, error: 'Ya se envió un recordatorio a este número hace poco' })
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
})

app.post('/api/whatsapp/test', async (req, res) => {
  if (!tieneSecretoValido(req)) {
    return res.status(401).json({ success: false, error: 'No autorizado' })
  }
  const { phone } = req.body || {}
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Falta el campo phone' })
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
})

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    /** @type {string} */
    let template
    /** @type {import('./src/entry-server.js').render} */
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    let didError = false

    const { pipe, abort } = render(url, {
      onShellError() {
        res.status(500)
        res.set({ 'Content-Type': 'text/html' })
        res.send('<h1>Something went wrong</h1>')
      },
      onShellReady() {
        res.status(didError ? 500 : 200)
        res.set({ 'Content-Type': 'text/html' })

        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`)

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding)
            callback()
          },
        })
        transformStream.on('finish', () => {
          res.write(htmlEnd)
          res.end()
        })

        res.write(htmlStart)
        pipe(transformStream)
      },
      onError(error) {
        didError = true
        console.error(error)
      },
    })

    setTimeout(() => abort(), ABORT_DELAY)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
