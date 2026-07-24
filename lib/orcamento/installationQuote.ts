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
  /** Área de uma placa em m² (para cálculo de área do telhado) */
  moduloAreaM2: 2.88,
  /** Parcelas no cartão para equipamentos */
  parcelasEquipamentos: 21,
  /** Markup total do parcelamento (ex.: 21x eleva o valor ~16,6%) */
  fatorParcelamento: 1.16614,
  validadeDias: 7,
  prazoInstalacaoDias: 7,
  prazoNeoenergiaDias: 90,
  garantiaModulosAnos: 25,
  garantiaInversorAnos: 10,
  garantiaInstalacaoMeses: 12,
  /** Inflação anual usada na projeção de 25 anos */
  inflacaoAnualEconomia: 0.0605,
} as const;

export type QuoteImage = {
  id: string;
  /** Nome / legenda da imagem */
  nome: string;
  /** Data URL (base64) da imagem */
  src: string;
};

export type InstallationQuoteInput = {
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
  /** Override: quantidade de módulos (vazio = automático) */
  qtdModulos: string;
  /** Override: nome/modelo do módulo (vazio = automático) */
  nomeModulo: string;
  /** Override: potência do módulo em Wp (vazio = automático) */
  potenciaModulo: string;
  /** Override: quantidade de inversores (vazio = 1) */
  qtdInversor: string;
  /** Override: nome/modelo do inversor (vazio = automático) */
  nomeInversor: string;
  /** Override: potência do inversor em kW (vazio = automático) */
  potenciaInversor: string;
  /** Override: valor dos equipamentos (vazio = automático) */
  valorEquipamentos: string;
  /** Override: valor de engenharia (vazio = automático) */
  valorEngenharia: string;
  /** Override: prazo de obra em dias (vazio = padrão) */
  prazoObra: string;
  /** Override: quantidade de parcelas do equipamento (vazio = padrão) */
  qtdParcelas: string;
  /** Fotos opcionais — duas por página no PDF */
  imagens: QuoteImage[];
};

export type InstallationQuoteComputed = {
  potenciaKwp: number;
  potenciaSugerida: number;
  potenciaEditada: boolean;
  qtdModulos: number;
  qtdModulosSugerida: number;
  nomeModulo: string;
  nomeModuloSugerido: string;
  potenciaModuloWp: number;
  potenciaModuloSugerida: number;
  /** Rótulo completo do módulo — ex.: Canadian 620 Wp */
  moduloLabel: string;
  qtdInversor: number;
  nomeInversor: string;
  nomeInversorSugerido: string;
  potenciaInversorKw: number;
  potenciaInversorSugerida: number;
  /** Rótulo completo do inversor — ex.: 1× Huawei AFCI 4 kW */
  inversor: string;
  geracaoMensalKwh: number;
  geracaoAnualKwh: number;
  areaM2: number;
  valorEquipamentos: number;
  valorEquipamentosSugerido: number;
  valorEngenharia: number;
  valorEngenhariaSugerido: number;
  valorTotal: number;
  qtdParcelas: number;
  valorParcelaEquipamentos: number;
  prazoObraDias: number;
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
  data: "",
  clienteNome: "",
  clienteCidade: "",
  clienteTelefone: "",
  valorFatura: "",
  consumoKwh: "",
  potenciaKwp: "",
  qtdModulos: "",
  nomeModulo: "",
  potenciaModulo: "",
  qtdInversor: "",
  nomeInversor: "",
  potenciaInversor: "",
  valorEquipamentos: "",
  valorEngenharia: "",
  prazoObra: "",
  qtdParcelas: "",
  imagens: [],
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

/** Potência sugerida: valor_da_conta / 130 */
export function suggestPotenciaKwp(valorFatura: string): number {
  const bill = parseMoney(valorFatura);
  if (bill <= 0) return 0;
  return bill / QUOTE_CALC.kwhPorKwpMes;
}

export function suggestQtdModulos(
  potenciaKwp: number,
  moduloWp: number = QUOTE_CALC.moduloWp,
): number {
  if (potenciaKwp <= 0 || moduloWp <= 0) return 0;
  return Math.max(1, Math.round((potenciaKwp * 1000) / moduloWp));
}

export function suggestNomeModulo(): string {
  return "Canadian";
}

export function suggestPotenciaModuloWp(): number {
  return QUOTE_CALC.moduloWp;
}

export function suggestInversorKw(potenciaKwp: number): number {
  if (potenciaKwp <= 0) return 0;
  const candidates = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 36, 40, 50];
  const target = potenciaKwp * 0.85;
  const found = candidates.find((kw) => kw >= target - 0.15);
  return found ?? Math.ceil(potenciaKwp);
}

export function suggestNomeInversor(): string {
  return "Huawei AFCI";
}

/** Marcas genéricas exibidas na proposta (sem modelo fixo). */
export const QUOTE_EQUIPMENT_OPTIONS = {
  modulos: ["Gokin", "DAH", "Trina", "DMEG", "Canadian"] as const,
  inversores: [
    "Solis",
    "Sungrow",
    "Livoltek",
    "Canadian",
    "Huawei",
    "Solplanet",
  ] as const,
  disponibilidadeNote:
    "Os módulos e inversores disponíveis dependerão da disponibilidade dos fornecedores.",
} as const;

export function suggestEquipamentos(potenciaKwp: number): number {
  return potenciaKwp > 0 ? potenciaKwp * QUOTE_CALC.precoEquipPorKwp : 0;
}

export function suggestEngenharia(potenciaKwp: number): number {
  return potenciaKwp > 0 ? potenciaKwp * QUOTE_CALC.precoEngPorKwp : 0;
}

