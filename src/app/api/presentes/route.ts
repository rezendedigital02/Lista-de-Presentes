import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { initialGifts } from "@/lib/gifts-data";

// GET - List all gifts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const available = searchParams.get("available");

    // Check if Supabase is configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      // Return demo data
      let gifts = [...initialGifts];

      if (category && category !== "all") {
        gifts = gifts.filter((g) => g.category === category);
      }

      if (available === "true") {
        gifts = gifts.filter((g) => g.amount_received < g.price);
      }

      return NextResponse.json({
        success: true,
        data: gifts,
        demo: true,
      });
    }

    // Build query
    let query = supabaseAdmin
      .from("gifts")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (available === "true") {
      query = query.lt("amount_received", "price");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Error fetching gifts" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new gift (admin only)
const giftSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().min(1),
  image_url: z.string().url(),
  category: z.enum([
    "cozinha",
    "quarto",
    "sala",
    "banheiro",
    "eletrodomesticos",
    "experiencias",
  ]),
});

export async function POST(request: NextRequest) {
  try {
    // In production, add authentication check here
    const body = await request.json();

    // Validate input
    const validatedData = giftSchema.parse(body);

    // Check if Supabase is configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json({
        success: true,
        message: "Demo mode - Gift would be created",
        data: { ...validatedData, id: `demo-${Date.now()}` },
        demo: true,
      });
    }

    const { data, error } = await supabaseAdmin
      .from("gifts")
      .insert({
        ...validatedData,
        is_available: true,
        amount_received: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Error creating gift" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
