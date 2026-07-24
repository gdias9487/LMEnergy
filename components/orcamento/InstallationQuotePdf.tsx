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
  QUOTE_EQUIPMENT_OPTIONS,
  formatKwh,
  formatKwp,
  formatMoneyNumber,
  formatPaybackLabel,
  type InstallationQuote,
} from "@/lib/orcamento/installationQuote";

export type PdfTheme = "dark" | "light";

type Palette = {
  page: string;
  card: string;
  /** Fundo secundário (labels de tabela, metric cells). Ligeiramente diferente do card. */
  cardAlt: string;
  text: string;
  textMuted: string;
  line: string;
  /** Título de seção / escopo (no light = petróleo; no dark = amarelo). */
  sectionTitle: string;
  /** Título de seção alternativa (ex.: retorno financeiro). */
  sectionTitleAlt: string;
  /** Amarelo forte para bordas / fills (visual, identidade). */
  energia: string;
  /** Amarelo para números-chave (no light = energia-600). */
  energiaText: string;
  /** Verde forte para bordas / fills. */
  sustentavel: string;
  /** Verde para números-chave (no light = sustentavel-600). */
  sustentavelText: string;
};

const DARK_PALETTE: Palette = {
  page: "#071824",
  card: "#102735",
  cardAlt: "#0a2030",
  text: "#F4F7FA",
  textMuted: "#7E8B96",
  line: "#1d4360",
  sectionTitle: "#F4B223",
  sectionTitleAlt: "#2BB673",
  energia: "#F4B223",
  energiaText: "#F4B223",
  sustentavel: "#2BB673",
  sustentavelText: "#2BB673",
};

/** Alternativa A — papel limpo: gelo + cards brancos + tipografia petróleo. */
const LIGHT_PALETTE: Palette = {
  page: "#F4F7FA", // gelo
  card: "#FFFFFF",
  cardAlt: "#E5EBF1", // gelo-200
  text: "#071824", // petroleo
  textMuted: "#7E8B96", // aco
  line: "#C9D4DE",
  sectionTitle: "#071824", // petroleo — títulos legíveis
  sectionTitleAlt: "#071824",
  energia: "#F4B223", // borda / identidade
  energiaText: "#D6981A", // energia-600 — só números-chave
  sustentavel: "#2BB673", // borda / identidade
  sustentavelText: "#1F9A5E", // sustentavel-600 — só números-chave
};

function getPalette(theme: PdfTheme): Palette {
  return theme === "light" ? LIGHT_PALETTE : DARK_PALETTE;
}

