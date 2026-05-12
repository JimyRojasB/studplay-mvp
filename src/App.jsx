import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import MascotaAndre3D from './components/MascotaAndre3D'
import LoginScreen from './screens/LoginScreen'
import logoStudplay from './assets/logo.png' 

export default function StudplayProfessionalMVP() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [pantallaActual, setPantallaActual] = useState(0)

  // Manejar login
  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  // Manejar logout
  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setPantallaActual(0)
  }

  // Datos de Pantallas (Manteniendo todo tu código funcional intacto)
  const pantallas = [
    {
      titulo: 'Dashboard',
      contenido: (
        <div className="flex flex-col gap-3 sm:gap-4">

          {/* Mascota 3D */}
          <div className="relative h-48 sm:h-60 md:h-72 flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-white/10 backdrop-blur-xl">

            {/* Glow */}
            <div className="absolute w-40 sm:w-52 md:w-64 h-40 sm:h-52 md:h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>

            {/* Mascota */}
            <MascotaAndre3D />

            {/* Info */}
            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 text-left z-20">
              <h2 className="font-black text-xl sm:text-2xl md:text-3xl tracking-tight">
                ANDRÉ
              </h2>

              <p className="text-cyan-400 text-[9px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                Nivel 12
              </p>
            </div>

            {/* XP */}
            <div className="absolute top-3 sm:top-6 right-3 sm:right-6 bg-black/40 px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-2xl border border-white/10 backdrop-blur-xl z-20">
              <span className="text-yellow-400 font-black text-xs sm:text-sm">
                1250 XP
              </span>
            </div>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-orange-500/10 border border-orange-400/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center backdrop-blur-xl"
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-orange-500">
                7🔥
              </h3>

              <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                Días Racha
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center backdrop-blur-xl"
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-cyan-400">
                #4
              </h3>

              <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                Ranking
              </p>
            </motion.div>

          </div>

          {/* Botón */}
          <motion.button
            onClick={() => setPantallaActual(1)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="mt-1 sm:mt-3 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-black shadow-[0_0_40px_rgba(34,211,238,0.5)] text-xs sm:text-lg tracking-wide"
          >
            INICIAR ESTUDIO 📚
          </motion.button>

        </div>
      )
    },

    {
      titulo: 'Mis Cursos',
      contenido: (
        <div className="space-y-2 sm:space-y-3">

          {/* Botón de agregar curso */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-2 border-dashed border-emerald-400/40 hover:border-emerald-400 rounded-lg sm:rounded-xl p-2 text-center backdrop-blur-xl transition-all group opacity-80 hover:opacity-100"
          >
            <div className="text-lg sm:text-xl mb-0.5 group-hover:scale-110 transition-transform">➕</div>
            <h3 className="font-black text-[11px] sm:text-xs text-emerald-300 group-hover:text-emerald-200 transition-colors">
              Agregar Curso
            </h3>
          </motion.button>

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
              className="bg-slate-900/70 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-xl"
            >

              <div className="flex justify-between mb-2 flex-wrap gap-2">
                <h3 className="font-bold text-xs sm:text-base">
                  {curso.n}
                </h3>

                <span className="text-cyan-400 font-black text-xs sm:text-sm">
                  {curso.p}
                </span>
              </div>

              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">

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
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-xl">

          <div className="flex justify-between items-center mb-4 sm:mb-6">

            <span className="bg-orange-500 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black shadow-lg">
              +15 XP
            </span>

            <span className="text-slate-400 text-xs sm:text-sm font-bold">
              1/3
            </span>

          </div>

          <h3 className="text-lg sm:text-xl font-black mb-4 sm:mb-6 leading-tight">
            ¿Qué es una derivada en cálculo?
          </h3>

          <div className="space-y-2 sm:space-y-3">

            {[
              'Una operación lineal',
              'La tasa de cambio de una función',
              'Un valor constante'
            ].map((opt, i) => (

              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-slate-900/80 hover:bg-cyan-500/20 border border-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 text-left transition-all backdrop-blur-xl text-xs sm:text-base"
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

  // Si no está autenticado, mostrar LoginScreen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

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

        {/* Header con Logo Corregido */}
        <div className="relative px-8 pt-12 pb-4 border-b border-white/5 bg-black/20 backdrop-blur-xl">
          
          {/* Botón de logout - posicionado arriba a la derecha */}
          <motion.button
            whileHover={{ scale: 1.15, boxShadow: '0_0_20px_rgba(248,113,113,0.8)' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 rounded-full font-black text-lg text-white shadow-lg transition-all flex items-center justify-center border-2 border-red-400/30"
            title="Logout"
          >
            ⏻
          </motion.button>

          {/* Centro: Logo y Título */}
          <div className="flex flex-col items-center">
            {/* LOGO STUDPLAY */}
            <motion.img 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              src={logoStudplay}
              alt="StudPlay Logo" 
              className="h-20 sm:h-24 w-auto drop-shadow-[0_0_20px_rgba(34,211,238,0.7)] mb-2"
            />

            <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight text-center">
              {pantallas[pantallaActual].titulo}
            </h2>
          </div>

        </div>

        {/* Contenido (Manteniendo tu lógica de navegación y drag) */}
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
              className="absolute inset-0 overflow-y-auto scroll-hidden p-4 sm:p-6 pb-24 sm:pb-28"
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

        {/* Navbar (Manteniendo tu lógica original) */}
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