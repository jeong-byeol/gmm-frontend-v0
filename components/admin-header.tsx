"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Bell, Settings, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3AuthReact = require("@web3auth/modal/react") as {
  useWeb3AuthDisconnect: () => {
    disconnect: (options?: { cleanup: boolean }) => Promise<void>
    loading: boolean
    error: Error | null
  }
}
import { useAccount } from "wagmi"

const LOCAL_PHONE_KEY = "gmm_signup_phone"

export function AdminHeader() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { disconnect, loading: disconnectLoading, error: disconnectError } = Web3AuthReact.useWeb3AuthDisconnect();
  const { isConnected: isWalletConnected } = useAccount()

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    })()
  }, [])


  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                FitNFT
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                관리자
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/admin/register-brand")}>
            브랜드 등록
          </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            {(isLoggedIn || isWalletConnected) && (
              <Button variant="ghost" size="icon" onClick={() => disconnect()}>
                <LogOut className="h-5 w-5" />
              </Button>
            )}
            {disconnectLoading && <div className="loading">Disconnecting...</div>}
            {disconnectError && <div className="error">{disconnectError.message}</div>}
          </div>
        </div>
      </div>
    </header>
  )
}
