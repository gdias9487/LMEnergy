"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact";
import { useQuoteModal } from "./QuoteModalProvider";

export function CTA() {
  const { openModal } = useQuoteModal();

  return (
    <section id="contato" className="relative py-20 sm:py-24 lg:py-32">
      <div className="container-pad">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[24px] border border-gelo/10 bg-gradient-to-br from-grafite-800 via-grafite-700 to-petroleo p-6 sm:rounded-[32px] sm:p-10 md:p-14 lg:p-20"
        >
          {/* Brilho energia */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-energia/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-sustentavel/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-hero-grid bg-grid opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

          <div className="relative flex flex-col items-start gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="chip">
                <MessageCircle className="h-3.5 w-3.5 text-energia" />
                Orçamento sem compromisso
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-gelo sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl">
                Pronto para{" "}
                <span className="bg-gradient-to-r from-energia to-sustentavel bg-clip-text text-transparent">
                  pagar menos
                </span>{" "}
                de luz?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-aco-400 sm:mt-5 sm:text-base">
                Envie sua conta de luz e descubra em até 24h quanto você pode
                economizar — seja com desconto direto na fatura ou com sistema
                fotovoltaico próprio.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn-primary group whitespace-nowrap"
              >
                Falar no WhatsApp
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <button
                type="button"
                onClick={openModal}
                className="btn-secondary whitespace-nowrap"
              >
                Enviar minha conta
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
