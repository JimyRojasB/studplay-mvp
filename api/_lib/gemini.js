const GEMINI_MODEL = 'gemini-flash-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
const REQUEST_TIMEOUT_MS = 20000
const FALLBACK_MESSAGE = 'IA no disponible'

export class GeminiProxyError extends Error {
  constructor(message, status = 502) {
    super(message)
    this.status = status
  }
}

// Proxy server-side hacia Gemini (Google AI Studio): la API key nunca debe
// llegar al bundle del cliente, por eso vive en process.env.GEMINI_API_KEY.
export async function callGemini({ systemPrompt, userPrompt, maxTokens = 500 }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new GeminiProxyError(FALLBACK_MESSAGE, 503)
  }
  if (!userPrompt) {
    throw new GeminiProxyError('Solicitud inválida', 400)
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: systemPrompt
          ? { parts: [{ text: systemPrompt }] }
          : undefined,
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] },
        ],
        generationConfig: {
          maxOutputTokens: maxTokens,
        },
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      console.error('Gemini API error', response.status, detail)
      throw new GeminiProxyError(FALLBACK_MESSAGE, 502)
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return { result: text }
  } catch (err) {
    if (err instanceof GeminiProxyError) throw err
    if (err.name === 'AbortError') {
      throw new GeminiProxyError(FALLBACK_MESSAGE, 504)
    }
    console.error('Gemini proxy error', err)
    throw new GeminiProxyError(FALLBACK_MESSAGE, 502)
  } finally {
    clearTimeout(timer)
  }
}
