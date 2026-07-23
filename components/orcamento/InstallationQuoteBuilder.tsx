"use client";

import { pdf } from "@react-pdf/renderer";
import {
  Download,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { InstallationQuotePdf } from "@/components/orcamento/InstallationQuotePdf";
import {
  INITIAL_INSTALLATION_QUOTE,
  QUOTE_CALC,
  buildPdfFilename,
  buildQuoteForPdf,
  computeInstallationQuote,
  formatKwh,
  formatKwp,
  formatMoneyInput,
  formatMoneyNumber,
  formatPaybackLabel,
  formatPhone,
  formatQuoteDate,
  generateQuoteNumber,
  suggestPotenciaKwp,
  type InstallationQuoteInput,
} from "@/lib/orcamento/installationQuote";

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  inputMode,
  hint,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-aco-400">
        {label}
        {required && <span className="ml-1 text-energia">*</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        readOnly={readOnly}
        className={`w-full rounded-2xl border border-gelo/10 px-4 py-3 text-sm text-gelo outline-none transition placeholder:text-aco-500/70 ${
          readOnly
            ? "cursor-default bg-petroleo-900/40 text-aco-400"
            : "bg-petroleo-700/40 focus:border-energia/40"
        }`}
      />
      {hint && <p className="mt-1 text-[11px] text-aco-500">{hint}</p>}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gelo/10 bg-petroleo-700/40 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wider text-aco-500">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-gelo">{value}</p>
    </div>
  );
}

