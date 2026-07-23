/** Constantes calibradas a partir da proposta M 13/2026 (Marcelo — Jaboatão). */
export const QUOTE_CALC = {
  /** kWh gerados por mês por kWp instalado */
  kwhPorKwpMes: 130,
  /** Fator de economia sobre a geração valorizada (~4% residual na conta) */
  economiaFator: 0.96,
  /** Preço de equipamentos por kWp */
  precoEquipPorKwp: 1597.39,
  /** Preço de engenharia/instalação por kWp */
  precoEngPorKwp: 955.83,
  /** Potência unitária dos módulos (Canadian) */
  moduloWp: 620,
  /** Área aproximada ocupada por kWp */
  areaM2PorKwp: 6.05,
  /** Parcelas no cartão para equipamentos */
  parcelasEquipamentos: 21,
  /** Markup total do parcelamento (ex.: 21x eleva o valor ~16,6%) */
  fatorParcelamento: 1.16614,
  validadeDias: 7,
  prazoInstalacaoDias: 7,
  prazoCelpeDias: 90,
  garantiaModulosAnos: 25,
  garantiaInversorAnos: 10,
  garantiaInstalacaoMeses: 12,
  /** Inflação anual usada na projeção de 25 anos */
  inflacaoAnualEconomia: 0.0605,
} as const;

export type InstallationQuoteInput = {
  numero: string;
  data: string;
  clienteNome: string;
  clienteCidade: string;
  clienteTelefone: string;
  /** Valor médio da conta de luz (R$) — driver principal do cálculo */
  valorFatura: string;
  /** Consumo médio em kWh (informativo) */
  consumoKwh: string;
  /**
   * Potência em kWp. Se vazia, usa valor_conta / 130.
   * Editável quando o cliente quiser gerar a mais.
   */
  potenciaKwp: string;
  observacoes: string;
};

export type InstallationQuoteComputed = {
  potenciaKwp: number;
  potenciaSugerida: number;
  potenciaEditada: boolean;
  qtdModulos: number;
  geracaoMensalKwh: number;
  geracaoAnualKwh: number;
  areaM2: number;
  inversorKw: number;
  valorEquipamentos: number;
  valorEngenharia: number;
  valorTotal: number;
  valorParcelaEquipamentos: number;
  economiaMensal: number;
  economiaAnual: number;
  economia25Anos: number;
  paybackAnos: number;
};

export type InstallationQuote = InstallationQuoteInput & {
  validadeDias: number;
  computed: InstallationQuoteComputed | null;
};

export const INITIAL_INSTALLATION_QUOTE: InstallationQuoteInput = {
  numero: "",
  data: "",
  clienteNome: "",
  clienteCidade: "",
  clienteTelefone: "",
  valorFatura: "",
  consumoKwh: "",
  potenciaKwp: "",
  observacoes: "",
};

export function parseMoney(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

export function parseDecimal(value: string): number {
  if (!value.trim()) return 0;
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

export function formatMoneyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return (Number(digits) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatMoneyNumber(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatKwp(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatKwh(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatQuoteDate(now = new Date()) {
  return now.toLocaleDateString("pt-BR");
}

/** Nº no formato da proposta de referência: 13/2026 */
export function generateQuoteNumber(now = new Date()) {
  const y = now.getFullYear();
  const seq = String(now.getDate()).padStart(2, "0");
  return `${seq}/${y}`;
}

/** Potência sugerida: valor_da_conta / 130 */
export function suggestPotenciaKwp(valorFatura: string): number {
  const bill = parseMoney(valorFatura);
  if (bill <= 0) return 0;
  return bill / QUOTE_CALC.kwhPorKwpMes;
}

function pickInversorKw(potenciaKwp: number): number {
  if (potenciaKwp <= 0) return 0;
  const candidates = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 36, 40, 50];
  const target = potenciaKwp * 0.85;
  const found = candidates.find((c) => c >= target - 0.15);
  return found ?? Math.ceil(potenciaKwp);
}

/** Soma futura com correção anual (projeção 25 anos). */
function projectedSavings(annual: number, years: number, rate: number) {
  if (annual <= 0) return 0;
  if (rate <= 0) return annual * years;
  return (annual * (Math.pow(1 + rate, years) - 1)) / rate;
}

export function computeInstallationQuote(
  input: Pick<InstallationQuoteInput, "valorFatura" | "potenciaKwp">,
): InstallationQuoteComputed | null {
  const bill = parseMoney(input.valorFatura);
  if (bill <= 0) return null;

  const potenciaSugerida = bill / QUOTE_CALC.kwhPorKwpMes;
  const potenciaManual = parseDecimal(input.potenciaKwp);
  const potenciaEditada = potenciaManual > 0;
  const potenciaKwp = potenciaEditada ? potenciaManual : potenciaSugerida;

  if (potenciaKwp <= 0) return null;

  const geracaoMensalKwh = potenciaKwp * QUOTE_CALC.kwhPorKwpMes;
  const geracaoAnualKwh = geracaoMensalKwh * 12;

  // No modelo calibrado: 1 kWh ≈ R$ 1 quando o sistema é dimensionado por conta/130,
  // com fator 0,96 de economia efetiva.
  const economiaMensal = geracaoMensalKwh * QUOTE_CALC.economiaFator;
  const economiaAnual = economiaMensal * 12;
  const economia25Anos = projectedSavings(
    economiaAnual,
    25,
    QUOTE_CALC.inflacaoAnualEconomia,
  );

  const valorEquipamentos = potenciaKwp * QUOTE_CALC.precoEquipPorKwp;
  const valorEngenharia = potenciaKwp * QUOTE_CALC.precoEngPorKwp;
  const valorTotal = valorEquipamentos + valorEngenharia;
  const valorParcelaEquipamentos =
    (valorEquipamentos * QUOTE_CALC.fatorParcelamento) /
    QUOTE_CALC.parcelasEquipamentos;

  const qtdModulos = Math.max(
    1,
    Math.round((potenciaKwp * 1000) / QUOTE_CALC.moduloWp),
  );
  const areaM2 = potenciaKwp * QUOTE_CALC.areaM2PorKwp;
  const inversorKw = pickInversorKw(potenciaKwp);
  const paybackAnos =
    economiaAnual > 0 ? valorTotal / economiaAnual : 0;

  return {
    potenciaKwp,
    potenciaSugerida,
    potenciaEditada,
    qtdModulos,
    geracaoMensalKwh,
    geracaoAnualKwh,
    areaM2,
    inversorKw,
    valorEquipamentos,
    valorEngenharia,
    valorTotal,
    valorParcelaEquipamentos,
    economiaMensal,
    economiaAnual,
    economia25Anos,
    paybackAnos,
  };
}

export function buildQuoteForPdf(
  input: InstallationQuoteInput,
): InstallationQuote {
  return {
    ...input,
    validadeDias: QUOTE_CALC.validadeDias,
    computed: computeInstallationQuote(input),
  };
}

export function buildPdfFilename(quote: InstallationQuoteInput) {
  const safe = (s: string) =>
    s
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const num = quote.numero.replace("/", "-") || "rascunho";
  const nome = safe(quote.clienteNome) || "cliente";
  const cidade = safe(quote.clienteCidade) || "PE";

  return `M ${num} - ${nome} - ${cidade} - PE.pdf`;
}

export function formatPaybackLabel(years: number): string {
  if (years <= 0) return "—";
  if (years < 2) return "< 2 anos";
  return `${years.toFixed(1).replace(".", ",")} anos`;
}
