export const WHATSAPP_NUMBER = "5581981684949";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá, gostaria de mais informações sobre os serviços da LM Energy!";

export function buildWhatsAppUrl(message: string = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
