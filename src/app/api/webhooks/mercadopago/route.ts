import { NextRequest, NextResponse } from "next/server";
import { getPaymentDetails, mapPaymentStatus, mapPaymentMethod } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log webhook data
    console.log("Webhook received:", JSON.stringify(body, null, 2));

    // Verify webhook type
    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      console.error("No payment ID in webhook");
      return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
    }

    // Get payment details from Mercado Pago
    let paymentDetails;
    try {
      paymentDetails = await getPaymentDetails(paymentId.toString());
    } catch (error) {
      console.error("Error fetching payment details:", error);
      return NextResponse.json(
        { error: "Error fetching payment details" },
        { status: 500 }
      );
    }

    // Parse external reference
    let externalRef;
    try {
      externalRef = JSON.parse(paymentDetails.external_reference || "{}");
    } catch {
      externalRef = {};
    }

    const { gift_id, guest_name, guest_email, message } = externalRef;

    // Map payment status and method
    const status = mapPaymentStatus(paymentDetails.status || "pending");
    const method = mapPaymentMethod(
      paymentDetails.payment_type_id || paymentDetails.payment_method_id || "pix"
    );

    // Check if contribution already exists
    const { data: existingContribution } = await supabaseAdmin
      .from("contributions")
      .select("id")
      .eq("payment_id", paymentId.toString())
      .single();

    if (existingContribution) {
      // Update existing contribution
      const { data: oldContribution } = await supabaseAdmin
        .from("contributions")
        .select("payment_status, amount, gift_id")
        .eq("id", existingContribution.id)
        .single();

      await supabaseAdmin
        .from("contributions")
        .update({
          payment_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingContribution.id);

      // If status changed to approved, update gift amount_received
      if (status === "approved" && oldContribution?.payment_status !== "approved" && oldContribution?.gift_id) {
        const { data: gift } = await supabaseAdmin
          .from("gifts")
          .select("amount_received, price")
          .eq("id", oldContribution.gift_id)
          .single();

        if (gift) {
          const newAmount = (gift.amount_received || 0) + (oldContribution.amount || 0);
          const isFullyFunded = newAmount >= gift.price;

          await supabaseAdmin
            .from("gifts")
            .update({
              amount_received: newAmount,
              is_available: !isFullyFunded,
              updated_at: new Date().toISOString(),
            })
            .eq("id", oldContribution.gift_id);
        }
      }
    } else {
      // Create new contribution
      await supabaseAdmin.from("contributions").insert({
        gift_id,
        guest_name: guest_name || "Anônimo",
        guest_email: guest_email || "",
        amount: paymentDetails.transaction_amount || 0,
        message: message || null,
        payment_id: paymentId.toString(),
        payment_status: status,
        payment_method: method,
      });

      // Update gift amount_received if payment is approved
      if (status === "approved" && gift_id) {
        const { data: gift } = await supabaseAdmin
          .from("gifts")
          .select("amount_received, price")
          .eq("id", gift_id)
          .single();

        if (gift) {
          const newAmount =
            (gift.amount_received || 0) + (paymentDetails.transaction_amount || 0);
          const isFullyFunded = newAmount >= gift.price;

          await supabaseAdmin
            .from("gifts")
            .update({
              amount_received: newAmount,
              is_available: !isFullyFunded,
              updated_at: new Date().toISOString(),
            })
            .eq("id", gift_id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mercado Pago may also send GET requests for validation
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
