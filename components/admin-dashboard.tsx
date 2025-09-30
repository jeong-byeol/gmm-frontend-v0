"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Users,
  CreditCard,
  Building2,
  Calendar,
  BarChart3,
  DollarSign,
  Activity,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface DashboardStats {
  totalRevenue: number
  totalMembers: number
  activeGyms: number
  monthlyGrowth: number
}

interface GymData {
  id: string
  name: string
  address: string
  totalMembers: number
  monthlyRevenue: number
  status: "active" | "pending" | "suspended"
  joinDate: string
}

const mockStats: DashboardStats = {
  totalRevenue: 45600000,
  totalMembers: 1247,
  activeGyms: 23,
  monthlyGrowth: 12.5,
}

const mockGyms: GymData[] = [
  {
    id: "1",
    name: "스트롱 피트니스",
    address: "서울시 강남구 테헤란로 123",
    totalMembers: 156,
    monthlyRevenue: 8900000,
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "프리미엄 PT 스튜디오",
    address: "서울시 강남구 역삼동 456",
    totalMembers: 89,
    monthlyRevenue: 12400000,
    status: "active",
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "파워 짐",
    address: "서울시 서초구 서초대로 789",
    totalMembers: 203,
    monthlyRevenue: 6700000,
    status: "pending",
    joinDate: "2024-12-01",
  },
]

export function AdminDashboard() {
  const [stats] = useState<DashboardStats>(mockStats)
  const [gyms] = useState<GymData[]>(mockGyms)
  const router = useRouter()
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-accent text-accent-foreground">활성</Badge>
      case "pending":
        return <Badge variant="secondary">대기</Badge>
      case "suspended":
        return <Badge variant="destructive">정지</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* 대시보드 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">관리자 대시보드</h1>
          <p className="text-muted-foreground">헬스장 운영 현황과 수익을 한눈에 확인하세요</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/admin/register-gym")}>새 헬스장 등록</Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-sm bg-card/80 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 수익</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalRevenue.toLocaleString()}원</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">+{stats.monthlyGrowth}%</span> 전월 대비
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-card/80 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 회원 수</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalMembers.toLocaleString()}명</div>
            <p className="text-xs text-muted-foreground">활성 NFT 회원권 보유자</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-card/80 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">등록 헬스장</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.activeGyms}개</div>
            <p className="text-xs text-muted-foreground">플랫폼 파트너 헬스장</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-card/80 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">월 성장률</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">+{stats.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">신규 회원 증가율</p>
          </CardContent>
        </Card>
      </div>

      {/* 탭 컨텐츠 */}
      <Tabs defaultValue="gyms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gyms">헬스장 관리</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
          <TabsTrigger value="transactions">거래 내역</TabsTrigger>
        </TabsList>

        <TabsContent value="gyms" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <CardTitle>등록된 헬스장</CardTitle>
              <CardDescription>플랫폼에 등록된 모든 헬스장을 관리하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gyms.map((gym) => (
                  <div
                    key={gym.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{gym.name}</h3>
                        {getStatusBadge(gym.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{gym.address}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {gym.totalMembers}명
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {gym.monthlyRevenue.toLocaleString()}원/월
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {gym.joinDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        보기
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  월별 수익 추이
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>차트 데이터 로딩 중...</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  회원 증가 추이
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>차트 데이터 로딩 중...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/80 border-border/50">
            <CardHeader>
              <CardTitle>최근 거래 내역</CardTitle>
              <CardDescription>NFT 회원권 구매 및 재판매 거래 내역</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">NFT 회원권 구매</p>
                      <p className="text-sm text-muted-foreground">스트롱 피트니스 - 월 이용권</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">89,000원</p>
                      <p className="text-xs text-muted-foreground">2024-12-{27 - i} 14:30</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
