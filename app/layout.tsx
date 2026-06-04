import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LM Energy — Leonardo Mendes | Energia Solar e Soluções Inteligentes",
  description:
    "Especialista em energia solar e soluções inteligentes para redução da conta de luz. Descontos na tarifa sem investimento, projetos, instalação e manutenção de sistemas fotovoltaicos para residências e empresas.",
  keywords: [
    "energia solar",
    "desconto na conta de luz",
    "redução da tarifa de energia",
    "instalação fotovoltaica",
    "manutenção de placas solares",
    "Leonardo Mendes",
    "LM Energy",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
