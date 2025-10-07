"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Upload, X } from "lucide-react"

interface ImageMergerProps {
  onBack: () => void
}

type MergeLayout = "horizontal" | "vertical" | "grid"

export default function ImageMerger({ onBack }: ImageMergerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [layout, setLayout] = useState<MergeLayout>("horizontal")
  const [spacing, setSpacing] = useState(10)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      const img = new Image()
      img.onload = () => {
        setImages((prev) => [...prev, img])
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (images.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Calculate dimensions based on layout
    let totalWidth = 0
    let totalHeight = 0

    if (layout === "horizontal") {
      totalWidth = images.reduce((sum, img) => sum + img.width + spacing, -spacing)
      totalHeight = Math.max(...images.map((img) => img.height))
    } else if (layout === "vertical") {
      totalWidth = Math.max(...images.map((img) => img.width))
      totalHeight = images.reduce((sum, img) => sum + img.height + spacing, -spacing)
    } else {
      // Grid layout (2 columns)
      const cols = 2
      const rows = Math.ceil(images.length / cols)
      totalWidth = Math.max(...images.map((img) => img.width)) * cols + spacing * (cols - 1)
      totalHeight = Math.max(...images.map((img) => img.height)) * rows + spacing * (rows - 1)
    }

    canvas.width = totalWidth
    canvas.height = totalHeight

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw images
    let x = 0
    let y = 0

    images.forEach((img, index) => {
      if (layout === "horizontal") {
        ctx.drawImage(img, x, 0, img.width, img.height)
        x += img.width + spacing
      } else if (layout === "vertical") {
        ctx.drawImage(img, 0, y, img.width, img.height)
        y += img.height + spacing
      } else {
        // Grid layout
        const col = index % 2
        const row = Math.floor(index / 2)
        const maxWidth = Math.max(...images.map((img) => img.width))
        const maxHeight = Math.max(...images.map((img) => img.height))
        ctx.drawImage(img, col * (maxWidth + spacing), row * (maxHeight + spacing), img.width, img.height)
      }
    })
  }, [images, layout, spacing])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `merged-images-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, "image/png")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ছবি মার্জ করুন (Merge Images)</h2>
        <Button variant="outline" onClick={onBack}>
          ← ফিরে যান (Back)
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Preview */}
        <Card className="p-4">
          <div className="aspect-video bg-muted rounded-lg overflow-auto flex items-center justify-center">
            {images.length > 0 ? (
              <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
            ) : (
              <p className="text-muted-foreground">ছবি যোগ করুন (Add images to preview)</p>
            )}
          </div>
        </Card>

        {/* Controls */}
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-upload">ছবি যোগ করুন (Add Images)</Label>
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
              <Button asChild variant="outline" className="w-full mt-2 bg-transparent">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  ছবি নির্বাচন করুন (Select Images)
                </label>
              </Button>
            </div>

            <div className="space-y-2">
              <Label>লেআউট (Layout)</Label>
              <Select value={layout} onValueChange={(v) => setLayout(v as MergeLayout)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">অনুভূমিক (Horizontal)</SelectItem>
                  <SelectItem value="vertical">উল্লম্ব (Vertical)</SelectItem>
                  <SelectItem value="grid">গ্রিড (Grid 2x2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image List */}
            {images.length > 0 && (
              <div className="space-y-2">
                <Label>যোগ করা ছবি ({images.length})</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {images.map((img, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">
                        Image {index + 1} ({img.width}x{img.height})
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeImage(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button onClick={handleDownload} disabled={images.length === 0} className="w-full" size="lg">
            <Download className="mr-2 h-5 w-5" />
            ডাউনলোড করুন (Download Merged Image)
          </Button>
        </Card>
      </div>
    </div>
  )
}
