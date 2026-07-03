"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calculator, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact";
import { fadeUp, stagger } from "@/lib/motion";
import { HeroIllustration } from "./HeroIllustration";
import { useQuoteModal } from "./QuoteModalProvider";
import { useSavingsCalculator } from "./SavingsCalculatorProvider";

export function Hero() {
  const { openModal } = useQuoteModal();
  const { openCalculator } = useSavingsCalculator();

  return (
    <section id="hero" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      {/* Padrão de grid decorativo */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-grid bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="container-pad grid items-center gap-10 pb-16 sm:gap-14 sm:pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28">
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
            className="mt-6 font-display text-[2.5rem] font-bold leading-[1.05] tracking-tight text-gelo sm:text-6xl lg:text-7xl"
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
            className="mt-6 max-w-xl text-base leading-relaxed text-aco-400 sm:mt-8 sm:text-lg"
          >
            A <span className="text-gelo">LM Energy</span> é especialista em
            energia solar e soluções para reduzir a conta de luz em
            Pernambuco. Oferecemos desconto na tarifa sem investimento inicial,
            além de projeto, instalação e manutenção de sistemas fotovoltaicos
            para residências e empresas.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-3 sm:mt-10"
          >
            <button
              type="button"
              onClick={openModal}
              className="btn-primary group w-full sm:w-auto sm:self-start"
            >
              Solicitar orçamento grátis
              <span className="grid h-6 w-6 place-items-center rounded-full bg-petroleo/15 transition group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-md">
              <button
                type="button"
                onClick={openCalculator}
                className="btn-secondary w-full"
              >
                <Calculator className="h-4 w-4 text-energia" />
                Calcular economia
              </button>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary w-full"
              >
                <MessageCircle className="h-4 w-4 text-sustentavel" />
                Falar no WhatsApp
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center gap-4 sm:mt-12 sm:gap-5"
          >
            <div className="flex -space-x-3">
              {[
                "from-energia to-energia-600",
                "from-sustentavel to-sustentavel-600",
                "from-grafite-600 to-grafite-800",
              ].map((g, i) => (
                <div
                  key={i}
                  className={`grid h-10 w-10 place-items-center rounded-full border-2 border-petroleo bg-gradient-to-br ${g} font-display text-xs font-semibold text-petroleo sm:h-11 sm:w-11 sm:text-sm`}
                >
                  {["AC", "MR", "JS"][i]}
                </div>
              ))}
              <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-petroleo bg-grafite text-[11px] font-semibold text-aco-400 sm:h-11 sm:w-11 sm:text-xs">
                +50
              </div>
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-gelo sm:text-2xl">
                50<span className="text-energia">+</span>
              </p>
              <p className="text-[11px] uppercase tracking-wider text-aco-500 sm:text-xs">
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
        <div className="container-pad flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-5 sm:justify-between sm:gap-x-10 sm:gap-y-4 sm:py-6">
          <p className="w-full text-center text-[11px] uppercase tracking-[0.3em] text-aco-500 sm:w-auto sm:text-left sm:text-xs">
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
              className="font-display text-sm font-medium text-aco-400 transition hover:text-gelo sm:text-base"
            >
              {segment}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
