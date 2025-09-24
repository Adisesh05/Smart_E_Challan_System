"use client"

import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccessibilityControls } from "@/components/accessibility-controls"
import { useI18n } from "@/components/i18n-provider"
import { useToast } from "@/hooks/use-toast"

export function DashboardHeader() {
  const { t } = useI18n()
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    toast({
      title: t("common.success"),
      description: "Logged out successfully",
    })
    router.push("/auth/login")
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">{t("dashboard.title")}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <AccessibilityControls />
            <LanguageSelector />
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Account menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("auth.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
