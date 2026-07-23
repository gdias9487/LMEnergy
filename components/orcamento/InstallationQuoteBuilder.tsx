"use client";

import { pdf } from "@react-pdf/renderer";
import {
  Download,
  FileText,
  ImagePlus,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { InstallationQuotePdf } from "@/components/orcamento/InstallationQuotePdf";
import { CIDADES_PE } from "@/lib/quote/formConfig";
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
  suggestPotenciaKwp,
  type InstallationQuoteInput,
  type QuoteImage,
} from "@/lib/orcamento/installationQuote";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function CityCombobox({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = normalizeText(value);
    if (!q) return CIDADES_PE.slice(0, 8);
    return CIDADES_PE.filter((cidade) =>
      normalizeText(cidade).includes(q),
    ).slice(0, 8);
  }, [value]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative block">
      <span className="mb-1.5 block text-xs font-medium text-aco-400">
        {label}
        {required && <span className="ml-1 text-energia">*</span>}
      </span>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" && suggestions[0]) {
            e.preventDefault();
            onChange(suggestions[0]);
            setOpen(false);
          }
        }}
        required={required}
        placeholder="Digite para buscar..."
        autoComplete="off"
        className="w-full rounded-2xl border border-gelo/10 bg-petroleo-700/40 px-4 py-3 text-sm text-gelo outline-none transition placeholder:text-aco-500/70 focus:border-energia/40"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-2xl border border-gelo/10 bg-grafite-800 py-1 shadow-card">
          {suggestions.map((cidade) => (
            <li key={cidade}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(cidade);
                  setOpen(false);
                }}
                className={`flex w-full px-4 py-2.5 text-left text-sm transition hover:bg-energia/10 hover:text-gelo ${
                  value === cidade ? "bg-energia/15 text-gelo" : "text-aco-400"
                }`}
              >
                {cidade}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-[11px] text-aco-500">
        Digite o nome — as sugestões aparecem automaticamente
      </p>
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  inputMode,
  hint,
  readOnly,
  className,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
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

const EMPTY_OVERRIDES = {
  potenciaKwp: "",
  qtdModulos: "",
  nomeModulo: "",
  potenciaModulo: "",
  qtdInversor: "",
  nomeInversor: "",
  potenciaInversor: "",
  valorEquipamentos: "",
  valorEngenharia: "",
} as const;

export function InstallationQuoteBuilder() {
  const [quote, setQuote] = useState<InstallationQuoteInput>(() => ({
    ...INITIAL_INSTALLATION_QUOTE,
    data: formatQuoteDate(),
  }));
  const [generating, setGenerating] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      ...EMPTY_OVERRIDES,
    }));
  }

  function handlePotenciaChange(raw: string) {
    const potenciaKwp = raw.replace(/[^\d.,]/g, "").slice(0, 8);
    setQuote((p) => ({
      ...p,
      potenciaKwp,
      qtdModulos: "",
      nomeModulo: "",
      potenciaModulo: "",
      qtdInversor: "",
      nomeInversor: "",
      potenciaInversor: "",
      valorEquipamentos: "",
      valorEngenharia: "",
    }));
  }

  function resetQuote() {
    setQuote({
      ...INITIAL_INSTALLATION_QUOTE,
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

    const imagensIncompletas = quote.imagens.some(
      (img) => img.src && !img.nome.trim(),
    );
    if (imagensIncompletas) {
      setErro("Informe o nome de cada imagem adicionada.");
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

  async function handleAddImages(files: FileList | null) {
    if (!files?.length) return;
    setErro(null);

    const accepted: QuoteImage[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setErro("Use apenas arquivos de imagem (JPG, PNG ou WEBP).");
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErro("Cada imagem deve ter no máximo 8 MB.");
        continue;
      }
      const src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        nome: "",
        src,
      });
    }

    if (accepted.length) {
      setQuote((p) => ({ ...p, imagens: [...p.imagens, ...accepted] }));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function updateImageNome(id: string, nome: string) {
    setQuote((p) => ({
      ...p,
      imagens: p.imagens.map((img) =>
        img.id === id ? { ...img, nome } : img,
      ),
    }));
  }

  function removeImage(id: string) {
    setQuote((p) => ({
      ...p,
      imagens: p.imagens.filter((img) => img.id !== id),
    }));
  }

  const potenciaExibida =
    quote.potenciaKwp ||
    (potenciaSugerida > 0 ? formatKwp(potenciaSugerida) : "");

  const modulosExibidos =
    quote.qtdModulos ||
    (computed ? String(computed.qtdModulosSugerida) : "");

  const nomeModuloExibido =
    quote.nomeModulo || (computed ? computed.nomeModuloSugerido : "");

  const potenciaModuloExibida =
    quote.potenciaModulo ||
    (computed ? String(computed.potenciaModuloSugerida) : "");

  const qtdInversorExibido =
    quote.qtdInversor ||
    (computed ? String(computed.qtdInversor) : "1");

  const nomeInversorExibido =
    quote.nomeInversor ||
    (computed ? computed.nomeInversorSugerido : "");

  const potenciaInversorExibida =
    quote.potenciaInversor ||
    (computed ? String(computed.potenciaInversorSugerida) : "");

  const equipExibido =
    quote.valorEquipamentos ||
    (computed
      ? formatMoneyNumber(computed.valorEquipamentosSugerido)
      : "");

  const engExibido =
    quote.valorEngenharia ||
    (computed
      ? formatMoneyNumber(computed.valorEngenhariaSugerido)
      : "");

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
            {quote.clienteNome
              ? `${quote.clienteNome} · ${quote.data}`
              : quote.data}
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
          <CityCombobox
            label="Cidade"
            required
            value={quote.clienteCidade}
            onChange={(v) => update("clienteCidade", v)}
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
            onChange={handlePotenciaChange}
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
            value={computed ? formatKwh(computed.geracaoMensalKwh) : ""}
            readOnly
            hint={`Potência × ${QUOTE_CALC.kwhPorKwpMes}`}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-gelo/10 bg-grafite-800/60 p-5 sm:p-6">
        <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-energia">
          Equipamentos e valores
        </h2>
        <p className="mb-4 text-xs text-aco-500">
          Pré-preenchidos pelo cálculo da conta. Edite se precisar ajustar a
          proposta.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid grid-cols-[4.75rem_1fr_5.5rem] gap-3 sm:col-span-2">
            <Field
              label="Qtd."
              value={modulosExibidos}
              onChange={(v) =>
                update("qtdModulos", v.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="8"
              inputMode="numeric"
            />
            <Field
              label="Módulo"
              value={nomeModuloExibido}
              onChange={(v) => update("nomeModulo", v)}
              placeholder="Canadian"
            />
            <Field
              label="Potência (Wp)"
              value={potenciaModuloExibida}
              onChange={(v) => {
                update("potenciaModulo", v.replace(/\D/g, "").slice(0, 4));
                update("qtdModulos", "");
              }}
              placeholder="620"
              inputMode="numeric"
            />
          </div>
          <div className="grid grid-cols-[4.75rem_1fr_5.5rem] gap-3 sm:col-span-2">
            <Field
              label="Qtd."
              value={qtdInversorExibido}
              onChange={(v) =>
                update("qtdInversor", v.replace(/\D/g, "").slice(0, 2))
              }
              placeholder="1"
              inputMode="numeric"
            />
            <Field
              label="Inversor"
              value={nomeInversorExibido}
              onChange={(v) => update("nomeInversor", v)}
              placeholder="Huawei AFCI"
            />
            <Field
              label="Potência (kW)"
              value={potenciaInversorExibida}
              onChange={(v) =>
                update(
                  "potenciaInversor",
                  v.replace(/[^\d.,]/g, "").slice(0, 5),
                )
              }
              placeholder="4"
              inputMode="decimal"
            />
          </div>
          <Field
            label="Equipamentos (investimento)"
            value={equipExibido}
            onChange={(v) =>
              update("valorEquipamentos", formatMoneyInput(v))
            }
            placeholder="R$ 0,00"
            inputMode="numeric"
            hint={
              computed
                ? `Sugerido: ${formatMoneyNumber(computed.valorEquipamentosSugerido)}`
                : undefined
            }
          />
          <Field
            label="Engenharia"
            value={engExibido}
            onChange={(v) => update("valorEngenharia", formatMoneyInput(v))}
            placeholder="R$ 0,00"
            inputMode="numeric"
            hint={
              computed
                ? `Sugerido: ${formatMoneyNumber(computed.valorEngenhariaSugerido)}`
                : undefined
            }
          />
          <Field
            label="Área aproximada"
            value={
              computed ? `${Math.round(computed.areaM2)} m²` : ""
            }
            readOnly
            hint={`(área da placa × módulos) + 30%`}
          />
          <Field
            label="Total"
            value={
              computed ? formatMoneyNumber(computed.valorTotal) : ""
            }
            readOnly
            hint="Equipamentos + engenharia"
          />
          <Field
            label="Qtd. de parcelas"
            value={
              quote.qtdParcelas ||
              (computed ? String(computed.qtdParcelas) : String(QUOTE_CALC.parcelasEquipamentos))
            }
            onChange={(v) =>
              update("qtdParcelas", v.replace(/\D/g, "").slice(0, 3))
            }
            placeholder="21"
            inputMode="numeric"
            hint={`Padrão: ${QUOTE_CALC.parcelasEquipamentos}x no cartão`}
          />
          <Field
            label="Prazo de obra (dias)"
            value={
              quote.prazoObra ||
              (computed
                ? String(computed.prazoObraDias)
                : String(QUOTE_CALC.prazoInstalacaoDias))
            }
            onChange={(v) =>
              update("prazoObra", v.replace(/\D/g, "").slice(0, 3))
            }
            placeholder="7"
            inputMode="numeric"
            hint={`Padrão: ${QUOTE_CALC.prazoInstalacaoDias} dias`}
          />
        </div>
      </section>

      {computed && (
        <section className="rounded-3xl border border-sustentavel/20 bg-sustentavel/5 p-5 sm:p-6">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-sustentavel">
            Resultado
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Stat
              label="Parcelas (equip.)"
              value={`${computed.qtdParcelas}x ${formatMoneyNumber(computed.valorParcelaEquipamentos)}`}
            />
            <Stat
              label="Prazo de obra"
              value={`${computed.prazoObraDias} dias`}
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
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-energia">
              Imagens (opcional)
            </h2>
            <p className="mt-1 text-xs text-aco-500">
              Duas fotos por página no PDF. Informe um nome para cada imagem.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-gelo/10 px-4 py-2 text-sm text-aco-400 transition hover:border-energia/40 hover:text-gelo"
          >
            <ImagePlus className="h-4 w-4 text-energia" />
            Adicionar imagens
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleAddImages(e.target.files)}
          />
        </div>

        {quote.imagens.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gelo/10 px-4 py-8 text-center text-sm text-aco-500">
            Nenhuma imagem adicionada
          </p>
        ) : (
          <ul className="space-y-3">
            {quote.imagens.map((img) => (
              <li
                key={img.id}
                className="flex flex-col gap-3 rounded-2xl border border-gelo/10 bg-petroleo-700/30 p-3 sm:flex-row sm:items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.nome || "Prévia"}
                  className="h-24 w-full shrink-0 rounded-xl object-cover sm:h-20 sm:w-28"
                />
                <div className="min-w-0 flex-1">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-aco-400">
                      Nome
                      <span className="ml-1 text-energia">*</span>
                    </span>
                    <input
                      value={img.nome}
                      onChange={(e) =>
                        updateImageNome(img.id, e.target.value)
                      }
                      placeholder="Ex.: Vista frontal"
                      className="w-full rounded-2xl border border-gelo/10 bg-petroleo-700/40 px-4 py-2.5 text-sm text-gelo outline-none transition placeholder:text-aco-500/70 focus:border-energia/40"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="inline-flex items-center justify-center gap-2 self-end rounded-full border border-gelo/10 px-3 py-2 text-sm text-aco-400 transition hover:border-red-400/40 hover:text-red-200 sm:self-center"
                  aria-label="Remover imagem"
                >
                  <Trash2 className="h-4 w-4" />
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
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
