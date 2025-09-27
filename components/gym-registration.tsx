"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, CreditCard, Shield, CheckCircle, Upload, X } from "lucide-react"

interface GymFormData {
  // 기본 정보
  name: string
  address: string
  phone: string
  businessNumber: string
  description: string

  // 이용권 타입
  membershipType: "gym" | "pt" | "both"

  // 가격 정책
  monthlyPrice: number
  ptPrice: number

  // 재판매 설정
  resaleEnabled: boolean
  resaleCommission: number

  // 시설 정보
  features: string[]
  images: File[]
}

const availableFeatures = [
  "24시간 운영",
  "샤워실",
  "주차장",
  "사우나",
  "개인 트레이닝",
  "그룹 수업",
  "웨이트 전문",
  "유산소 기구",
  "체성분 분석",
  "영양 상담",
  "락커룸",
  "와이파이",
]

export function GymRegistration() {
  const [formData, setFormData] = useState<GymFormData>({
    name: "",
    address: "",
    phone: "",
    businessNumber: "",
    description: "",
    membershipType: "gym",
    monthlyPrice: 0,
    ptPrice: 0,
    resaleEnabled: true,
    resaleCommission: 5,
    features: [],
    images: [],
  })

  const [step, setStep] = useState<"form" | "preview" | "success">("form")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof GymFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 등록 처리 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsSubmitting(false)
    setStep("success")
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
            <Button className="w-full bg-primary hover:bg-primary/90">관리자 대시보드로 이동</Button>
            <Button variant="outline" className="w-full bg-transparent">
              새 헬스장 등록하기
            </Button>
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
              <Shield className="h-5 w-5 text-primary" />
              등록 정보 확인
            </CardTitle>
            <CardDescription>입력한 정보를 확인하고 등록을 완료하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 기본 정보 */}
            <div>
              <h3 className="font-semibold mb-3">기본 정보</h3>
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
                  <span className="text-muted-foreground">전화번호</span>
                  <span className="font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">사업자등록번호</span>
                  <span className="font-medium">{formData.businessNumber}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* 이용권 및 가격 */}
            <div>
              <h3 className="font-semibold mb-3">이용권 및 가격</h3>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이용권 타입</span>
                  <Badge variant="secondary">
                    {formData.membershipType === "gym"
                      ? "헬스장 이용권"
                      : formData.membershipType === "pt"
                        ? "PT 전용"
                        : "헬스장 + PT"}
                  </Badge>
                </div>
                {(formData.membershipType === "gym" || formData.membershipType === "both") && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">월 이용권 가격</span>
                    <span className="font-medium text-primary">{formData.monthlyPrice.toLocaleString()}원</span>
                  </div>
                )}
                {(formData.membershipType === "pt" || formData.membershipType === "both") && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PT 이용권 가격</span>
                    <span className="font-medium text-accent">{formData.ptPrice.toLocaleString()}원</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* 재판매 설정 */}
            <div>
              <h3 className="font-semibold mb-3">재판매 설정</h3>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">재판매 허용</span>
                  <Badge variant={formData.resaleEnabled ? "default" : "secondary"}>
                    {formData.resaleEnabled ? "허용" : "비허용"}
                  </Badge>
                </div>
                {formData.resaleEnabled && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">재판매 수수료</span>
                    <span className="font-medium">{formData.resaleCommission}%</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* 시설 정보 */}
            <div>
              <h3 className="font-semibold mb-3">시설 정보</h3>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
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
      {/* 기본 정보 */}
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            기본 정보
          </CardTitle>
          <CardDescription>헬스장의 기본 정보를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
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
              <Label htmlFor="phone">전화번호 *</Label>
              <Input
                id="phone"
                placeholder="02-1234-5678"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
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
        </CardContent>
      </Card>

      {/* 이용권 타입 및 가격 */}
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            이용권 및 가격 정책
          </CardTitle>
          <CardDescription>제공할 이용권 타입과 가격을 설정하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>이용권 타입 *</Label>
            <RadioGroup
              value={formData.membershipType}
              onValueChange={(value: "gym" | "pt" | "both") => handleInputChange("membershipType", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gym" id="gym" />
                <Label htmlFor="gym">헬스장 이용권만</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pt" id="pt" />
                <Label htmlFor="pt">PT 이용권만</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">헬스장 + PT 이용권</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(formData.membershipType === "gym" || formData.membershipType === "both") && (
              <div className="space-y-2">
                <Label htmlFor="monthlyPrice">월 이용권 가격 (원) *</Label>
                <Input
                  id="monthlyPrice"
                  type="number"
                  placeholder="89000"
                  value={formData.monthlyPrice || ""}
                  onChange={(e) => handleInputChange("monthlyPrice", Number.parseInt(e.target.value) || 0)}
                  required
                />
              </div>
            )}
            {(formData.membershipType === "pt" || formData.membershipType === "both") && (
              <div className="space-y-2">
                <Label htmlFor="ptPrice">PT 이용권 가격 (원) *</Label>
                <Input
                  id="ptPrice"
                  type="number"
                  placeholder="150000"
                  value={formData.ptPrice || ""}
                  onChange={(e) => handleInputChange("ptPrice", Number.parseInt(e.target.value) || 0)}
                  required
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 재판매 설정 */}
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            재판매 설정
          </CardTitle>
          <CardDescription>NFT 회원권의 재판매 정책을 설정하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="resaleEnabled"
              checked={formData.resaleEnabled}
              onCheckedChange={(checked) => handleInputChange("resaleEnabled", checked)}
            />
            <Label htmlFor="resaleEnabled">NFT 회원권 재판매 허용</Label>
          </div>

          {formData.resaleEnabled && (
            <div className="space-y-2">
              <Label htmlFor="resaleCommission">재판매 수수료 (%)</Label>
              <Input
                id="resaleCommission"
                type="number"
                min="0"
                max="20"
                placeholder="5"
                value={formData.resaleCommission}
                onChange={(e) => handleInputChange("resaleCommission", Number.parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">재판매 시 헬스장이 받을 수수료 비율 (0-20%)</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 시설 정보 */}
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            시설 정보
          </CardTitle>
          <CardDescription>헬스장의 시설과 서비스를 선택하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">제공 시설 및 서비스</Label>
            <div className="grid gap-2 md:grid-cols-3">
              {availableFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">헬스장 사진</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">헬스장 사진을 업로드하세요 (최대 5장)</p>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => document.getElementById("images")?.click()}>
                사진 선택
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid gap-2 md:grid-cols-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">{image.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
        등록 정보 확인
      </Button>
    </form>
  )
}
