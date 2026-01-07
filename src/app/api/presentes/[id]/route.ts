import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { initialGifts } from "@/lib/gifts-data";

// GET - Get a single gift by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if Supabase is configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      // Return demo data
      const gift = initialGifts.find((g) => g.id === id);

      if (!gift) {
        return NextResponse.json(
          { success: false, error: "Gift not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: gift,
        demo: true,
      });
    }

    const { data, error } = await supabaseAdmin
      .from("gifts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Gift not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update a gift (admin only)
const updateGiftSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().min(1).optional(),
  image_url: z.string().url().optional(),
  category: z
    .enum([
      "cozinha",
      "quarto",
      "sala",
      "banheiro",
      "eletrodomesticos",
      "experiencias",
    ])
    .optional(),
  is_available: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In production, add authentication check here
    const { id } = params;
    const body = await request.json();

    // Validate input
    const validatedData = updateGiftSchema.parse(body);

    // Check if Supabase is configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const gift = initialGifts.find((g) => g.id === id);

      if (!gift) {
        return NextResponse.json(
          { success: false, error: "Gift not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Demo mode - Gift would be updated",
        data: { ...gift, ...validatedData },
        demo: true,
      });
    }

    const { data, error } = await supabaseAdmin
      .from("gifts")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Error updating gift" },
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

// DELETE - Delete a gift (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In production, add authentication check here
    const { id } = params;

    // Check if Supabase is configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json({
        success: true,
        message: "Demo mode - Gift would be deleted",
        demo: true,
      });
    }

    const { error } = await supabaseAdmin.from("gifts").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Error deleting gift" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gift deleted successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
