import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { askAI } from '../services/aiClient'
import { calcularRiesgo } from '../utils/studyMetrics'

const SYSTEM_PROMPT = `Eres un coach de estudio empático pero directo. Escribe UN mensaje de máximo 2 oraciones. Menciona el curso específico en riesgo y propón UNA acción concreta de 5-10 minutos. Tono: amigo cercano. Solo español. No uses formato Markdown (sin asteriscos ni negritas), solo texto plano.`

const QUIZ_SYSTEM_PROMPT = `Eres un profesor universitario peruano experto en evaluación. Genera exactamente 1 pregunta de opción múltiple (A, B, C) sobre el tema indicado, pensada para reforzar en menos de 2 minutos. No uses formato Markdown dentro de los textos (sin asteriscos ni negritas).
Responde ÚNICAMENTE con este JSON válido, sin texto adicional:
{
  "pregunta": "...",
  "opciones": {"A": "...", "B": "...", "C": "..."},
  "correcta": "B",
  "explicacion": "..."
}`

const COOLDOWN_MS = 3 * 60 * 1000 // modo demo: cada 3 minutos, en vez de cada hora

function elegirCursoEnRiesgo({ cursos, cursoProximoExamen, diasProximoExamen }) {
  if (cursoProximoExamen && diasProximoExamen !== null && diasProximoExamen <= 5) {
    return cursoProximoExamen
  }
  return [...cursos].sort((a, b) => a.progreso - b.progreso)[0] || null
}

function extraerJSON(texto) {
  try {
    return JSON.parse(texto)
  } catch {
    const match = texto.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('JSON inválido')
    return JSON.parse(match[0])
  }
}

async function generarPregunta(curso) {
  const temas = (curso.temasDebiles || []).join(', ') || curso.nombre
  const texto = await askAI({
    systemPrompt: QUIZ_SYSTEM_PROMPT,
    userPrompt: `Curso: ${curso.nombre}. Tema débil: ${temas}.`,
  })
  const data = extraerJSON(texto)
  if (!data?.pregunta || !data?.opciones || !data?.correcta) {
    throw new Error('JSON inválido')
  }
  return data
}

