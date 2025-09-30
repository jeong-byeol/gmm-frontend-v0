"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
  const router = useRouter()

  // 사용자 표시용 상태
  const [displayName, setDisplayName] = useState("")
  const [displayEmail, setDisplayEmail] = useState("")
  const [displayPhone, setDisplayPhone] = useState("")
  const [walletAddress, setWalletAddress] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  // 초기 로딩: Supabase 세션과 /api/register GET으로 유저 데이터 조회
  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        // 세션 사용자
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          // 로그인되지 않은 경우 홈으로 이동
          router.replace("/")
          return
        }

        const email = user.email || ""
        setDisplayEmail(email)

        // DB 등록 데이터 조회 (프로젝트의 기존 API 활용)
        const res = await fetch(`/api/register?email=${encodeURIComponent(email)}`)
        const json = await res.json()
        if (res.ok && json.user) {
          setDisplayName(json.user.name ?? "")
          setDisplayPhone(json.user.phone ?? "")
          setWalletAddress(json.user.wallet_address ?? "")
        } else {
          // 등록 전 상태인 경우: 구글 프로필 이름을 참고
          const metaName = (user.user_metadata?.full_name || user.user_metadata?.name || "").trim()
          setDisplayName(metaName)
        }
      } catch (e) {
        console.error(e)
        alert("프로필 정보를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [router])

  return (
    <div>
      <Header />
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">내 프로필</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 프로필 상단: 아바타, 이름, 이메일 */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-border">
              <Image
                src="/placeholder-user.jpg"
                alt="프로필 이미지"
                fill
                sizes="64px"
                className="object-cover"
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-semibold truncate">{displayName || "이름 정보 없음"}</div>
              <div className="text-muted-foreground truncate">{displayEmail || "이메일 정보 없음"}</div>
            </div>
          </div>

          <Separator />

          {/* 편집 가능한 필드: 이름, 전화번호 (UI 전용) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="홍길동"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={displayPhone}
                onChange={(e) => setDisplayPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="01012345678"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* 읽기 전용 필드: 지갑 주소 */}
          <div className="space-y-2">
            <Label htmlFor="wallet">지갑 주소</Label>
            <Input id="wallet" value={walletAddress} readOnly className="bg-muted/30" placeholder="미발급" />
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


