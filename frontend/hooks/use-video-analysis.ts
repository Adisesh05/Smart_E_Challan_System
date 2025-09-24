"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AnalysisResult {
  vehicle: { plate: string; type: string }
  violation: { type: string; confidence: number; location: string }
  challan: { id: number; amount: number; status: string }
}

export function useVideoAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const analyzeVideo = async (location: string, videoFile: File): Promise<AnalysisResult | null> => {
    if (!location.trim() || !videoFile) {
      toast({
        title: "Error",
        description: "Please provide both location and video file",
        variant: "destructive",
      })
      return null
    }

    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const analysisResult = await apiClient.analyzeVideo(location.trim(), videoFile)
      setResult(analysisResult)

      toast({
        title: "Success",
        description: "Video analysis completed successfully",
      })

      return analysisResult
    } catch (err: any) {
      const errorMessage = err.message || "Failed to analyze video"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearResult = () => {
    setResult(null)
    setError(null)
  }

  return {
    isAnalyzing,
    result,
    error,
    analyzeVideo,
    clearResult,
  }
}
