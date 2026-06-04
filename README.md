# LM Energy — Leonardo Mendes

Site institucional/portfólio de **Leonardo Mendes**, especialista em energia solar.
Divulga os serviços oferecidos: desconto na conta de luz, projeto e instalação
de sistemas fotovoltaicos residenciais e comerciais, montagem, manutenção e
consultoria.

Construído com **Next.js 14 (App Router)**, **React 18**, **Tailwind CSS** e
**Framer Motion**, em tema escuro inspirado em um layout de energia limpa.

## Paleta de cores

| Cor | Uso | HEX |
| --- | --- | --- |
| Azul petróleo escuro | Fundo principal | `#071824` |
| Azul grafite | Seções secundárias | `#102735` |
| Branco gelo | Textos principais | `#F4F7FA` |
| Amarelo energia | CTA / destaque | `#F4B223` |
| Cinza aço | Textos secundários | `#7E8B96` |
| Verde sustentável | Indicadores positivos | `#2BB673` |

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Estrutura

```
app/
  layout.tsx           # Layout raiz + fontes (Inter / Space Grotesk) + metadata
  page.tsx             # Composição da home
  globals.css          # Tokens + classes utilitárias (.btn-primary, .chip, .card)
components/
  Navbar.tsx           # Header fixo com mobile menu
  Hero.tsx             # Hero principal com CTA, prova social e métricas
  HeroIllustration.tsx # Ilustração SVG animada (turbinas + painel solar + casa)
  Stats.tsx            # Faixa de números com contador animado
  Services.tsx         # Grid com os 6 serviços oferecidos
  Projects.tsx         # Cards de casos reais por categoria
  CTA.tsx              # Bloco final de captação de orçamento
  Footer.tsx           # Rodapé com newsletter e redes
lib/
  motion.ts            # Variants reutilizáveis de Framer Motion
```

## Personalização rápida

Onde alterar cada conteúdo:

- **Nome / tagline / WhatsApp do hero**: `components/Hero.tsx`
- **Lista de serviços**: array `services` em `components/Services.tsx`
- **Casos / projetos reais**: array `projects` em `components/Projects.tsx`
- **Números (clientes, kWp, etc.)**: array `items` em `components/Stats.tsx`
- **Links sociais e newsletter**: `components/Footer.tsx`
- **E-mail/WhatsApp do CTA final**: `components/CTA.tsx`
- **Paleta de cores**: `tailwind.config.ts`

### Trocar o número do WhatsApp

Número atual: **+55 81 98168-4949** (`wa.me/5581981684949`).
Para alterar, procurar por `wa.me/5581981684949` em `components/Hero.tsx` e
`components/CTA.tsx` e substituir pelo novo número no formato internacional
(ex.: `wa.me/5541999999999`).

### Trocar o e-mail de contato

Procurar por `contato@lmenergy.com.br` em `components/CTA.tsx`.
# LMEnergy
