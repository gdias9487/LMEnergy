"use client";

import { motion } from "framer-motion";

/**
 * Ilustração SVG do hero — turbinas eólicas + painel solar + casa sustentável,
 * inspirada na imagem de referência mas em paleta escura (azul petróleo).
 */
export function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[560px]">
      {/* Halo de luz atrás da composição */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[70%] w-[70%] -translate-x-1/2 rounded-full bg-energia/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[40%] w-[60%] -translate-x-1/2 rounded-full bg-sustentavel/20 blur-3xl" />
      </div>

      <motion.svg
        viewBox="0 0 560 560"
        className="h-full w-full drop-shadow-2xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <defs>
          <radialGradient id="sky" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#1d4360" />
            <stop offset="100%" stopColor="#071824" />
          </radialGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f9a5e" />
            <stop offset="100%" stopColor="#0f5436" />
          </linearGradient>
          <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1d4360" />
            <stop offset="100%" stopColor="#0a2030" />
          </linearGradient>
          <linearGradient id="turbine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4F7FA" />
            <stop offset="100%" stopColor="#7E8B96" />
          </linearGradient>
          <linearGradient id="sun" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4B223" />
            <stop offset="100%" stopColor="#d6981a" />
          </linearGradient>
        </defs>

        {/* Círculo de fundo (céu) */}
        <circle cx="280" cy="280" r="260" fill="url(#sky)" />

        {/* Sol amarelo */}
        <motion.circle
          cx="400"
          cy="170"
          r="48"
          fill="url(#sun)"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />

        {/* Linhas de grid sutis no céu */}
        <g opacity="0.08" stroke="#F4F7FA" strokeWidth="0.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="40" y1={120 + i * 25} x2="520" y2={120 + i * 25} />
          ))}
        </g>

        {/* Solo / colina */}
        <path
          d="M 30 430 Q 200 360 280 400 T 530 420 L 530 560 L 30 560 Z"
          fill="url(#ground)"
          opacity="0.85"
        />
        <path
          d="M 30 460 Q 200 410 280 440 T 530 460 L 530 560 L 30 560 Z"
          fill="#071824"
          opacity="0.4"
        />

        {/* Turbina eólica grande */}
        <Turbine x={160} y={420} scale={1} duration={6} delay={0.2} />
        {/* Turbina média */}
        <Turbine x={260} y={420} scale={0.7} duration={4.5} delay={0.5} />
        {/* Turbina ao fundo */}
        <Turbine x={350} y={420} scale={0.9} duration={7} delay={0.8} />

        {/* Painel solar */}
        <g transform="translate(220 360) rotate(-12)">
          <rect
            x="0"
            y="0"
            width="160"
            height="90"
            rx="6"
            fill="url(#panel)"
            stroke="#16344a"
            strokeWidth="2"
          />
          {Array.from({ length: 4 }).map((_, col) =>
            Array.from({ length: 3 }).map((_, row) => (
              <rect
                key={`${col}-${row}`}
                x={6 + col * 39}
                y={6 + row * 28}
                width="35"
                height="24"
                rx="2"
                fill="#1d4360"
                stroke="#2BB673"
                strokeOpacity="0.25"
                strokeWidth="1"
              />
            ))
          )}
          {/* Reflexo */}
          <rect x="0" y="0" width="160" height="20" rx="6" fill="#F4B223" opacity="0.12" />
        </g>

        {/* Casa sustentável */}
        <g transform="translate(390 360)">
          <rect x="0" y="0" width="100" height="90" rx="6" fill="#102735" stroke="#16344a" strokeWidth="2" />
          {/* Telhado verde */}
          <path d="M -8 4 L 50 -20 L 108 4 Z" fill="#2BB673" />
          <path d="M -8 4 L 50 -20 L 108 4 L 108 10 L -8 10 Z" fill="#1f9a5e" />
          {/* Janelas */}
          <rect x="14" y="22" width="22" height="22" rx="2" fill="#F4B223" opacity="0.9" />
          <rect x="64" y="22" width="22" height="22" rx="2" fill="#F4B223" opacity="0.6" />
          {/* Porta */}
          <rect x="40" y="50" width="20" height="40" rx="2" fill="#071824" />
          <circle cx="56" cy="72" r="1.5" fill="#F4B223" />
        </g>

        {/* Folhas / partículas verdes flutuando */}
        {[
          { x: 460, y: 180, d: 0.2 },
          { x: 480, y: 220, d: 0.5 },
          { x: 440, y: 260, d: 0.9 },
          { x: 100, y: 200, d: 1.2 },
          { x: 130, y: 260, d: 1.5 },
        ].map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#2BB673"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: [0, 1, 0.5, 1], y: [0, -10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: p.d,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.svg>

      {/* Card flutuante de métrica */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-6 rounded-2xl border border-gelo/10 bg-grafite/80 px-3 py-2 shadow-card backdrop-blur-md sm:-left-2 sm:top-12 sm:px-4 sm:py-3"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-sustentavel/15 text-sustentavel sm:h-9 sm:w-9">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-5 sm:w-5">
              <path
                d="M3 17l6-6 4 4 8-8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="text-[10px] text-aco-400 sm:text-xs">Eficiência média</p>
            <p className="font-display text-sm font-semibold text-gelo sm:text-lg">
              +38% <span className="text-sustentavel">↑</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Card flutuante de energia */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-10 right-0 rounded-2xl border border-gelo/10 bg-grafite/80 px-3 py-2 shadow-card backdrop-blur-md sm:-right-2 sm:bottom-16 sm:px-4 sm:py-3"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-energia/15 text-energia sm:h-9 sm:w-9">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
              <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
            </svg>
          </span>
          <div>
            <p className="text-[10px] text-aco-400 sm:text-xs">Carbono neutro</p>
            <p className="font-display text-sm font-semibold text-gelo sm:text-lg">
              100% limpo
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Turbine({
  x,
  y,
  scale = 1,
  duration = 5,
  delay = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Mastro */}
      <path d="M -3 0 L 3 0 L 2 -180 L -2 -180 Z" fill="url(#turbine)" />
      <circle cx="0" cy="-180" r="6" fill="#F4F7FA" stroke="#7E8B96" strokeWidth="1" />

      {/* Pás (rotação) */}
      <motion.g
        style={{ originX: "0px", originY: "-180px" }}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      >
        {[0, 120, 240].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 0 -180)`}>
            <path
              d="M 0 -180 Q 4 -228 0 -260 Q -4 -228 0 -180 Z"
              fill="#F4F7FA"
            />
          </g>
        ))}
        <circle cx="0" cy="-180" r="4" fill="#F4B223" />
      </motion.g>
    </g>
  );
}
