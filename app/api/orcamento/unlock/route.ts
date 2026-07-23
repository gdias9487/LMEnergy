import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const expected = process.env.ORCAMENTO_SECRET?.trim();
  if (!expected) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ORCAMENTO_SECRET não configurado no .env.local. Defina uma senha secreta e reinicie o servidor.",
      },
      { status: 500 },
    );
  }

  if (!body.password || body.password !== expected) {
    return NextResponse.json(
      { ok: false, error: "Senha incorreta." },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
