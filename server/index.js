import express from "express"
import cors from "cors"
import multer from "multer"
import path from "path"
import fs from "fs/promises"
import { fileURLToPath } from "url"
import cron from "node-cron"
import dotenv from "dotenv"
import { convertFile } from "./converters/index.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Create directories if they don't exist
const UPLOAD_DIR = path.join(__dirname, "../tmp/uploads")
const OUTPUT_DIR = path.join(__dirname, "../tmp/outputs")

await fs.mkdir(UPLOAD_DIR, { recursive: true })
await fs.mkdir(OUTPUT_DIR, { recursive: true })

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types for now
    cb(null, true)
  },
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "QuickConvert API is running" })
})

// File conversion endpoint
app.post("/api/convert", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const { format } = req.body

    if (!format) {
      return res.status(400).json({ error: "No conversion format specified" })
    }

    console.log(`[v0] Converting file: ${req.file.originalname} to format: ${format}`)

    // Validate format
    const validFormats = [
      "pdf-to-docx",
      "docx-to-pdf",
      "pdf-to-pptx",
      "pptx-to-pdf",
      "csv-to-json",
      "json-to-csv",
      "png-to-jpg",
      "jpg-to-png",
    ]

    if (!validFormats.includes(format)) {
      return res.status(400).json({ error: "Invalid conversion format" })
    }

    // Perform conversion
    const outputPath = await convertFile(req.file.path, format, OUTPUT_DIR)

    // Generate download URL
    const outputFilename = path.basename(outputPath)
    const downloadUrl = `/api/download/${outputFilename}`

    console.log(`[v0] Conversion successful: ${outputFilename}`)

    res.json({
      success: true,
      downloadUrl,
      message: "File converted successfully",
    })
  } catch (error) {
    console.error("[v0] Conversion error:", error)
    res.status(500).json({
      error: error.message || "Conversion failed. Please try again.",
    })
  }
})

// File download endpoint
app.get("/api/download/:filename", async (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(OUTPUT_DIR, filename)

    // Check if file exists
    await fs.access(filePath)

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("[v0] Download error:", err)
        res.status(500).json({ error: "Failed to download file" })
      }
    })
  } catch (error) {
    console.error("[v0] File not found:", error)
    res.status(404).json({ error: "File not found" })
  }
})

// Cleanup old files (runs every hour)
cron.schedule("0 * * * *", async () => {
  console.log("[v0] Running file cleanup task...")
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours

  try {
    // Clean uploads
    const uploadFiles = await fs.readdir(UPLOAD_DIR)
    for (const file of uploadFiles) {
      const filePath = path.join(UPLOAD_DIR, file)
      const stats = await fs.stat(filePath)
      if (now - stats.mtimeMs > maxAge) {
        await fs.unlink(filePath)
        console.log(`[v0] Deleted old upload: ${file}`)
      }
    }

    // Clean outputs
    const outputFiles = await fs.readdir(OUTPUT_DIR)
    for (const file of outputFiles) {
      const filePath = path.join(OUTPUT_DIR, file)
      const stats = await fs.stat(filePath)
      if (now - stats.mtimeMs > maxAge) {
        await fs.unlink(filePath)
        console.log(`[v0] Deleted old output: ${file}`)
      }
    }
  } catch (error) {
    console.error("[v0] Cleanup error:", error)
  }
})

app.listen(PORT, () => {
  console.log(`[v0] QuickConvert API server running on port ${PORT}`)
})

export default app