/**
 * Área aproximada = (m² da placa × qtd de placas) + 30%
 */
export function calcAreaM2(qtdModulos: number): number {
  if (qtdModulos <= 0) return 0;
  const base = QUOTE_CALC.moduloAreaM2 * qtdModulos;
  return base * 1.3;
}

/** Soma futura com correção anual (projeção 25 anos). */
function projectedSavings(annual: number, years: number, rate: number) {
  if (annual <= 0) return 0;
  if (rate <= 0) return annual * years;
  return (annual * (Math.pow(1 + rate, years) - 1)) / rate;
}

export function resolvePotenciaKwp(input: InstallationQuoteInput): number {
  const bill = parseMoney(input.valorFatura);
  const potenciaSugerida = bill > 0 ? bill / QUOTE_CALC.kwhPorKwpMes : 0;
  const potenciaManual = parseDecimal(input.potenciaKwp);
  return potenciaManual > 0 ? potenciaManual : potenciaSugerida;
}

export function computeInstallationQuote(
  input: InstallationQuoteInput,
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

  const economiaMensal = geracaoMensalKwh * QUOTE_CALC.economiaFator;
  const economiaAnual = economiaMensal * 12;
  const economia25Anos = projectedSavings(
    economiaAnual,
    25,
    QUOTE_CALC.inflacaoAnualEconomia,
  );

  const nomeModuloSugerido = suggestNomeModulo();
  const nomeModulo = input.nomeModulo.trim() || nomeModuloSugerido;

  const potenciaModuloSugerida = suggestPotenciaModuloWp();
  const potenciaModuloManual = Number(
    input.potenciaModulo.replace(/\D/g, ""),
  );
  const potenciaModuloWp =
    potenciaModuloManual > 0 ? potenciaModuloManual : potenciaModuloSugerida;
  const moduloLabel = `${nomeModulo} ${potenciaModuloWp} Wp`;

  const qtdModulosSugerida = suggestQtdModulos(potenciaKwp, potenciaModuloWp);
  const qtdModulosManual = Number(input.qtdModulos.replace(/\D/g, ""));
  const qtdModulos =
    qtdModulosManual > 0 ? qtdModulosManual : qtdModulosSugerida;

  const qtdInversorManual = Number(input.qtdInversor.replace(/\D/g, ""));
  const qtdInversor = qtdInversorManual > 0 ? qtdInversorManual : 1;

  const nomeInversorSugerido = suggestNomeInversor();
  const nomeInversor = input.nomeInversor.trim() || nomeInversorSugerido;

  const potenciaInversorSugerida = suggestInversorKw(potenciaKwp);
  const potenciaInversorManual = parseDecimal(input.potenciaInversor);
  const potenciaInversorKw =
    potenciaInversorManual > 0
      ? potenciaInversorManual
      : potenciaInversorSugerida;
  const inversor = `${qtdInversor}× ${nomeInversor} ${potenciaInversorKw} kW`;

  const valorEquipamentosSugerido = suggestEquipamentos(potenciaKwp);
  const valorEngenhariaSugerido = suggestEngenharia(potenciaKwp);
  const valorEquipamentos =
    parseMoney(input.valorEquipamentos) > 0
      ? parseMoney(input.valorEquipamentos)
      : valorEquipamentosSugerido;
  const valorEngenharia =
    parseMoney(input.valorEngenharia) > 0
      ? parseMoney(input.valorEngenharia)
      : valorEngenhariaSugerido;

  const valorTotal = valorEquipamentos + valorEngenharia;

  const qtdParcelasManual = Number(input.qtdParcelas.replace(/\D/g, ""));
  const qtdParcelas =
    qtdParcelasManual > 0
      ? qtdParcelasManual
      : QUOTE_CALC.parcelasEquipamentos;

  const valorParcelaEquipamentos =
    (valorEquipamentos * QUOTE_CALC.fatorParcelamento) / qtdParcelas;

  const prazoObraManual = Number(input.prazoObra.replace(/\D/g, ""));
  const prazoObraDias =
    prazoObraManual > 0
      ? prazoObraManual
      : QUOTE_CALC.prazoInstalacaoDias;

  const areaM2 = calcAreaM2(qtdModulos);
  const paybackAnos = economiaAnual > 0 ? valorTotal / economiaAnual : 0;

  return {
    potenciaKwp,
    potenciaSugerida,
    potenciaEditada,
    qtdModulos,
    qtdModulosSugerida,
    nomeModulo,
    nomeModuloSugerido,
    potenciaModuloWp,
    potenciaModuloSugerida,
    moduloLabel,
    qtdInversor,
    nomeInversor,
    nomeInversorSugerido,
    potenciaInversorKw,
    potenciaInversorSugerida,
    inversor,
    geracaoMensalKwh,
    geracaoAnualKwh,
    areaM2,
    valorEquipamentos,
    valorEquipamentosSugerido,
    valorEngenharia,
    valorEngenhariaSugerido,
    valorTotal,
    qtdParcelas,
    valorParcelaEquipamentos,
    prazoObraDias,
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

  const nome = safe(quote.clienteNome) || "cliente";
  const cidade = safe(quote.clienteCidade) || "PE";
  const data = safe(quote.data) || "rascunho";

  return `${nome} - ${cidade} - PE - ${data}.pdf`;
}

export function formatPaybackLabel(years: number): string {
  if (years <= 0) return "—";
  if (years < 2) return "< 2 anos";
  return `${years.toFixed(1).replace(".", ",")} anos`;
}
