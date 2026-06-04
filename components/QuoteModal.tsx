"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Gauge,
  Home,
  Loader2,
  MapPin,
  Phone,
  Receipt,
  Send,
  Sun,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormState = {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  bairro: string;
  tipoImovel: string;
  distribuidora: string;
  consumoKwh: string;
  valorFatura: string;
  tipoTarifa: string;
  temTelhado: string;
  jaPossuiSolar: string;
  objetivo: string;
  observacoes: string;
};

const INITIAL: FormState = {
  nome: "",
  email: "",
  telefone: "",
  cidade: "",
  bairro: "",
  tipoImovel: "Residencial",
  distribuidora: "Neoenergia Pernambuco (Celpe)",
  consumoKwh: "",
  valorFatura: "",
  tipoTarifa: "Convencional",
  temTelhado: "sim",
  jaPossuiSolar: "nao",
  objetivo: "Desconto na tarifa (sem investimento)",
  observacoes: "",
};

const CIDADES_PE = [
  "Recife",
  "Olinda",
  "Jaboatão dos Guararapes",
  "Paulista",
  "Camaragibe",
  "Caruaru",
  "Petrolina",
  "Garanhuns",
  "Vitória de Santo Antão",
  "Igarassu",
  "São Lourenço da Mata",
  "Abreu e Lima",
  "Cabo de Santo Agostinho",
  "Bezerros",
  "Belo Jardim",
  "Outra",
];

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

