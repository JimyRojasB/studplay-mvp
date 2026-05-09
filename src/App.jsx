import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import MascotaAndre3D from './components/MascotaAndre3D'

export default function StudplayProfessionalMVP() {

  const [pantallaActual, setPantallaActual] = useState(0)

  // Datos de Pantallas
  const pantallas = [
    {
      titulo: 'Dashboard',
      contenido: (
        <div className="flex flex-col">

          {/* Mascota 3D */}
          <div className="relative h-80 flex items-center justify-center overflow-hidden rounded-[40px] bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-white/10 backdrop-blur-xl">

            {/* Glow */}
            <div className="absolute w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>

            {/* Mascota */}
            <MascotaAndre3D />

            {/* Info */}
            <div className="absolute top-6 left-6 text-left z-20">
              <h2 className="font-black text-3xl tracking-tight">
                ANDRÉ
              </h2>

              <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.3em]">
                Nivel 12
              </p>
            </div>

            {/* XP */}
            <div className="absolute top-6 right-6 bg-black/40 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-xl z-20">
              <span className="text-yellow-400 font-black text-sm">
                1250 XP
              </span>
            </div>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-orange-500/10 border border-orange-400/20 rounded-3xl p-6 text-center backdrop-blur-xl"
            >
              <h3 className="text-5xl font-black text-orange-500">
                7🔥
              </h3>

              <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">
                Días Racha
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-cyan-500/10 border border-cyan-400/20 rounded-3xl p-6 text-center backdrop-blur-xl"
            >
              <h3 className="text-5xl font-black text-cyan-400">
                #4
              </h3>

              <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">
                Ranking
              </p>
            </motion.div>

          </div>

          {/* Botón */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="mt-6 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-5 rounded-[2rem] font-black shadow-[0_0_40px_rgba(34,211,238,0.5)] text-lg tracking-wide"
          >
            INICIAR ESTUDIO 📚
          </motion.button>

        </div>
      )
    },

    {
      titulo: 'Mis Cursos',
      contenido: (
        <div className="space-y-5">

          {[
            {
              n: '📘 Matemática',
              p: '80%',
              c: 'from-cyan-400 to-blue-500'
            },
            {
              n: '⚡ Física',
              p: '65%',
              c: 'from-purple-500 to-pink-500'
            },
            {
              n: '💻 Programación',
              p: '92%',
              c: 'from-green-400 to-emerald-500'
            }
          ].map((curso, i) => (

            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-slate-900/70 border border-white/10 rounded-[30px] p-6 backdrop-blur-xl"
            >

              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-lg">
                  {curso.n}
                </h3>

                <span className="text-cyan-400 font-black">
                  {curso.p}
                </span>
              </div>

              <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: curso.p }}
                  transition={{ duration: 1 }}
                  className={`h-full bg-gradient-to-r ${curso.c}`}
                />

              </div>

            </motion.div>

          ))}

        </div>
      )
    },

    {
      titulo: 'Quiz Diario',
      contenido: (
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl">

          <div className="flex justify-between items-center mb-8">

            <span className="bg-orange-500 px-4 py-2 rounded-full text-xs font-black shadow-lg">
              +15 XP
            </span>

            <span className="text-slate-400 text-sm font-bold">
              1/3
            </span>

          </div>

          <h3 className="text-2xl font-black mb-8 leading-tight">
            ¿Qué es una derivada en cálculo?
          </h3>

          <div className="space-y-4">

            {[
              'Una operación lineal',
              'La tasa de cambio de una función',
              'Un valor constante'
            ].map((opt, i) => (

              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-slate-900/80 hover:bg-cyan-500/20 border border-white/5 rounded-2xl p-5 text-left transition-all backdrop-blur-xl"
              >
                {String.fromCharCode(65 + i)}) {opt}
              </motion.button>

            ))}

          </div>

        </div>
      )
    },

    {
      titulo: 'Ranking Global',
      contenido: (
        <div className="space-y-4">

          {[
            ['🥇', 'Pepe', '950 XP'],
            ['🥈', 'Alex', '870 XP'],
            ['🥉', 'Victor', '700 XP'],
            ['4️⃣', 'André', '650 XP']
          ].map((u, i) => (

            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white/5 border border-white/10 rounded-[2rem] p-5 flex items-center justify-between backdrop-blur-xl"
            >

              <div className="flex items-center gap-4">

                <span className="text-3xl">
                  {u[0]}
                </span>

                <div>
                  <h3 className="font-bold">
                    {u[1]}
                  </h3>

                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    U. Wiener
                  </p>
                </div>

              </div>

              <span className="text-cyan-400 font-black tracking-tighter">
                {u[2]}
              </span>

            </motion.div>

          ))}

        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center overflow-hidden relative">

      {/* Fondo Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full"></div>

      {/* Celular */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-slate-900 rounded-[60px] p-3 border-[8px] border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] w-[390px] h-[820px] overflow-hidden flex flex-col"
      >

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50"></div>

        {/* Header */}
        <div className="px-8 pt-14 pb-4 border-b border-white/5 bg-black/20 backdrop-blur-xl">

          <h2 className="text-3xl font-black italic tracking-tight">
            {pantallas[pantallaActual].titulo}
          </h2>

          <p className="text-[10px] text-cyan-500 font-bold tracking-[0.3em] uppercase mt-1">
            Studplay OS
          </p>

        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-hidden relative">

          <AnimatePresence mode="wait">

            <motion.div
              key={pantallaActual}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.35 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => {

                if (info.offset.x < -80 && pantallaActual < pantallas.length - 1) {
                  setPantallaActual(pantallaActual + 1)
                }

                if (info.offset.x > 80 && pantallaActual > 0) {
                  setPantallaActual(pantallaActual - 1)
                }

              }}
              className="absolute inset-0 overflow-y-auto p-6 pb-28"
            >

              {pantallas[pantallaActual].contenido}

            </motion.div>

          </AnimatePresence>

        </div>

        {/* Indicadores */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2">

          {pantallas.map((_, i) => (

            <button
              key={i}
              onClick={() => setPantallaActual(i)}
              className={`transition-all rounded-full ${
                pantallaActual === i
                  ? 'w-8 h-3 bg-cyan-400'
                  : 'w-3 h-3 bg-slate-600'
              }`}
            />

          ))}

        </div>

        {/* Navbar */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-3xl border-t border-white/5 px-8 py-6 flex justify-between items-center">

          {[
            { i: '🏠', idx: 0 },
            { i: '📚', idx: 1 },
            { i: '🧠', idx: 2 },
            { i: '🏆', idx: 3 }
          ].map((tab) => (

            <motion.button
              whileTap={{ scale: 0.85 }}
              key={tab.idx}
              onClick={() => setPantallaActual(tab.idx)}
              className={`text-2xl transition-all ${
                pantallaActual === tab.idx
                  ? 'text-cyan-400 scale-125'
                  : 'text-slate-500'
              }`}
            >
              {tab.i}
            </motion.button>

          ))}

        </div>

      </motion.div>

    </div>
  )
}