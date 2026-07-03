"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  PiggyBank,
  Settings,
  Sun,
  Wrench,
  Zap,
} from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";

const services = [
  {
    icon: PiggyBank,
    title: "Desconto na conta de luz",
    desc: "Economize de 15% a 20% no boleto sem obra, sem investimento e sem multa de fidelidade.",
    accent: "energia",
  },
  {
    icon: Sun,
    title: "Energia solar residencial",
    desc: "Projeto e instalação de sistema fotovoltaico sob medida para sua casa.",
    accent: "sustentavel",
  },
  {
    icon: Zap,
    title: "Energia solar comercial",
    desc: "Soluções para lojas, indústrias e agronegócio com retorno em poucos anos.",
    accent: "energia",
  },
  {
    icon: Wrench,
    title: "Montagem e instalação",
    desc: "Execução técnica completa: estrutura, módulos, inversor e homologação.",
    accent: "sustentavel",
  },
  {
    icon: Settings,
    title: "Manutenção e limpeza",
    desc: "Inspeção, limpeza dos painéis e correções para manter a geração no topo.",
    accent: "energia",
  },
  {
    icon: ClipboardCheck,
    title: "Projeto e consultoria",
    desc: "Dimensionamento, análise de viabilidade, ROI e homologação na concessionária.",
    accent: "sustentavel",
  },
];

export function Services() {
  return (
    <section id="servicos" className="relative py-20 sm:py-24 lg:py-32">
      <div className="container-pad">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span variants={fadeUp} className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-energia" />
            Serviços
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-3xl font-bold tracking-tight text-gelo sm:text-4xl lg:text-5xl"
          >
            Tudo que sua casa ou empresa precisa para{" "}
            <span className="text-energia">economizar com sol</span>.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-sm leading-relaxed text-aco-400 sm:mt-5 sm:text-base"
          >
            Do desconto imediato na conta de luz à instalação completa de
            energia solar — soluções sob medida, com garantia e suporte
            contínuo.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {services.map((s) => {
            const Icon = s.icon;
            const accentColor = s.accent === "energia" ? "energia" : "sustentavel";
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="group card relative overflow-hidden hover:border-gelo/20"
              >
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500 ${
                    accentColor === "energia"
                      ? "bg-energia/15"
                      : "bg-sustentavel/15"
                  } opacity-60 group-hover:opacity-100`}
                />
                <div
                  className={`relative grid h-12 w-12 place-items-center rounded-xl border ${
                    accentColor === "energia"
                      ? "border-energia/25 bg-energia/10 text-energia"
                      : "border-sustentavel/25 bg-sustentavel/10 text-sustentavel"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="relative mt-5 font-display text-lg font-semibold text-gelo">
                  {s.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-aco-400">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
