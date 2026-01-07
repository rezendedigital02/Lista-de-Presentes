import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPaymentPreference } from "@/lib/mercadopago";

const checkoutSchema = z.object({
  gift_id: z.string().min(1),
  gift_name: z.string().min(1),
  amount: z.number().min(10),
  guest_name: z.string().min(2),
  guest_email: z.string().email(),
  message: z.string().optional(),
  payment_method: z.enum(["pix", "credit_card", "boleto"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = checkoutSchema.parse(body);

    // Check if Mercado Pago is configured
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      // Return mock response for demo
      return NextResponse.json({
        success: true,
        message: "Demo mode - Mercado Pago not configured",
        demo: true,
      });
    }

    // Create payment preference
    const preference = await createPaymentPreference({
      gift_id: validatedData.gift_id,
      gift_name: validatedData.gift_name,
      amount: validatedData.amount,
      guest_name: validatedData.guest_name,
      guest_email: validatedData.guest_email,
      message: validatedData.message,
    });

    return NextResponse.json({
      success: true,
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error) {
    console.error("Checkout error:", error);

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
