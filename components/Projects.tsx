"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";

const projects = [
  {
    tag: "Residencial",
    title: "Casa Família Almeida",
    desc: "Sistema fotovoltaico de 5,4 kWp com 12 módulos e geração mensal estimada de 720 kWh.",
    metric: "Economia de 92% na conta",
    color: "from-energia/30 to-energia/0",
    accent: "energia",
  },
  {
    tag: "Comercial",
    title: "Padaria Pão Quente",
    desc: "Usina solar de 18 kWp instalada sobre a laje, com monitoramento remoto integrado.",
    metric: "R$ 2.300 economizados/mês",
    color: "from-sustentavel/30 to-sustentavel/0",
    accent: "sustentavel",
  },
  {
    tag: "Desconto na conta",
    title: "Assinatura LM Solar",
    desc: "Programa de desconto sem investimento para quem mora de aluguel ou não pode instalar painéis.",
    metric: "Até 20% off na fatura",
    color: "from-energia/25 to-sustentavel/10",
    accent: "energia",
  },
  {
    tag: "Manutenção",
    title: "Limpeza Condomínio Sol Nascente",
    desc: "Higienização técnica de 84 módulos com recuperação total da geração após 8 meses sem limpeza.",
    metric: "+27% de produção restaurada",
    color: "from-sustentavel/30 to-sustentavel/0",
    accent: "sustentavel",
  },
];

export function Projects() {
  return (
    <section id="projetos" className="relative bg-grafite-800/60 py-24 lg:py-32">
      <div className="container-pad">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <motion.span variants={fadeUp} className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-sustentavel" />
              Casos reais
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-5 font-display text-4xl font-bold tracking-tight text-gelo sm:text-5xl"
            >
              Clientes que já estão{" "}
              <span className="text-sustentavel">economizando</span> com{" "}
              <span className="text-energia">energia solar</span>.
            </motion.h2>
          </div>
          <motion.a
            variants={fadeUp}
            href="#contato"
            className="group inline-flex items-center gap-2 rounded-full border border-gelo/15 px-5 py-2.5 text-sm font-medium text-gelo transition hover:border-gelo/35"
          >
            Quero economizar também
            <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
          </motion.a>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="group relative overflow-hidden rounded-3xl border border-gelo/10 bg-petroleo p-1 shadow-card"
            >
              <div
                className={`relative h-56 overflow-hidden rounded-2xl bg-gradient-to-br ${p.color}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,178,35,0.15),transparent_55%)]" />
                <div className="absolute inset-0 bg-hero-grid bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

                <ProjectArtwork index={i} accent={p.accent} />

                <span
                  className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur ${
                    p.accent === "energia"
                      ? "border-energia/30 bg-energia/10 text-energia"
                      : "border-sustentavel/30 bg-sustentavel/10 text-sustentavel"
                  }`}
                >
                  {p.tag}
                </span>
              </div>

              <div className="flex items-end justify-between gap-4 p-6">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-gelo">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-aco-400">
                    {p.desc}
                  </p>
                  <p
                    className={`mt-4 text-sm font-semibold ${
                      p.accent === "energia" ? "text-energia" : "text-sustentavel"
                    }`}
                  >
                    {p.metric}
                  </p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gelo/15 bg-grafite/60 text-gelo transition group-hover:-translate-y-1 group-hover:bg-energia group-hover:text-petroleo">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectArtwork({
  index,
  accent,
}: {
  index: number;
  accent: string;
}) {
  const color = accent === "energia" ? "#F4B223" : "#2BB673";

  if (index % 4 === 0) {
    // Gráfico de barras animado
    return (
      <svg
        viewBox="0 0 400 220"
        className="absolute inset-0 h-full w-full opacity-90"
      >
        {[40, 90, 140, 190, 240, 290, 340].map((x, i) => (
          <motion.rect
            key={i}
            x={x}
            y={200 - (40 + i * 18)}
            width="28"
            height={40 + i * 18}
            rx="4"
            fill={i === 6 ? color : "rgba(244,247,250,0.18)"}
            initial={{ scaleY: 0, originY: 1 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            style={{ transformOrigin: `${x + 14}px 200px` }}
          />
        ))}
      </svg>
    );
  }

  if (index % 4 === 1) {
    // Linhas de mapa / rotas
    return (
      <svg viewBox="0 0 400 220" className="absolute inset-0 h-full w-full">
        <motion.path
          d="M 20 180 Q 100 60 200 130 T 380 60"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        {[
          [20, 180],
          [200, 130],
          [380, 60],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="7"
            fill={color}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
          />
        ))}
      </svg>
    );
  }

  if (index % 4 === 2) {
    // Donut chart
    return (
      <svg viewBox="0 0 400 220" className="absolute inset-0 h-full w-full">
        <g transform="translate(200 110)">
          <circle r="60" fill="none" stroke="rgba(244,247,250,0.12)" strokeWidth="14" />
          <motion.circle
            r="60"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 60}
            initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
            whileInView={{ strokeDashoffset: 2 * Math.PI * 60 * 0.25 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            transform="rotate(-90)"
          />
          <text
            textAnchor="middle"
            dy="6"
            fill="#F4F7FA"
            fontFamily="Space Grotesk, sans-serif"
            fontSize="22"
            fontWeight="700"
          >
            75%
          </text>
        </g>
      </svg>
    );
  }

  // Grid de partículas
  return (
    <svg viewBox="0 0 400 220" className="absolute inset-0 h-full w-full">
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => {
          const cx = 40 + col * 32;
          const cy = 40 + row * 28;
          const active = (row + col) % 4 === 0;
          return (
            <motion.circle
              key={`${row}-${col}`}
              cx={cx}
              cy={cy}
              r={active ? 5 : 2.5}
              fill={active ? color : "rgba(244,247,250,0.25)"}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (row + col) * 0.03, duration: 0.4 }}
            />
          );
        })
      )}
    </svg>
  );
}
