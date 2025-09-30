import { createClient } from "@supabase/supabase-js";

// 클라이언트에서 사용할 공개 키
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// 서버에서만 사용할 서비스 롤 키 (절대 NEXT_PUBLIC로 노출 금지)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // 환경변수 누락 시 즉시 오류 발생시켜 원인 파악을 돕습니다.
  throw new Error("Supabase 환경변수(NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)가 설정되지 않았습니다.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버 사이드에서만 호출해 Admin 클라이언트를 생성하도록 팩토리 함수 제공
export function getSupabaseAdmin() {
  // 클라이언트에서 실수로 호출되는 것을 방지합니다.
  if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin은 서버 환경에서만 사용할 수 있습니다.");
  }
  if (!supabaseServiceRoleKey) {
    throw new Error("Supabase 서비스 롤 키(SUPABASE_SERVICE_ROLE_KEY)가 설정되지 않았습니다.");
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

export interface UserData {
  // 사용자 고유 ID (supabase auth의 user.id)
  user_id?: string;
  // 사용자 이름
  name: string;
  // 전화번호 (숫자만)
  phone: string;
  // 이메일
  email: string;
  // 블록체인 지갑 주소
  wallet_address: string;
  // 관리자 여부
  is_admin: boolean;
}

export interface BrandData {
  // 브랜드 고유 ID (supabase auth의 user.id)
  brand_id?: string;
  // 브랜드 이름
  name: string;
  // 판매 가능 여부
  is_sale: boolean;
}

export interface GymData {
  // 헬스장 고유 ID (supabase auth의 user.id)
  gym_id?: string;
  // 브랜드 ID
  brand_id?: string;
  // 헬스장 이름
  name: string;
  // 헬스장 주소
  address: string;
  // 헬스장 사업자등록번호
  businessNumber: string;
  // 헬스장 소개
  description: string;
  // 1개월 이용권 가격
  one_month: number;
  // 3개월 이용권 가격
  three_month: number;
  // 10회 PT 이용권 가격
  pt_ten_times: number;
  // 20회 PT 이용권 가격
  pt_twenty_times: number;
}