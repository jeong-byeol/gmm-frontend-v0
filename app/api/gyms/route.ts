import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// GET /api/gyms → 헬스장 목록 조회(브랜드 목록 포함)
export async function GET() {
  try {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
      .from("Gyms")
      .select(`
        gym_id, brand_id, name, address, business_number, description, one_month, three_month, pt_ten_times, pt_twenty_times,
        Brands:brand_id ( brand_id, name, is_sale )
      `)
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, gyms: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/gyms { brand_id, name, address, business_number, description, one_month, three_month, pt_ten_times, pt_twenty_times }
export async function POST(request: Request) {
  try {
    const admin = getSupabaseAdmin();
    const body = await request.json();

    const brandId = typeof body.brand_id === "string" ? body.brand_id.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const address = typeof body.address === "string" ? body.address.trim() : "";
    const business_number = typeof body.business_number === "string" ? body.business_number.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const one_month = Number.isFinite(body.one_month) ? Number(body.one_month) : null;
    const three_month = Number.isFinite(body.three_month) ? Number(body.three_month) : null;
    const pt_ten_times = Number.isFinite(body.pt_ten_times) ? Number(body.pt_ten_times) : null;
    const pt_twenty_times = Number.isFinite(body.pt_twenty_times) ? Number(body.pt_twenty_times) : null;

    if ( !name || !address || !business_number) {
      return NextResponse.json({ error: "name, address, business_number는 필수입니다." }, { status: 400 });
    }

    const { data, error } = await admin
      .from("Gyms")
      .insert({
        brand_id: brandId,
        name,
        address,
        business_number,
        description,
        one_month,
        three_month,
        pt_ten_times,
        pt_twenty_times,
      })
      .select(`
        gym_id, brand_id, name, address, business_number, description, one_month, three_month, pt_ten_times, pt_twenty_times,
        Brands:brand_id ( brand_id, name, is_sale )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, gym: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


