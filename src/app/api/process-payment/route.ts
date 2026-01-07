import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MercadoPagoConfig, Payment } from "mercadopago";

const paymentSchema = z.object({
  token: z.string().min(1),
  transaction_amount: z.number().min(10),
  installments: z.number().min(1).default(1),
  payment_method_id: z.string().min(1),
  issuer_id: z.string().optional(),
  payer: z.object({
    email: z.string().email(),
    identification: z.object({
      type: z.string(),
      number: z.string(),
    }).optional(),
  }),
  description: z.string(),
  external_reference: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = paymentSchema.parse(body);

    // Check if Mercado Pago is configured
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json({
        success: false,
        error: "Mercado Pago não configurado",
        demo: true,
      }, { status: 400 });
    }

    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    const paymentClient = new Payment(mercadopago);

    const paymentData = {
      transaction_amount: validatedData.transaction_amount,
      token: validatedData.token,
      description: validatedData.description,
      installments: validatedData.installments,
      payment_method_id: validatedData.payment_method_id,
      issuer_id: validatedData.issuer_id ? Number(validatedData.issuer_id) : undefined,
      payer: {
        email: validatedData.payer.email,
        identification: validatedData.payer.identification,
      },
      external_reference: validatedData.external_reference,
    };

    const payment = await paymentClient.create({ body: paymentData });

    return NextResponse.json({
      success: true,
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
    });
  } catch (error) {
    console.error("Payment processing error:", error);

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mpError = error as any;
    if (mpError?.cause) {
      return NextResponse.json(
        {
          success: false,
          error: "Erro no pagamento",
          details: mpError.cause,
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
