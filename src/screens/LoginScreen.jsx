import { motion } from 'framer-motion'
import { useState } from 'react'
import logoStudplay from '../assets/logo.png'

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validación simple - solo verificar que no esté vacío
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      setIsLoading(false)
      return
    }

    // Simular delay de autenticación
    setTimeout(() => {
      setIsLoading(false)
      if (onLogin) {
        onLogin({ email, name: email })
      }
    }, 1500)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-black to-purple-600/5"></div>

      {/* Efectos de luz de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      {/* Contenedor principal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Header con logo */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <img
            src={logoStudplay}
            alt="StudPlay"
            className="h-16 sm:h-20 w-auto mx-auto mb-4 drop-shadow-lg"
          />
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            STUDPLAY
          </h1>
          <p className="text-cyan-400 text-sm font-bold uppercase tracking-[0.2em]">
  
          </p>
        </motion.div>

        {/* Card de login */}
        <motion.div
          variants={itemVariants}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
        >
          <h2 className="text-2xl font-black text-white mb-1">Bienvenido</h2>
          <p className="text-slate-400 text-sm mb-6">Inicia sesión en tu cuenta</p>

          {/* Mensaje de error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-200 text-sm font-semibold"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuario */}
            <motion.div variants={itemVariants}>
              <label className="text-white text-sm font-bold block mb-2">
                Usuario o Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu usuario o email"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all"
              />
            </motion.div>

            {/* Contraseña */}
            <motion.div variants={itemVariants}>
              <label className="text-white text-sm font-bold block mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </motion.div>

            {/* Recordar contraseña */}
            <motion.div variants={itemVariants} className="flex justify-end">
              <button
                type="button"
                className="text-cyan-400 text-xs font-semibold hover:text-cyan-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </motion.div>

            {/* Botón de inicio */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-black py-3 rounded-xl mt-6 shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.7)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                  Iniciando...
                </span>
              ) : (
                'INICIAR SESIÓN'
              )}
            </motion.button>
          </form>

          {/* Divisor */}
          <motion.div variants={itemVariants} className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="px-3 text-slate-500 text-xs font-bold">O</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </motion.div>

          {/* Logins sociales */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            <button className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg py-2 font-bold text-white text-sm transition-all">
              Google
            </button>
            <button className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg py-2 font-bold text-white text-sm transition-all">
              GitHub
            </button>
          </motion.div>

          {/* Sign up */}
          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-slate-400 text-sm">
              ¿No tienes cuenta?{' '}
              <button className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                Regístrate
              </button>
            </p>
          </motion.div>
        </motion.div>

        {/* Info adicional */}
        <motion.div variants={itemVariants} className="text-center mt-6 text-xs text-slate-500">
          <p>© 2026 StudPlay. Todos los derechos reservados.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
