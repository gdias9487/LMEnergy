"use client";

import { motion } from "framer-motion";
import { Github, Instagram } from "lucide-react";
import Image from "next/image";
import { useSavingsCalculator } from "./SavingsCalculatorProvider";

const links = {
  navegacao: [
    { label: "Início", href: "#hero" },
    { label: "Serviços", href: "#servicos" },
    { label: "Casos reais", href: "#projetos" },
    { label: "Sobre", href: "#sobre" },
    { label: "FAQ", href: "#faq" },
    { label: "Contato", href: "#contato" },
  ],
  recursos: [
    { label: "Calculadora de economia", action: "calculator" as const },
    { label: "Perguntas frequentes", href: "#faq" },
    { label: "Política de garantia", href: "#" },
  ],
};

const socials = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/lmenergy_of/",
    label: "Instagram",
  },
  { icon: Github, href: "https://github.com/gdias9487", label: "GitHub" },
];

export function Footer() {
  const { openCalculator } = useSavingsCalculator();

  return (
    <footer className="relative border-t border-gelo/5 bg-petroleo-900/60">
      <div className="container-pad grid gap-12 py-16 lg:grid-cols-[1.6fr_1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <a
            href="#hero"
            className="relative flex h-9 w-[165px] shrink-0 items-center sm:h-10 sm:w-[185px]"
            aria-label="LM Energy — voltar ao topo"
          >
            <Image
              src="/logolm_white.png"
              alt="LM Energy"
              fill
              className="object-contain object-left"
              sizes="185px"
            />
          </a>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-aco-400">
            Leonardo Mendes — especialista em energia solar e soluções
            inteligentes para redução da conta de luz. Projeto, instalação e
            manutenção com garantia.
          </p>

          <div className="mt-6 flex items-center gap-3">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-gelo/10 bg-grafite/40 text-aco-400 transition hover:border-energia/40 hover:text-energia"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </motion.div>

        <FooterColumn title="Navegação" items={links.navegacao} />
        <FooterColumn
          title="Recursos"
          items={links.recursos}
          onCalculator={openCalculator}
        />
      </div>

      <div className="border-t border-gelo/5">
        <div className="container-pad flex flex-col items-center justify-between gap-3 py-6 text-xs text-aco-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} LM Energy — Leonardo Mendes. Todos os
            direitos reservados.
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sustentavel" />
            CNPJ e licenças regularizados
          </p>
        </div>
      </div>
    </footer>
  );
}

type FooterItem =
  | { label: string; href: string; action?: never }
  | { label: string; action: "calculator"; href?: never };

function FooterColumn({
  title,
  items,
  onCalculator,
}: {
  title: string;
  items: FooterItem[];
  onCalculator?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <h4 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-aco-500">
        {title}
      </h4>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((it) => (
          <li key={it.label}>
            {it.action === "calculator" ? (
              <button
                type="button"
                onClick={onCalculator}
                className="text-sm text-gelo/85 transition hover:text-energia"
              >
                {it.label}
              </button>
            ) : (
              <a
                href={it.href}
                className="text-sm text-gelo/85 transition hover:text-energia"
              >
                {it.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
