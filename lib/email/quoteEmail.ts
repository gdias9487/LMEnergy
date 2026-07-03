import { buildClientWhatsAppUrl } from "@/lib/contact";
import {
  showBillFields,
  showMaintenanceFields,
  showRoofQuestion,
  type ObjetivoId,
} from "@/lib/quote/formConfig";

export type QuotePayload = {
  objetivo?: string;
  objetivoId?: ObjetivoId | string;
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  tipoImovel?: string;
  consumoKwh?: string;
  valorFatura?: string;
  temTelhado?: string;
  potenciaSistema?: string;
  tipoManutencao?: string;
  observacoes?: string;
};

export type SendQuoteEmailOptions = {
  payload: QuotePayload;
  to?: string;
};

export type SendQuoteEmailResult =
  | { ok: true }
  | { ok: false; error: string };

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getObjetivoId(data: QuotePayload): ObjetivoId | undefined {
  if (data.objetivoId) return data.objetivoId as ObjetivoId;
  if (data.objetivo?.includes("Economia")) return "desconto";
  if (data.objetivo?.includes("Instalar")) return "instalacao";
  if (data.objetivo?.includes("Manutenção")) return "manutencao";
  if (data.objetivo?.includes("Não sei")) return "indefinido";
  return undefined;
}

function labelTelhado(v?: string) {
  if (v === "sim") return "Sim";
  if (v === "nao") return "Não";
  if (!v) return "Não sei";
  return v;
}

function row(label: string, value?: string) {
  if (!value?.trim()) return "";
  return `
    <tr>
      <td style="padding:8px 16px;color:#7E8B96;font-size:13px;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:8px 16px;color:#F4F7FA;font-size:14px;font-weight:500;">${escapeHtml(value)}</td>
    </tr>`;
}

function buildDetailRows(data: QuotePayload) {
  const objetivoId = getObjetivoId(data);
  const rows: string[] = [
    row("Objetivo", data.objetivo),
    row("Imóvel", data.tipoImovel),
    row("Cidade", data.cidade ? `${data.cidade} — PE` : undefined),
  ];

  if (objetivoId && showBillFields(objetivoId)) {
    rows.push(
      row("Consumo", data.consumoKwh ? `${data.consumoKwh} kWh/mês` : undefined),
      row("Fatura", data.valorFatura),
    );
  }

  if (objetivoId && showRoofQuestion(objetivoId)) {
    rows.push(row("Telhado / área", labelTelhado(data.temTelhado)));
  }

  if (objetivoId && showMaintenanceFields(objetivoId)) {
    rows.push(
      row("Serviço", data.tipoManutencao),
      row("Potência", data.potenciaSistema ? `${data.potenciaSistema} kWp` : undefined),
    );
  }

  if (data.email?.trim()) {
    rows.push(row("E-mail", data.email));
  }

  return rows.filter(Boolean).join("");
}

function whatsAppBlock(data: QuotePayload) {
  const waUrl = buildClientWhatsAppUrl(data.telefone ?? "", data.nome);
  if (!waUrl) return "";

  const firstName = data.nome?.split(" ")[0] ?? "cliente";

  return `
    <div style="padding:20px 16px;text-align:center;border-top:1px solid #16344a;">
      <a href="${escapeHtml(waUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 24px;background:#25D366;color:#ffffff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:700;">
        Chamar ${escapeHtml(firstName)} no WhatsApp
      </a>
      <p style="margin:8px 0 0;color:#7E8B96;font-size:12px;">${escapeHtml(data.telefone ?? "")}</p>
    </div>`;
}

