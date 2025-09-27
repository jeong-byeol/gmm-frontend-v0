import { AuthSection } from "@/components/auth-section"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              피트니스의 미래
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance leading-relaxed">
              NFT 기술로 혁신된 헬스장 회원권.
              <br />
              언제든 재판매 가능한 디지털 자산으로 운동하세요.
            </p>
            <AuthSection />
          </div>
        </div>
      </main>
    </div>
  )
}
