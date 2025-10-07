import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const format = formData.get("format") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!format) {
      return NextResponse.json({ error: "No format specified" }, { status: 400 })
    }

    console.log("[v0] Converting file:", file.name, "to format:", format)

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
      return NextResponse.json({ error: "Invalid conversion format" }, { status: 400 })
    }

    // For PDF/Office conversions, return a demo message
    if (format.includes("pdf") || format.includes("docx") || format.includes("pptx")) {
      return NextResponse.json({
        success: true,
        demo: true,
        message: "PDF and Office document conversions require a backend server. This is a demo response.",
        downloadUrl: null,
      })
    }

    // For image and CSV/JSON conversions, we'll handle them client-side
    // Return success to trigger client-side conversion
    return NextResponse.json({
      success: true,
      clientSide: true,
      message: "File ready for conversion",
    })
  } catch (error) {
    console.error("[v0] Conversion error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Conversion failed. Please try again." },
      { status: 500 },
    )
  }
}
