import { NextResponse } from "next/server";
import { getSupabaseAdmin, type UserData } from "@/lib/supabase";

// GET: 사용자 등록 여부 확인 ?email=
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "email 파라미터가 필요합니다." }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("Users")
      .select("user_id, name, phone, email, wallet_address, is_admin")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ exists: !!data, user: data ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: 사용자 등록 { user_id?, name, phone, email, wallet_address? }
export async function POST(request: Request) {
  try {
    const admin = getSupabaseAdmin();
    const body = (await request.json()) as Partial<UserData>;

    const name = (body.name ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const email = (body.email ?? "").trim();
    const userId = (body.user_id ?? "").trim();
    const walletFromClient = (body.wallet_address ?? "").trim();

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "name, phone, email은 필수입니다." }, { status: 400 });
    }

    // 이미 등록된 사용자 여부 확인
    const { data: existing, error: checkError } = await admin
      .from("Users")
      .select("user_id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }
    if (existing) {
      return NextResponse.json({ ok: true, userAlreadyExists: true });
    }

    // 클라이언트에서 전달된 지갑 주소 우선 사용, 없으면 새 지갑 주소 생성
    const wallet_address = walletFromClient;
    const payload: UserData = {
      user_id: userId || undefined,
      name,
      phone,
      email,
      wallet_address,
      is_admin: false,
    };

    const { data, error } = await admin
      .from("Users")
      .insert(payload)
      .select("user_id, name, phone, email, wallet_address, is_admin")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


