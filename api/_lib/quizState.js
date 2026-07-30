// Estado en memoria (vive mientras el proceso del servidor esté arriba).
// Suficiente para el demo local con ngrok; en un backend real esto sería
// una tabla en base de datos ligada a la cuenta del estudiante.

const preguntasPendientes = new Map() // phone -> { curso, correcta, explicacion, ts }
const ultimoEnvioAutomatico = new Map() // phone -> timestamp

const RATE_LIMIT_MS = 3 * 60 * 1000 // 1 envío por número cada 3 minutos (modo demo)

export function puedeEnviarAutomatico(phone) {
  const ultima = ultimoEnvioAutomatico.get(phone) || 0
  return Date.now() - ultima >= RATE_LIMIT_MS
}

export function registrarEnvioAutomatico(phone) {
  ultimoEnvioAutomatico.set(phone, Date.now())
}

export function guardarPreguntaPendiente(phone, { curso, correcta, explicacion }) {
  preguntasPendientes.set(phone, { curso, correcta, explicacion, ts: Date.now() })
}

export function verPreguntaPendiente(phone) {
  return preguntasPendientes.get(phone) || null
}

export function eliminarPreguntaPendiente(phone) {
  preguntasPendientes.delete(phone)
}