export function InstallationQuoteBuilder() {
  const [quote, setQuote] = useState<InstallationQuoteInput>(() => ({
    ...INITIAL_INSTALLATION_QUOTE,
    numero: generateQuoteNumber(),
    data: formatQuoteDate(),
  }));
  const [generating, setGenerating] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const update = <K extends keyof InstallationQuoteInput>(
    key: K,
    value: InstallationQuoteInput[K],
  ) => setQuote((p) => ({ ...p, [key]: value }));

  const computed = useMemo(
    () => computeInstallationQuote(quote),
    [quote],
  );

  const potenciaSugerida = useMemo(
    () => suggestPotenciaKwp(quote.valorFatura),
    [quote.valorFatura],
  );

  const canDownload = useMemo(
    () =>
      Boolean(
        quote.clienteNome.trim() &&
          quote.clienteCidade.trim() &&
          quote.valorFatura.trim() &&
          computed,
      ),
    [quote, computed],
  );

  function handleBillChange(raw: string) {
    const valorFatura = formatMoneyInput(raw);
    setQuote((p) => ({
      ...p,
      valorFatura,
      // Recalcula potência sugerida; limpa override manual para acompanhar a conta
      potenciaKwp: "",
    }));
  }

  function resetQuote() {
    setQuote({
      ...INITIAL_INSTALLATION_QUOTE,
      numero: generateQuoteNumber(),
      data: formatQuoteDate(),
    });
    setErro(null);
  }

  async function handleDownload() {
    setErro(null);
    if (!canDownload || !computed) {
      setErro("Preencha nome, cidade e valor da conta de luz.");
      return;
    }

    setGenerating(true);
    try {
      const fullQuote = buildQuoteForPdf(quote);
      const blob = await pdf(
        <InstallationQuotePdf quote={fullQuote} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = buildPdfFilename(quote);
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Não foi possível gerar o PDF. Tente novamente.",
      );
    } finally {
      setGenerating(false);
    }
  }

  const potenciaExibida =
    quote.potenciaKwp ||
    (potenciaSugerida > 0 ? formatKwp(potenciaSugerida) : "");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="chip">
            <FileText className="h-3.5 w-3.5 text-energia" />
            Instalação solar
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold text-gelo sm:text-3xl">
            Gerador de orçamento
          </h1>
          <p className="mt-1 text-sm text-aco-400">
            Proposta nº {quote.numero} · {quote.data}
          </p>
        </div>
        <button
          type="button"
          onClick={resetQuote}
          className="inline-flex items-center gap-2 rounded-full border border-gelo/10 px-4 py-2 text-sm text-aco-400 transition hover:border-gelo/25 hover:text-gelo"
        >
          <RefreshCw className="h-4 w-4" />
          Nova proposta
        </button>
      </div>

      <section className="rounded-3xl border border-gelo/10 bg-grafite-800/60 p-5 sm:p-6">
        <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-energia">
          Cliente
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Nº da proposta"
            value={quote.numero}
            onChange={(v) => update("numero", v)}
            placeholder="13/2026"
            hint="Formato livre — ex.: 13/2026"
          />
          <Field
            label="Data"
            value={quote.data}
            onChange={(v) => update("data", v)}
            placeholder="10/07/2026"
          />
          <Field
            label="Nome"
            required
            value={quote.clienteNome}
            onChange={(v) => update("clienteNome", v)}
            placeholder="Marcelo"
          />
          <Field
            label="Cidade"
            required
            value={quote.clienteCidade}
            onChange={(v) => update("clienteCidade", v)}
            placeholder="Jaboatão"
          />
          <Field
            label="WhatsApp"
            value={quote.clienteTelefone}
            onChange={(v) => update("clienteTelefone", formatPhone(v))}
            placeholder="(81) 99999-9999"
            inputMode="tel"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-gelo/10 bg-grafite-800/60 p-5 sm:p-6">
        <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-energia">
          Conta de luz e sistema
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Valor médio da conta"
            required
            value={quote.valorFatura}
            onChange={handleBillChange}
            placeholder="R$ 0,00"
            inputMode="numeric"
            hint={`Potência sugerida = conta ÷ ${QUOTE_CALC.kwhPorKwpMes}`}
          />
          <Field
            label="Consumo médio (kWh)"
            value={quote.consumoKwh}
            onChange={(v) =>
              update("consumoKwh", v.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="400"
            inputMode="numeric"
            hint="Informativo na proposta"
          />
          <Field
            label="Potência (kWp)"
            value={potenciaExibida}
            onChange={(v) =>
              update("potenciaKwp", v.replace(/[^\d.,]/g, "").slice(0, 8))
            }
            placeholder="4,96"
            inputMode="decimal"
            hint={
              potenciaSugerida > 0
                ? `Sugerido: ${formatKwp(potenciaSugerida)} kWp — edite se quiser gerar a mais`
                : "Preencha a conta para calcular"
            }
          />
          <Field
            label="Geração média (kWh/mês)"
            value={
              computed ? formatKwh(computed.geracaoMensalKwh) : ""
            }
            readOnly
            hint={`Potência × ${QUOTE_CALC.kwhPorKwpMes}`}
          />
        </div>
      </section>

      {computed && (
        <section className="rounded-3xl border border-sustentavel/20 bg-sustentavel/5 p-5 sm:p-6">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-sustentavel">
            Resultado calculado
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Stat
              label="Módulos"
              value={`${computed.qtdModulos} × ${QUOTE_CALC.moduloWp} Wp`}
            />
            <Stat label="Inversor" value={`Huawei ${computed.inversorKw} kW`} />
            <Stat
              label="Área aprox."
              value={`${Math.round(computed.areaM2)} m²`}
            />
            <Stat
              label="Equipamentos"
              value={formatMoneyNumber(computed.valorEquipamentos)}
            />
            <Stat
              label="Engenharia"
              value={formatMoneyNumber(computed.valorEngenharia)}
            />
            <Stat
              label="Total"
              value={formatMoneyNumber(computed.valorTotal)}
            />
            <Stat
              label="Parcelas (equip.)"
              value={`${QUOTE_CALC.parcelasEquipamentos}x ${formatMoneyNumber(computed.valorParcelaEquipamentos)}`}
            />
            <Stat
              label="Economia / mês"
              value={formatMoneyNumber(computed.economiaMensal)}
            />
            <Stat
              label="Economia / ano"
              value={formatMoneyNumber(computed.economiaAnual)}
            />
            <Stat
              label="Economia 25 anos"
              value={formatMoneyNumber(computed.economia25Anos)}
            />
            <Stat
              label="Payback"
              value={formatPaybackLabel(computed.paybackAnos)}
            />
            <Stat
              label="Geração / ano"
              value={`${formatKwh(computed.geracaoAnualKwh)} kWh`}
            />
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-gelo/10 bg-grafite-800/60 p-5 sm:p-6">
        <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-energia">
          Observações (opcional)
        </h2>
        <textarea
          rows={3}
          value={quote.observacoes}
          onChange={(e) => update("observacoes", e.target.value)}
          placeholder="Detalhes extras para esta proposta..."
          className="w-full resize-none rounded-2xl border border-gelo/10 bg-petroleo-700/40 px-4 py-3 text-sm text-gelo outline-none transition placeholder:text-aco-500/70 focus:border-energia/40"
        />
      </section>

      {erro && (
        <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {erro}
        </p>
      )}

      <button
        type="button"
        onClick={handleDownload}
        disabled={generating || !canDownload}
        className="btn-primary group w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Gerando PDF...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Baixar proposta PDF
            <Sparkles className="h-4 w-4 text-petroleo/70" />
          </>
        )}
      </button>
    </div>
  );
}
