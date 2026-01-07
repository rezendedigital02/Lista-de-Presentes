import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MercadoPagoConfig, Payment } from "mercadopago";

const pixSchema = z.object({
  transaction_amount: z.number().min(10),
  payer: z.object({
    email: z.string().email(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    identification: z.object({
      type: z.string(),
      number: z.string(),
    }),
  }),
  description: z.string(),
  external_reference: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = pixSchema.parse(body);

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
      description: validatedData.description,
      payment_method_id: "pix",
      payer: {
        email: validatedData.payer.email,
        first_name: validatedData.payer.first_name,
        last_name: validatedData.payer.last_name,
        identification: validatedData.payer.identification,
      },
      external_reference: validatedData.external_reference,
    };

    const payment = await paymentClient.create({ body: paymentData });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pixData = payment.point_of_interaction?.transaction_data as any;

    return NextResponse.json({
      success: true,
      id: payment.id,
      status: payment.status,
      qr_code: pixData?.qr_code,
      qr_code_base64: pixData?.qr_code_base64,
      ticket_url: pixData?.ticket_url,
    });
  } catch (error) {
    console.error("PIX payment error:", error);

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
          error: "Erro ao gerar PIX",
          details: mpError.cause,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar pagamento PIX",
      },
      { status: 500 }
    );
  }
}
