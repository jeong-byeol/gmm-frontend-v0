"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function RegisterBrandPage() {
  const [brandName, setBrandName] = useState("")
  const [isSale, setIsSale] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 폼 제출 핸들러: Brands 테이블에 name, is_sale 저장
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      // 현재 로그인 유저 확인 (외래키 저장용)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert("로그인이 필요합니다.")
        return
      }
      const name = brandName.trim()
      if (!name) {
        alert("브랜드 이름을 입력해주세요.")
        return
      }

      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, name, is_sale: isSale }),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || "브랜드 등록 실패")
      }

      alert("브랜드가 등록되었습니다.")
      setBrandName("")
      setIsSale(false)
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "알 수 없는 오류")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              브랜드 등록
            </h1>
            <p className="text-lg text-muted-foreground text-balance">새로운 브랜드를 생성하고 판매 가능 여부를 설정하세요</p>
          </div>

          <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle>브랜드 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brandName">브랜드 이름</Label>
                  <Input
                    id="brandName"
                    placeholder="예) FitNFT Lab"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="isSale" checked={isSale} onCheckedChange={(v) => setIsSale(Boolean(v))} />
                  <Label htmlFor="isSale">판매 가능 (is_sale)</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "등록 중..." : "등록"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


