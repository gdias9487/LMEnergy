export type ObjetivoId = "desconto" | "instalacao" | "manutencao" | "indefinido";

export type TipoImovelId =
  | "residencial"
  | "comercial"
  | "industrial"
  | "rural"
  | "condominio";

export type QuoteFormState = {
  objetivo: ObjetivoId;
  tipoImovel: TipoImovelId;
  subtipoImovel: string;
  perfilCliente: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  bairro: string;
  distribuidora: string;
  consumoKwh: string;
  valorFatura: string;
  tipoTarifa: string;
  temTelhado: string;
  areaTelhado: string;
  sombraNoTelhado: string;
  moraDeAluguel: string;
  jaPossuiSolar: string;
  potenciaSistema: string;
  anoInstalacao: string;
  tipoManutencao: string;
  interesseFinanciamento: string;
  observacoes: string;
};

export const INITIAL_QUOTE_FORM: QuoteFormState = {
  objetivo: "desconto",
  tipoImovel: "residencial",
  subtipoImovel: "",
  perfilCliente: "pessoa_fisica",
  nome: "",
  email: "",
  telefone: "",
  cidade: "",
  bairro: "",
  distribuidora: "Neoenergia Pernambuco (Celpe)",
  consumoKwh: "",
  valorFatura: "",
  tipoTarifa: "Convencional",
  temTelhado: "",
  areaTelhado: "",
  sombraNoTelhado: "",
  moraDeAluguel: "",
  jaPossuiSolar: "nao",
  potenciaSistema: "",
  anoInstalacao: "",
  tipoManutencao: "",
  interesseFinanciamento: "",
  observacoes: "",
};

export const CIDADES_PE = [
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

export const OBJETIVOS: { id: ObjetivoId; label: string }[] = [
  { id: "desconto", label: "Economia na conta" },
  { id: "instalacao", label: "Instalar painéis" },
  { id: "manutencao", label: "Manutenção" },
  { id: "indefinido", label: "Não sei ainda" },
];

export const TIPOS_IMOVEL: { id: TipoImovelId; label: string }[] = [
  { id: "residencial", label: "Residência" },
  { id: "comercial", label: "Empresa" },
  { id: "industrial", label: "Industrial" },
  { id: "rural", label: "Rural" },
  { id: "condominio", label: "Condomínio" },
];

export const TIPOS_MANUTENCAO = [
  "Limpeza dos painéis",
  "Queda na geração",
  "Problema no inversor",
  "Inspeção preventiva",
  "Outro",
];

export function getObjetivoLabel(id: ObjetivoId) {
  return OBJETIVOS.find((o) => o.id === id)?.label ?? id;
}

export function getTipoImovelLabel(id: TipoImovelId) {
  return TIPOS_IMOVEL.find((t) => t.id === id)?.label ?? id;
}

export function showBillFields(objetivo: ObjetivoId) {
  return objetivo === "desconto" || objetivo === "instalacao" || objetivo === "indefinido";
}

export function showRoofQuestion(objetivo: ObjetivoId) {
  return objetivo === "instalacao" || objetivo === "indefinido";
}

export function showMaintenanceFields(objetivo: ObjetivoId) {
  return objetivo === "manutencao";
}

export function getFormHeadline(objetivo: ObjetivoId) {
  switch (objetivo) {
    case "desconto":
      return { title: "economia", subtitle: "Leva menos de 1 minuto." };
    case "instalacao":
      return { title: "instalação", subtitle: "Leva menos de 1 minuto." };
    case "manutencao":
      return { title: "manutenção", subtitle: "Leva menos de 1 minuto." };
    default:
      return { title: "orçamento", subtitle: "Leva menos de 1 minuto." };
  }
}

export function toQuotePayload(form: QuoteFormState) {
  return {
    objetivo: getObjetivoLabel(form.objetivo),
    objetivoId: form.objetivo,
    tipoImovel: getTipoImovelLabel(form.tipoImovel),
    tipoImovelId: form.tipoImovel,
    subtipoImovel: form.subtipoImovel || getTipoImovelLabel(form.tipoImovel),
    perfilCliente: form.perfilCliente,
    nome: form.nome,
    email: form.email,
    telefone: form.telefone,
    cidade: form.cidade,
    bairro: form.bairro,
    distribuidora: form.distribuidora,
    consumoKwh: form.consumoKwh,
    valorFatura: form.valorFatura,
    tipoTarifa: form.tipoTarifa,
    temTelhado: form.temTelhado,
    areaTelhado: form.areaTelhado,
    sombraNoTelhado: form.sombraNoTelhado,
    moraDeAluguel: form.moraDeAluguel,
    jaPossuiSolar: form.jaPossuiSolar,
    potenciaSistema: form.potenciaSistema,
    anoInstalacao: form.anoInstalacao,
    tipoManutencao: form.tipoManutencao,
    interesseFinanciamento: form.interesseFinanciamento,
    observacoes: form.observacoes,
  };
}
