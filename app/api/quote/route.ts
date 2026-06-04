import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type QuotePayload = {
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  bairro?: string;
  tipoImovel?: string;
  distribuidora?: string;
  consumoKwh?: string;
  valorFatura?: string;
  tipoTarifa?: string;
  temTelhado?: string;
  jaPossuiSolar?: string;
  objetivo?: string;
  observacoes?: string;
};

const DESTINO = process.env.EMAIL_TO ?? "msol.leonardo@outlook.com";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value?: string) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 14px;background:#0a2030;color:#7E8B96;font-size:12px;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #16344a;width:42%;">${escapeHtml(
        label,
      )}</td>
      <td style="padding:10px 14px;background:#102735;color:#F4F7FA;font-size:14px;border-bottom:1px solid #16344a;">${escapeHtml(
        value,
      )}</td>
    </tr>`;
}

function buildHtml(data: QuotePayload) {
  return `
  <!doctype html>
  <html lang="pt-BR">
  <body style="margin:0;padding:24px;background:#071824;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:640px;width:100%;background:#102735;border-radius:18px;overflow:hidden;border:1px solid rgba(244,247,250,0.08);">
      <tr>
        <td style="padding:28px 28px 18px;background:linear-gradient(135deg,#0a2030 0%,#102735 60%,#1d4360 100%);">
          <p style="margin:0;color:#F4B223;font-size:12px;letter-spacing:2px;text-transform:uppercase;">LM Energy</p>
          <h1 style="margin:6px 0 0;color:#F4F7FA;font-size:22px;font-weight:700;">Nova solicitação de orçamento</h1>
          <p style="margin:6px 0 0;color:#9aa6b0;font-size:13px;">Enviado pelo formulário do site</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 8px;">
          <h2 style="margin:20px 28px 8px;color:#F4B223;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">Dados pessoais</h2>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            ${row("Nome", data.nome)}
            ${row("E-mail", data.email)}
            ${row("Telefone / WhatsApp", data.telefone)}
          </table>

          <h2 style="margin:24px 28px 8px;color:#F4B223;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">Localização</h2>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            ${row("Cidade", data.cidade ? `${data.cidade} - PE` : undefined)}
            ${row("Bairro", data.bairro)}
          </table>

          <h2 style="margin:24px 28px 8px;color:#F4B223;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">Imóvel & Conta de luz</h2>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            ${row("Tipo de imóvel", data.tipoImovel)}
            ${row("Distribuidora", data.distribuidora)}
            ${row("Consumo médio", data.consumoKwh ? `${data.consumoKwh} kWh/mês` : undefined)}
            ${row("Valor médio da fatura", data.valorFatura)}
            ${row("Tipo de tarifa", data.tipoTarifa)}
            ${row("Telhado / área para placas", data.temTelhado === "sim" ? "Sim" : "Não / Não sei")}
            ${row("Já possui sistema solar", data.jaPossuiSolar === "sim" ? "Sim (precisa de manutenção)" : "Não")}
          </table>

          <h2 style="margin:24px 28px 8px;color:#F4B223;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">Objetivo</h2>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            ${row("Procurando por", data.objetivo)}
          </table>

          ${
            data.observacoes
              ? `<h2 style="margin:24px 28px 8px;color:#F4B223;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">Observações</h2>
                 <div style="margin:0 28px 8px;padding:14px;background:#0a2030;border-radius:12px;color:#F4F7FA;font-size:14px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(
                   data.observacoes,
                 )}</div>`
              : ""
          }

          <div style="margin:24px 28px 6px;padding:14px 18px;background:rgba(43,182,115,0.08);border:1px solid rgba(43,182,115,0.25);border-radius:12px;">
            <p style="margin:0;color:#2BB673;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;">Ação sugerida</p>
            <p style="margin:6px 0 0;color:#F4F7FA;font-size:14px;">Retornar em até 24h com orçamento personalizado.</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 28px;background:#0a2030;color:#7E8B96;font-size:12px;text-align:center;">
          Esta mensagem foi gerada automaticamente pelo site lm.energy
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

function buildText(data: QuotePayload) {
  const lines = [
    "Nova solicitação de orçamento — LM Energy",
    "==========================================",
    "",
    "[ Dados pessoais ]",
    `Nome: ${data.nome ?? "-"}`,
    `E-mail: ${data.email ?? "-"}`,
    `Telefone: ${data.telefone ?? "-"}`,
    "",
    "[ Localização ]",
    `Cidade: ${data.cidade ?? "-"} - PE`,
    `Bairro: ${data.bairro || "-"}`,
    "",
    "[ Imóvel & Conta de luz ]",
    `Tipo de imóvel: ${data.tipoImovel ?? "-"}`,
    `Distribuidora: ${data.distribuidora ?? "-"}`,
    `Consumo médio: ${data.consumoKwh ?? "-"} kWh/mês`,
    `Valor médio da fatura: ${data.valorFatura ?? "-"}`,
    `Tipo de tarifa: ${data.tipoTarifa ?? "-"}`,
    `Telhado/área para placas: ${data.temTelhado === "sim" ? "Sim" : "Não / Não sei"}`,
    `Já possui sistema solar: ${data.jaPossuiSolar === "sim" ? "Sim" : "Não"}`,
    "",
    "[ Objetivo ]",
    data.objetivo ?? "-",
  ];
  if (data.observacoes) {
    lines.push("", "[ Observações ]", data.observacoes);
  }
  return lines.join("\n");
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

  const obrigatorios: (keyof QuotePayload)[] = [
    "nome",
    "email",
    "telefone",
    "cidade",
    "consumoKwh",
    "valorFatura",
  ];
  const faltando = obrigatorios.filter((k) => !payload[k]?.trim());
  if (faltando.length) {
    return NextResponse.json(
      { ok: false, error: `Campos obrigatórios: ${faltando.join(", ")}` },
      { status: 400 },
    );
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Servidor de e-mail não configurado. Defina SMTP_HOST, SMTP_USER e SMTP_PASS no .env.local.",
      },
      { status: 500 },
    );
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? `"LM Energy — Site" <${user}>`,
      to: DESTINO,
      replyTo: payload.email,
      subject: `[Orçamento] ${payload.nome} — ${payload.cidade}/PE`,
      text: buildText(payload),
      html: buildHtml(payload),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Falha ao enviar e-mail:", err);
    return NextResponse.json(
      { ok: false, error: "Não foi possível enviar o e-mail no momento." },
      { status: 500 },
    );
  }
}
