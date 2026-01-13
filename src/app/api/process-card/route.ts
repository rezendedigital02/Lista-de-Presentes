import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const cardPaymentSchema = z.object({
  card_number: z.string().min(13),
  cardholder_name: z.string().min(2),
  expiration_month: z.string().min(1),
  expiration_year: z.string().min(4),
  security_code: z.string().min(3),
  identification_type: z.string().default("CPF"),
  identification_number: z.string().min(11),
  installments: z.number().min(1).default(1),
  transaction_amount: z.number().min(1),
  description: z.string(),
  payer_email: z.string().email(),
  external_reference: z.string(),
});

// Identify card brand by BIN (first digits)
function getCardBrand(cardNumber: string): { id: string; name: string } | null {
  const bin = cardNumber.replace(/\s/g, "").substring(0, 6);
  const firstDigit = bin[0];
  const firstTwo = bin.substring(0, 2);
  const firstFour = bin.substring(0, 4);

  // Visa: starts with 4
  if (firstDigit === "4") {
    return { id: "visa", name: "Visa" };
  }

  // Mastercard: starts with 51-55 or 2221-2720
  const firstTwoNum = parseInt(firstTwo);
  const firstFourNum = parseInt(firstFour);
  if ((firstTwoNum >= 51 && firstTwoNum <= 55) || (firstFourNum >= 2221 && firstFourNum <= 2720)) {
    return { id: "master", name: "Mastercard" };
  }

  // Amex: starts with 34 or 37
  if (firstTwo === "34" || firstTwo === "37") {
    return { id: "amex", name: "American Express" };
  }

  // Elo: various BINs
  const eloBins = ["636368", "438935", "504175", "451416", "636297", "506699", "509048", "509067", "509049", "509069", "509050", "509074", "509068", "509040", "509045", "509051", "509046", "509066", "509047", "509042", "509052", "509043", "509064", "509040"];
  if (eloBins.some(eloBin => bin.startsWith(eloBin.substring(0, Math.min(6, eloBin.length))))) {
    return { id: "elo", name: "Elo" };
  }

  // Hipercard: starts with 606282
  if (bin.startsWith("606282") || bin.startsWith("3841")) {
    return { id: "hipercard", name: "Hipercard" };
  }

  // Diners: starts with 36, 38, or 300-305
  if (firstTwo === "36" || firstTwo === "38" || (firstTwoNum >= 30 && firstTwoNum <= 30)) {
    return { id: "diners", name: "Diners" };
  }

  return null;
}

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

    const cleanCardNumber = data.card_number.replace(/\s/g, "");

    // Identify card brand locally
    const cardBrand = getCardBrand(cleanCardNumber);

    if (!cardBrand) {
      return NextResponse.json({
        success: false,
        error: "Bandeira do cartão não reconhecida. Aceitamos Visa, Mastercard, Elo, Amex e Hipercard.",
      }, { status: 400 });
    }

    console.log(`Card identified as: ${cardBrand.name} (${cardBrand.id})`);

    // Create card token using public key approach
    const tokenResponse = await fetch(
      `https://api.mercadopago.com/v1/card_tokens?public_key=${process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card_number: cleanCardNumber,
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

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      console.error("Token error:", tokenData);

      let errorMessage = "Dados do cartão inválidos";

      if (tokenData.cause && tokenData.cause.length > 0) {
        const cause = tokenData.cause[0];
        if (cause.code === "324") {
          errorMessage = "CPF inválido";
        } else if (cause.code === "325") {
          errorMessage = "Mês de validade inválido";
        } else if (cause.code === "326") {
          errorMessage = "Ano de validade inválido";
        } else if (cause.code === "E301") {
          errorMessage = "Número do cartão inválido";
        } else if (cause.code === "E302") {
          errorMessage = "CVV inválido";
        } else if (cause.description) {
          errorMessage = cause.description;
        }
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
      }, { status: 400 });
    }

    console.log("Token created successfully:", tokenData.id);

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
          payment_method_id: cardBrand.id,
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

    console.log("Payment response:", payment.status, payment.status_detail);

    if (!paymentResponse.ok || payment.status === "rejected") {
      console.error("Payment error:", payment);

      let errorMessage = "Pagamento não aprovado";

      // Map common rejection reasons
      const statusDetail = payment.status_detail;
      switch (statusDetail) {
        case "cc_rejected_bad_filled_card_number":
          errorMessage = "Número do cartão inválido";
          break;
        case "cc_rejected_bad_filled_date":
          errorMessage = "Data de validade inválida";
          break;
        case "cc_rejected_bad_filled_security_code":
          errorMessage = "Código de segurança inválido";
          break;
        case "cc_rejected_bad_filled_other":
          errorMessage = "Verifique os dados do cartão";
          break;
        case "cc_rejected_insufficient_amount":
          errorMessage = "Saldo insuficiente";
          break;
        case "cc_rejected_call_for_authorize":
          errorMessage = "Ligue para o banco para autorizar";
          break;
        case "cc_rejected_card_disabled":
          errorMessage = "Cartão desabilitado. Contate seu banco.";
          break;
        case "cc_rejected_max_attempts":
          errorMessage = "Limite de tentativas. Tente mais tarde.";
          break;
        case "cc_rejected_duplicated_payment":
          errorMessage = "Pagamento duplicado. Aguarde alguns minutos.";
          break;
        case "cc_rejected_high_risk":
          errorMessage = "Pagamento recusado por segurança";
          break;
        case "cc_rejected_other_reason":
          errorMessage = "Pagamento recusado. Tente outro cartão.";
          break;
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        status: payment.status,
        status_detail: statusDetail,
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
          error: "Dados inválidos. Verifique todos os campos.",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar pagamento. Tente novamente.",
      },
      { status: 500 }
    );
  }
}
