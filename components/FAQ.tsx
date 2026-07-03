"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { fadeUp, stagger } from "@/lib/motion";

const faqs = [
  {
    q: "Como funciona o desconto na conta de luz?",
    a: "Você passa a consumir energia de uma usina solar parceira e recebe um desconto direto na tarifa, sem precisar instalar nada no seu imóvel e sem investimento inicial. A conta continua vindo da distribuidora, só que mais barata.",
  },
  {
    q: "Preciso investir ou fazer obra para economizar?",
    a: "Não. No modelo de desconto por assinatura não há obra nem custo de instalação. Se você preferir ter o próprio sistema fotovoltaico, também fazemos o projeto e a instalação completos — aí sim com investimento que se paga em poucos anos.",
  },
  {
    q: "Quanto posso economizar por mês?",
    a: "Depende do seu consumo, mas normalmente a economia fica entre 12% e 20% na fatura no modelo de desconto. Com sistema próprio, a redução pode chegar a mais de 90% da conta. No orçamento gratuito calculamos o valor exato para o seu caso.",
  },
  {
    q: "Atende minha cidade?",
    a: "Atendemos toda a Pernambuco — região metropolitana do Recife, Zona da Mata, Agreste e Sertão. Se tiver dúvida sobre a sua cidade, é só falar com a gente pelo WhatsApp.",
  },
  {
    q: "Serve para casa e para empresa?",
    a: "Sim. Atendemos residências, comércios, indústrias, propriedades rurais e condomínios. As soluções são dimensionadas conforme o consumo e o perfil de cada cliente.",
  },
  {
    q: "Moro de aluguel, posso participar?",
    a: "Pode. Como o modelo de desconto não exige instalação no imóvel, quem mora de aluguel também consegue economizar na conta de luz. É uma das grandes vantagens dessa modalidade.",
  },
  {
    q: "Vocês fazem manutenção de sistemas já instalados?",
    a: "Sim. Fazemos limpeza dos painéis, inspeção preventiva, correção de queda na geração e reparo de inversores — mesmo em sistemas que não foram instalados por nós.",
  },
  {
    q: "Em quanto tempo recebo o orçamento?",
    a: "Retornamos em até 24 horas após você preencher o formulário ou falar com a gente pelo WhatsApp, com uma proposta personalizada e sem compromisso.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-24 lg:py-32">
      <div className="container-pad">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span variants={fadeUp} className="chip">
            <HelpCircle className="h-3.5 w-3.5 text-energia" />
            Perguntas frequentes
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-3xl font-bold tracking-tight text-gelo sm:text-4xl lg:text-5xl"
          >
            Tudo o que você precisa saber antes de{" "}
            <span className="text-energia">economizar</span>.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-sm leading-relaxed text-aco-400 sm:text-base"
          >
            Reunimos as dúvidas mais comuns sobre desconto na conta, energia
            solar e nossos serviços. Não achou a sua? Fale com a gente.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mt-12 max-w-3xl space-y-3 sm:mt-16"
        >
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.q}
                variants={fadeUp}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? "border-energia/30 bg-grafite-800/80"
                    : "border-gelo/10 bg-grafite-800/40 hover:border-gelo/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="font-display text-base font-semibold text-gelo sm:text-lg">
                    {item.q}
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition ${
                      isOpen
                        ? "border-energia/40 bg-energia/15 text-energia"
                        : "border-gelo/15 bg-grafite/60 text-aco-400"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-aco-400 sm:px-6 sm:pb-6 sm:text-base">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
