import { GymRegistration } from "@/components/gym-registration"
import { AdminHeader } from "@/components/admin-header"

export default function RegisterGymPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              헬스장 등록
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              새로운 헬스장을 플랫폼에 등록하여 NFT 회원권 서비스를 시작하세요
            </p>
          </div>
          <GymRegistration />
        </div>
      </main>
    </div>
  )
}
