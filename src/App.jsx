import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Componente Mascota André con animaciones Premium
function MascotaAndre3D() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div className="absolute w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative"
      >
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-600 shadow-[0_0_60px_rgba(56,189,248,0.5)] relative border-4 border-white/10 flex items-center justify-center">
          <div className="absolute top-16 left-16 w-6 h-6 bg-black rounded-full"></div>
          <div className="absolute top-16 right-16 w-6 h-6 bg-black rounded-full"></div>
          <div className="absolute bottom-20 w-10 h-10 bg-slate-900 rounded-full"></div>
          <div className="absolute -top-5 left-10 w-16 h-16 rounded-full bg-cyan-300 shadow-lg"></div>
          <div className="absolute -top-5 right-10 w-16 h-16 rounded-full bg-blue-400 shadow-lg"></div>
        </div>
      </motion.div>
    </div>
  )
}

export default function StudplayProfessionalMVP() {
  const [pantallaActual, setPantallaActual] = useState(0)

  // Datos de las pantallas
  const pantallas = [
    {
      titulo: 'Dashboard',
      contenido: (
        <div className="flex flex-col">
          <div className="relative h-72 flex items-center justify-center overflow-hidden rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl">
            <MascotaAndre3D />
            <div className="absolute top-6 left-6 text-left">
              <h2 className="font-black text-2xl">ANDRÉ</h2>
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Nivel 12</p>
            </div>
            <div className="absolute top-6 right-6 bg-black/40 px-3 py-1 rounded-xl border border-white/10">
              <span className="text-yellow-400 font-bold text-sm">1250 XP</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-orange-500/10 border border-orange-400/20 rounded-3xl p-6 text-center">
              <h3 className="text-4xl font-black text-orange-500">7🔥</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Días Racha</p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-3xl p-6 text-center">
              <h3 className="text-4xl font-black text-cyan-400">#4</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Ranking</p>
            </div>
          </div>
          <button className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-[2rem] font-black shadow-lg">
            INICIAR ESTUDIO 📚
          </button>
        </div>
      )
    },
    {
      titulo: 'Mis Cursos',
      contenido: (
        <div className="space-y-4">
          {[
            { n: '📘 Matemática', p: '80%', c: 'from-cyan-400 to-blue-500' },
            { n: '⚡ Física', p: '65%', c: 'from-purple-500 to-pink-500' },
            { n: '💻 Programación', p: '92%', c: 'from-green-400 to-emerald-500' }
          ].map((curso, i) => (
            <div key={i} className="bg-slate-900/70 border border-white/10 rounded-[30px] p-6">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-lg">{curso.n}</h3>
                <span className="text-cyan-400 font-black">{curso.p}</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: curso.p }} className={`h-full bg-gradient-to-r ${curso.c}`} />
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      titulo: 'Quiz Diario',
      contenido: (
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-white/10 rounded-[40px] p-8">
          <div className="flex justify-between items-center mb-8">
            <span className="bg-orange-500 px-4 py-2 rounded-full text-xs font-black">+15 XP</span>
            <span className="text-slate-400 text-sm font-bold">1/3</span>
          </div>
          <h3 className="text-2xl font-black mb-8 leading-tight">¿Qué es una derivada en cálculo?</h3>
          <div className="space-y-4">
            {['Una operación lineal', 'La tasa de cambio de una función', 'Un valor constante'].map((opt, i) => (
              <button key={i} className="w-full bg-slate-900/80 hover:bg-cyan-500/30 border border-white/5 rounded-2xl p-5 text-left transition-all">
                {String.fromCharCode(65 + i)}) {opt}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      titulo: 'Ranking Global',
      contenido: (
        <div className="space-y-4">
          {[['🥇', 'Pepe', '950 XP'], ['🥈', 'Alex', '870 XP'], ['🥉', 'Victor', '700 XP'], ['4️⃣', 'André', '650 XP']].map((u, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-5 flex items-center justify-between backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{u[0]}</span>
                <div>
                  <h3 className="font-bold">{u[1]}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">U. Wiener</p>
                </div>
              </div>
              <span className="text-cyan-400 font-black tracking-tighter">{u[2]}</span>
            </div>
          ))}
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-4">
      {/* Marco de Celular */}
      <div className="relative bg-slate-900 rounded-[60px] p-3 border-[8px] border-slate-800 shadow-2xl w-[390px] h-[820px] overflow-hidden flex flex-col">
        {/* Barra Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50"></div>

        {/* Header Dinámico */}
        <div className="px-8 pt-14 pb-4 border-b border-white/5 bg-black/20 backdrop-blur-xl">
          <h2 className="text-2xl font-black italic">{pantallas[pantallaActual].titulo}</h2>
          <p className="text-[10px] text-cyan-500 font-bold tracking-[0.3em] uppercase">Studplay OS</p>
        </div>

        {/* Área de Contenido */}
        <div className="flex-1 overflow-y-auto p-6 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={pantallaActual}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              {pantallas[pantallaActual].contenido}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Menú de Navegación */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-3xl border-t border-white/5 px-8 py-6 flex justify-between items-center">
          {[
            { i: '🏠', idx: 0 }, { i: '📚', idx: 1 }, { i: '🧠', idx: 2 }, { i: '🏆', idx: 3 }
          ].map((tab) => (
            <button
              key={tab.idx}
              onClick={() => setPantallaActual(tab.idx)}
              className={`text-2xl transition-all ${pantallaActual === tab.idx ? 'text-cyan-400 scale-125' : 'text-slate-500'}`}
            >
              {tab.i}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}