import { NextResponse } from "next/server";
import { getSupabaseAdmin, BrandData } from "@/lib/supabase";

// POST /api/brands { name: string, is_sale: boolean } ->브랜드 등록 처리
export async function POST(request: Request) {
  try {
    const admin = getSupabaseAdmin();
    const body = await request.json() as BrandData;

    const rawName = typeof body.name === "string" ? body.name.trim() : "";
    const isSale = typeof body.is_sale === "boolean" ? body.is_sale : false;
    // 사용자 ID는 외래키이므로 필수로 받아야 함
    const userId = typeof (body as any).user_id === "string" ? (body as any).user_id.trim() : "";

    if (!rawName) {
      return NextResponse.json({ error: "name은 필수입니다." }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "user_id는 필수입니다." }, { status: 400 });
    }

    const { data, error } = await admin
      .from("Brands")
      .insert({ user_id: userId, name: rawName, is_sale: isSale })
      .select("brand_id, user_id, name, is_sale")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, brand: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/brands?user_id=... ->등록된 모든 브랜드 조회(현재 사용 안하고 플랫폼 운영자 관리 페이지 만들 때 사용 예정)
export async function GET(request: Request) {
  try {
    const admin = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const userId = (searchParams.get("user_id") || "").trim();

    const query = admin
      .from("Brands")
      .select("brand_id, user_id, name, is_sale")
      .order("name", { ascending: true });

    const { data, error } = userId ? await query.eq("user_id", userId) : await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, brands: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


