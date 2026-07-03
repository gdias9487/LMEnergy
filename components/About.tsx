"use client";

import { motion } from "framer-motion";
import { Award, Handshake, MapPin, ShieldCheck, Sun } from "lucide-react";
import Image from "next/image";
import { fadeUp, stagger } from "@/lib/motion";
import { buildWhatsAppUrl } from "@/lib/contact";

const highlights = [
  {
    icon: Sun,
    title: "Especialista em solar",
    desc: "Projeto, instalação e homologação de sistemas fotovoltaicos.",
  },
  {
    icon: ShieldCheck,
    title: "Execução própria",
    desc: "Acompanho cada obra de perto, do orçamento à entrega.",
  },
  {
    icon: Handshake,
    title: "Atendimento direto",
    desc: "Você fala comigo, sem intermediários nem call center.",
  },
];

export function About() {
  return (
    <section id="sobre" className="relative py-20 sm:py-24 lg:py-32">
      <div className="container-pad">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div className="pointer-events-none absolute -left-6 -top-6 h-40 w-40 rounded-full bg-energia/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-sustentavel/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-gelo/10 bg-grafite-800 p-2 shadow-card">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
                <Image
                  src="/leonardo-mendes.png"
                  alt="Leonardo Mendes, fundador da LM Energy, sobre uma usina solar"
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-petroleo/90 to-transparent" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-gelo/10 bg-grafite-800/95 px-4 py-3 shadow-card backdrop-blur sm:left-6"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-energia to-energia-600 text-petroleo">
                <Award className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-gelo">
                  Leonardo Mendes
                </p>
                <p className="text-xs text-aco-400">Fundador · LM Energy</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.span variants={fadeUp} className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-energia" />
              Sobre mim
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="mt-5 font-display text-3xl font-bold tracking-tight text-gelo sm:text-4xl lg:text-5xl"
            >
              Prazer, sou{" "}
              <span className="bg-gradient-to-r from-energia to-sustentavel bg-clip-text text-transparent">
                Leonardo Mendes
              </span>
              .
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-aco-400"
            >
              <MapPin className="h-4 w-4 text-sustentavel" />
              Pernambuco · atendimento em todo o estado
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm leading-relaxed text-aco-400 sm:text-base"
            >
              Fundei a LM Energy com um objetivo simples: ajudar famílias e
              empresas de Pernambuco a pagarem menos na conta de luz usando a
              energia do sol. Coloco a mão na massa em cada projeto — do primeiro
              orçamento à instalação e manutenção dos painéis.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-sm leading-relaxed text-aco-400 sm:text-base"
            >
              Acredito em transparência, trabalho bem feito e num atendimento
              próximo, em que você fala diretamente comigo. Meu compromisso é
              entregar economia real e um sistema que dura por décadas.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 grid gap-3 sm:grid-cols-3"
            >
              {highlights.map((h) => {
                const Icon = h.icon;
                return (
                  <div
                    key={h.title}
                    className="rounded-2xl border border-gelo/10 bg-grafite-800/60 p-4"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-energia/25 bg-energia/10 text-energia">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <p className="mt-3 font-display text-sm font-semibold text-gelo">
                      {h.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-aco-400">
                      {h.desc}
                    </p>
                  </div>
                );
              })}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn-primary group w-full sm:w-auto"
              >
                Falar com Leonardo
                <Handshake className="h-4 w-4 transition group-hover:rotate-6" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
