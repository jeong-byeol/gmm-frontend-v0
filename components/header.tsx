"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dumbbell, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useWeb3AuthDisconnect } from "@web3auth/modal/react"

export function Header() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();

  // 세션 존재 여부 확인하여 로그아웃 버튼 표시
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    })()
  }, [])

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
            <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => router.push("/gyms")}>
              헬스장 찾기
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => router.push("/profile")}>
              내정보
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => router.push("/admin")}>
              관리자
            </Button>
            {isLoggedIn && (
              <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => disconnect()}>
                <LogOut className="h-4 w-4 mr-2" /> 로그아웃
              </Button>
            )}
            {disconnectLoading && <div className="loading">Disconnecting...</div>}
            {disconnectError && <div className="error">{disconnectError.message}</div>}
          </nav>
        </div>
      </div>
    </header>
  )
}
