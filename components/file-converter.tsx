"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, Download, Loader2, Moon, Sun, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import Logo from "@/components/logo"
import ImageEditor from "@/components/image-editor"
import ImageMerger from "@/components/image-merger"
import PDFMerger from "@/components/pdf-merger"
import { convertImage, csvToJson, jsonToCsv, getOutputFilename } from "@/lib/converters"

type ConversionFormat =
  | "pdf-to-docx"
  | "docx-to-pdf"
  | "pdf-to-pptx"
  | "pptx-to-pdf"
  | "csv-to-json"
  | "json-to-csv"
  | "png-to-jpg"
  | "jpg-to-png"

type ConversionState = "idle" | "uploading" | "converting" | "success" | "error"

type AppMode = "convert" | "edit-image" | "merge-images" | "merge-pdfs"

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<ConversionFormat>("png-to-jpg")
  const [state, setState] = useState<ConversionState>("idle")
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const [mode, setMode] = useState<AppMode>("convert")
  const { theme, setTheme } = useTheme()

  const formatOptions = [
    { value: "png-to-jpg", label: "PNG → JPG", available: true },
    { value: "jpg-to-png", label: "JPG → PNG", available: true },
    { value: "csv-to-json", label: "CSV → JSON", available: true },
    { value: "json-to-csv", label: "JSON → CSV", available: true },
    { value: "pdf-to-docx", label: "PDF → Word (Demo)", available: false },
    { value: "docx-to-pdf", label: "Word → PDF (Demo)", available: false },
    { value: "pdf-to-pptx", label: "PDF → PowerPoint (Demo)", available: false },
    { value: "pptx-to-pdf", label: "PowerPoint → PDF (Demo)", available: false },
  ]

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setError(null)
      setState("idle")
      setDownloadUrl(null)
      setIsDemo(false)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setState("idle")
      setDownloadUrl(null)
      setIsDemo(false)
    }
  }

  const handleConvert = async () => {
    if (!file) return

    setState("uploading")
    setProgress(0)
    setError(null)
    setIsDemo(false)

    try {
      // Simulate upload progress
      setProgress(30)
      await new Promise((resolve) => setTimeout(resolve, 300))

      setState("converting")
      setProgress(50)

      let convertedBlob: Blob | null = null

      // Handle client-side conversions
      if (format === "png-to-jpg" || format === "jpg-to-png") {
        const targetFormat = format === "png-to-jpg" ? "jpg" : "png"
        convertedBlob = await convertImage(file, targetFormat)
      } else if (format === "csv-to-json") {
        convertedBlob = await csvToJson(file)
      } else if (format === "json-to-csv") {
        convertedBlob = await jsonToCsv(file)
      } else {
        // PDF/Office conversions - demo mode
        setIsDemo(true)
        setProgress(100)
        setState("success")
        return
      }

      if (convertedBlob) {
        // Create download URL
        const url = URL.createObjectURL(convertedBlob)
        const outputFilename = getOutputFilename(file.name, format)

        setProgress(100)
        setState("success")
        setDownloadUrl(url)

        // Trigger automatic download
        const link = document.createElement("a")
        link.href = url
        link.download = outputFilename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (err) {
      setState("error")
      setError(err instanceof Error ? err.message : "An error occurred during conversion")
      setProgress(0)
    }
  }

  const handleReset = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
    }
    setFile(null)
    setFormat("png-to-jpg")
    setState("idle")
    setProgress(0)
    setDownloadUrl(null)
    setError(null)
    setIsDemo(false)
  }

  const handleEditImage = () => {
    if (file && file.type.startsWith("image/")) {
      setMode("edit-image")
    }
  }

  if (mode === "edit-image" && file) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <ImageEditor file={file} onBack={() => setMode("convert")} />
      </div>
    )
  }

  if (mode === "merge-images") {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <ImageMerger onBack={() => setMode("convert")} />
      </div>
    )
  }

  if (mode === "merge-pdfs") {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <PDFMerger onBack={() => setMode("convert")} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 md:mb-12">
        <Logo />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </header>

      {/* Main Card */}
      <Card className="p-6 md:p-8 shadow-lg">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-balance">ফাইল কনভার্টার</h1>
            <p className="text-muted-foreground text-pretty">
              Convert, edit, and merge files instantly in your browser
            </p>
          </div>

          {/* Tabs for different modes */}
          <Tabs defaultValue="convert" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="convert">কনভার্ট (Convert)</TabsTrigger>
              <TabsTrigger value="edit">এডিট (Edit)</TabsTrigger>
              <TabsTrigger value="merge">মার্জ (Merge)</TabsTrigger>
            </TabsList>

            <TabsContent value="convert" className="space-y-6 mt-6">
              {/* Format Selector */}
              <div className="space-y-2">
                <label htmlFor="format-select" className="text-sm font-medium">
                  কনভার্শন ফরম্যাট নির্বাচন করুন (Select Conversion Format)
                </label>
                <Select value={format} onValueChange={(value) => setFormat(value as ConversionFormat)}>
                  <SelectTrigger id="format-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 md:p-12 transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input type="file" id="file-input" className="sr-only" onChange={handleFileChange} accept="*/*" />
                <label
                  htmlFor="file-input"
                  className="flex flex-col items-center justify-center cursor-pointer space-y-4"
                >
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">ফাইল ড্র্যাগ করুন বা ক্লিক করে আপলোড করুন</p>
                    <p className="text-sm text-muted-foreground">(Drag & Drop a file here or click to upload)</p>
                  </div>
                </label>
              </div>

              {/* Selected File */}
              {file && (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {(state === "uploading" || state === "converting") && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {state === "uploading" ? "আপলোড হচ্ছে... (Uploading...)" : "কনভার্ট হচ্ছে... (Converting...)"}
                    </span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Error Message */}
              {state === "error" && error && (
                <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-destructive">Error</p>
                    <p className="text-sm text-destructive/90">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {state === "success" && (
                <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-600 dark:text-green-400">
                      সফলভাবে কনভার্ট হয়েছে! (Conversion Successful!)
                    </p>
                    <p className="text-sm text-green-600/90 dark:text-green-400/90">
                      {isDemo
                        ? "This is a demo. PDF/Office conversions require a backend server."
                        : "Your file has been converted and downloaded automatically"}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {state === "success" ? (
                  <>
                    {downloadUrl && !isDemo && (
                      <Button asChild className="flex-1" size="lg">
                        <a href={downloadUrl} download={getOutputFilename(file?.name || "file", format)}>
                          <Download className="mr-2 h-5 w-5" />
                          ডাউনলোড করুন (Download Again)
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      size="lg"
                      className={downloadUrl && !isDemo ? "" : "flex-1"}
                    >
                      নতুন ফাইল (New File)
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleConvert}
                    disabled={!file || state === "uploading" || state === "converting"}
                    className="w-full"
                    size="lg"
                  >
                    {state === "uploading" || state === "converting" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        প্রসেসিং... (Processing...)
                      </>
                    ) : (
                      <>কনভার্ট শুরু করুন (Start Convert)</>
                    )}
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="edit" className="space-y-6 mt-6">
              <div className="text-center space-y-4 py-8">
                <p className="text-muted-foreground">ছবি এডিট করার জন্য একটি ছবি নির্বাচন করুন</p>
                <p className="text-sm text-muted-foreground">(Select an image file to edit)</p>

                <input
                  type="file"
                  id="edit-file-input"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0]
                    if (selectedFile && selectedFile.type.startsWith("image/")) {
                      setFile(selectedFile)
                      setMode("edit-image")
                    }
                  }}
                />
                <Button asChild size="lg">
                  <label htmlFor="edit-file-input" className="cursor-pointer">
                    <Upload className="mr-2 h-5 w-5" />
                    ছবি নির্বাচন করুন (Select Image)
                  </label>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="merge" className="space-y-6 mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <Card
                  className="p-6 space-y-4 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setMode("merge-images")}
                >
                  <div className="p-3 rounded-full bg-primary/10 w-fit">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">ছবি মার্জ (Merge Images)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      একাধিক ছবি একসাথে যুক্ত করুন (Combine multiple images into one)
                    </p>
                  </div>
                  <Button className="w-full">শুরু করুন (Start)</Button>
                </Card>

                <Card
                  className="p-6 space-y-4 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setMode("merge-pdfs")}
                >
                  <div className="p-3 rounded-full bg-primary/10 w-fit">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">PDF মার্জ (Merge PDFs)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      একাধিক PDF একসাথে যুক্ত করুন (Combine multiple PDFs into one)
                    </p>
                  </div>
                  <Button className="w-full">শুরু করুন (Start)</Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Privacy Notice */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center text-pretty">
              🔒 সম্পূর্ণ ব্রাউজার-ভিত্তিক রূপান্তর। আপনার ফাইল কখনও সার্ভারে আপলোড হয় না।
            </p>
            <p className="text-xs text-muted-foreground text-center mt-2">
              100% browser-based conversion. Your files never leave your device. Complete privacy guaranteed.
            </p>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>QuickConvert © 2025 • Free Online File Converter</p>
      </footer>
    </div>
  )
}
