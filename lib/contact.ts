export const WHATSAPP_NUMBER = "5581981684949";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá, gostaria de mais informações sobre os serviços da LM Energy!";

export function buildWhatsAppUrl(
  phone: string = WHATSAPP_NUMBER,
  message: string = WHATSAPP_DEFAULT_MESSAGE,
) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Converte telefone BR do formulário para formato wa.me (ex.: 5581981684949). */
export function normalizeBrazilWhatsAppNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (digits.length === 10 || digits.length === 11) {
    digits = `55${digits}`;
  }

  return digits;
}

export function buildClientWhatsAppUrl(
  phone: string,
  clientName?: string,
) {
  const number = normalizeBrazilWhatsAppNumber(phone);
  if (!number) return "";

  const greeting = clientName?.trim()
    ? `Olá ${clientName.trim()}! `
    : "Olá! ";

  const message = `${greeting}Recebi sua solicitação de orçamento na LM Energy. Em breve envio seu orçamento personalizado.`;

  return buildWhatsAppUrl(number, message);
}
