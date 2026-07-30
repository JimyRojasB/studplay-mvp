import { useState } from 'react'
import { motion } from 'framer-motion'
import { askAI } from '../services/aiClient'

const MAX_CHARS = 2000

const SYSTEM_PROMPT = `Eres un profesor universitario peruano experto en evaluación. Genera exactamente 3 preguntas de opción múltiple (A, B, C) priorizando los conceptos más importantes del texto dado. No uses formato Markdown dentro de los textos (sin asteriscos ni negritas).
Responde ÚNICAMENTE con este JSON válido, sin texto adicional:
{
  "preguntas": [
    {
      "pregunta": "...",
      "opciones": {"A": "...", "B": "...", "C": "..."},
      "correcta": "B",
      "explicacion": "..."
    }
  ]
}`

function extraerJSON(texto) {
  try {
    return JSON.parse(texto)
  } catch {
    const match = texto.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('JSON inválido')
    return JSON.parse(match[0])
  }
}

async function generarPreguntas(userPrompt) {
  const texto = await askAI({ systemPrompt: SYSTEM_PROMPT, userPrompt })
  const data = extraerJSON(texto)
  if (!Array.isArray(data?.preguntas) || data.preguntas.length === 0) {
    throw new Error('JSON inválido')
  }
  return data.preguntas.slice(0, 3)
}

export default function AdaptiveQuizEngine({ cursos, onEarnXp }) {
  const [modo, setModo] = useState('apuntes') // apuntes | curso
  const [apuntes, setApuntes] = useState('')
  const [cursoId, setCursoId] = useState(cursos[0]?.id ?? '')
  const [estado, setEstado] = useState('idle') // idle | cargando | listo | error
  const [preguntas, setPreguntas] = useState([])
  const [respuestas, setRespuestas] = useState({})

  const cursoSeleccionado = cursos.find((c) => c.id === cursoId)
  const puedeGenerar = modo === 'apuntes' ? apuntes.trim().length > 0 : Boolean(cursoSeleccionado)

  const handleGenerar = async () => {
    setEstado('cargando')
    setRespuestas({})

    const temaDebil =
      modo === 'curso'
        ? (cursoSeleccionado.temasDebiles || []).join(', ') || cursoSeleccionado.nombre
        : 'no especificado'
    const textoApuntes =
      modo === 'apuntes'
        ? apuntes.trim()
        : 'sin apuntes, genera preguntas generales sobre el tema débil indicado.'
    const userPrompt = `Tema débil del estudiante: ${temaDebil}. Apuntes: ${textoApuntes}`

    try {
      setPreguntas(await generarPreguntas(userPrompt))
      setEstado('listo')
    } catch {
      // Reintento único si falla el parseo del JSON (o la llamada) la primera vez.
      try {
        setPreguntas(await generarPreguntas(userPrompt))
        setEstado('listo')
      } catch {
        setEstado('error')
      }
    }
  }

  const responder = (index, opcion) => {
    if (respuestas[index]) return
    const esCorrecta = opcion === preguntas[index].correcta
    setRespuestas((prev) => ({ ...prev, [index]: opcion }))
    onEarnXp(esCorrecta ? 15 : 5)
  }

  return (
    <div
      className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 backdrop-blur-xl"
      style={{ backgroundColor: '#1a2236', borderColor: '#00d4ff' }}
    >
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setModo('apuntes')}
          className={`flex-1 py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all ${
            modo === 'apuntes'
              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
              : 'bg-white/5 text-slate-400 border border-white/10'
          }`}
        >
          Pegar apuntes
        </button>
        <button
          onClick={() => setModo('curso')}
          className={`flex-1 py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all ${
            modo === 'curso'
              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
              : 'bg-white/5 text-slate-400 border border-white/10'
          }`}
        >
          Elegir curso
        </button>
      </div>

      {modo === 'apuntes' ? (
        <div className="mb-4">
          <textarea
            value={apuntes}
            onChange={(e) => setApuntes(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Pega aquí tus apuntes (máx. 2000 caracteres)..."
            rows={5}
            className="w-full bg-slate-900/70 border border-white/10 rounded-xl p-3 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
          />
          <p className="text-right text-[10px] text-slate-500 mt-1">
            {apuntes.length}/{MAX_CHARS}
          </p>
        </div>
      ) : (
        <select
          value={cursoId}
          onChange={(e) => setCursoId(e.target.value)}
          className="w-full mb-4 bg-slate-900/70 border border-white/10 rounded-xl p-3 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400/50"
        >
          {cursos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={handleGenerar}
        disabled={!puedeGenerar || estado === 'cargando'}
        className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm shadow-[0_0_30px_rgba(34,211,238,0.4)] disabled:opacity-50 mb-4"
      >
        {estado === 'cargando' ? 'Generando...' : 'Generar Quiz IA'}
      </button>

      {estado === 'cargando' && (
        <div className="space-y-3">
          <p className="text-slate-400 text-[11px] sm:text-xs font-bold">
            Analizando tu progreso...
          </p>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {estado === 'error' && (
        <div className="text-center space-y-2">
          <p className="text-slate-300 text-xs sm:text-sm">
            IA no disponible, intenta en un momento
          </p>
          <button
            onClick={handleGenerar}
            className="text-cyan-400 font-bold text-xs underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {estado === 'listo' && (
        <div className="space-y-4">
          {preguntas.map((p, i) => {
            const respuesta = respuestas[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/70 border border-white/10 rounded-xl p-3 sm:p-4"
              >
                <p className="font-bold text-xs sm:text-sm text-white mb-3">
                  {i + 1}. {p.pregunta}
                </p>
                <div className="space-y-2">
                  {Object.entries(p.opciones).map(([letra, texto]) => {
                    const seleccionada = respuesta === letra
                    const esCorrecta = letra === p.correcta
                    let estilo = 'bg-slate-800/80 border-white/5 hover:bg-cyan-500/10'
                    if (respuesta) {
                      if (esCorrecta) estilo = 'bg-green-500/20 border-green-400/50'
                      else if (seleccionada) estilo = 'bg-red-500/20 border-red-400/50'
                      else estilo = 'bg-slate-800/50 border-white/5 opacity-60'
                    }
                    return (
                      <button
                        key={letra}
                        onClick={() => responder(i, letra)}
                        disabled={Boolean(respuesta)}
                        className={`w-full text-left border rounded-lg p-2.5 text-[11px] sm:text-sm transition-all ${estilo}`}
                      >
                        {letra}) {texto}
                      </button>
                    )
                  })}
                </div>
                {respuesta && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-[11px] sm:text-xs text-slate-300 bg-black/30 rounded-lg p-2.5"
                  >
                    <p className="font-bold mb-1">
                      {respuesta === p.correcta ? '✅ ¡Correcto! +15 XP' : '❌ Incorrecto +5 XP'}
                    </p>
                    <p>💡 {p.explicacion}</p>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
