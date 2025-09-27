import { QREntry } from "@/components/qr-entry"
import { Header } from "@/components/header"

export default function QREntryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              헬스장 입장
            </h1>
            <p className="text-lg text-muted-foreground text-balance">NFT 회원권 QR 코드로 간편하게 입장하세요</p>
          </div>
          <QREntry />
        </div>
      </main>
    </div>
  )
}
