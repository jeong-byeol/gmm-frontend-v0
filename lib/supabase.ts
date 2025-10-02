import { createClient } from "@supabase/supabase-js";

// 클라이언트에서 사용할 공개 키
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// 서버에서만 사용할 서비스 롤 키 (절대 NEXT_PUBLIC로 노출 금지)
const supabase_service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// supabaseAdmin이 클라이언트에서 실행되지 않고, 서버에서만 사용할수 있도록함.
export function getSupabaseAdmin() {
  if (typeof window !== "undefined") { //window 객체의 자료형은 undefined이어야 한다.(즉, 값이 할당되지 않음을 의미)
    throw new Error("supabaseAdmin은 서버 환경에서만 사용할 수 있습니다.");
  }
  return createClient(supabaseUrl, supabase_service_role_key);
}

export interface UserData {
  // 사용자 고유 ID (supabase auth의 user.id) (PK)
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
  // 브랜드 고유 ID (supabase auth의 user.id) (PK)
  brand_id?: string;
  // 브랜드 이름
  name: string;
  // 판매 가능 여부
  is_sale: boolean;
}

export interface GymData {
  // 헬스장 고유 ID (supabase auth의 user.id) (PK)
  gym_id?: string;
  // 브랜드 ID(FK)
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

export interface NFTtokenData {
  // NFT 토큰 ID(PK)
  token_id: number;
  // 사용자 ID(FK)
  user_id: string;
  // 브랜드 ID(FK)
  brand_id: string;
  // 시작 날짜
  start_date?: string;
  // 종료 날짜
  end_date?: string;
  // 상태
  status: "ACTIVE" | "EXPIRE";
  // PT 섹션
  pt_section?: number;
  // 멤버십 타입
  membership_type: "1MONTH" | "3MONTH" | "10PT" | "20PT";
  // 가격
  price: number;
}