export default function ProcrastinationRadar({
  cursos,
  diasSinActividad,
  diasProximoExamen,
  cursoProximoExamen,
  rachaRota,
  onEarnXp,
  telefono,
  onGuardarTelefono,
}) {
  const [estado, setEstado] = useState('idle') // idle | cargando | listo | error
  const [mensaje, setMensaje] = useState('')
  const [cursoRiesgo, setCursoRiesgo] = useState(null)
  const [telefonoInput, setTelefonoInput] = useState('')
  const [whatsappEstado, setWhatsappEstado] = useState('idle') // idle | enviando | enviado | error
  const [proximoDisponible, setProximoDisponible] = useState(0)
  const [ahora, setAhora] = useState(Date.now())

  const score = calcularRiesgo({ diasSinActividad, diasProximoExamen, rachaRota })
  const enCooldown = ahora < proximoDisponible

  useEffect(() => {
    if (!enCooldown) return
    const id = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(id)
  }, [enCooldown])

  const dispararWhatsapp = async (numero, riesgo) => {
    if (!riesgo) return
    setWhatsappEstado('enviando')
    try {
      const pregunta = await generarPregunta(riesgo)
      const resp = await fetch('/api/whatsapp/radar-alert', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          phone: numero,
          curso: riesgo.nombre,
          pregunta: pregunta.pregunta,
          opciones: pregunta.opciones,
          correcta: pregunta.correcta,
          explicacion: pregunta.explicacion,
        }),
      })
      const data = await resp.json()
      setWhatsappEstado(data.success ? 'enviado' : 'error')
      if (data.success) {
        setProximoDisponible(Date.now() + COOLDOWN_MS)
      }
    } catch {
      setWhatsappEstado('error')
    }
  }

  const analizarYEnviar = () => {
    if (enCooldown) return
    const riesgo = elegirCursoEnRiesgo({ cursos, cursoProximoExamen, diasProximoExamen })
    setCursoRiesgo(riesgo)
    setEstado('cargando')
    setWhatsappEstado('idle')

    const userPrompt = `Curso en riesgo: ${riesgo ? riesgo.nombre : 'sin especificar'}.
Días sin estudiar: ${diasSinActividad}.
Examen en: ${diasProximoExamen ?? 'sin examen próximo'} días.`

    askAI({ systemPrompt: SYSTEM_PROMPT, userPrompt })
      .then((texto) => {
        setMensaje(texto.trim())
        setEstado('listo')
      })
      .catch(() => setEstado('error'))

    if (telefono) {
      dispararWhatsapp(telefono, riesgo)
    }
  }

  const handleGuardarTelefono = () => {
    const numero = telefonoInput.trim()
    if (!numero) return
    onGuardarTelefono(numero)
    dispararWhatsapp(numero, cursoRiesgo)
    setProximoDisponible(Date.now() + COOLDOWN_MS)
  }

  const segundosRestantes = Math.max(0, Math.ceil((proximoDisponible - ahora) / 1000))
  const minutos = String(Math.floor(segundosRestantes / 60)).padStart(1, '0')
  const segundos = String(segundosRestantes % 60).padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 backdrop-blur-xl"
      style={{ backgroundColor: '#1a2236', borderColor: '#00d4ff' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <h3 className="font-black text-xs sm:text-sm uppercase tracking-widest text-cyan-300">
            Radar Anti-Procrastinación
          </h3>
        </div>
        <span className="text-orange-400 font-black text-xs sm:text-sm">{score}/100</span>
      </div>

      {estado === 'idle' && (
        <p className="text-slate-300 text-xs sm:text-sm mb-4">
          Analiza tu riesgo de procrastinar y manda un recordatorio con una pregunta de refuerzo por WhatsApp.
        </p>
      )}

      {estado === 'cargando' && (
        <div className="space-y-2 mb-4">
          <p className="text-slate-400 text-[11px] sm:text-xs font-bold">Analizando tu progreso...</p>
          <div className="h-3 bg-white/10 rounded w-full animate-pulse" />
          <div className="h-3 bg-white/10 rounded w-2/3 animate-pulse" />
        </div>
      )}

      {estado === 'error' && (
        <p className="text-slate-300 text-xs sm:text-sm mb-4">IA no disponible, intenta en un momento</p>
      )}

      {estado === 'listo' && (
        <p className="text-white text-xs sm:text-sm leading-relaxed mb-4">{mensaje}</p>
      )}

      {!telefono ? (
        <div className="mb-4 bg-black/20 border border-white/10 rounded-xl p-3">
          <p className="text-slate-300 text-[11px] sm:text-xs mb-2">
            📲 Conecta tu WhatsApp para recibir el recordatorio ahí también
          </p>
          <div className="flex gap-2">
            <input
              value={telefonoInput}
              onChange={(e) => setTelefonoInput(e.target.value)}
              placeholder="+51987654321"
              className="flex-1 bg-slate-900/70 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400/50"
            />
            <button
              onClick={handleGuardarTelefono}
              disabled={enCooldown}
              className="px-3 bg-cyan-500/30 border border-cyan-400/50 rounded-lg text-cyan-300 font-bold text-xs disabled:opacity-40"
            >
              Activar y enviar
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-[11px] sm:text-xs">
          {whatsappEstado === 'enviando' && <p className="text-slate-400">📲 Enviando por WhatsApp...</p>}
          {whatsappEstado === 'enviado' && <p className="text-green-400">📲 Recordatorio enviado por WhatsApp</p>}
          {whatsappEstado === 'error' && <p className="text-slate-400">📲 No se pudo enviar por WhatsApp esta vez</p>}
        </div>
      )}

      <div className="flex gap-2">
        {estado === 'listo' && (
          <button
            onClick={() => onEarnXp(15)}
            className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-2 sm:py-2.5 rounded-xl font-black text-[11px] sm:text-xs shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          >
            Empezar ahora
          </button>
        )}
        <button
          onClick={analizarYEnviar}
          disabled={enCooldown}
          className="flex-1 bg-white/10 border border-white/10 rounded-xl font-bold text-[11px] sm:text-xs text-cyan-300 py-2 sm:py-2.5 disabled:opacity-40"
        >
          {enCooldown ? `Disponible en ${minutos}:${segundos}` : 'Analizar y enviar WhatsApp'}
        </button>
      </div>
    </motion.div>
  )
}