export function buildQuoteEmailHtml(data: QuotePayload) {
  const detailRows = buildDetailRows(data);

  return `
  <!doctype html>
  <html lang="pt-BR">
  <body style="margin:0;padding:20px;background:#071824;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:520px;width:100%;background:#102735;border-radius:16px;overflow:hidden;border:1px solid rgba(244,247,250,0.08);">
      <tr>
        <td style="padding:20px 16px 16px;background:linear-gradient(135deg,#0a2030,#1d4360);">
          <p style="margin:0;color:#F4B223;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;">LM Energy</p>
          <h1 style="margin:4px 0 0;color:#F4F7FA;font-size:20px;font-weight:700;">Novo orçamento</h1>
          <p style="margin:6px 0 0;color:#9aa6b0;font-size:14px;">
            <strong style="color:#F4F7FA;">${escapeHtml(data.nome ?? "Cliente")}</strong>
            ${data.cidade ? ` · ${escapeHtml(data.cidade)}/PE` : ""}
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:4px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            ${detailRows}
          </table>
          ${
            data.observacoes?.trim()
              ? `<div style="margin:12px 16px 4px;padding:12px 14px;background:#0a2030;border-radius:10px;border-left:3px solid #F4B223;">
                   <p style="margin:0 0 4px;color:#7E8B96;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Observações</p>
                   <p style="margin:0;color:#F4F7FA;font-size:14px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(data.observacoes)}</p>
                 </div>`
              : ""
          }
          ${whatsAppBlock(data)}
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px;background:#0a2030;color:#7E8B96;font-size:11px;text-align:center;">
          Formulário do site · Retornar em até 24h
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

export function buildQuoteEmailText(data: QuotePayload) {
  const objetivoId = getObjetivoId(data);
  const waUrl = buildClientWhatsAppUrl(data.telefone ?? "", data.nome);

  const lines = [
    `LM Energy — Novo orçamento: ${data.nome ?? "-"}`,
    "",
    `Objetivo: ${data.objetivo ?? "-"}`,
    `Imóvel: ${data.tipoImovel ?? "-"}`,
    `Cidade: ${data.cidade ?? "-"} — PE`,
    `WhatsApp: ${data.telefone ?? "-"}`,
  ];

  if (data.email?.trim()) lines.push(`E-mail: ${data.email}`);

  if (objetivoId && showBillFields(objetivoId)) {
    lines.push(
      `Consumo: ${data.consumoKwh ? `${data.consumoKwh} kWh/mês` : "-"}`,
      `Fatura: ${data.valorFatura ?? "-"}`,
    );
  }

  if (objetivoId && showRoofQuestion(objetivoId)) {
    lines.push(`Telhado/área: ${labelTelhado(data.temTelhado)}`);
  }

  if (objetivoId && showMaintenanceFields(objetivoId)) {
    lines.push(
      `Serviço: ${data.tipoManutencao ?? "-"}`,
      `Potência: ${data.potenciaSistema ? `${data.potenciaSistema} kWp` : "-"}`,
    );
  }

  if (data.observacoes?.trim()) {
    lines.push("", "Observações:", data.observacoes);
  }

  if (waUrl) lines.push("", `WhatsApp: ${waUrl}`);

  return lines.join("\n");
}

export async function sendQuoteEmail({
  payload,
  to,
}: SendQuoteEmailOptions): Promise<SendQuoteEmailResult> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return {
      ok: false,
      error:
        "Servidor de e-mail não configurado. Defina SMTP_HOST, SMTP_USER e SMTP_PASS no .env.local.",
    };
  }

  const nodemailer = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const destination =
    to ?? process.env.EMAIL_TO ?? "msol.leonardo@outlook.com";
  const smtpPass = pass.replace(/\s+/g, "");

  const transporter = nodemailer.default.createTransport({
    host,
    port,
    secure,
    auth: { user, pass: smtpPass },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? `"LM Energy — Site" <${user}>`,
      to: destination,
      ...(payload.email?.trim() ? { replyTo: payload.email } : {}),
      subject: `LM Energy - Solicitação de novo orçamento — ${payload.nome}`,
      text: buildQuoteEmailText(payload),
      html: buildQuoteEmailHtml(payload),
    });

    return { ok: true };
  } catch (err) {
    console.error("Falha ao enviar e-mail:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível enviar o e-mail no momento.";

    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "EAUTH"
    ) {
      return {
        ok: false,
        error: `Autenticação SMTP recusada pelo Gmail (${message}). Verifique: (1) verificação em 2 etapas ativa em ${user}; (2) senha de app nova em https://myaccount.google.com/apppasswords; (3) SMTP_USER igual ao e-mail que gerou a senha; (4) use a senha de app, não a senha normal da conta.`,
      };
    }

    return { ok: false, error: message };
  }
}
