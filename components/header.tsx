import { Button } from "@/components/ui/button"
import { Dumbbell, Menu } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FitNFT
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              헬스장 찾기
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              내 NFT
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              지원
            </Button>
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
