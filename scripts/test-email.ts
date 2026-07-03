/**
 * Script de teste de envio de e-mail do formulário de orçamento.
 *
 * 1. Copie .env.local.example para .env.local
 * 2. Preencha SMTP_HOST, SMTP_USER e SMTP_PASS
 * 3. Rode: npm run test:email
 *
 * Destino padrão deste teste: gdias9487@gmail.com
 * (pode sobrescrever com EMAIL_TO=... npm run test:email)
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { sendQuoteEmail } from "../lib/email/quoteEmail";
import { INITIAL_QUOTE_FORM, toQuotePayload } from "../lib/quote/formConfig";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function printSmtpDiagnostics() {
  const user = process.env.SMTP_USER ?? "(não definido)";
  const host = process.env.SMTP_HOST ?? "(não definido)";
  const pass = process.env.SMTP_PASS ?? "";
  const passOk = pass.replace(/\s+/g, "").length === 16;

  console.log("Diagnóstico SMTP:");
  console.log(`  Host: ${host}`);
  console.log(`  Usuário: ${user}`);
  console.log(
    `  Senha de app: ${pass ? (passOk ? "16 caracteres (formato OK)" : `${pass.replace(/\s+/g, "").length} caracteres (esperado: 16)`) : "não definida"}`,
  );
}

const TEST_PAYLOAD = toQuotePayload({
  ...INITIAL_QUOTE_FORM,
  objetivo: "desconto",
  tipoImovel: "residencial",
  subtipoImovel: "Casa",
  perfilCliente: "pessoa_fisica",
  nome: "Gabriel Dias (teste)",
  email: "gdias9487@gmail.com",
  telefone: "(81) 98168-4949",
  cidade: "Recife",
  bairro: "Boa Viagem",
  consumoKwh: "350",
  valorFatura: "R$ 420,00",
  moraDeAluguel: "nao",
  observacoes: "E-mail de teste enviado pelo script npm run test:email",
});

async function main() {
  loadEnvLocal();
  printSmtpDiagnostics();

  const destination = process.env.EMAIL_TO ?? "gdias9487@gmail.com";

  console.log(`Enviando e-mail de teste para: ${destination}`);

  const result = await sendQuoteEmail({
    payload: TEST_PAYLOAD,
    to: destination,
  });

  if (!result.ok) {
    console.error("\nFalha:", result.error);
    process.exit(1);
  }

  console.log("\nE-mail enviado com sucesso!");
}

main().catch((err) => {
  console.error("Erro inesperado:", err);
  process.exit(1);
});
