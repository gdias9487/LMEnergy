"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Send,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { QuoteFormBody } from "@/components/quote/QuoteFormSections";
import {
  getFormHeadline,
  INITIAL_QUOTE_FORM,
  showBillFields,
  showMaintenanceFields,
  toQuotePayload,
  type QuoteFormState,
} from "@/lib/quote/formConfig";

type Props = {
  open: boolean;
  onClose: () => void;
};

function formatTelefone(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

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

function validateForm(form: QuoteFormState): string | null {
  if (!form.nome.trim() || !form.telefone.trim() || !form.cidade.trim()) {
    return "Preencha nome, WhatsApp e cidade.";
  }

  if (showBillFields(form.objetivo)) {
    if (!form.consumoKwh.trim() || !form.valorFatura.trim()) {
      return "Informe consumo e valor da fatura.";
    }
  }

  if (showMaintenanceFields(form.objetivo) && !form.tipoManutencao.trim()) {
    return "Selecione o tipo de manutenção.";
  }

  return null;
}

export function QuoteModal({ open, onClose }: Props) {
  const [form, setForm] = useState<QuoteFormState>(INITIAL_QUOTE_FORM);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const headline = getFormHeadline(form.objetivo);

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
        setForm(INITIAL_QUOTE_FORM);
        setEnviado(false);
        setEnviando(false);
        setErro(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const update = <K extends keyof QuoteFormState>(
    key: K,
    value: QuoteFormState[K],
  ) => setForm((p) => ({ ...p, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    const validationError = validateForm(form);
    if (validationError) {
      setErro(validationError);
      return;
    }

    setEnviando(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toQuotePayload(form)),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(
          data.error ?? "Não foi possível enviar sua solicitação.",
        );
      }

      setEnviado(true);
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Erro inesperado. Tente novamente em instantes.",
      );
    } finally {
      setEnviando(false);
    }
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
          aria-labelledby="quote-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-lg overflow-hidden rounded-t-3xl border border-gelo/10 bg-grafite-800 shadow-card sm:rounded-3xl"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-energia/20 blur-3xl" />

            <div className="relative flex items-start justify-between gap-3 border-b border-gelo/10 bg-petroleo-700/60 px-5 py-4 backdrop-blur sm:px-6">
              <div className="min-w-0">
                <span className="chip mb-2">
                  <Sun className="h-3.5 w-3.5 text-energia" />
                  Orçamento em 24h
                </span>
                <h2
                  id="quote-modal-title"
                  className="font-display text-xl font-bold leading-tight text-gelo sm:text-2xl"
                >
                  Solicitar{" "}
                  <span className="bg-gradient-to-r from-energia to-sustentavel bg-clip-text text-transparent">
                    {headline.title}
                  </span>
                </h2>
                <p className="mt-0.5 text-xs text-aco-400">{headline.subtitle}</p>
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
              {enviado ? (
                <SuccessState onClose={onClose} />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <QuoteFormBody
                    form={form}
                    update={update}
                    formatTelefone={formatTelefone}
                    formatMoeda={formatMoeda}
                  />

                  {erro && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200"
                      role="alert"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>{erro}</p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="btn-primary group w-full disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {enviando ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar solicitação
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center py-6 text-center"
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 animate-pulse-soft rounded-full bg-sustentavel/30 blur-2xl" />
        <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-sustentavel to-sustentavel-600 text-petroleo shadow-glow">
          <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
        </div>
      </div>
      <h3 className="font-display text-2xl font-bold text-gelo">
        Enviado!
      </h3>
      <p className="mt-2 max-w-sm text-sm text-aco-400">
        Retornamos em até <span className="text-gelo">24 horas</span> pelo
        WhatsApp.
      </p>
      <button type="button" onClick={onClose} className="btn-secondary mt-6">
        Fechar
      </button>
    </motion.div>
  );
}