function createStyles(p: Palette) {
  return StyleSheet.create({
    page: {
      backgroundColor: p.page,
      color: p.text,
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
      borderBottomColor: p.line,
    },
    brand: {
      fontSize: 20,
      fontFamily: "Helvetica-Bold",
      color: p.text,
    },
    brandDot: { color: p.energia },
    brandLogo: {
      width: 165,
      height: 36,
      objectFit: "contain",
    },
    brandSub: {
      marginTop: 6,
      fontSize: 8,
      color: p.textMuted,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    meta: { alignItems: "flex-end" },
    metaLabel: {
      fontSize: 8,
      color: p.textMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    metaValue: {
      marginTop: 2,
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      color: p.text,
    },
    title: {
      fontSize: 18,
      fontFamily: "Helvetica-Bold",
      color: p.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 10,
      color: p.textMuted,
      marginBottom: 16,
    },
    section: { marginBottom: 14 },
    sectionTitle: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: p.sectionTitle,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginBottom: 8,
    },
    card: {
      backgroundColor: p.card,
      borderRadius: 10,
      padding: 12,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderTopColor: p.line,
      borderRightColor: p.line,
      borderBottomColor: p.line,
      borderLeftColor: p.line,
    },
    row: { flexDirection: "row", gap: 10 },
    col: { flex: 1 },
    label: {
      fontSize: 8,
      color: p.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    value: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      color: p.text,
      marginBottom: 6,
    },
    highlightRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
    highlight: {
      flex: 1,
      backgroundColor: p.card,
      borderRadius: 10,
      padding: 10,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderTopColor: p.line,
      borderRightColor: p.line,
      borderBottomColor: p.line,
      borderLeftColor: p.line,
    },
    highlightGreen: {
      borderTopColor: p.sustentavel,
      borderRightColor: p.sustentavel,
      borderBottomColor: p.sustentavel,
      borderLeftColor: p.sustentavel,
      backgroundColor: p.card,
    },
    highlightGold: {
      borderTopColor: p.energia,
      borderRightColor: p.energia,
      borderBottomColor: p.energia,
      borderLeftColor: p.energia,
      backgroundColor: p.card,
    },
    highlightLabel: {
      fontSize: 7,
      color: p.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.7,
      marginBottom: 3,
    },
    highlightValue: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      color: p.text,
    },
    green: { color: p.sustentavelText },
    gold: { color: p.energiaText },
    bullet: {
      fontSize: 9.5,
      color: p.text,
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
      backgroundColor: p.card,
      borderRadius: 10,
      padding: 10,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderTopColor: p.line,
      borderRightColor: p.line,
      borderBottomColor: p.line,
      borderLeftColor: p.line,
    },
    scopeItemTitle: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: p.sectionTitle,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 4,
    },
    scopeItemValue: {
      fontSize: 9.5,
      fontFamily: "Helvetica-Bold",
      color: p.text,
      marginBottom: 3,
      lineHeight: 1.35,
    },
    scopeItemOptions: {
      fontSize: 8.5,
      color: p.text,
      lineHeight: 1.35,
      marginBottom: 4,
    },
    scopeItemDesc: {
      fontSize: 8.5,
      color: p.textMuted,
      lineHeight: 1.35,
    },
    metricsRow: {
      flexDirection: "row",
      gap: 8,
    },
    metricCell: {
      flex: 1,
      backgroundColor: p.cardAlt,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderTopColor: p.line,
      borderRightColor: p.line,
      borderBottomColor: p.line,
      borderLeftColor: p.line,
    },
    metricLabel: {
      fontSize: 7,
      color: p.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 3,
    },
    metricValue: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: p.text,
    },
    table: {
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderTopColor: p.line,
      borderRightColor: p.line,
      borderBottomColor: p.line,
      borderLeftColor: p.line,
      borderRadius: 10,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: p.line,
    },
    tableRowLast: { borderBottomWidth: 0 },
    tableCellLabel: {
      width: "48%",
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: p.cardAlt,
      color: p.textMuted,
      fontSize: 9,
    },
    tableCellValue: {
      width: "52%",
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: p.card,
      color: p.text,
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
    },
    tableCellLabelFirst: { borderTopLeftRadius: 9 },
    tableCellValueFirst: { borderTopRightRadius: 9 },
    tableCellLabelLast: { borderBottomLeftRadius: 9 },
    tableCellValueLast: { borderBottomRightRadius: 9 },
    sectionTitleGreen: {
      color: p.sectionTitleAlt,
    },
    footer: {
      position: "absolute",
      left: 40,
      right: 40,
      bottom: 22,
      borderTopWidth: 1,
      borderTopColor: p.line,
      paddingTop: 8,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    footerText: { fontSize: 8, color: p.textMuted },
    disclaimer: {
      marginTop: 10,
      fontSize: 8,
      color: p.textMuted,
      lineHeight: 1.4,
    },
    thanks: {
      marginTop: 18,
      fontSize: 16,
      fontFamily: "Helvetica-Bold",
      color: p.text,
      textAlign: "center",
    },
    contact: {
      marginTop: 6,
      fontSize: 10,
      color: p.textMuted,
      lineHeight: 1.5,
      textAlign: "center",
    },
    imagePageTitle: {
      fontSize: 13,
      fontFamily: "Helvetica-Bold",
      color: p.sectionTitle,
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
}

type Styles = ReturnType<typeof createStyles>;

function Info({
  label,
  value,
  styles,
}: {
  label: string;
  value?: string;
  styles: Styles;
}) {
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
  styles,
}: {
  label: string;
  value?: string;
  last?: boolean;
  first?: boolean;
  valueColor?: string;
  styles: Styles;
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

function BrandBlock({
  subtitle,
  logoSrc,
  styles,
}: {
  subtitle: string;
  logoSrc: string;
  styles: Styles;
}) {
  return (
    <View>
      <Image src={logoSrc} style={styles.brandLogo} />
      <Text style={styles.brandSub}>{subtitle}</Text>
    </View>
  );
}

export function InstallationQuotePdf({
  quote,
  theme = "dark",
  logoSrc,
}: {
  quote: InstallationQuote;
  theme?: PdfTheme;
  /** URL absoluta ou data URL da logo (obrigatório na geração no browser). */
  logoSrc: string;
}) {
  const palette = getPalette(theme);
  const styles = createStyles(palette);

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
      value: `${c.qtdModulos} × ${c.potenciaModuloWp} Wp`,
      options: QUOTE_EQUIPMENT_OPTIONS.modulos.join(" · "),
      warranty: `${QUOTE_CALC.garantiaModulosAnos} anos de garantia de eficiência.`,
    },
    {
      title: "Inversores",
      value: `${c.qtdInversor} × ${c.potenciaInversorKw} kW`,
      options: QUOTE_EQUIPMENT_OPTIONS.inversores.join(" · "),
      warranty: `${QUOTE_CALC.garantiaInversorAnos} anos de garantia do equipamento.`,
    },
    {
      title: "Instalação",
      value: "Montagem completa",
      options: undefined as string | undefined,
      warranty: `Instalação elétrica em pleno funcionamento · garantia de ${QUOTE_CALC.garantiaInstalacaoMeses} meses.`,
    },
    {
      title: "Homologação",
      value: "Registro na Neoenergia",
      options: undefined as string | undefined,
      warranty: "Projeto homologado junto à concessionária ao final da instalação.",
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
          <BrandBlock
            logoSrc={logoSrc}
            subtitle="Proposta comercial · UFV"
            styles={styles}
          />
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
              <Info label="Cliente" value={quote.clienteNome} styles={styles} />
              <Info
                label="Local"
                value={
                  quote.clienteCidade ? `${quote.clienteCidade} – PE` : ""
                }
                styles={styles}
              />
            </View>
            <View style={styles.row}>
              <Info
                label="WhatsApp"
                value={quote.clienteTelefone}
                styles={styles}
              />
              <Info
                label="Valor médio da conta"
                value={quote.valorFatura}
                styles={styles}
              />
            </View>
            <View style={styles.row}>
              <Info
                label="Consumo médio aproximado"
                value={
                  quote.consumoKwh ? `${quote.consumoKwh} kWh` : undefined
                }
                styles={styles}
              />
              <Info
                label="Geração média aproximada"
                value={`${formatKwh(c.geracaoMensalKwh)} kWh`}
                styles={styles}
              />
            </View>
            <View style={styles.row}>
              <Info
                label="Potência da instalação"
                value={potenciaLabel}
                styles={styles}
              />
              <Info
                label="Área ocupada (aprox.)"
                value={`${Math.round(c.areaM2)} m²`}
                styles={styles}
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
                {item.options ? (
                  <Text style={styles.scopeItemOptions}>{item.options}</Text>
                ) : null}
                <Text style={styles.scopeItemDesc}>{item.warranty}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.disclaimer, { marginTop: 2, marginBottom: 8 }]}>
            {QUOTE_EQUIPMENT_OPTIONS.disponibilidadeNote}
          </Text>

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
          <BrandBlock
            logoSrc={logoSrc}
            subtitle="Investimento · Garantias"
            styles={styles}
          />
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
              valueColor={palette.energiaText}
              styles={styles}
            />
            <Row
              label="Engenharia"
              value={formatMoneyNumber(c.valorEngenharia)}
              valueColor={palette.energiaText}
              styles={styles}
            />
            <Row
              label="Total"
              value={formatMoneyNumber(c.valorTotal)}
              valueColor={palette.energiaText}
              last
              styles={styles}
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
              valueColor={palette.sustentavelText}
              styles={styles}
            />
            <Row
              label="Economia média anual"
              value={formatMoneyNumber(c.economiaAnual)}
              valueColor={palette.sustentavelText}
              styles={styles}
            />
            <Row
              label="Economia em 25 anos"
              value={formatMoneyNumber(c.economia25Anos)}
              valueColor={palette.sustentavelText}
              styles={styles}
            />
            <Row
              label="Payback (retorno do investimento)"
              value={formatPaybackLabel(c.paybackAnos)}
              valueColor={palette.sustentavelText}
              last
              styles={styles}
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
              styles={styles}
            />
            <Row
              label="Painéis fotovoltaicos"
              value={`Equipamentos com ${QUOTE_CALC.garantiaModulosAnos} anos de garantia de eficiência`}
              styles={styles}
            />
            <Row
              label="Montagem e instalação"
              value={`${QUOTE_CALC.garantiaInstalacaoMeses} meses — instalação elétrica completa`}
              styles={styles}
            />
            <Row
              label="Registro na concessionária"
              value="Projeto homologado e registrado pela Neoenergia"
              last
              styles={styles}
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
                styles={styles}
              />
              <Info
                label="Neoenergia"
                value={`até ${QUOTE_CALC.prazoNeoenergiaDias} dias`}
                styles={styles}
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
            <BrandBlock
              logoSrc={logoSrc}
              subtitle="Imagens"
              styles={styles}
            />
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
