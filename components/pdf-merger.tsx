"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Download, Upload, X, FileText, ArrowUp, ArrowDown } from "lucide-react"

interface PDFMergerProps {
  onBack: () => void
}

interface PDFFile {
  file: File
  id: string
}

export default function PDFMerger({ onBack }: PDFMergerProps) {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPdfs = files
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
      }))

    setPdfFiles((prev) => [...prev, ...newPdfs])
  }

  const removeFile = (id: string) => {
    setPdfFiles((prev) => prev.filter((pdf) => pdf.id !== id))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newFiles = [...pdfFiles]
    ;[newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]]
    setPdfFiles(newFiles)
  }

  const moveDown = (index: number) => {
    if (index === pdfFiles.length - 1) return
    const newFiles = [...pdfFiles]
    ;[newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]]
    setPdfFiles(newFiles)
  }

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      alert("অন্তত দুটি PDF ফাইল যোগ করুন (Please add at least 2 PDF files)")
      return
    }

    try {
      // Dynamic import of pdf-lib
      const { PDFDocument } = await import("pdf-lib")

      const mergedPdf = await PDFDocument.create()

      for (const pdfFile of pdfFiles) {
        const arrayBuffer = await pdfFile.file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `merged-${Date.now()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] PDF merge error:", error)
      alert("PDF মার্জ করতে সমস্যা হয়েছে (Error merging PDFs)")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">PDF মার্জ করুন (Merge PDFs)</h2>
        <Button variant="outline" onClick={onBack}>
          ← ফিরে যান (Back)
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* File List */}
        <Card className="p-6 space-y-4">
          <div>
            <Label htmlFor="pdf-upload">PDF ফাইল যোগ করুন (Add PDF Files)</Label>
            <input
              type="file"
              id="pdf-upload"
              multiple
              accept="application/pdf"
              onChange={handleFileChange}
              className="sr-only"
            />
            <Button asChild variant="outline" className="w-full mt-2 bg-transparent">
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                PDF নির্বাচন করুন (Select PDFs)
              </label>
            </Button>
          </div>

          {pdfFiles.length > 0 && (
            <div className="space-y-2">
              <Label>যোগ করা PDF ({pdfFiles.length})</Label>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pdfFiles.map((pdf, index) => (
                  <div key={pdf.id} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{pdf.file.name}</p>
                      <p className="text-xs text-muted-foreground">{(pdf.file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => moveUp(index)} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveDown(index)}
                        disabled={index === pdfFiles.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(pdf.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Instructions */}
        <Card className="p-6 space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">কিভাবে ব্যবহার করবেন (How to Use)</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>একাধিক PDF ফাইল নির্বাচন করুন (Select multiple PDF files)</li>
                <li>তীর বোতাম দিয়ে ক্রম পরিবর্তন করুন (Reorder using arrow buttons)</li>
                <li>মার্জ বোতামে ক্লিক করুন (Click merge button)</li>
                <li>মার্জ করা PDF ডাউনলোড হবে (Merged PDF will download)</li>
              </ol>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium">✨ সম্পূর্ণ ব্রাউজার-ভিত্তিক</p>
              <p className="text-xs text-muted-foreground mt-1">
                আপনার PDF ফাইল কখনও সার্ভারে আপলোড হয় না। সম্পূর্ণ গোপনীয়তা নিশ্চিত।
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                100% browser-based. Your PDFs never leave your device. Complete privacy guaranteed.
              </p>
            </div>
          </div>

          <Button onClick={handleMerge} disabled={pdfFiles.length < 2} className="w-full" size="lg">
            <Download className="mr-2 h-5 w-5" />
            PDF মার্জ করুন (Merge PDFs)
          </Button>
        </Card>
      </div>
    </div>
  )
}
