"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, CheckCircle, XCircle, Clock, MapPin, Calendar, Wallet, RefreshCw } from "lucide-react"

interface NFTMembership {
  id: string
  gymName: string
  gymAddress: string
  membershipType: "monthly" | "pt"
  expiryDate: string
  remainingSessions?: number
  walletAddress: string
  isActive: boolean
}

const mockNFTMembership: NFTMembership = {
  id: "FIT-1735123456789",
  gymName: "스트롱 피트니스",
  gymAddress: "서울시 강남구 테헤란로 123",
  membershipType: "monthly",
  expiryDate: "2025-01-27",
  walletAddress: "0x1234...5678",
  isActive: true,
}

export function QREntry() {
  const [membership, setMembership] = useState<NFTMembership | null>(null)
  const [qrCode, setQrCode] = useState<string>("")
  const [entryStatus, setEntryStatus] = useState<"idle" | "scanning" | "success" | "failed">("idle")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // NFT 회원권 정보 로드 시뮬레이션
    const loadMembership = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setMembership(mockNFTMembership)
      setIsLoading(false)
    }

    loadMembership()
  }, [])

  useEffect(() => {
    // QR 코드 생성 (실제로는 지갑 주소와 NFT ID를 포함한 암호화된 데이터)
    if (membership) {
      const qrData = `${membership.walletAddress}:${membership.id}:${Date.now()}`
      setQrCode(qrData)
    }
  }, [membership])

  const handleScanEntry = async () => {
    setEntryStatus("scanning")

    // 입장 인증 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 90% 확률로 성공
    const isSuccess = Math.random() > 0.1
    setEntryStatus(isSuccess ? "success" : "failed")

    // 3초 후 초기화
    setTimeout(() => {
      setEntryStatus("idle")
    }, 3000)
  }

  const refreshQR = () => {
    if (membership) {
      const qrData = `${membership.walletAddress}:${membership.id}:${Date.now()}`
      setQrCode(qrData)
    }
  }

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">NFT 회원권 정보를 불러오는 중...</p>
        </CardContent>
      </Card>
    )
  }

  if (!membership) {
    return (
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardContent className="p-8 text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">NFT 회원권을 찾을 수 없습니다</h3>
          <p className="text-muted-foreground mb-4">유효한 NFT 회원권이 없거나 지갑이 연결되지 않았습니다</p>
          <Button className="bg-primary hover:bg-primary/90">헬스장 찾아보기</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* NFT 회원권 정보 */}
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />내 NFT 회원권
          </CardTitle>
          <CardDescription>블록체인에 등록된 디지털 회원권 정보</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{membership.gymName}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {membership.gymAddress}
              </p>
            </div>
            <Badge variant={membership.isActive ? "default" : "destructive"}>
              {membership.isActive ? "활성" : "비활성"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">NFT ID</span>
              <p className="font-mono text-xs">{membership.id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">이용권 타입</span>
              <p className="font-semibold">{membership.membershipType === "monthly" ? "월 이용권" : "PT 이용권"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">만료일</span>
              <p className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {membership.expiryDate}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">지갑 주소</span>
              <p className="font-mono text-xs">{membership.walletAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR 코드 */}
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            입장용 QR 코드
          </CardTitle>
          <CardDescription>헬스장 입구에서 이 QR 코드를 스캔하세요</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* QR 코드 영역 */}
          <div className="relative">
            <div className="w-64 h-64 mx-auto bg-white rounded-lg p-4 shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-16 w-16 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground font-mono break-all px-2">{qrCode}</p>
                </div>
              </div>
            </div>

            {/* 새로고침 버튼 */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-background/80"
              onClick={refreshQR}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* 입장 상태 */}
          {entryStatus !== "idle" && (
            <div className="p-4 rounded-lg border">
              {entryStatus === "scanning" && (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>입장 인증 중...</span>
                </div>
              )}
              {entryStatus === "success" && (
                <div className="flex items-center justify-center gap-2 text-accent">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">입장이 승인되었습니다!</span>
                </div>
              )}
              {entryStatus === "failed" && (
                <div className="flex items-center justify-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  <span>입장이 거부되었습니다. 다시 시도해주세요.</span>
                </div>
              )}
            </div>
          )}

          {/* 테스트 버튼 */}
          <Button
            onClick={handleScanEntry}
            disabled={entryStatus !== "idle" || !membership.isActive}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {entryStatus === "scanning" ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                인증 중...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                입장 테스트
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground">QR 코드는 보안을 위해 30초마다 자동으로 갱신됩니다</div>
        </CardContent>
      </Card>

      {/* 추가 기능 */}
      <div className="grid gap-3 md:grid-cols-2">
        <Button variant="outline" className="h-12 bg-transparent">
          NFT 재판매하기
        </Button>
        <Button variant="outline" className="h-12 bg-transparent">
          이용 내역 보기
        </Button>
      </div>
    </div>
  )
}
