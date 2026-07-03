import { NextResponse } from "next/server";
import { sendQuoteEmail, type QuotePayload } from "@/lib/email/quoteEmail";

export const runtime = "nodejs";

function validatePayload(payload: QuotePayload): string | null {
  if (!payload.nome?.trim() || !payload.telefone?.trim() || !payload.cidade?.trim()) {
    return "Informe nome, WhatsApp e cidade.";
  }

  const objetivo = payload.objetivoId ?? payload.objetivo;

  if (
    objetivo === "desconto" ||
    objetivo === "instalacao" ||
    objetivo === "indefinido" ||
    payload.objetivo?.includes("Economia") ||
    payload.objetivo?.includes("Instalar") ||
    payload.objetivo?.includes("Não sei")
  ) {
    if (!payload.consumoKwh?.trim() || !payload.valorFatura?.trim()) {
      return "Informe consumo e valor da fatura.";
    }
  }

  if (objetivo === "manutencao" || payload.objetivo?.includes("Manutenção")) {
    if (!payload.tipoManutencao?.trim()) {
      return "Informe o tipo de manutenção.";
    }
  }

  return null;
}

export async function POST(request: Request) {
  let payload: QuotePayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Payload inválido" },
      { status: 400 },
    );
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return NextResponse.json(
      { ok: false, error: validationError },
      { status: 400 },
    );
  }

  const result = await sendQuoteEmail({ payload });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
