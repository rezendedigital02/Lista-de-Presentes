import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MercadoPagoConfig, Payment } from "mercadopago";

const cardPaymentSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  payment_method_id: z.string().min(1, "Método de pagamento é obrigatório"),
  issuer_id: z.string().optional(),
  installments: z.number().min(1).default(1),
  transaction_amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  description: z.string(),
  gift_id: z.string().optional(),
  gift_name: z.string().optional(),
  payer_email: z.string().email("Email inválido"),
  payer_name: z.string().optional(),
  identification_type: z.string().default("CPF"),
  identification_number: z.string().min(11, "CPF/CNPJ inválido"),
  external_reference: z.string(),
  // Address fields
  address_zip_code: z.string().optional(),
  address_street_name: z.string().optional(),
  address_street_number: z.string().optional(),
  address_neighborhood: z.string().optional(),
  address_city: z.string().optional(),
  address_federal_unit: z.string().optional(),
  // Phone
  payer_phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = cardPaymentSchema.parse(body);

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error("MERCADOPAGO_ACCESS_TOKEN not configured");
      return NextResponse.json({
        success: false,
        error: "Sistema de pagamento não configurado",
      }, { status: 500 });
    }

    // Initialize MercadoPago with the SDK (like PIX does)
    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    const paymentClient = new Payment(mercadopago);

    // Get client IP for anti-fraud
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : request.headers.get("x-real-ip") || undefined;

    // Parse payer name
    const nameParts = (data.payer_name || "Cliente").trim().split(" ");
    const firstName = nameParts[0] || "Cliente";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    // Build payment data following MercadoPago SDK structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentData: any = {
      transaction_amount: data.transaction_amount,
      token: data.token,
      description: data.description,
      installments: data.installments,
      payment_method_id: data.payment_method_id,
      issuer_id: data.issuer_id || undefined,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://lista-de-presentes-sigma.vercel.app"}/api/webhooks/mercadopago`,
      external_reference: data.external_reference,
      statement_descriptor: "CASAMENTO P&E",
      payer: {
        email: data.payer_email,
        first_name: firstName,
        last_name: lastName,
        identification: {
          type: data.identification_type,
          number: data.identification_number.replace(/\D/g, ""),
        },
      },
      additional_info: {
        items: [
          {
            id: data.gift_id || "gift-item",
            title: data.gift_name || data.description,
            description: `Presente de casamento: ${data.gift_name || data.description}`,
            category_id: "others",
            quantity: 1,
            unit_price: data.transaction_amount,
          },
        ],
        payer: {
          first_name: firstName,
          last_name: lastName,
          registration_date: new Date().toISOString(),
        },
      },
    };

    // Add phone if provided
    if (data.payer_phone && data.payer_phone.length >= 10) {
      const phoneDigits = data.payer_phone.replace(/\D/g, "");
      paymentData.payer.phone = {
        area_code: phoneDigits.substring(0, 2),
        number: phoneDigits.substring(2),
      };
      paymentData.additional_info.payer.phone = {
        area_code: phoneDigits.substring(0, 2),
        number: phoneDigits.substring(2),
      };
    }

    // Add address if provided
    if (data.address_zip_code) {
      const zipCode = data.address_zip_code.replace(/\D/g, "");
      paymentData.payer.address = {
        zip_code: zipCode,
        street_name: data.address_street_name || "",
        street_number: data.address_street_number || "",
        neighborhood: data.address_neighborhood || "",
        city: data.address_city || "",
        federal_unit: data.address_federal_unit || "",
      };
      paymentData.additional_info.payer.address = {
        zip_code: zipCode,
        street_name: data.address_street_name || "",
        street_number: data.address_street_number || "",
      };
      paymentData.additional_info.shipments = {
        receiver_address: {
          zip_code: zipCode,
          street_name: data.address_street_name || "",
          street_number: data.address_street_number || "",
          city_name: data.address_city || "",
          state_name: data.address_federal_unit || "",
        },
      };
    }

    // Add IP address for anti-fraud
    if (clientIp) {
      paymentData.additional_info.ip_address = clientIp;
    }

    console.log("Creating payment with token:", data.token.substring(0, 15) + "...");
    console.log("Payment method:", data.payment_method_id);
    console.log("Amount:", data.transaction_amount);

    // Create payment using the official SDK
    const payment = await paymentClient.create({
      body: paymentData,
      requestOptions: {
        idempotencyKey: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      },
    });

    console.log("Payment response - Status:", payment.status, "Detail:", payment.status_detail);

    // Handle rejected payments
    if (payment.status === "rejected") {
      console.error("Payment rejected:", payment.status_detail);

      const errorMessages: Record<string, string> = {
        cc_rejected_bad_filled_card_number: "Número do cartão inválido",
        cc_rejected_bad_filled_date: "Data de validade inválida",
        cc_rejected_bad_filled_security_code: "Código de segurança inválido",
        cc_rejected_bad_filled_other: "Verifique os dados do cartão",
        cc_rejected_insufficient_amount: "Saldo insuficiente",
        cc_rejected_call_for_authorize: "Cartão requer autorização. Ligue para o banco.",
        cc_rejected_card_disabled: "Cartão desabilitado. Contate seu banco.",
        cc_rejected_max_attempts: "Limite de tentativas excedido. Aguarde e tente novamente.",
        cc_rejected_duplicated_payment: "Pagamento duplicado detectado. Aguarde alguns minutos.",
        cc_rejected_high_risk: "Pagamento recusado pelo sistema de segurança. Tente outro cartão ou método de pagamento.",
        cc_rejected_other_reason: "Pagamento recusado. Tente outro cartão.",
        cc_rejected_blacklist: "Cartão não permitido. Use outro cartão.",
        cc_rejected_card_error: "Erro no cartão. Tente novamente.",
        cc_rejected_invalid_installments: "Número de parcelas inválido",
      };

      const errorMessage = errorMessages[payment.status_detail || ""] ||
        "Pagamento não aprovado. Tente outro cartão ou método de pagamento.";

      return NextResponse.json({
        success: false,
        error: errorMessage,
        status: payment.status,
        status_detail: payment.status_detail,
      }, { status: 400 });
    }

    // Return success for approved, pending, in_process, or authorized
    return NextResponse.json({
      success: true,
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
    });

  } catch (error) {
    console.error("Card payment error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json({
        success: false,
        error: firstError.message || "Dados inválidos. Verifique todos os campos.",
        details: error.issues,
      }, { status: 400 });
    }

    // Handle MercadoPago SDK errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mpError = error as any;
    if (mpError?.cause) {
      console.error("MercadoPago error cause:", mpError.cause);

      // Try to extract meaningful error message
      let errorMessage = "Erro ao processar pagamento. Tente novamente.";
      if (Array.isArray(mpError.cause) && mpError.cause[0]?.description) {
        errorMessage = mpError.cause[0].description;
      } else if (mpError.message) {
        errorMessage = mpError.message;
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        details: mpError.cause,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: "Erro interno ao processar pagamento. Tente novamente.",
    }, { status: 500 });
  }
}
