"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chrome, Phone, User } from "lucide-react"

export function AuthSection() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  })

  const handleGoogleAuth = () => {
    // Google OAuth 로직 구현 예정
    console.log("Google 로그인 시작")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("회원가입 데이터:", formData)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{isSignUp ? "회원가입" : "로그인"}</CardTitle>
          <CardDescription>
            {isSignUp
              ? "NFT 헬스장 회원권으로 새로운 피트니스 경험을 시작하세요"
              : "계정에 로그인하여 NFT 회원권을 관리하세요"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleAuth}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Google로 {isSignUp ? "회원가입" : "로그인"}
          </Button>

          {isSignUp && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">추가 정보 입력</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    이름
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-input/50 border-border/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    전화번호
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="bg-input/50 border-border/50"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  회원가입 완료
                </Button>
              </form>
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
