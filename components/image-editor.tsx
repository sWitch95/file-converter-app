"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Download, RotateCw, Sliders, Undo2, Type, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"

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
  const [hue, setHue] = useState(0)
  const [blur, setBlur] = useState(0)
  const [sepia, setSepia] = useState(0)
  const [compression, setCompression] = useState(0.95)
  const [textOverlay, setTextOverlay] = useState("")
  const [textSize, setTextSize] = useState(24)
  const [cropMode, setCropMode] = useState(false)
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isCropping, setIsCropping] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImage(img)
      drawImage(img)
    }
    img.src = URL.createObjectURL(file)

    return () => {
      URL.revokeObjectURL(img.src)
    }
  }, [file])

  const drawImage = (
    img: HTMLImageElement,
    filters = {
      brightness,
      contrast,
      saturation,
      rotation,
      scale,
      hue,
      blur,
      sepia,
      textOverlay,
      textSize,
    },
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = img.width
    canvas.height = img.height

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((filters.rotation * Math.PI) / 180)
    ctx.scale(filters.scale / 100, filters.scale / 100)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) hue-rotate(${filters.hue}deg) blur(${filters.blur}px) sepia(${filters.sepia}%)`

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    if (filters.textOverlay) {
      ctx.restore()
      ctx.save()
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = `bold ${filters.textSize}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.fillText(filters.textOverlay, canvas.width / 2, canvas.height / 2)
    }

    ctx.restore()
  }

  useEffect(() => {
    if (image) {
      drawImage(image, {
        brightness,
        contrast,
        saturation,
        rotation,
        scale,
        hue,
        blur,
        sepia,
        textOverlay,
        textSize,
      })
    }
  }, [brightness, contrast, saturation, rotation, scale, hue, blur, sepia, textOverlay, textSize, image])

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotation(0)
    setScale(100)
    setHue(0)
    setBlur(0)
    setSepia(0)
    setTextOverlay("")
    setCropMode(false)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob(
      (blob) => {
        if (!blob) return

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `edited-${file.name}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      },
      "image/png",
      compression,
    )
  }

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case "grayscale":
        setSaturation(0)
        break
      case "vintage":
        setSepia(50)
        setBrightness(110)
        setContrast(90)
        break
      case "vivid":
        setSaturation(150)
        setContrast(120)
        break
      case "cool":
        setHue(200)
        setContrast(110)
        break
      case "warm":
        setHue(30)
        setBrightness(110)
        break
    }
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
        <Card className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
          {/* Filter Sliders */}
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

            <div className="space-y-2">
              <Label>রঙের টোন (Hue): {hue}°</Label>
              <Slider value={[hue]} onValueChange={(v) => setHue(v[0])} min={-180} max={180} step={1} />
            </div>

            <div className="space-y-2">
              <Label>ব্লার (Blur): {blur}px</Label>
              <Slider value={[blur]} onValueChange={(v) => setBlur(v[0])} min={0} max={20} step={0.5} />
            </div>

            <div className="space-y-2">
              <Label>সেপিয়া (Sepia): {sepia}%</Label>
              <Slider value={[sepia]} onValueChange={(v) => setSepia(v[0])} min={0} max={100} step={1} />
            </div>

            <div className="space-y-2">
              <Label>কম্প্রেশন (Compression): {Math.round(compression * 100)}%</Label>
              <Slider value={[compression]} onValueChange={(v) => setCompression(v[0])} min={0.1} max={1} step={0.05} />
            </div>
          </div>

          {/* Preset Filters */}
          <div className="pt-4 border-t">
            <Label className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4" />
              প্রিসেট ফিল্টার (Presets)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "grayscale", label: "গ্রেস্কেল" },
                { name: "vintage", label: "ভিন্টেজ" },
                { name: "vivid", label: "ভিভিড" },
                { name: "cool", label: "কুল" },
              ].map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset.name)}
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Text Overlay */}
          <div className="pt-4 border-t space-y-3">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              টেক্সট ওভারলে (Text)
            </Label>
            <Input
              placeholder="টেক্সট লিখুন..."
              value={textOverlay}
              onChange={(e) => setTextOverlay(e.target.value)}
              className="text-sm"
            />
            <div className="space-y-2">
              <Label className="text-xs">টেক্সট সাইজ: {textSize}px</Label>
              <Slider value={[textSize]} onValueChange={(v) => setTextSize(v[0])} min={8} max={100} step={1} />
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        <Button onClick={handleRotate} variant="outline" className="bg-transparent">
          <RotateCw className="mr-2 h-4 w-4" />
          ঘোরান (Rotate)
        </Button>
        <Button onClick={handleReset} variant="outline" className="bg-transparent">
          <Undo2 className="mr-2 h-4 w-4" />
          রিসেট (Reset)
        </Button>
        <Button onClick={handleDownload} className="flex-1 md:flex-none">
          <Download className="mr-2 h-5 w-5" />
          ডাউনলোড করুন (Download)
        </Button>
      </div>
    </div>
  )
}
