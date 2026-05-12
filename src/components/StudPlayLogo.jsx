import { motion } from 'framer-motion'

export default function StudPlayLogo({ className = 'h-24 w-auto' }) {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculo de fondo gradiente */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Fondo circular con gradiente */}
      <circle cx="100" cy="100" r="95" fill="url(#logoGradient)" opacity="0.15" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.4" />

      {/* Símbolo de libro/estudio */}
      <g filter="url(#glow)">
        {/* Página izquierda del libro */}
        <path
          d="M 75 55 L 75 145 L 90 145 L 90 55 Z"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Página derecha del libro */}
        <path
          d="M 110 55 L 110 145 L 125 145 L 125 55 Z"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lomo del libro (en el centro) */}
        <line
          x1="100"
          y1="60"
          x2="100"
          y2="140"
          stroke="#06b6d4"
          strokeWidth="2"
          opacity="0.6"
          strokeLinecap="round"
        />

        {/* Líneas de texto en página izquierda */}
        <line x1="80" y1="75" x2="85" y2="75" stroke="#06b6d4" strokeWidth="1.5" opacity="0.8" />
        <line x1="80" y1="85" x2="85" y2="85" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
        <line x1="80" y1="95" x2="85" y2="95" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4" />

        {/* Líneas de texto en página derecha */}
        <line x1="115" y1="75" x2="120" y2="75" stroke="#a78bfa" strokeWidth="1.5" opacity="0.8" />
        <line x1="115" y1="85" x2="120" y2="85" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6" />
        <line x1="115" y1="95" x2="120" y2="95" stroke="#a78bfa" strokeWidth="1.5" opacity="0.4" />

        {/* Estrella pequeña (gamificación) */}
        <g transform="translate(130, 70)">
          <polygon
            points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2"
            fill="#fbbf24"
            opacity="0.9"
          />
        </g>
      </g>

      {/* Brillo exterior */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="0.5"
        opacity="0.2"
      />
    </motion.svg>
  )
}
