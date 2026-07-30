import { callGemini, GeminiProxyError } from './_lib/gemini.js'

// Vercel Serverless Function: expone POST /api/ai para producción.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'IA no disponible' })
    return
  }

  try {
    const { systemPrompt, userPrompt } = req.body || {}
    const { result } = await callGemini({ systemPrompt, userPrompt })
    res.status(200).json({ result })
  } catch (err) {
    const status = err instanceof GeminiProxyError ? err.status : 502
    res.status(status).json({ error: 'IA no disponible' })
  }
}
