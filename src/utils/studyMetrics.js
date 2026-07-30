export function fechaEnDias(offsetDias) {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + offsetDias)
  return fecha.toISOString().slice(0, 10)
}

export function diasDesde(fechaISO) {
  if (!fechaISO) return 0
  const inicio = new Date(fechaISO)
  const hoy = new Date()
  inicio.setHours(0, 0, 0, 0)
  hoy.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((hoy - inicio) / 86400000))
}

export function diasHasta(fechaISO) {
  if (!fechaISO) return null
  const objetivo = new Date(fechaISO)
  const hoy = new Date()
  objetivo.setHours(0, 0, 0, 0)
  hoy.setHours(0, 0, 0, 0)
  return Math.round((objetivo - hoy) / 86400000)
}

export function proximoExamen(cursos) {
  const futuros = cursos
    .map((curso) => ({ ...curso, diasRestantes: diasHasta(curso.fechaExamen) }))
    .filter((curso) => curso.diasRestantes !== null && curso.diasRestantes >= 0)
    .sort((a, b) => a.diasRestantes - b.diasRestantes)
  return futuros[0] || null
}

// Score de riesgo de procrastinación (0-100): +40 si lleva 2+ días sin
// actividad, +35 si el próximo examen es en 5 días o menos, +25 si la racha
// está rota.
export function calcularRiesgo({ diasSinActividad, diasProximoExamen, rachaRota }) {
  let score = 0
  if (diasSinActividad >= 2) score += 40
  if (diasProximoExamen !== null && diasProximoExamen !== undefined && diasProximoExamen <= 5) {
    score += 35
  }
  if (rachaRota) score += 25
  return score
}
