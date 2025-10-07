// Client-side conversion utilities for browser environment

export async function convertImage(file: File, targetFormat: "jpg" | "png"): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      reject(new Error("Canvas context not available"))
      return
    }

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to convert image"))
          }
        },
        targetFormat === "jpg" ? "image/jpeg" : "image/png",
        0.95,
      )
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}

export async function csvToJson(file: File): Promise<Blob> {
  const text = await file.text()
  const lines = text.trim().split("\n")

  if (lines.length === 0) {
    throw new Error("Empty CSV file")
  }

  const headers = lines[0].split(",").map((h) => h.trim())
  const result = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())
    const obj: Record<string, string> = {}

    headers.forEach((header, index) => {
      obj[header] = values[index] || ""
    })

    result.push(obj)
  }

  const jsonString = JSON.stringify(result, null, 2)
  return new Blob([jsonString], { type: "application/json" })
}

export async function jsonToCsv(file: File): Promise<Blob> {
  const text = await file.text()
  const data = JSON.parse(text)

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Invalid JSON format. Expected an array of objects.")
  }

  const headers = Object.keys(data[0])
  const csvLines = [headers.join(",")]

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]?.toString() || ""
      // Escape commas and quotes
      return value.includes(",") || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value
    })
    csvLines.push(values.join(","))
  }

  const csvString = csvLines.join("\n")
  return new Blob([csvString], { type: "text/csv" })
}

export function getFileExtension(format: string): string {
  const parts = format.split("-to-")
  return parts[1] || "bin"
}

export function getOutputFilename(originalName: string, format: string): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "")
  const extension = getFileExtension(format)
  return `${nameWithoutExt}-converted.${extension}`
}
