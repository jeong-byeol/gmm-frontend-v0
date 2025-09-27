import { PaymentFlow } from "@/components/payment-flow"
import { Header } from "@/components/header"

interface PaymentPageProps {
  params: {
    gymId: string
  }
}

export default function PaymentPage({ params }: PaymentPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              NFT 회원권 구매
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              안전한 결제로 디지털 헬스장 회원권을 발급받으세요
            </p>
          </div>
          <PaymentFlow gymId={params.gymId} />
        </div>
      </main>
    </div>
  )
}
