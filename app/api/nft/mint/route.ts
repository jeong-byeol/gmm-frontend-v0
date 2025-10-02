import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ethers } from "ethers";
import nftAbi from "@/abis/NFTmembership.json";

// 환경 변수: 서버 전용 RPC, 컨트랙트, 민터 프라이빗키
const RPC_URL = process.env.EVM_RPC as string;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS as string;
const MINTER_PRIVATE_KEY = process.env.NFT_MINTER_PRIVATE_KEY as string;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const toAddress = (body.toAddress || "").trim();
    const userId = (body.user_id || "").trim();
    const brandId = (body.brand_id || "").trim();
    const membershipType = (body.membership_type || "").trim(); // "1MONTH" | "3MONTH" | "10PT" | "20PT"
    const price = Number(body.price || 0);

    if (!toAddress || !userId || !brandId || !membershipType) {
      return NextResponse.json({ error: "toAddress, user_id, brand_id, membership_type는 필수입니다." }, { status: 400 });
    }
    if (!RPC_URL || !NFT_CONTRACT_ADDRESS || !MINTER_PRIVATE_KEY) {
      return NextResponse.json({ error: "서버 환경변수(EVM_RPC, NFT_CONTRACT_ADDRESS, NFT_MINTER_PRIVATE_KEY)가 필요합니다." }, { status: 500 });
    }

    // 1) 온체인 민팅 (서버 사이드 민터 계정)
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(MINTER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, nftAbi as any, wallet);

    const metadataURI = process.env.TOKENURI as string;
    const tx = await contract.mint(toAddress, metadataURI);
    const receipt = await tx.wait(1);
    if (!receipt || receipt.status !== 1) {
      return NextResponse.json({ error: "민팅 트랜잭션 실패" }, { status: 500 });
    }

    // 방금 민팅된 tokenId를 이벤트 로그에서 직접 파싱 (Transfer 이벤트)
    let tokenId: number | null = null;
    try {
      const iface = new ethers.Interface(nftAbi as any);
      for (const log of receipt.logs) {
        if ((log as any).address?.toLowerCase() === NFT_CONTRACT_ADDRESS.toLowerCase()) {
          try {
            const parsed = iface.parseLog({ topics: (log as any).topics, data: (log as any).data });
            if (parsed?.name === "Transfer") {
              const from = String(parsed.args?.from || parsed.args?.[0] || "");
              const idBig = (parsed.args?.tokenId ?? parsed.args?.[2]) as bigint;
              if (from.toLowerCase() === ethers.ZeroAddress.toLowerCase() && typeof idBig === "bigint") {
                tokenId = Number(idBig);
                break;
              }
            }
          } catch {}
        }
      }
    } catch {}


    // 2) DB 저장 (nft_token 테이블)
    const admin = getSupabaseAdmin();

    // 멤버십 타입별 필드 구성
    const now = new Date();
    const startISO = now.toISOString();
    let start_date: string | undefined = undefined;
    let end_date: string | undefined = undefined;
    let pt_section: number | undefined = undefined;

    if (membershipType === "1MONTH") {
      start_date = startISO;
      end_date = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (membershipType === "3MONTH") {
      start_date = startISO;
      end_date = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();
    } else if (membershipType === "10PT") {
      pt_section = 10;
    } else if (membershipType === "20PT") {
      pt_section = 20;
    } else {
      return NextResponse.json({ error: "membership_type 값이 올바르지 않습니다." }, { status: 400 });
    }

    const insertPayload: any = {
      token_id: tokenId!,
      user_id: userId,
      brand_id: brandId,
      status: "ACTIVE",
      membership_type: membershipType,
      price,
      start_date,
      end_date,
      pt_section,
    };
    if (start_date) insertPayload.start_date = start_date;
    if (end_date) insertPayload.end_date = end_date;
    if (typeof pt_section === "number") insertPayload.pt_section = pt_section;

    const { error } = await admin
      .from("nft_token")
      .insert(insertPayload)
      ;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, txHash: receipt.hash });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


