import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const cardPaymentSchema = z.object({
  token: z.string().min(1),
  payment_method_id: z.string().min(1),
  issuer_id: z.string().optional(),
  installments: z.number().min(1).default(1),
  transaction_amount: z.number().min(1),
  description: z.string(),
  gift_id: z.string().optional(),
  gift_name: z.string().optional(),
  payer_email: z.string().email(),
  payer_name: z.string().optional(),
  identification_type: z.string().default("CPF"),
  identification_number: z.string().min(11),
  external_reference: z.string(),
  // Address fields (optional but recommended for better approval)
  address_zip_code: z.string().optional(),
  address_street_name: z.string().optional(),
  address_street_number: z.string().optional(),
  address_neighborhood: z.string().optional(),
  address_city: z.string().optional(),
  address_federal_unit: z.string().optional(),
  // Phone (optional but helps with approval)
  payer_phone: z.string().optional(),
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

    // Get client IP for anti-fraud
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";

    console.log(`Processing payment with token: ${data.token.substring(0, 10)}...`);
    console.log(`Payment method: ${data.payment_method_id}`);
    console.log(`Client IP: ${clientIp}`);

    // Create payment using the token from the SDK
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
          token: data.token,
          description: data.description,
          installments: data.installments,
          payment_method_id: data.payment_method_id,
          issuer_id: data.issuer_id || undefined,
          // binary_mode removed to allow "in_process" status which has better approval rates
          notification_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://lista-de-presentes-sigma.vercel.app"}/api/webhooks/mercadopago`,
          payer: {
            email: data.payer_email,
            first_name: data.payer_name?.split(" ")[0] || "Cliente",
            last_name: data.payer_name?.split(" ").slice(1).join(" ") || "Lista Presentes",
            identification: {
              type: data.identification_type,
              number: data.identification_number.replace(/\D/g, ""),
            },
            phone: data.payer_phone ? {
              area_code: data.payer_phone.replace(/\D/g, "").substring(0, 2),
              number: data.payer_phone.replace(/\D/g, "").substring(2),
            } : undefined,
            address: data.address_zip_code ? {
              zip_code: data.address_zip_code.replace(/\D/g, ""),
              street_name: data.address_street_name || "",
              street_number: data.address_street_number || "",
              neighborhood: data.address_neighborhood || "",
              city: data.address_city || "",
              federal_unit: data.address_federal_unit || "",
            } : undefined,
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
              first_name: data.payer_name?.split(" ")[0] || "Cliente",
              last_name: data.payer_name?.split(" ").slice(1).join(" ") || "Lista Presentes",
              registration_date: new Date().toISOString(),
              phone: data.payer_phone ? {
                area_code: data.payer_phone.replace(/\D/g, "").substring(0, 2),
                number: data.payer_phone.replace(/\D/g, "").substring(2),
              } : undefined,
              address: data.address_zip_code ? {
                zip_code: data.address_zip_code.replace(/\D/g, ""),
                street_name: data.address_street_name || "",
                street_number: data.address_street_number || "",
              } : undefined,
            },
            shipments: data.address_zip_code ? {
              receiver_address: {
                zip_code: data.address_zip_code.replace(/\D/g, ""),
                street_name: data.address_street_name || "",
                street_number: data.address_street_number || "",
                city_name: data.address_city || "",
                state_name: data.address_federal_unit || "",
              },
            } : undefined,
            // IP address for anti-fraud validation
            ip_address: clientIp !== "unknown" ? clientIp : undefined,
          },
          external_reference: data.external_reference,
          statement_descriptor: "CASAMENTO P&E",
          // Enable 3D Secure for better approval rates on high-risk transactions
          three_d_secure_mode: "optional",
          // Callback URL for 3DS redirect
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://lista-de-presentes-sigma.vercel.app"}/confirmacao`,
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
          errorMessage = "Pagamento recusado por segurança. Tente outro cartão.";
          break;
        case "cc_rejected_other_reason":
          errorMessage = "Pagamento recusado. Tente outro cartão.";
          break;
        default:
          if (payment.message) {
            errorMessage = payment.message;
          }
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        status: payment.status,
        status_detail: statusDetail,
      }, { status: 400 });
    }

    // Check if 3DS challenge is required
    if (payment.three_ds_info?.external_resource_url) {
      console.log("3DS Challenge required:", payment.three_ds_info);
      return NextResponse.json({
        success: true,
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        three_ds_info: payment.three_ds_info,
        requires_3ds: true,
      });
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
