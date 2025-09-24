"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, X, Play, FileVideo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LiveRegion } from "@/components/ui/live-region"
import { useI18n } from "@/components/i18n-provider"
import { useToast } from "@/hooks/use-toast"

interface VideoUploadStepProps {
  file: File | null
  onFileChange: (file: File | null) => void
  onAnalyze: () => void
  canAnalyze: boolean
  isAnalyzing: boolean
}

export function VideoUploadStep({ file, onFileChange, onAnalyze, canAnalyze, isAnalyzing }: VideoUploadStepProps) {
  const { t } = useI18n()
  const { toast } = useToast()
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [liveMessage, setLiveMessage] = useState("")

  const acceptedTypes = [".mp4", ".mov", ".mkv"]
  const maxFileSize = 100 * 1024 * 1024 // 100MB

  const validateFile = (file: File): boolean => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

    if (!acceptedTypes.includes(fileExtension)) {
      const errorMessage = `Unsupported file type. Please use: ${acceptedTypes.join(", ")}`
      setLiveMessage(errorMessage)
      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }

    if (file.size > maxFileSize) {
      const errorMessage = t("dashboard.maxFileSize")
      setLiveMessage(errorMessage)
      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      if (validateFile(selectedFile)) {
        onFileChange(selectedFile)
        setLiveMessage(`File selected: ${selectedFile.name}`)

        // Simulate upload progress
        setUploadProgress(0)
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              const successMessage = t("dashboard.uploadSuccess")
              setLiveMessage(successMessage)
              toast({
                title: t("common.success"),
                description: successMessage,
              })
              return 100
            }
            return prev + 10
          })
        }, 100)
      }
    },
    [onFileChange, toast, t],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        handleFileSelect(droppedFiles[0])
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleKeyboardActivation = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      document.getElementById("video-upload")?.click()
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const removeFile = () => {
    onFileChange(null)
    setUploadProgress(0)
    setLiveMessage("File removed")
  }

  return (
    <div className="space-y-4">
      <LiveRegion message={liveMessage} />

      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
            isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyboardActivation}
          aria-label={t("dashboard.dragDropText")}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-muted" aria-hidden="true">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("dashboard.dragDropText")}</p>
              <p className="text-xs text-muted-foreground">{t("dashboard.supportedFormats")}</p>
              <p className="text-xs text-muted-foreground">{t("dashboard.maxFileSize")}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("video-upload")?.click()}
              data-testid="upload-button"
            >
              <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
              {t("common.upload")}
            </Button>
            <input
              id="video-upload"
              type="file"
              accept={acceptedTypes.join(",")}
              onChange={handleFileInputChange}
              className="hidden"
              aria-label={t("dashboard.uploadVideo")}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 border rounded-lg bg-muted/50">
            <div className="p-2 rounded bg-primary/10" aria-hidden="true">
              <FileVideo className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} • {file.type}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              aria-label={`Remove file ${file.name}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" aria-label={`Upload progress: ${uploadProgress}%`} />
            </div>
          )}

          <Button
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className="w-full"
            data-testid="analyze-button"
            aria-describedby="analyze-status"
          >
            {isAnalyzing ? (
              <>
                <div
                  className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
                {t("dashboard.analyzing")}
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                {t("dashboard.analyze")}
              </>
            )}
          </Button>
          <div id="analyze-status" className="sr-only">
            {isAnalyzing
              ? "Analysis in progress"
              : canAnalyze
                ? "Ready to analyze"
                : "Please provide location and video file"}
          </div>
        </div>
      )}
    </div>
  )
}
