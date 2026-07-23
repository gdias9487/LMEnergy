import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  QUOTE_CALC,
  formatKwh,
  formatKwp,
  formatMoneyNumber,
  formatPaybackLabel,
  type InstallationQuote,
} from "@/lib/orcamento/installationQuote";

const colors = {
  petroleo: "#071824",
  grafite: "#102735",
  gelo: "#F4F7FA",
  energia: "#F4B223",
  sustentavel: "#2BB673",
  aco: "#7E8B96",
  line: "#1d4360",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.petroleo,
    color: colors.gelo,
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  brand: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: colors.gelo,
  },
  brandDot: { color: colors.energia },
  brandSub: {
    marginTop: 3,
    fontSize: 8,
    color: colors.aco,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  meta: { alignItems: "flex-end" },
  metaLabel: {
    fontSize: 8,
    color: colors.aco,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metaValue: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: colors.gelo,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: colors.gelo,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: colors.aco,
    marginBottom: 16,
  },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.energia,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.grafite,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  row: { flexDirection: "row", gap: 10 },
  col: { flex: 1 },
  label: {
    fontSize: 8,
    color: colors.aco,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: colors.gelo,
    marginBottom: 6,
  },
  highlightRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  highlight: {
    flex: 1,
    backgroundColor: colors.grafite,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.line,
  },
  highlightGreen: {
    borderColor: "rgba(43,182,115,0.45)",
    backgroundColor: "#0d2a22",
  },
  highlightGold: {
    borderColor: "rgba(244,178,35,0.45)",
    backgroundColor: "#2a2210",
  },
  highlightLabel: {
    fontSize: 7,
    color: colors.aco,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 3,
  },
  highlightValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.gelo,
  },
  green: { color: colors.sustentavel },
  gold: { color: colors.energia },
  bullet: {
    fontSize: 9.5,
    color: colors.gelo,
    lineHeight: 1.45,
    marginBottom: 4,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tableRowLast: { borderBottomWidth: 0 },
  tableCellLabel: {
    width: "48%",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#0a2030",
    color: colors.aco,
    fontSize: 9,
  },
  tableCellValue: {
    width: "52%",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.grafite,
    color: colors.gelo,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    left: 40,
    right: 40,
    bottom: 22,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 8, color: colors.aco },
  disclaimer: {
    marginTop: 10,
    fontSize: 8,
    color: colors.aco,
    lineHeight: 1.4,
  },
  thanks: {
    marginTop: 18,
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: colors.gelo,
  },
  contact: {
    marginTop: 6,
    fontSize: 10,
    color: colors.aco,
    lineHeight: 1.5,
  },
});

