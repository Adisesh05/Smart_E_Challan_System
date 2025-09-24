"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { LocationStep } from "@/components/location-step"
import { VideoUploadStep } from "@/components/video-upload-step"
import { AnalysisResults } from "@/components/analysis-results"
import { RecentChallans } from "@/components/recent-challans"
import { useI18n } from "@/components/i18n-provider"
import { useAuth } from "@/hooks/use-auth"
import { useChallans } from "@/hooks/use-challans"
import { useVideoAnalysis } from "@/hooks/use-video-analysis"

export default function DashboardPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { user, isLoading: authLoading, requireAuth } = useAuth()
  const { challans, loadChallans, refreshChallans } = useChallans()
  const { isAnalyzing, result, analyzeVideo, clearResult } = useVideoAnalysis()

  const [location, setLocation] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [searchPlate, setSearchPlate] = useState("")

  // Check authentication on mount
  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      router.push("/auth/login")
    }
  }, [authLoading, requireAuth, router])

  // Load recent challans
  useEffect(() => {
    loadChallans()
  }, [loadChallans])

  const handleAnalyze = async () => {
    const analysisResult = await analyzeVideo(location, videoFile)
    if (analysisResult) {
      // Refresh challans to show the new one
      refreshChallans()
    }
  }

  const handleSearch = (plate: string) => {
    setSearchPlate(plate)
    loadChallans(plate || undefined)
  }

  const canAnalyze = location.trim() && videoFile && !isAnalyzing

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main id="main-content" className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-balance">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground text-pretty">{t("dashboard.subtitle")}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Analysis Section */}
          <section aria-labelledby="analysis-heading">
            <h2 id="analysis-heading" className="sr-only">
              Video Analysis
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      1
                    </span>
                    {t("dashboard.step1")}
                  </CardTitle>
                  <CardDescription>{t("dashboard.locationHelper")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <LocationStep value={location} onChange={setLocation} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      2
                    </span>
                    {t("dashboard.step2")}
                  </CardTitle>
                  <CardDescription>{t("dashboard.supportedFormats")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <VideoUploadStep
                    file={videoFile}
                    onFileChange={setVideoFile}
                    onAnalyze={handleAnalyze}
                    canAnalyze={canAnalyze}
                    isAnalyzing={isAnalyzing}
                  />
                </CardContent>
              </Card>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("dashboard.results")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnalysisResults result={result} />
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Recent Challans Section */}
          <section aria-labelledby="challans-heading">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle id="challans-heading">{t("dashboard.recentChallans")}</CardTitle>
                <CardDescription>{t("dashboard.searchByPlate")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentChallans challans={challans} onSearch={handleSearch} />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
