import type { Metadata } from "next";
import { OrcamentoGate } from "@/components/orcamento/OrcamentoGate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gerador de orçamento | LM Energy",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function OrcamentoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-petroleo">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-energia/15 blur-3xl" />
      <div className="relative">
        <OrcamentoGate />
      </div>
    </main>
  );
}
