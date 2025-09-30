"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Bell, Settings, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"

const LOCAL_PHONE_KEY = "gmm_signup_phone"

export function AdminHeader() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    })()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem(LOCAL_PHONE_KEY)
      router.push("/")
    } catch (e) {
      console.error(e)
      alert("로그아웃 중 오류가 발생했습니다.")
    }
  }

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
            {isLoggedIn && (
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
