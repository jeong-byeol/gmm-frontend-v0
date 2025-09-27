"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Shield, CheckCircle, Clock, MapPin, Star, Coins, Smartphone } from "lucide-react"

interface PaymentFlowProps {
  gymId: string
}

interface GymDetails {
  id: string
  name: string
  address: string
  rating: number
  price: {
    monthly: number
    pt: number
  }
  type: "gym" | "pt"
  features: string[]
  image: string
}

const mockGymDetails: GymDetails = {
  id: "1",
  name: "스트롱 피트니스",
  address: "서울시 강남구 테헤란로 123",
  rating: 4.8,
  price: { monthly: 89000, pt: 150000 },
  type: "gym",
  features: ["24시간", "샤워실", "주차장", "개인 트레이닝"],
  image: "/placeholder.svg?key=y8mkv",
}

export function PaymentFlow({ gymId }: PaymentFlowProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "pt">("monthly")
  const [paymentMethod, setPaymentMethod] = useState<"kakao" | "crypto">("kakao")
  const [step, setStep] = useState<"select" | "payment" | "success">("select")
  const [isProcessing, setIsProcessing] = useState(false)

  const gym = mockGymDetails // 실제로는 gymId로 데이터 조회

  const handlePayment = async () => {
    setIsProcessing(true)

    // 결제 처리 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setStep("success")
  }

  if (step === "success") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="backdrop-blur-sm bg-card/80 border-border/50 text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">NFT 회원권 발급 완료!</h2>
              <p className="text-muted-foreground">블록체인에 등록된 디지털 회원권이 발급되었습니다</p>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">NFT ID</span>
                <span className="font-mono text-sm">#FIT-{Date.now()}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">헬스장</span>
                <span className="font-semibold">{gym.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">이용권 타입</span>
                <Badge variant="secondary">{selectedPlan === "monthly" ? "월 이용권" : "PT 이용권"}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90">내 NFT 지갑 보기</Button>
              <Button variant="outline" className="w-full bg-transparent">
                QR 코드로 입장하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 헬스장 정보 */}
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            선택한 헬스장
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <img src={gym.image || "/placeholder.svg"} alt={gym.name} className="w-20 h-20 rounded-lg object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{gym.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {gym.address}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{gym.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {gym.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 결제 정보 */}
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardHeader>
          <CardTitle>이용권 선택 및 결제</CardTitle>
          <CardDescription>원하는 이용권을 선택하고 결제 방법을 선택하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 이용권 선택 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">이용권 타입</Label>
            <RadioGroup value={selectedPlan} onValueChange={(value: "monthly" | "pt") => setSelectedPlan(value)}>
              {gym.type === "gym" && (
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-secondary/50">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span>월 이용권</span>
                      <span className="font-semibold text-primary">{gym.price.monthly.toLocaleString()}원</span>
                    </div>
                  </Label>
                </div>
              )}
              {gym.price.pt > 0 && (
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-secondary/50">
                  <RadioGroupItem value="pt" id="pt" />
                  <Label htmlFor="pt" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span>PT 이용권</span>
                      <span className="font-semibold text-accent">{gym.price.pt.toLocaleString()}원</span>
                    </div>
                  </Label>
                </div>
              )}
            </RadioGroup>
          </div>

          <Separator />

          {/* 결제 방법 선택 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">결제 방법</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: "kakao" | "crypto") => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-secondary/50">
                <RadioGroupItem value="kakao" id="kakao" />
                <Label htmlFor="kakao" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">카카오페이</div>
                      <div className="text-sm text-muted-foreground">간편하고 안전한 결제</div>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-secondary/50">
                <RadioGroupItem value="crypto" id="crypto" />
                <Label htmlFor="crypto" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium">스테이블코인 (USDT)</div>
                      <div className="text-sm text-muted-foreground">블록체인 직접 결제</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* 결제 요약 */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>이용권 가격</span>
              <span className="font-semibold">
                {selectedPlan === "monthly" ? gym.price.monthly.toLocaleString() : gym.price.pt.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>NFT 발급 수수료</span>
              <span>무료</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>총 결제 금액</span>
              <span className="text-primary">
                {selectedPlan === "monthly" ? gym.price.monthly.toLocaleString() : gym.price.pt.toLocaleString()}원
              </span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                결제 처리 중...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                {paymentMethod === "kakao" ? "카카오페이로" : "스테이블코인으로"} 결제하기
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground text-center">결제 완료 후 NFT 회원권이 자동으로 발급됩니다</div>
        </CardContent>
      </Card>
    </div>
  )
}
