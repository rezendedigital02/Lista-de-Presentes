import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import type { CheckoutData } from "@/types";

// Configuração do Mercado Pago
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

// Cliente de preferências
export const preferenceClient = new Preference(mercadopago);

// Cliente de pagamentos
export const paymentClient = new Payment(mercadopago);

// Criar preferência de pagamento
export async function createPaymentPreference(data: CheckoutData) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const preference = await preferenceClient.create({
    body: {
      items: [
        {
          id: data.gift_id,
          title: `Presente: ${data.gift_name}`,
          description: `Contribuição para o casamento de Priscila e Emanuel`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: data.amount,
        },
      ],
      payer: {
        name: data.guest_name,
        email: data.guest_email,
      },
      back_urls: {
        success: `${baseUrl}/confirmacao?status=approved`,
        failure: `${baseUrl}/confirmacao?status=rejected`,
        pending: `${baseUrl}/confirmacao?status=pending`,
      },
      auto_return: "approved",
      external_reference: JSON.stringify({
        gift_id: data.gift_id,
        guest_name: data.guest_name,
        guest_email: data.guest_email,
        message: data.message || "",
      }),
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      statement_descriptor: "CASAMENTO P&E",
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
        default_installments: 1,
      },
    },
  });

  return preference;
}

// Buscar detalhes do pagamento
export async function getPaymentDetails(paymentId: string) {
  const payment = await paymentClient.get({ id: paymentId });
  return payment;
}

// Mapear status do Mercado Pago para nosso sistema
export function mapPaymentStatus(
  mpStatus: string
): "pending" | "approved" | "rejected" | "cancelled" {
  switch (mpStatus) {
    case "approved":
      return "approved";
    case "pending":
    case "in_process":
    case "authorized":
      return "pending";
    case "rejected":
    case "refunded":
    case "charged_back":
      return "rejected";
    case "cancelled":
      return "cancelled";
    default:
      return "pending";
  }
}

// Mapear método de pagamento
export function mapPaymentMethod(
  mpMethod: string
): "pix" | "credit_card" | "debit_card" | "boleto" {
  if (mpMethod === "pix") return "pix";
  if (mpMethod === "credit_card") return "credit_card";
  if (mpMethod === "debit_card") return "debit_card";
  if (mpMethod === "bolbradesco" || mpMethod === "boleto") return "boleto";
  return "pix";
}