export function QuoteModal({ open, onClose }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // ESC para fechar + lock no scroll do body
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

  // Reset ao fechar
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setEnviado(false);
        setEnviando(false);
        setErro(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const economiaEstimada = useMemo(() => {
    const valor = Number(form.valorFatura.replace(/\D/g, "")) / 100;
    if (!valor) return null;
    const min = valor * 0.12;
    const max = valor * 0.2;
    return {
      min: min.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      max: max.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      anual: (valor * 0.18 * 12).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    };
  }, [form.valorFatura]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      const message =
        err instanceof Error
          ? err.message
          : "Erro inesperado. Tente novamente em instantes.";
      setErro(message);
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
            className="relative max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-t-3xl border border-gelo/10 bg-grafite-800 shadow-card sm:rounded-3xl"
          >
            {/* Glows decorativos */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-energia/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sustentavel/15 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-start justify-between gap-4 border-b border-gelo/10 bg-petroleo-700/60 px-6 py-5 backdrop-blur sm:px-8">
              <div>
                <span className="chip mb-2">
                  <Sun className="h-3.5 w-3.5 text-energia" />
                  Orçamento gratuito em 24h
                </span>
                <h2
                  id="quote-modal-title"
                  className="font-display text-2xl font-bold leading-tight text-gelo sm:text-3xl"
                >
                  Vamos calcular sua{" "}
                  <span className="bg-gradient-to-r from-energia to-sustentavel bg-clip-text text-transparent">
                    economia
                  </span>
                </h2>
                <p className="mt-1 text-sm text-aco-400">
                  Conte sobre sua conta de luz e respondemos em até 24h.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gelo/10 bg-grafite/60 text-gelo transition hover:border-gelo/30 hover:bg-grafite"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conteúdo scrollável */}
            <div className="relative max-h-[calc(92vh-180px)] overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              {enviado ? (
                <SuccessState onClose={onClose} />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* SEÇÃO: Dados pessoais */}
                  <fieldset className="space-y-4">
                    <Legend icon={<User className="h-4 w-4" />}>
                      Seus dados
                    </Legend>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Nome completo"
                        required
                        value={form.nome}
                        onChange={(v) => update("nome", v)}
                        placeholder="Ex: Maria Silva"
                        autoFocus
                      />
                      <Field
                        label="E-mail"
                        type="email"
                        required
                        value={form.email}
                        onChange={(v) => update("email", v)}
                        placeholder="voce@email.com"
                      />
                    </div>

                    <Field
                      label="WhatsApp / Telefone"
                      icon={<Phone className="h-4 w-4 text-aco-500" />}
                      required
                      value={form.telefone}
                      onChange={(v) => update("telefone", formatTelefone(v))}
                      placeholder="(81) 99999-9999"
                      inputMode="tel"
                    />
                  </fieldset>

                  {/* SEÇÃO: Localização */}
                  <fieldset className="space-y-4">
                    <Legend icon={<MapPin className="h-4 w-4" />}>
                      Localização em Pernambuco
                    </Legend>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Select
                        label="Cidade"
                        required
                        value={form.cidade}
                        onChange={(v) => update("cidade", v)}
                      >
                        <option value="" disabled>
                          Selecione sua cidade
                        </option>
                        {CIDADES_PE.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Select>
                      <Field
                        label="Bairro (opcional)"
                        value={form.bairro}
                        onChange={(v) => update("bairro", v)}
                        placeholder="Ex: Boa Viagem"
                      />
                    </div>
                  </fieldset>

                  {/* SEÇÃO: Imóvel */}
                  <fieldset className="space-y-4">
                    <Legend icon={<Home className="h-4 w-4" />}>
                      Sobre o imóvel
                    </Legend>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Select
                        label="Tipo de imóvel"
                        required
                        value={form.tipoImovel}
                        onChange={(v) => update("tipoImovel", v)}
                      >
                        <option>Residencial</option>
                        <option>Comercial</option>
                        <option>Industrial</option>
                        <option>Rural</option>
                        <option>Condomínio</option>
                      </Select>

                      <Select
                        label="Possui telhado/área para placas?"
                        required
                        value={form.temTelhado}
                        onChange={(v) => update("temTelhado", v)}
                      >
                        <option value="sim">Sim, tenho espaço</option>
                        <option value="nao">Não / Não sei</option>
                      </Select>
                    </div>
                  </fieldset>

                  {/* SEÇÃO: Conta de luz */}
                  <fieldset className="space-y-4">
                    <Legend icon={<Receipt className="h-4 w-4" />}>
                      Sua conta de luz
                    </Legend>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Select
                        label="Distribuidora"
                        required
                        icon={<Building2 className="h-4 w-4 text-aco-500" />}
                        value={form.distribuidora}
                        onChange={(v) => update("distribuidora", v)}
                      >
                        <option>Neoenergia Pernambuco (Celpe)</option>
                        <option>Outra</option>
                      </Select>

                      <Select
                        label="Tipo de tarifa"
                        value={form.tipoTarifa}
                        onChange={(v) => update("tipoTarifa", v)}
                      >
                        <option>Convencional</option>
                        <option>Branca</option>
                        <option>Verde</option>
                        <option>Azul</option>
                        <option>Não sei</option>
                      </Select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Consumo médio mensal (kWh)"
                        icon={<Gauge className="h-4 w-4 text-aco-500" />}
                        required
                        value={form.consumoKwh}
                        onChange={(v) =>
                          update("consumoKwh", v.replace(/\D/g, "").slice(0, 6))
                        }
                        placeholder="Ex: 350"
                        inputMode="numeric"
                        suffix="kWh"
                        hint="Está no canto da sua fatura, em 'consumo do mês'."
                      />
                      <Field
                        label="Valor médio da fatura (R$)"
                        icon={<Zap className="h-4 w-4 text-energia" />}
                        required
                        value={form.valorFatura}
                        onChange={(v) => update("valorFatura", formatMoeda(v))}
                        placeholder="R$ 0,00"
                        inputMode="numeric"
                      />
                    </div>

                    <Select
                      label="Já possui sistema solar instalado?"
                      value={form.jaPossuiSolar}
                      onChange={(v) => update("jaPossuiSolar", v)}
                    >
                      <option value="nao">Não, ainda não tenho</option>
                      <option value="sim">Sim, mas preciso de manutenção</option>
                    </Select>

                    {economiaEstimada && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-sustentavel/20 bg-sustentavel/5 p-4"
                      >
                        <p className="text-xs uppercase tracking-wider text-sustentavel">
                          Estimativa preliminar
                        </p>
                        <p className="mt-1 text-sm text-aco-400">
                          Com sua fatura média, você pode economizar entre{" "}
                          <span className="font-semibold text-gelo">
                            {economiaEstimada.min}
                          </span>{" "}
                          e{" "}
                          <span className="font-semibold text-gelo">
                            {economiaEstimada.max}
                          </span>{" "}
                          por mês — até{" "}
                          <span className="font-semibold text-sustentavel">
                            {economiaEstimada.anual}
                          </span>{" "}
                          ao ano.
                        </p>
                      </motion.div>
                    )}
                  </fieldset>

                  {/* SEÇÃO: Objetivo */}
                  <fieldset className="space-y-4">
                    <Legend icon={<Sun className="h-4 w-4" />}>
                      O que você procura?
                    </Legend>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Desconto na tarifa (sem investimento)",
                        "Instalação de sistema fotovoltaico",
                        "Manutenção do meu sistema",
                        "Ainda não tenho certeza",
                      ].map((opt) => (
                        <label
                          key={opt}
                          className={`cursor-pointer rounded-2xl border p-3 text-sm transition ${
                            form.objetivo === opt
                              ? "border-energia/60 bg-energia/10 text-gelo"
                              : "border-gelo/10 bg-grafite/40 text-aco-400 hover:border-gelo/25"
                          }`}
                        >
                          <input
                            type="radio"
                            name="objetivo"
                            value={opt}
                            checked={form.objetivo === opt}
                            onChange={(e) => update("objetivo", e.target.value)}
                            className="sr-only"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-aco-400">
                        Observações (opcional)
                      </label>
                      <textarea
                        rows={3}
                        value={form.observacoes}
                        onChange={(e) =>
                          update("observacoes", e.target.value)
                        }
                        placeholder="Conte mais detalhes que possam ajudar no orçamento..."
                        className="w-full resize-none rounded-2xl border border-gelo/10 bg-petroleo-700/40 px-4 py-3 text-sm text-gelo placeholder:text-aco-500/70 outline-none transition focus:border-energia/40 focus:bg-petroleo-700/70"
                      />
                    </div>
                  </fieldset>

                  {/* Erro */}
                  {erro && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
                      role="alert"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p className="font-semibold text-red-100">
                          Não foi possível enviar.
                        </p>
                        <p className="mt-0.5 text-red-200/80">{erro}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <div className="flex flex-col-reverse items-center gap-3 border-t border-gelo/10 pt-5 sm:flex-row sm:justify-between">
                    <p className="text-xs text-aco-500">
                      Seus dados são tratados com sigilo e usados apenas para o
                      orçamento.
                    </p>
                    <button
                      type="submit"
                      disabled={enviando}
                      className="btn-primary group w-full whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
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
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Subcomponentes ---------- */

function Legend({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <legend className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-energia">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-energia/15 text-energia">
        {icon}
      </span>
      {children}
    </legend>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoFocus?: boolean;
  icon?: React.ReactNode;
  suffix?: string;
  hint?: string;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  inputMode,
  autoFocus,
  icon,
  suffix,
  hint,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-aco-400">
        {label}
        {required && <span className="ml-1 text-energia">*</span>}
      </span>
      <div className="group flex items-center gap-2 rounded-2xl border border-gelo/10 bg-petroleo-700/40 px-4 py-3 transition focus-within:border-energia/40 focus-within:bg-petroleo-700/70">
        {icon}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          inputMode={inputMode}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-sm text-gelo placeholder:text-aco-500/70 outline-none"
        />
        {suffix && (
          <span className="text-xs font-medium text-aco-500">{suffix}</span>
        )}
      </div>
      {hint && <p className="mt-1 text-[11px] text-aco-500">{hint}</p>}
    </label>
  );
}

type SelectProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

function Select({ label, value, onChange, required, children, icon }: SelectProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-aco-400">
        {label}
        {required && <span className="ml-1 text-energia">*</span>}
      </span>
      <div className="flex items-center gap-2 rounded-2xl border border-gelo/10 bg-petroleo-700/40 px-4 py-3 transition focus-within:border-energia/40 focus-within:bg-petroleo-700/70">
        {icon}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full appearance-none bg-transparent text-sm text-gelo outline-none [&>option]:bg-grafite-800 [&>option]:text-gelo"
        >
          {children}
        </select>
      </div>
    </label>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center py-8 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-pulse-soft rounded-full bg-sustentavel/30 blur-2xl" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-sustentavel to-sustentavel-600 text-petroleo shadow-glow">
          <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
        </div>
      </div>
      <h3 className="font-display text-2xl font-bold text-gelo sm:text-3xl">
        Solicitação enviada!
      </h3>
      <p className="mt-3 max-w-md text-sm text-aco-400">
        Recebemos seus dados por e-mail. Em até{" "}
        <span className="text-gelo">24 horas</span>, Leonardo retorna com seu
        orçamento personalizado.
      </p>
      <button onClick={onClose} className="btn-secondary mt-7">
        Fechar
      </button>
    </motion.div>
  );
}
