// Client-side conversion utilities for browser environment

export async function convertImage(file: File, targetFormat: "jpg" | "png" | "webp" | "bmp" | "gif"): Promise<Blob> {
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

      // Map format to MIME type
      const mimeTypes: Record<string, string> = {
        jpg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        bmp: "image/bmp",
        gif: "image/gif",
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to convert image"))
          }
        },
        mimeTypes[targetFormat] || "image/png",
        0.95,
      )
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}

export async function csvToJson(file: File, compress = false): Promise<Blob> {
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

  const jsonString = compress ? JSON.stringify(result) : JSON.stringify(result, null, 2)
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

export async function jsonToXlsx(file: File): Promise<Blob> {
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
      return value.includes(",") || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value
    })
    csvLines.push(values.join(","))
  }

  const csvString = csvLines.join("\n")
  return new Blob([csvString], { type: "text/csv" })
}

export async function csvToXml(file: File): Promise<Blob> {
  const text = await file.text()
  const lines = text.trim().split("\n")

  if (lines.length === 0) {
    throw new Error("Empty CSV file")
  }

  const headers = lines[0].split(",").map((h) => h.trim())
  let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n'

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())
    xmlString += "  <record>\n"

    headers.forEach((header, index) => {
      const value = values[index] || ""
      const escapedValue = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      xmlString += `    <${header}>${escapedValue}</${header}>\n`
    })

    xmlString += "  </record>\n"
  }

  xmlString += "</root>"
  return new Blob([xmlString], { type: "application/xml" })
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const { getDocument } = await import("pdfjs-dist")
  const arrayBuffer = await file.arrayBuffer()

  try {
    const pdf = await getDocument({ data: arrayBuffer }).promise
    let fullText = ""

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")
      fullText += `\n--- Page ${i} ---\n${pageText}`
    }

    return fullText
  } catch (error) {
    throw new Error("Failed to extract text from PDF. Please ensure the PDF is valid.")
  }
}

export async function pdfToText(file: File): Promise<Blob> {
  const text = await extractTextFromPDF(file)
  return new Blob([text], { type: "text/plain" })
}

export async function convertOfficeToBackend(file: File, format: string, apiUrl: string): Promise<Blob> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("format", format)

  const response = await fetch(`${apiUrl}/api/convert`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Conversion failed")
  }

  const data = await response.json()
  const downloadResponse = await fetch(`${apiUrl}${data.downloadUrl}`)
  return downloadResponse.blob()
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
