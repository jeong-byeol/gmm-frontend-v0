"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Star, Dumbbell, Zap } from "lucide-react"

interface Gym {
  id: string
  name: string
  address: string
  rating: number
  distance: string
  price: {
    monthly: number
    pt: number
  }
  features: string[]
  type: "gym" | "pt"
  image: string
  available: boolean
}

const mockGyms: Gym[] = [
  {
    id: "1",
    name: "스트롱 피트니스",
    address: "서울시 강남구 테헤란로 123",
    rating: 4.8,
    distance: "0.5km",
    price: { monthly: 89000, pt: 150000 },
    features: ["24시간", "샤워실", "주차장", "개인 트레이닝"],
    type: "gym",
    image: "/modern-gym-interior.png",
    available: true,
  },
  {
    id: "2",
    name: "프리미엄 PT 스튜디오",
    address: "서울시 강남구 역삼동 456",
    rating: 4.9,
    distance: "0.8km",
    price: { monthly: 0, pt: 200000 },
    features: ["개인 트레이닝 전문", "영양 상담", "체성분 분석"],
    type: "pt",
    image: "/personal-training-studio.jpg",
    available: true,
  },
  {
    id: "3",
    name: "파워 짐",
    address: "서울시 서초구 서초대로 789",
    rating: 4.6,
    distance: "1.2km",
    price: { monthly: 75000, pt: 120000 },
    features: ["웨이트 전문", "그룹 수업", "사우나"],
    type: "gym",
    image: "/weight-training-gym.jpg",
    available: false,
  },
]

export function GymSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "gym" | "pt">("all")
  const [gyms] = useState<Gym[]>(mockGyms)

  const filteredGyms = gyms.filter((gym) => {
    const matchesSearch =
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || gym.type === selectedType
    return matchesSearch && matchesType
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
            <div className="flex gap-2">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => setSelectedType("all")}
                className="bg-primary hover:bg-primary/90"
              >
                전체
              </Button>
              <Button
                variant={selectedType === "gym" ? "default" : "outline"}
                onClick={() => setSelectedType("gym")}
                className="bg-primary hover:bg-primary/90"
              >
                <Dumbbell className="mr-2 h-4 w-4" />
                헬스장
              </Button>
              <Button
                variant={selectedType === "pt" ? "default" : "outline"}
                onClick={() => setSelectedType("pt")}
                className="bg-primary hover:bg-primary/90"
              >
                <Zap className="mr-2 h-4 w-4" />
                PT 전용
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 헬스장 목록 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGyms.map((gym) => (
          <Card
            key={gym.id}
            className="backdrop-blur-sm bg-card/80 border-border/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="relative">
              <img src={gym.image || "/placeholder.svg"} alt={gym.name} className="w-full h-48 object-cover" />
              {!gym.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-sm">
                    매진
                  </Badge>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-background/80 text-foreground">
                  {gym.type === "pt" ? "PT 전용" : "헬스장"}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">{gym.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {gym.address}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{gym.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{gym.distance}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {gym.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                {gym.type === "gym" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">월 이용권</span>
                    <span className="font-semibold text-primary">{gym.price.monthly.toLocaleString()}원</span>
                  </div>
                )}
                {gym.price.pt > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">PT 이용권</span>
                    <span className="font-semibold text-accent">{gym.price.pt.toLocaleString()}원</span>
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!gym.available}
              >
                {gym.available ? "NFT 회원권 구매" : "매진"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGyms.length === 0 && (
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
