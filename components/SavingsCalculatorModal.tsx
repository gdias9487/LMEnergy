"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  PiggyBank,
  Sun,
  TrendingDown,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ChipOptions, Field } from "@/components/quote/QuoteFormUi";
import {
  calculateSavings,
  formatCurrency,
  parseBillValue,
  type SavingsResult,
  type SavingsSolution,
} from "@/lib/calculator/savingsCalculator";
import { useQuoteModal } from "./QuoteModalProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

function formatMoeda(v: string) {
  const digits = v.replace(/\D/g, "");
  if (!digits) return "";
  const num = Number(digits) / 100;
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function SavingsCalculatorModal({ open, onClose }: Props) {
  const { openModal: openQuoteModal } = useQuoteModal();
  const [solution, setSolution] = useState<SavingsSolution>("desconto");
  const [valorFatura, setValorFatura] = useState("");
  const [consumoKwh, setConsumoKwh] = useState("");
  const [result, setResult] = useState<SavingsResult | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setSolution("desconto");
        setValorFatura("");
        setConsumoKwh("");
        setResult(null);
        setErro(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  function handleCalculate() {
    setErro(null);
    const billValue = parseBillValue(valorFatura);
    if (!billValue) {
      setErro("Informe o valor médio da sua fatura.");
      setResult(null);
      return;
    }
    const calculated = calculateSavings(solution, billValue);
    setResult(calculated);
  }

  function handleQuote() {
    onClose();
    openQuoteModal();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-petroleo-900/80 px-0 backdrop-blur-md sm:items-center sm:px-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="calculator-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-lg overflow-hidden rounded-t-3xl border border-gelo/10 bg-grafite-800 shadow-card sm:rounded-3xl"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sustentavel/20 blur-3xl" />

            <div className="relative flex items-start justify-between gap-3 border-b border-gelo/10 bg-petroleo-700/60 px-5 py-4 backdrop-blur sm:px-6">
              <div className="min-w-0">
                <span className="chip mb-2">
                  <Calculator className="h-3.5 w-3.5 text-sustentavel" />
                  Estimativa gratuita
                </span>
                <h2
                  id="calculator-modal-title"
                  className="font-display text-xl font-bold leading-tight text-gelo sm:text-2xl"
                >
                  Calculadora de{" "}
                  <span className="bg-gradient-to-r from-energia to-sustentavel bg-clip-text text-transparent">
                    economia
                  </span>
                </h2>
                <p className="mt-0.5 text-xs text-aco-400">
                  Veja quanto você pode economizar por mês.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gelo/10 bg-grafite/60 text-gelo transition hover:border-gelo/30 hover:bg-grafite"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative max-h-[calc(92vh-140px)] overflow-y-auto px-5 py-5 sm:px-6">
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-xs font-medium text-aco-400">
                    Qual solução te interessa?
                  </p>
                  <ChipOptions
                    name="solution"
                    value={solution}
                    options={[
                      {
                        value: "desconto" as const,
                        label: "Desconto na conta",
                      },
                      {
                        value: "instalacao" as const,
                        label: "Instalação solar",
                      },
                    ]}
                    onChange={(v) => {
                      setSolution(v);
                      setResult(null);
                    }}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Valor da fatura"
                    required
                    value={valorFatura}
                    onChange={(v) => {
                      setValorFatura(formatMoeda(v));
                      setResult(null);
                    }}
                    placeholder="R$ 0,00"
                    inputMode="numeric"
                    autoFocus
                  />
                  <Field
                    label="Consumo (opcional)"
                    value={consumoKwh}
                    onChange={(v) =>
                      setConsumoKwh(v.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="350"
                    inputMode="numeric"
                    suffix="kWh"
                  />
                </div>

                {erro && (
                  <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {erro}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleCalculate}
                  className="btn-primary group w-full"
                >
                  <TrendingDown className="h-4 w-4" />
                  Calcular economia
                </button>

                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="rounded-2xl border border-sustentavel/25 bg-sustentavel/5 p-5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sustentavel/15 text-sustentavel">
                          {result.solution === "desconto" ? (
                            <PiggyBank className="h-5 w-5" />
                          ) : (
                            <Sun className="h-5 w-5" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-wider text-sustentavel">
                            {result.solutionLabel}
                          </p>
                          <p className="mt-1 font-display text-2xl font-bold text-gelo">
                            {formatCurrency(result.monthlyAvg)}
                            <span className="text-base font-medium text-aco-400">
                              {" "}
                              / mês
                            </span>
                          </p>
                          <p className="mt-1 text-sm text-aco-400">
                            Economia média entre{" "}
                            <strong className="text-gelo">
                              {formatCurrency(result.monthlyMin)}
                            </strong>{" "}
                            e{" "}
                            <strong className="text-gelo">
                              {formatCurrency(result.monthlyMax)}
                            </strong>{" "}
                            ({result.percentMin}% a {result.percentMax}%)
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-petroleo-700/50 px-3 py-3">
                          <p className="text-[11px] uppercase tracking-wider text-aco-500">
                            Por ano
                          </p>
                          <p className="mt-1 font-display text-lg font-semibold text-gelo">
                            {formatCurrency(result.annualAvg)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-petroleo-700/50 px-3 py-3">
                          <p className="text-[11px] uppercase tracking-wider text-aco-500">
                            Fatura atual
                          </p>
                          <p className="mt-1 font-display text-lg font-semibold text-gelo">
                            {formatCurrency(result.billValue)}
                          </p>
                        </div>
                      </div>

                      {consumoKwh && (
                        <p className="mt-3 text-xs text-aco-500">
                          Consumo informado: {consumoKwh} kWh/mês
                        </p>
                      )}

                      <p className="mt-4 text-[11px] leading-relaxed text-aco-500">
                        Estimativa com base no seu consumo informado. O valor
                        final depende da análise da fatura e do perfil do imóvel.
                      </p>

                      <button
                        type="button"
                        onClick={handleQuote}
                        className="btn-secondary group mt-4 w-full"
                      >
                        Solicitar orçamento personalizado
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
