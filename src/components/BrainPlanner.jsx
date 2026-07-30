import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { askAI } from '../services/aiClient'

const SYSTEM_PROMPT = `Eres un tutor académico experto en psicología del aprendizaje. Genera un micro-plan de estudio para HOY de máximo 15 minutos. Sé específico y directo. Solo en español. Formato: título del plan (1 línea) + 3 micro-tareas numeradas + tiempo estimado total.`

function construirPrompt({ cursos, diasSinActividad, diasProximoExamen, cursoProximoExamen }) {
  const listaCursos = cursos.map((c) => c.nombre).join(', ')
  const proximoExamen = cursoProximoExamen ? cursoProximoExamen.nombre : 'sin examen próximo'
  const diasParaExamen = diasProximoExamen ?? 'N/A'
  const temasDebiles = cursos.flatMap((c) => c.temasDebiles || []).join(', ') || 'sin datos'

  return `El estudiante tiene estos cursos: ${listaCursos}.
Días sin actividad: ${diasSinActividad}.
Próximo examen: ${proximoExamen} en ${diasParaExamen} días.
Temas donde más falla: ${temasDebiles}.`
}

export default function BrainPlanner({
  cursos,
  diasSinActividad,
  diasProximoExamen,
  cursoProximoExamen,
  onEarnXp,
}) {
  const [estado, setEstado] = useState('idle') // idle | cargando | listo | error
  const [plan, setPlan] = useState('')
  const [aceptado, setAceptado] = useState(false)

  const deberiaAutoGenerar =
    diasSinActividad > 1 || (diasProximoExamen !== null && diasProximoExamen < 7)

  const generarPlan = async () => {
    setEstado('cargando')
    setAceptado(false)
    try {
      const texto = await askAI({
        systemPrompt: SYSTEM_PROMPT,
        userPrompt: construirPrompt({ cursos, diasSinActividad, diasProximoExamen, cursoProximoExamen }),
      })
      setPlan(texto.trim())
      setEstado('listo')
    } catch {
      setEstado('error')
    }
  }

  useEffect(() => {
    if (deberiaAutoGenerar && cursos.length > 0) {
      generarPlan()
    }
    // Solo se auto-genera una vez, al montar el Dashboard.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (estado === 'idle' && !deberiaAutoGenerar) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 backdrop-blur-xl"
        style={{ backgroundColor: '#1a2236', borderColor: '#00d4ff' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🧠</span>
          <h3 className="font-black text-xs sm:text-sm uppercase tracking-widest text-cyan-300">
            Brain Planner IA
          </h3>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm mb-3">
          Vas al día. Genera un micro-plan de 15 min cuando quieras darle un empujón extra.
        </p>
        <button
          onClick={generarPlan}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-[0_0_30px_rgba(34,211,238,0.4)]"
        >
          Generar plan de hoy
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 backdrop-blur-xl"
      style={{ backgroundColor: '#1a2236', borderColor: '#00d4ff' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🧠</span>
        <h3 className="font-black text-xs sm:text-sm uppercase tracking-widest text-cyan-300">
          Brain Planner IA
        </h3>
      </div>

      <AnimatePresence mode="wait">
        {estado === 'cargando' && (
          <motion.div key="skeleton" className="space-y-2">
            <p className="text-slate-400 text-[11px] sm:text-xs font-bold mb-1">
              Analizando tu progreso...
            </p>
            <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-white/10 rounded w-full animate-pulse" />
            <div className="h-3 bg-white/10 rounded w-5/6 animate-pulse" />
            <div className="h-3 bg-white/10 rounded w-2/3 animate-pulse" />
          </motion.div>
        )}

        {estado === 'error' && (
          <motion.div key="error" className="text-slate-300 text-xs sm:text-sm space-y-3">
            <p>IA no disponible, intenta en un momento</p>
            <button onClick={generarPlan} className="text-cyan-400 font-bold text-xs underline">
              Reintentar
            </button>
          </motion.div>
        )}

        {estado === 'listo' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-white text-xs sm:text-sm whitespace-pre-line leading-relaxed mb-4">
              {plan}
            </p>
            <button
              onClick={() => {
                if (!aceptado) {
                  onEarnXp(10)
                  setAceptado(true)
                }
              }}
              disabled={aceptado}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm shadow-[0_0_30px_rgba(34,211,238,0.4)] disabled:opacity-60"
            >
              {aceptado ? '✓ Plan iniciado (+10 XP)' : 'Iniciar ahora'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
