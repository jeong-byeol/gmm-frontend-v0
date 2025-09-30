"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"

// OAuth 회원가입 시 전화번호 임시 저장 키 (리다이렉트 복귀 후 사용)
const LOCAL_PHONE_KEY = "gmm_signup_phone"

export function AuthSection() {
  const router = useRouter()

  const [isSignUp, setIsSignUp] = useState(false)
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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
        if (savedPhone) {
          const nameFromGoogle = (user.user_metadata?.full_name || user.user_metadata?.name || "").trim()
          const payload = {
            user_id: user.id,
            name: nameFromGoogle || email.split("@")[0], // 이름이 없으면 이메일 앞부분 사용
            phone: savedPhone,
            email,
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

  // Google OAuth 시작
  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true)

      // 회원가입 모드에서는 전화번호만 유효성 검사
      if (isSignUp) {
        const rawPhone = (phone || "").trim()
        const digitsOnly = rawPhone.replace(/\D/g, "")
        if (!digitsOnly) {
          alert("전화번호를 입력해주세요.")
          return
        }
        if (digitsOnly.length < 9 || digitsOnly.length > 12) {
          alert("전화번호 형식을 확인해주세요.")
          return
        }
        // 리다이렉트 복귀 후 자동 등록을 위해 로컬에 저장
        localStorage.setItem(LOCAL_PHONE_KEY, digitsOnly)
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      })
      if (error) throw error
    } catch (err) {
      console.error(err)
      alert("구글 인증 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
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
            onClick={handleGoogleAuth}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
            disabled={isLoading}
          >
            Google로 {isSignUp ? "회원가입" : "로그인"}
          </Button>

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
