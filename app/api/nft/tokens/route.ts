import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// GET /api/nft/tokens?user_id=...토큰 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = (searchParams.get("user_id") || "").trim();
    if (!userId) {
      return NextResponse.json({ error: "user_id가 필요합니다." }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("nft_token")
      .select("*")
      .eq("user_id", userId)
      .order("token_id", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, tokens: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


