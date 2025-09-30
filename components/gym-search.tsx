"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function GymSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [gyms, setGyms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // 상세보기 토글 상태: 선택된 헬스장의 gym_id 저장
  const [expandedGymId, setExpandedGymId] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/gyms")
        const json = await res.json()
        if (res.ok) {
          setGyms(json.gyms || [])
        } else {
          console.error(json.error)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const filteredGyms = gyms.filter((gym) => {
    const matchesSearch =
      (gym.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gym.address || "").toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <Card className="backdrop-blur-sm bg-card/80 border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="헬스장 이름 또는 주소로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input/50 border-border/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 헬스장 목록 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGyms.map((gym) => (
          <Card
            key={gym.gym_id}
            className="backdrop-blur-sm bg-card/80 border-border/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">{gym.name}</CardTitle>
                  {gym.Brands?.name && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>브랜드: {gym.Brands.name}</span>
                      {typeof gym.Brands?.is_sale === "boolean" && (
                        <Badge variant={gym.Brands.is_sale ? "secondary" : "outline"}>
                          {gym.Brands.is_sale ? "재판매 가능" : "재판매 불가"}
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {gym.address}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                {gym.one_month != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">1개월권</span>
                    <span className="font-semibold text-primary">{Number(gym.one_month).toLocaleString()}원</span>
                  </div>
                )}
                {gym.three_month != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">3개월권</span>
                    <span className="font-semibold text-primary">{Number(gym.three_month).toLocaleString()}원</span>
                  </div>
                )}
                {gym.pt_ten_times != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">PT 10회</span>
                    <span className="font-semibold text-accent">{Number(gym.pt_ten_times).toLocaleString()}원</span>
                  </div>
                )}
                {gym.pt_twenty_times != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">PT 20회</span>
                    <span className="font-semibold text-accent">{Number(gym.pt_twenty_times).toLocaleString()}원</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setExpandedGymId(expandedGymId === gym.gym_id ? null : gym.gym_id)}
                >
                  {expandedGymId === gym.gym_id ? "접기" : "상세보기"}
                </Button>
                <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => router.push(`/gyms/payment/${gym.gym_id}`)}
                >
                  NFT 회원권 구매
                </Button>
              </div>

              {/* 상세 정보: 사업자등록번호, 소개 */}
              {expandedGymId === gym.gym_id && (
                <div className="mt-3 space-y-2 rounded-md border border-border/50 p-3 bg-card/60">
                  <div className="text-sm">
                    <span className="text-muted-foreground">사업자등록번호: </span>
                    <span className="font-medium">{gym.business_number || "정보 없음"}</span>
                  </div>
                  {gym.description && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">소개: </span>
                      <span className="whitespace-pre-wrap">{gym.description}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGyms.length === 0 && !isLoading && (
        <Card className="backdrop-blur-sm bg-card/80 border-border/50">
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">검색 결과가 없습니다</p>
              <p className="text-sm">다른 검색어를 시도해보세요</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
