"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact";
import { fadeUp, stagger } from "@/lib/motion";
import { HeroIllustration } from "./HeroIllustration";
import { useQuoteModal } from "./QuoteModalProvider";

export function Hero() {
  const { openModal } = useQuoteModal();

  return (
    <section id="hero" className="relative overflow-hidden pt-32 lg:pt-36">
      {/* Padrão de grid decorativo */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-grid bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="container-pad grid items-center gap-14 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <motion.div variants={fadeUp} className="chip">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sustentavel/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sustentavel" />
            </span>
            Orçamento gratuito em 24h
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-gelo sm:text-6xl lg:text-7xl"
          >
            Reduza sua conta
            <br />
            de luz com{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-energia via-energia-400 to-sustentavel bg-clip-text text-transparent">
                energia solar
              </span>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 h-1 w-full origin-left rounded-full bg-gradient-to-r from-energia to-sustentavel"
              />
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-lg leading-relaxed text-aco-400"
          >
            Sou <span className="text-gelo">Leonardo Mendes</span>, especialista
            em energia solar e soluções inteligentes para redução da conta de
            luz. Ofereço descontos na tarifa de energia sem necessidade de
            investimento, além de projetos, instalação e manutenção de sistemas
            fotovoltaicos para residências e empresas.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={openModal}
              className="btn-primary group"
            >
              Solicitar orçamento grátis
              <span className="grid h-6 w-6 place-items-center rounded-full bg-petroleo/15 transition group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <MessageCircle className="h-4 w-4 text-sustentavel" />
              Falar no WhatsApp
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex items-center gap-5"
          >
            <div className="flex -space-x-3">
              {[
                "from-energia to-energia-600",
                "from-sustentavel to-sustentavel-600",
                "from-grafite-600 to-grafite-800",
              ].map((g, i) => (
                <div
                  key={i}
                  className={`grid h-11 w-11 place-items-center rounded-full border-2 border-petroleo bg-gradient-to-br ${g} font-display text-sm font-semibold text-petroleo`}
                >
                  {["AC", "MR", "JS"][i]}
                </div>
              ))}
              <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-petroleo bg-grafite text-xs font-semibold text-aco-400">
                +50
              </div>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-gelo">
                50<span className="text-energia">+</span>
              </p>
              <p className="text-xs uppercase tracking-wider text-aco-500">
                Clientes economizando
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="relative flex items-center justify-center lg:justify-end"
        >
          <HeroIllustration />
        </motion.div>
      </div>

      {/* Faixa de áreas atendidas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="border-y border-gelo/5 bg-grafite/20 backdrop-blur"
      >
        <div className="container-pad flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-6">
          <p className="text-xs uppercase tracking-[0.3em] text-aco-500">
            Atendemos
          </p>
          {[
            "Residencial",
            "Comercial",
            "Industrial",
            "Rural",
            "Condomínios",
            "Mercado livre",
          ].map((segment) => (
            <span
              key={segment}
              className="font-display text-base font-medium text-aco-400 transition hover:text-gelo"
            >
              {segment}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
