import {
  Document,
  Image,
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
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: colors.line,
    borderRightColor: colors.line,
    borderBottomColor: colors.line,
    borderLeftColor: colors.line,
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
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: colors.line,
    borderRightColor: colors.line,
    borderBottomColor: colors.line,
    borderLeftColor: colors.line,
  },
  highlightGreen: {
    borderTopColor: colors.sustentavel,
    borderRightColor: colors.sustentavel,
    borderBottomColor: colors.sustentavel,
    borderLeftColor: colors.sustentavel,
    backgroundColor: colors.grafite,
  },
  highlightGold: {
    borderTopColor: colors.energia,
    borderRightColor: colors.energia,
    borderBottomColor: colors.energia,
    borderLeftColor: colors.energia,
    backgroundColor: colors.grafite,
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
  scopeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  scopeItem: {
    width: "48.5%",
    backgroundColor: colors.grafite,
    borderRadius: 10,
    padding: 10,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: colors.line,
    borderRightColor: colors.line,
    borderBottomColor: colors.line,
    borderLeftColor: colors.line,
  },
  scopeItemTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.energia,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  scopeItemValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: colors.gelo,
    marginBottom: 3,
  },
  scopeItemDesc: {
    fontSize: 8.5,
    color: colors.aco,
    lineHeight: 1.35,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
  },
  metricCell: {
    flex: 1,
    backgroundColor: "#0a2030",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: colors.line,
    borderRightColor: colors.line,
    borderBottomColor: colors.line,
    borderLeftColor: colors.line,
  },
  metricLabel: {
    fontSize: 7,
    color: colors.aco,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.gelo,
  },
  table: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: colors.line,
    borderRightColor: colors.line,
    borderBottomColor: colors.line,
    borderLeftColor: colors.line,
    borderRadius: 10,
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
  tableCellLabelFirst: { borderTopLeftRadius: 9 },
  tableCellValueFirst: { borderTopRightRadius: 9 },
  tableCellLabelLast: { borderBottomLeftRadius: 9 },
  tableCellValueLast: { borderBottomRightRadius: 9 },
  sectionTitleGreen: {
    color: colors.sustentavel,
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
    textAlign: "center",
  },
  contact: {
    marginTop: 6,
    fontSize: 10,
    color: colors.aco,
    lineHeight: 1.5,
    textAlign: "center",
  },
  imagePageTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: colors.energia,
    textAlign: "center",
    marginBottom: 8,
  },
  imageSlots: {
    flex: 1,
    flexDirection: "column",
    gap: 16,
  },
  imageSlot: {
    flex: 1,
    justifyContent: "flex-start",
  },
  imageWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePhoto: {
    width: "100%",
    maxHeight: 300,
    objectFit: "contain",
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
  first,
  valueColor,
}: {
  label: string;
  value?: string;
  last?: boolean;
  first?: boolean;
  valueColor?: string;
}) {
  if (!value?.trim()) return null;
  return (
    <View style={[styles.tableRow, last ? styles.tableRowLast : {}]}>
      <Text
        style={[
          styles.tableCellLabel,
          first ? styles.tableCellLabelFirst : {},
          last ? styles.tableCellLabelLast : {},
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.tableCellValue,
          first ? styles.tableCellValueFirst : {},
          last ? styles.tableCellValueLast : {},
          valueColor ? { color: valueColor } : {},
        ]}
      >
        {value}
      </Text>
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

  const imagePages = (() => {
    const valid = (quote.imagens ?? []).filter(
      (img) => img.src && img.nome.trim(),
    );
    const pages: (typeof valid)[] = [];
    for (let i = 0; i < valid.length; i += 2) {
      pages.push(valid.slice(i, i + 2));
    }
    return pages;
  })();

  const scopeItems = [
    {
      title: "Módulos",
      value: `${c.qtdModulos} × ${c.moduloLabel}`,
      desc: `Sistema de ${formatKwp(c.potenciaKwp)} kWp com ${QUOTE_CALC.garantiaModulosAnos} anos de garantia de eficiência.`,
    },
    {
      title: "Inversor",
      value: c.inversor,
      desc: `${QUOTE_CALC.garantiaInversorAnos} anos de garantia do equipamento.`,
    },
    {
      title: "Instalação",
      value: "Montagem completa",
      desc: `Instalação elétrica em pleno funcionamento · garantia de ${QUOTE_CALC.garantiaInstalacaoMeses} meses.`,
    },
    {
      title: "Homologação",
      value: "Registro na Neoenergia",
      desc: "Projeto homologado junto à concessionária ao final da instalação.",
    },
  ];

  return (
    <Document
      title={`Proposta — ${quote.clienteNome}`}
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
            <Text style={styles.metaLabel}>Cliente</Text>
            <Text style={styles.metaValue}>{quote.clienteNome || "—"}</Text>
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

          <View style={styles.scopeGrid}>
            {scopeItems.map((item) => (
              <View key={item.title} style={styles.scopeItem}>
                <Text style={styles.scopeItemTitle}>{item.title}</Text>
                <Text style={styles.scopeItemValue}>{item.value}</Text>
                <Text style={styles.scopeItemDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Geração / mês</Text>
              <Text style={styles.metricValue}>
                {formatKwh(c.geracaoMensalKwh)} kWh
              </Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Geração / ano</Text>
              <Text style={styles.metricValue}>
                {formatKwh(c.geracaoAnualKwh)} kWh
              </Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Economia / mês</Text>
              <Text style={[styles.metricValue, styles.green]}>
                {formatMoneyNumber(c.economiaMensal)}
              </Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Economia / ano</Text>
              <Text style={[styles.metricValue, styles.green]}>
                {formatMoneyNumber(c.economiaAnual)}
              </Text>
            </View>
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
            <Text style={styles.metaLabel}>Cliente</Text>
            <Text style={styles.metaValue}>{quote.clienteNome || "—"}</Text>
            <Text style={[styles.metaLabel, { marginTop: 8 }]}>Data</Text>
            <Text style={styles.metaValue}>{quote.data || "—"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investimento</Text>
          <View style={styles.table}>
            <Row
              first
              label="Equipamentos"
              value={`${formatMoneyNumber(c.valorEquipamentos)} ou ${c.qtdParcelas}x de ${formatMoneyNumber(c.valorParcelaEquipamentos)} (cartão)`}
              valueColor={colors.energia}
            />
            <Row
              label="Engenharia"
              value={formatMoneyNumber(c.valorEngenharia)}
              valueColor={colors.energia}
            />
            <Row
              label="Total"
              value={formatMoneyNumber(c.valorTotal)}
              valueColor={colors.energia}
              last
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.sectionTitleGreen]}>
            Retorno financeiro
          </Text>
          <View style={styles.table}>
            <Row
              first
              label="Economia média mensal"
              value={formatMoneyNumber(c.economiaMensal)}
              valueColor={colors.sustentavel}
            />
            <Row
              label="Economia média anual"
              value={formatMoneyNumber(c.economiaAnual)}
              valueColor={colors.sustentavel}
            />
            <Row
              label="Economia em 25 anos"
              value={formatMoneyNumber(c.economia25Anos)}
              valueColor={colors.sustentavel}
            />
            <Row
              label="Payback (retorno do investimento)"
              value={formatPaybackLabel(c.paybackAnos)}
              valueColor={colors.sustentavel}
              last
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Garantias</Text>
          <View style={styles.table}>
            <Row
              first
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
              value="Projeto homologado e registrado pela Neoenergia"
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
                value={`${c.prazoObraDias} dias`}
              />
              <Info
                label="Neoenergia"
                value={`até ${QUOTE_CALC.prazoNeoenergiaDias} dias`}
              />
            </View>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          Esta proposta possui validade de {QUOTE_CALC.validadeDias} dias
          contados a partir da data de entrega. Valores e economia são
          estimativas com base no valor da conta e na potência do sistema,
          sujeitos a visita técnica e homologação na concessionária.
        </Text>

        <Text style={styles.thanks}>Obrigado!</Text>
        <Text style={styles.contact}>
          Alguma dúvida? Entre em contato:{"\n"}
          msol.leonardo@outlook.com{"\n"}
          (81) 98168-4949
        </Text>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            LM Energy · Leonardo Mendes · Pernambuco
          </Text>
        </View>
      </Page>

      {imagePages.map((pair, pageIndex) => (
        <Page key={`imgs-${pageIndex}`} size="A4" style={styles.page}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>
                lm<Text style={styles.brandDot}>.</Text>energy
              </Text>
              <Text style={styles.brandSub}>Imagens</Text>
            </View>
            <View style={styles.meta}>
              <Text style={styles.metaLabel}>Cliente</Text>
              <Text style={styles.metaValue}>
                {quote.clienteNome || "—"}
              </Text>
            </View>
          </View>

          <View style={styles.imageSlots}>
            {pair.map((img) => (
              <View key={img.id} style={styles.imageSlot}>
                <Text style={styles.imagePageTitle}>{img.nome.trim()}</Text>
                <View style={styles.imageWrap}>
                  <Image src={img.src} style={styles.imagePhoto} />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>
              LM Energy · Leonardo Mendes · Pernambuco
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}
