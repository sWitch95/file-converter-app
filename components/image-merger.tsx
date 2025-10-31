"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Download, Upload, X, GripVertical, Trash2 } from "lucide-react"

interface ImageMergerProps {
  onBack: () => void
}

interface MergeImage {
  img: HTMLImageElement
  id: string
  name: string
}

type MergeLayout = "horizontal" | "vertical" | "grid" | "grid3x3"

export default function ImageMerger({ onBack }: ImageMergerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<MergeImage[]>([])
  const [layout, setLayout] = useState<MergeLayout>("horizontal")
  const [spacing, setSpacing] = useState(10)
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setImages((prev) => [
          ...prev,
          {
            img,
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
          },
        ])
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) return

    const newImages = [...images]
    ;[newImages[draggedIndex], newImages[targetIndex]] = [newImages[targetIndex], newImages[draggedIndex]]
    setImages(newImages)
    setDraggedIndex(targetIndex)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  useEffect(() => {
    if (images.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let totalWidth = 0
    let totalHeight = 0
    const imageData = images.map((m) => m.img)

    if (layout === "horizontal") {
      totalWidth = imageData.reduce((sum, img) => sum + img.width + spacing, -spacing)
      totalHeight = Math.max(...imageData.map((img) => img.height))
    } else if (layout === "vertical") {
      totalWidth = Math.max(...imageData.map((img) => img.width))
      totalHeight = imageData.reduce((sum, img) => sum + img.height + spacing, -spacing)
    } else if (layout === "grid") {
      const cols = 2
      const rows = Math.ceil(imageData.length / cols)
      const maxWidth = Math.max(...imageData.map((img) => img.width))
      const maxHeight = Math.max(...imageData.map((img) => img.height))
      totalWidth = maxWidth * cols + spacing * (cols - 1)
      totalHeight = maxHeight * rows + spacing * (rows - 1)
    } else if (layout === "grid3x3") {
      const cols = 3
      const rows = Math.ceil(imageData.length / cols)
      const maxWidth = Math.max(...imageData.map((img) => img.width))
      const maxHeight = Math.max(...imageData.map((img) => img.height))
      totalWidth = maxWidth * cols + spacing * (cols - 1)
      totalHeight = maxHeight * rows + spacing * (rows - 1)
    }

    canvas.width = totalWidth
    canvas.height = totalHeight

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let x = 0
    let y = 0

    imageData.forEach((img, index) => {
      if (layout === "horizontal") {
        ctx.drawImage(img, x, 0, img.width, img.height)
        x += img.width + spacing
      } else if (layout === "vertical") {
        ctx.drawImage(img, 0, y, img.width, img.height)
        y += img.height + spacing
      } else if (layout === "grid") {
        const col = index % 2
        const row = Math.floor(index / 2)
        const maxWidth = Math.max(...imageData.map((img) => img.width))
        const maxHeight = Math.max(...imageData.map((img) => img.height))
        ctx.drawImage(img, col * (maxWidth + spacing), row * (maxHeight + spacing), img.width, img.height)
      } else if (layout === "grid3x3") {
        const col = index % 3
        const row = Math.floor(index / 3)
        const maxWidth = Math.max(...imageData.map((img) => img.width))
        const maxHeight = Math.max(...imageData.map((img) => img.height))
        ctx.drawImage(img, col * (maxWidth + spacing), row * (maxHeight + spacing), img.width, img.height)
      }
    })
  }, [images, layout, spacing, backgroundColor])

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

  const clearAll = () => {
    setImages([])
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
                  <SelectItem value="grid">গ্রিড ২x২ (Grid 2x2)</SelectItem>
                  <SelectItem value="grid3x3">গ্রিড ৩x৩ (Grid 3x3)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>মধ্যবর্তী দূরত্ব (Spacing): {spacing}px</Label>
              <Slider value={[spacing]} onValueChange={(v) => setSpacing(v[0])} min={0} max={50} step={1} />
            </div>

            <div className="space-y-2">
              <Label>পটভূমি রঙ (Background Color)</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-16 rounded cursor-pointer"
                />
                <span className="text-sm text-muted-foreground self-center">{backgroundColor}</span>
              </div>
            </div>

            {/* Image List with Drag Reordering */}
            {images.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>যোগ করা ছবি ({images.length})</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    সব মুছুন (Clear)
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className="flex items-center gap-2 p-2 bg-muted rounded cursor-move hover:bg-muted/80 transition-colors"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm flex-1 truncate">
                        {index + 1}. {img.name}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeImage(img.id)}>
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
            মার্জ ও ডাউনলোড করুন (Download Merged Image)
          </Button>
        </Card>
      </div>
    </div>
  )
}
