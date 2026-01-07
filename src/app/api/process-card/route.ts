import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const cardPaymentSchema = z.object({
  card_number: z.string().min(13),
  cardholder_name: z.string().min(2),
  expiration_month: z.string().min(2),
  expiration_year: z.string().min(4),
  security_code: z.string().min(3),
  identification_type: z.string().default("CPF"),
  identification_number: z.string().min(11),
  installments: z.number().min(1).default(1),
  transaction_amount: z.number().min(10),
  description: z.string(),
  payer_email: z.string().email(),
  external_reference: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = cardPaymentSchema.parse(body);

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json({
        success: false,
        error: "Mercado Pago não configurado",
      }, { status: 400 });
    }

    // Get payment method ID from card number (first 6 digits)
    const bin = data.card_number.substring(0, 6);
    const paymentMethodsResponse = await fetch(
      `https://api.mercadopago.com/v1/payment_methods/search?bin=${bin}&marketplace=NONE`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      }
    );

    if (!paymentMethodsResponse.ok) {
      return NextResponse.json({
        success: false,
        error: "Não foi possível identificar o cartão",
      }, { status: 400 });
    }

    const paymentMethods = await paymentMethodsResponse.json();

    if (!paymentMethods.results || paymentMethods.results.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Cartão não reconhecido. Verifique o número.",
      }, { status: 400 });
    }

    const paymentMethodId = paymentMethods.results[0].id;
    const issuerId = paymentMethods.results[0].issuer?.id;

    // Create card token
    const tokenResponse = await fetch(
      "https://api.mercadopago.com/v1/card_tokens",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card_number: data.card_number,
          cardholder: {
            name: data.cardholder_name,
            identification: {
              type: data.identification_type,
              number: data.identification_number,
            },
          },
          expiration_month: parseInt(data.expiration_month),
          expiration_year: parseInt(data.expiration_year),
          security_code: data.security_code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.json();
      console.error("Token error:", tokenError);
      return NextResponse.json({
        success: false,
        error: "Dados do cartão inválidos. Verifique e tente novamente.",
        details: tokenError,
      }, { status: 400 });
    }

    const tokenData = await tokenResponse.json();

    // Create payment
    const paymentResponse = await fetch(
      "https://api.mercadopago.com/v1/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": `${Date.now()}-${Math.random().toString(36).substring(7)}`,
        },
        body: JSON.stringify({
          transaction_amount: data.transaction_amount,
          token: tokenData.id,
          description: data.description,
          installments: data.installments,
          payment_method_id: paymentMethodId,
          issuer_id: issuerId,
          payer: {
            email: data.payer_email,
            identification: {
              type: data.identification_type,
              number: data.identification_number,
            },
          },
          external_reference: data.external_reference,
          statement_descriptor: "CASAMENTO P&E",
        }),
      }
    );

    const payment = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error("Payment error:", payment);

      // Map common error messages
      let errorMessage = "Erro ao processar pagamento";

      if (payment.cause) {
        const cause = payment.cause[0];
        switch (cause?.code) {
          case "cc_rejected_bad_filled_card_number":
            errorMessage = "Número do cartão inválido";
            break;
          case "cc_rejected_bad_filled_date":
            errorMessage = "Data de validade inválida";
            break;
          case "cc_rejected_bad_filled_security_code":
            errorMessage = "Código de segurança inválido";
            break;
          case "cc_rejected_insufficient_amount":
            errorMessage = "Saldo insuficiente";
            break;
          case "cc_rejected_call_for_authorize":
            errorMessage = "Entre em contato com seu banco para autorizar";
            break;
          case "cc_rejected_card_disabled":
            errorMessage = "Cartão desabilitado. Entre em contato com seu banco.";
            break;
          case "cc_rejected_max_attempts":
            errorMessage = "Limite de tentativas excedido. Tente mais tarde.";
            break;
          default:
            errorMessage = cause?.description || "Pagamento não aprovado";
        }
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        status: payment.status,
        status_detail: payment.status_detail,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
    });
  } catch (error) {
    console.error("Card payment error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar pagamento",
      },
      { status: 500 }
    );
  }
}
