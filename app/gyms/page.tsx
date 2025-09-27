import { GymSearch } from "@/components/gym-search"
import { Header } from "@/components/header"

export default function GymsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              헬스장 찾기
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              내 주변의 최고의 헬스장을 찾아 NFT 회원권을 구매하세요
            </p>
          </div>
          <GymSearch />
        </div>
      </main>
    </div>
  )
}
