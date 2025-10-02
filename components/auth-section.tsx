"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3AuthReact = require("@web3auth/modal/react") as {
  useWeb3AuthConnect: () => {
    connect: () => Promise<unknown>
    connectTo: (...args: unknown[]) => Promise<unknown>
    isConnected: boolean
    connectorName: string | null
    loading: boolean
    error: Error | null
  }
  useWeb3AuthUser: () => {
    userInfo: unknown
    loading: boolean
    error: Error | null
    isMFAEnabled: boolean
    getUserInfo: () => Promise<unknown>
  }
}
import { useAccount } from "wagmi"

// OAuth 회원가입 시 전화번호/지갑주소 임시 저장 키 (리다이렉트 복귀 후 사용)
const LOCAL_PHONE_KEY = "gmm_signup_phone"
const LOCAL_WALLET_KEY = "gmm_signup_wallet"

export function AuthSection() {
  const router = useRouter()

  // Web3Auth 연결 훅: 모달 연결/상태/에러 관리
  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = Web3AuthReact.useWeb3AuthConnect();
  // Web3Auth 사용자 정보 훅: 필요 시 최신 사용자 정보 조회
  const { userInfo, loading: userInfoLoading, error: userInfoError, getUserInfo } = Web3AuthReact.useWeb3AuthUser();
  // Wagmi 훅: 연결된 계정 주소 조회 (Web3Auth Provider 하위에서 동작)
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount()
  const [isSignUp, setIsSignUp] = useState(false)
  const [phone, setPhone] = useState("")
  const [authErrorMessage, setAuthErrorMessage] = useState("") // 로그인 실패 시 회원가입 안내 메시지

  // 초기 진입 또는 OAuth 리다이렉트 복귀 시: 세션 확인 및 등록 여부 처리
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const email = user.email || ""
        if (!email) return

        // DB 등록 여부 확인
        const existsRes = await fetch(`/api/register?email=${encodeURIComponent(email)}`)
        const existsJson = await existsRes.json()

        if (existsJson.exists) {
          // 이미 등록된 유저면 바로 기능 페이지로 이동
          router.push("/gyms")
          return
        }

        // 미등록: 로컬에 저장된 전화번호가 있으면 자동 등록 시도
        const savedPhone = localStorage.getItem(LOCAL_PHONE_KEY) || ""
        const savedWallet = localStorage.getItem(LOCAL_WALLET_KEY) || ""
        if (savedPhone) {
          const nameFromGoogle = (user.user_metadata?.full_name || user.user_metadata?.name || "").trim()
          const payload = {
            user_id: user.id,
            name: nameFromGoogle || email.split("@")[0], // 이름이 없으면 이메일 앞부분 사용
            phone: savedPhone,
            email,
            // Web3Auth 모달에서 받아 로컬에 저장해 둔 지갑주소 사용(없으면 서버에서 생성)
            wallet_address: savedWallet,
          }
          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
          const json = await res.json()
          if (!res.ok) throw new Error(json.error || "등록 실패")

          // 임시 저장 데이터 제거 후 이동
          localStorage.removeItem(LOCAL_PHONE_KEY)
          localStorage.removeItem(LOCAL_WALLET_KEY)
          router.push("/gyms")
          return
        }

        // 전화번호가 없는 경우: 로그인만 시도한 미등록 사용자로 판단 → 오류 문구 표시 및 회원가입 폼 전환
        setAuthErrorMessage("회원가입되지 않은 계정입니다. 회원가입을 진행해주세요.")
        setIsSignUp(true)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [router])

  // 연결 성공 시 지갑 주소를 로컬에 저장 (회원가입 자동 등록에 사용)
  useEffect(() => {
    (async () => {
      try {
        if (!isConnected) return
        // wagmi에서 주소가 조회되면 우선 사용
        if (isWagmiConnected && wagmiAddress) {
          localStorage.setItem(LOCAL_WALLET_KEY, wagmiAddress)
          return
        }
        // 필요 시 Web3Auth 사용자 정보 갱신 시도 (지갑 정보 포함되는 경우 대비)
        await getUserInfo().catch(() => undefined)
      } catch (e) {
        // 주소 저장 실패는 치명적이지 않으므로 콘솔만 남김
        console.error(e)
      }
    })()
  }, [isConnected, isWagmiConnected, wagmiAddress, getUserInfo])

  // 전화번호 유효성 검사 (숫자만, 9~11자리 허용)
  const isValidPhoneNumber = (value: string) => /^[0-9]{9,11}$/.test(value)

  // Web3Auth 모달 연결 핸들러
  const handleConnect = async () => {
    try {
      setAuthErrorMessage("")
      // 회원가입 플로우에서는 전화번호를 먼저 저장
      if (isSignUp) {
        if (!isValidPhoneNumber(phone)) {
          setAuthErrorMessage("올바른 전화번호를 입력해주세요. 예: 01012345678")
          return
        }
        localStorage.setItem(LOCAL_PHONE_KEY, phone)
      }
      await connect()
    } catch (e: any) {
      setAuthErrorMessage(e?.message || "로그인 중 오류가 발생했습니다.")
    }
  }

  // 전화번호는 Google 버튼 클릭 시 유효성 검사 후 저장됨

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{isSignUp ? "회원가입" : "로그인"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleConnect}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
            disabled={connectLoading || isConnected}
          >
            {connectLoading ? "Connecting..." : isConnected ? "Connected" : `Google로 ${isSignUp ? "회원가입" : "로그인"}`}
          </Button>
          {connectError && <div className="error">{connectError.message}</div>}
          {userInfoError && <div className="error">{userInfoError.message}</div>}

          {/* 로그인 실패(미등록) 시 안내 문구 */}
          {authErrorMessage && (
            <div className="text-center text-sm text-red-500">
              {authErrorMessage}
            </div>
          )}

          {isSignUp && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">전화번호 입력</span>
                </div>
              </div>

              {/* 전화번호 입력만 받는 영역 (제출 버튼 제거, Google 버튼으로 통일) */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    전화번호
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-input/50 border-border/50"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-muted-foreground hover:text-primary"
            >
              {isSignUp ? "이미 계정이 있으신가요? 로그인" : "계정이 없으신가요? 회원가입"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