function Info({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <View style={styles.col}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function Row({
  label,
  value,
  last,
}: {
  label: string;
  value?: string;
  last?: boolean;
}) {
  if (!value?.trim()) return null;
  return (
    <View style={[styles.tableRow, last ? styles.tableRowLast : {}]}>
      <Text style={styles.tableCellLabel}>{label}</Text>
      <Text style={styles.tableCellValue}>{value}</Text>
    </View>
  );
}

export function InstallationQuotePdf({ quote }: { quote: InstallationQuote }) {
  const c = quote.computed;
  if (!c) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Preencha o valor da conta para gerar a proposta.</Text>
        </Page>
      </Document>
    );
  }

  const potenciaLabel = `${formatKwp(c.potenciaKwp)} kWp`;
  const escopo = [
    `Realizar a Instalação Fotovoltaica de um sistema de ${formatKwp(c.potenciaKwp)} kWp (${c.qtdModulos} módulos Canadian ${QUOTE_CALC.moduloWp} Wp) com ${QUOTE_CALC.garantiaModulosAnos} anos de garantia.`,
    `Inversor solar fotovoltaico 1x Huawei ${c.inversorKw} kW AFCI (${QUOTE_CALC.garantiaInversorAnos} anos de garantia).`,
    `Instalação com garantia de ${QUOTE_CALC.garantiaInstalacaoMeses} meses.`,
    "Homologar o projeto junto à concessionária de energia ao final da instalação.",
  ];

  return (
    <Document
      title={`Proposta ${quote.numero} — ${quote.clienteNome}`}
      author="LM Energy"
      subject={`Proposta comercial ${potenciaLabel}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              lm<Text style={styles.brandDot}>.</Text>energy
            </Text>
            <Text style={styles.brandSub}>Proposta comercial · UFV</Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.metaLabel}>Proposta nº</Text>
            <Text style={styles.metaValue}>{quote.numero || "—"}</Text>
            <Text style={[styles.metaLabel, { marginTop: 8 }]}>Data</Text>
            <Text style={styles.metaValue}>{quote.data || "—"}</Text>
            <Text style={[styles.metaLabel, { marginTop: 8 }]}>Validade</Text>
            <Text style={styles.metaValue}>
              {QUOTE_CALC.validadeDias} dias
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Proposta comercial {potenciaLabel}</Text>
        <Text style={styles.subtitle}>
          Instalação de sistema fotovoltaico · Leonardo Mendes
        </Text>

        <View style={styles.highlightRow}>
          <View style={[styles.highlight, styles.highlightGold]}>
            <Text style={styles.highlightLabel}>Investimento total</Text>
            <Text style={[styles.highlightValue, styles.gold]}>
              {formatMoneyNumber(c.valorTotal)}
            </Text>
          </View>
          <View style={[styles.highlight, styles.highlightGreen]}>
            <Text style={styles.highlightLabel}>Economia / mês</Text>
            <Text style={[styles.highlightValue, styles.green]}>
              {formatMoneyNumber(c.economiaMensal)}
            </Text>
          </View>
          <View style={styles.highlight}>
            <Text style={styles.highlightLabel}>Payback</Text>
            <Text style={styles.highlightValue}>
              {formatPaybackLabel(c.paybackAnos)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados da proposta</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Info label="Cliente" value={quote.clienteNome} />
              <Info
                label="Local"
                value={
                  quote.clienteCidade ? `${quote.clienteCidade} – PE` : ""
                }
              />
            </View>
            <View style={styles.row}>
              <Info label="WhatsApp" value={quote.clienteTelefone} />
              <Info label="Valor médio da conta" value={quote.valorFatura} />
            </View>
            <View style={styles.row}>
              <Info
                label="Consumo médio aproximado"
                value={
                  quote.consumoKwh ? `${quote.consumoKwh} kWh` : undefined
                }
              />
              <Info
                label="Geração média aproximada"
                value={`${formatKwh(c.geracaoMensalKwh)} kWh`}
              />
            </View>
            <View style={styles.row}>
              <Info label="Potência da instalação" value={potenciaLabel} />
              <Info
                label="Área ocupada (aprox.)"
                value={`${Math.round(c.areaM2)} m²`}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escopo do projeto</Text>
          <View style={styles.card}>
            {escopo.map((line) => (
              <Text key={line} style={styles.bullet}>
                • {line}
              </Text>
            ))}
            <Text style={styles.bullet}>
              • Geração estimada de {formatKwh(c.geracaoMensalKwh)} kWh/mês
            </Text>
            <Text style={styles.bullet}>
              • Geração estimada de {formatKwh(c.geracaoAnualKwh)} kWh/ano
            </Text>
            <Text style={styles.bullet}>
              • Economia média mensal de {formatMoneyNumber(c.economiaMensal)}
            </Text>
            <Text style={styles.bullet}>
              • Economia média anual de {formatMoneyNumber(c.economiaAnual)}
            </Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              lm<Text style={styles.brandDot}>.</Text>energy
            </Text>
            <Text style={styles.brandSub}>Investimento · Garantias</Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.metaLabel}>Proposta nº</Text>
            <Text style={styles.metaValue}>{quote.numero || "—"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investimento</Text>
          <View style={styles.table}>
            <Row
              label="Equipamentos"
              value={`${formatMoneyNumber(c.valorEquipamentos)} ou ${QUOTE_CALC.parcelasEquipamentos}x de ${formatMoneyNumber(c.valorParcelaEquipamentos)} (cartão)`}
            />
            <Row
              label="Engenharia"
              value={formatMoneyNumber(c.valorEngenharia)}
            />
            <Row
              label="Total"
              value={formatMoneyNumber(c.valorTotal)}
              last
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Retorno financeiro</Text>
          <View style={styles.table}>
            <Row
              label="Economia média mensal"
              value={formatMoneyNumber(c.economiaMensal)}
            />
            <Row
              label="Economia média anual"
              value={formatMoneyNumber(c.economiaAnual)}
            />
            <Row
              label="Economia em 25 anos"
              value={formatMoneyNumber(c.economia25Anos)}
            />
            <Row
              label="Payback (retorno do investimento)"
              value={formatPaybackLabel(c.paybackAnos)}
              last
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Garantias</Text>
          <View style={styles.table}>
            <Row
              label="Inversor solar fotovoltaico"
              value={`Equipamento com ${QUOTE_CALC.garantiaInversorAnos} anos de garantia`}
            />
            <Row
              label="Painéis fotovoltaicos"
              value={`Equipamentos com ${QUOTE_CALC.garantiaModulosAnos} anos de garantia de eficiência`}
            />
            <Row
              label="Montagem e instalação"
              value={`${QUOTE_CALC.garantiaInstalacaoMeses} meses — instalação elétrica completa`}
            />
            <Row
              label="Registro na concessionária"
              value="Projeto homologado e registrado pela Celpe"
              last
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prazos</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Info
                label="Instalação"
                value={`${QUOTE_CALC.prazoInstalacaoDias} dias`}
              />
              <Info
                label="Celpe"
                value={`até ${QUOTE_CALC.prazoCelpeDias} dias`}
              />
            </View>
          </View>
        </View>

        {quote.observacoes?.trim() ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <View style={styles.card}>
              <Text style={styles.bullet}>{quote.observacoes.trim()}</Text>
            </View>
          </View>
        ) : null}

        <Text style={styles.disclaimer}>
          Esta proposta possui validade de {QUOTE_CALC.validadeDias} dias
          contados a partir da data de entrega. Valores e economia são
          estimativas com base no valor da conta e na potência do sistema,
          sujeitos a visita técnica e homologação na concessionária.
        </Text>

        <Text style={styles.thanks}>Obrigado</Text>
        <Text style={styles.contact}>
          Alguma dúvida?{"\n"}
          msol.leonardo@outlook.com{"\n"}
          CEO Leonardo: (81) 98168-4949{"\n"}
          IG: lmenergy_of
        </Text>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            LM Energy · Leonardo Mendes · Pernambuco
          </Text>
          <Text style={styles.footerText}>WhatsApp (81) 98168-4949</Text>
        </View>
      </Page>
    </Document>
  );
}
