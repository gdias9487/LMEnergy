"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuoteModal } from "./QuoteModalProvider";

const navItems = [
  { label: "Início", href: "#hero" },
  { label: "Serviços", href: "#servicos" },
  { label: "Casos reais", href: "#projetos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openModal } = useQuoteModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gelo/5 bg-petroleo/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="container-pad flex h-20 items-center justify-between">
        <a
          href="#hero"
          className="flex items-center gap-2.5 text-gelo"
          aria-label="LM Energy — voltar ao topo"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-energia to-energia-600 text-petroleo shadow-glow">
            <Zap className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            lm<span className="text-energia">.</span>energy
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="group inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-aco-400 transition hover:text-gelo"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={openModal}
            className="rounded-full border border-gelo/10 bg-grafite/40 px-5 py-2.5 text-sm font-semibold text-gelo backdrop-blur transition hover:border-gelo/25 hover:bg-grafite/70"
          >
            Orçamento grátis
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-gelo/10 bg-grafite/40 text-gelo lg:hidden"
          aria-label="Abrir menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gelo/5 bg-petroleo/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-pad flex flex-col gap-1 py-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-aco-400 transition hover:bg-grafite/60 hover:text-gelo"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openModal();
                  }}
                  className="btn-primary w-full"
                >
                  Orçamento grátis
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
