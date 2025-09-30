"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type GymFormData = {
  brandId: string
  name: string
  address: string
  businessNumber: string
  description: string
  oneMonth: string
  threeMonth: string
  ptTenTimes: string
  ptTwentyTimes: string
}

export function GymRegistration() {
  const [formData, setFormData] = useState<GymFormData>({
    brandId: "",
    name: "",
    address: "",
    businessNumber: "",
    description: "",
    oneMonth: "",
    threeMonth: "",
    ptTenTimes: "",
    ptTwentyTimes: "",
  })

  // 로그인 사용자의 브랜드 목록 상태
  const [brands, setBrands] = useState<Array<{ brand_id: string; name: string }>>([])
  const router = useRouter()
  const [step, setStep] = useState<"form" | "preview" | "success">("form")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 폼 상태 업데이트 유틸 (안전한 키만 허용)
  const handleInputChange = (field: keyof GymFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // 최초 진입 시: 로그인 사용자 확인 후 보유 브랜드 목록 로드
  useEffect(() => {
    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const res = await fetch(`/api/brands?user_id=${encodeURIComponent(user.id)}`)
        const json = await res.json()
        if (res.ok && Array.isArray(json.brands)) {
          setBrands(json.brands)
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // 로그인 여부 확인 (브랜드 소유자와 연결 필요 시 사용 가능)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert("로그인이 필요합니다.")
        setIsSubmitting(false)
        return
      }

      // 필수값 검증
      if (!formData.brandId.trim()) {
        alert("브랜드 ID를 입력해주세요.")
        setIsSubmitting(false)
        return
      }
      if (!formData.name.trim() || !formData.address.trim() || !formData.businessNumber.trim()) {
        alert("이름/주소/사업자등록번호를 모두 입력해주세요.")
        setIsSubmitting(false)
        return
      }

      // DB 저장 요청 (가격 필드는 숫자 변환 후 없으면 null 처리)
      const payload = {
        brand_id: formData.brandId.trim() || undefined,
        name: formData.name,
        address: formData.address,
        business_number: formData.businessNumber,
        description: formData.description,
        one_month: formData.oneMonth ? Number(formData.oneMonth) : null,
        three_month: formData.threeMonth ? Number(formData.threeMonth) : null,
        pt_ten_times: formData.ptTenTimes ? Number(formData.ptTenTimes) : null,
        pt_twenty_times: formData.ptTwentyTimes ? Number(formData.ptTwentyTimes) : null,
      }

      const res = await fetch("/api/gyms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "헬스장 등록 실패")

      setIsSubmitting(false)
      setStep("success")
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "알 수 없는 오류")
      setIsSubmitting(false)
    }
  }

  if (step === "success") {
    return (
      <Card className="backdrop-blur-sm bg-card/80 border-border/50 text-center">
        <CardContent className="p-8">
          <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">헬스장 등록 완료!</h2>
          <p className="text-muted-foreground mb-6">
            {formData.name}이(가) 성공적으로 등록되었습니다.
            <br />
            검토 후 승인되면 NFT 회원권 서비스를 시작할 수 있습니다.
          </p>
          <div className="space-y-3">
            <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => router.push("/admin")}>관리자 대시보드로 이동</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === "preview") {
    return (
      <div className="space-y-6">
        <Card className="backdrop-blur-sm bg-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              등록 정보 확인
            </CardTitle>
            <CardDescription>입력한 정보를 확인하고 등록을 완료하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">헬스장 이름</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주소</span>
                <span className="font-medium">{formData.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">사업자등록번호</span>
                <span className="font-medium">{formData.businessNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground">소개</span>
                <p className="mt-1 whitespace-pre-wrap">{formData.description}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
                수정하기
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90">
                {isSubmitting ? "등록 중..." : "등록 완료"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setStep("preview")
      }}
      className="space-y-6"
    >
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            기본 정보
          </CardTitle>
          <CardDescription>헬스장의 기본 정보를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 브랜드 선택: 텍스트 입력 대신 드롭다운으로 대체 */}
          <div className="space-y-2">
            <Label htmlFor="brandId">브랜드 선택 *</Label>
            <select
              id="brandId"
              value={formData.brandId}
              onChange={(e) => handleInputChange("brandId", e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-input/50 px-3 text-sm"
              required
            >
              <option value="" disabled>
                브랜드를 선택하세요
              </option>
              {brands.map((b) => (
                <option key={b.brand_id} value={b.brand_id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">헬스장 이름 *</Label>
            <Input
              id="name"
              placeholder="예: 스트롱 피트니스"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">주소 *</Label>
            <Input
              id="address"
              placeholder="서울시 강남구 테헤란로 123"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessNumber">사업자등록번호 *</Label>
            <Input
              id="businessNumber"
              placeholder="123-45-67890"
              value={formData.businessNumber}
              onChange={(e) => handleInputChange("businessNumber", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">헬스장 소개</Label>
            <Textarea
              id="description"
              placeholder="헬스장의 특징과 장점을 소개해주세요"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="oneMonth">1개월권 (원)</Label>
              <Input
                id="oneMonth"
                type="number"
                placeholder="89000"
                value={formData.oneMonth}
                onChange={(e) => handleInputChange("oneMonth", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threeMonth">3개월권 (원)</Label>
              <Input
                id="threeMonth"
                type="number"
                placeholder="249000"
                value={formData.threeMonth}
                onChange={(e) => handleInputChange("threeMonth", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ptTenTimes">PT 10회 (원)</Label>
              <Input
                id="ptTenTimes"
                type="number"
                placeholder="800000"
                value={formData.ptTenTimes}
                onChange={(e) => handleInputChange("ptTenTimes", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ptTwentyTimes">PT 20회 (원)</Label>
              <Input
                id="ptTwentyTimes"
                type="number"
                placeholder="1500000"
                value={formData.ptTwentyTimes}
                onChange={(e) => handleInputChange("ptTwentyTimes", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
        등록 정보 확인
      </Button>
    </form>
  )
}
