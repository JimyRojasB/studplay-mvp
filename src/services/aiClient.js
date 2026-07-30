const REQUEST_TIMEOUT_MS = 20000
const FALLBACK_ERROR = 'IA no disponible, intenta en un momento'

// Llama al proxy propio (/api/ai). La GROK_API_KEY vive solo en el servidor
// (server.js / api/ai.js), nunca en el bundle del cliente.
export async function askAI({ systemPrompt, userPrompt }) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ systemPrompt, userPrompt }),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(FALLBACK_ERROR)
    }

    const data = await response.json()
    if (!data.result) {
      throw new Error(FALLBACK_ERROR)
    }
    return data.result
  } catch {
    throw new Error(FALLBACK_ERROR)
  } finally {
    clearTimeout(timer)
  }
}
