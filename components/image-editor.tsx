"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Download, RotateCw, Sliders, Undo2 } from "lucide-react"

interface ImageEditorProps {
  file: File
  onBack: () => void
}

export default function ImageEditor({ file, onBack }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(100)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImage(img)
      drawImage(img)
    }
    img.src = URL.createObjectURL(file)

    return () => {
      URL.revokeObjectURL(img.src)
    }
  }, [file])

  const drawImage = (img: HTMLImageElement, filters = { brightness, contrast, saturation, rotation, scale }) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = img.width
    canvas.height = img.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Save context state
    ctx.save()

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((filters.rotation * Math.PI) / 180)
    ctx.scale(filters.scale / 100, filters.scale / 100)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    // Apply filters
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    // Restore context state
    ctx.restore()
  }

  useEffect(() => {
    if (image) {
      drawImage(image, { brightness, contrast, saturation, rotation, scale })
    }
  }, [brightness, contrast, saturation, rotation, scale, image])

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotation(0)
    setScale(100)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `edited-${file.name}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, "image/png")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ছবি এডিট করুন (Edit Image)</h2>
        <Button variant="outline" onClick={onBack}>
          ← ফিরে যান (Back)
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Canvas Preview */}
        <Card className="p-4">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
          </div>
        </Card>

        {/* Controls */}
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                উজ্জ্বলতা (Brightness): {brightness}%
              </Label>
              <Slider value={[brightness]} onValueChange={(v) => setBrightness(v[0])} min={0} max={200} step={1} />
            </div>

            <div className="space-y-2">
              <Label>কনট্রাস্ট (Contrast): {contrast}%</Label>
              <Slider value={[contrast]} onValueChange={(v) => setContrast(v[0])} min={0} max={200} step={1} />
            </div>

            <div className="space-y-2">
              <Label>স্যাচুরেশন (Saturation): {saturation}%</Label>
              <Slider value={[saturation]} onValueChange={(v) => setSaturation(v[0])} min={0} max={200} step={1} />
            </div>

            <div className="space-y-2">
              <Label>আকার (Scale): {scale}%</Label>
              <Slider value={[scale]} onValueChange={(v) => setScale(v[0])} min={10} max={200} step={1} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRotate} variant="outline" className="flex-1 bg-transparent">
              <RotateCw className="mr-2 h-4 w-4" />
              ঘোরান (Rotate)
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
              <Undo2 className="mr-2 h-4 w-4" />
              রিসেট (Reset)
            </Button>
          </div>

          <Button onClick={handleDownload} className="w-full" size="lg">
            <Download className="mr-2 h-5 w-5" />
            ডাউনলোড করুন (Download)
          </Button>
        </Card>
      </div>
    </div>
  )
}
