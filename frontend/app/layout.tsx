import type React from "react"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"
import { AccessibilityProvider } from "@/components/accessibility-provider"
import { Toaster } from "@/components/ui/toaster"
import { SkipLink } from "@/components/ui/skip-link"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <ThemeProvider>
          <AccessibilityProvider>
            <I18nProvider>
              {children}
              <Toaster />
            </I18nProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
