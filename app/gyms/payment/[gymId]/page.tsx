"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type GymItem = {
  gym_id: string
  name: string
  address: string
  business_number: string | null
  description: string | null
  one_month: number | null
  three_month: number | null
  pt_ten_times: number | null
  pt_twenty_times: number | null
  Brands?: { name?: string; is_sale?: boolean } | null
}

export default function GymPaymentPage() {
  const router = useRouter()
  const params = useParams()
  const gymId = String(params?.gymId || "")

  // 선택 가능한 상품 옵션 목록
  const [gym, setGym] = useState<GymItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSku, setSelectedSku] = useState<string>("")

  // 가격 옵션 가공
  const priceOptions = useMemo(() => {
    if (!gym) return [] as Array<{ key: string; label: string; price: number }>
    const options: Array<{ key: string; label: string; price: number }> = []
    if (gym.one_month != null) options.push({ key: "one_month", label: "1개월권", price: Number(gym.one_month) })
    if (gym.three_month != null) options.push({ key: "three_month", label: "3개월권", price: Number(gym.three_month) })
    if (gym.pt_ten_times != null) options.push({ key: "pt_ten_times", label: "PT 10회", price: Number(gym.pt_ten_times) })
    if (gym.pt_twenty_times != null) options.push({ key: "pt_twenty_times", label: "PT 20회", price: Number(gym.pt_twenty_times) })
    return options
  }, [gym])

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        // 헬스장 전체 목록을 받아서 해당 ID를 필터 (간단 구현)
        const res = await fetch("/api/gyms")
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "헬스장 정보를 불러오지 못했습니다.")
        const found = (json.gyms as GymItem[]).find((g) => g.gym_id === gymId) || null
        setGym(found)
        // 기본 선택값: 첫 번째 옵션
        if (found) {
          const opts = [] as string[]
          if (found.one_month != null) opts.push("one_month")
          if (found.three_month != null) opts.push("three_month")
          if (found.pt_ten_times != null) opts.push("pt_ten_times")
          if (found.pt_twenty_times != null) opts.push("pt_twenty_times")
          setSelectedSku(opts[0] || "")
        }
      } catch (e) {
        console.error(e)
        alert("결제 페이지 데이터를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [gymId])

  const selectedPrice = useMemo(() => {
    const match = priceOptions.find((o) => o.key === selectedSku)
    return match?.price ?? 0
  }, [priceOptions, selectedSku])

  const handlePay = async () => {
    try {
      if (!gym) {
        alert("헬스장 정보를 확인할 수 없습니다.")
        return
      }
      if (!selectedSku) {
        alert("결제할 상품 옵션을 선택해주세요.")
        return
      }
      // 결제 처리 자리 (결제 PG 연동 전 임시 안내)
      alert(`${gym.name} - ${priceOptions.find((o) => o.key === selectedSku)?.label} \n결제금액: ${selectedPrice.toLocaleString()}원`)
      router.push("/profile")
    } catch (e) {
      console.error(e)
      alert("결제 처리 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {/* 헬스장/브랜드 정보 영역 */}
                {isLoading ? "로딩 중..." : gym ? gym.name : "헬스장 정보를 찾을 수 없습니다"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 상품 옵션 선택 영역 */}
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">원하는 이용권을 선택하세요</div>
                <RadioGroup value={selectedSku} onValueChange={setSelectedSku} className="grid gap-3">
                  {priceOptions.length === 0 && (
                    <div className="text-sm text-muted-foreground">구매 가능한 상품이 없습니다</div>
                  )}
                  {priceOptions.map((opt) => (
                    <Label key={opt.key} htmlFor={opt.key} className="flex items-center justify-between p-4 rounded-md border border-border/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem id={opt.key} value={opt.key} />
                        <span className="font-medium">{opt.label}</span>
                      </div>
                      <span className="font-semibold">{opt.price.toLocaleString()}원</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              {/* 요약/결제 영역 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">선택 상품</span>
                  <span className="font-medium">
                    {priceOptions.find((o) => o.key === selectedSku)?.label || "미선택"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="text-muted-foreground">결제 금액</span>
                  <span className="font-bold text-primary">{selectedPrice.toLocaleString()}원</span>
                </div>
                <Button className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handlePay} disabled={isLoading || !selectedSku}>
                  결제하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


