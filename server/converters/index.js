import { convertImage } from "./image-converter.js"
import { convertCsvJson } from "./csv-json-converter.js"
import { convertOffice } from "./office-converter.js"

export async function convertFile(inputPath, format, outputDir) {
  const [sourceFormat, targetFormat] = format.split("-to-")

  console.log(`[v0] Converting from ${sourceFormat} to ${targetFormat}`)

  // Image conversions
  if ((sourceFormat === "png" && targetFormat === "jpg") || (sourceFormat === "jpg" && targetFormat === "png")) {
    return await convertImage(inputPath, targetFormat, outputDir)
  }

  // CSV/JSON conversions
  if ((sourceFormat === "csv" && targetFormat === "json") || (sourceFormat === "json" && targetFormat === "csv")) {
    return await convertCsvJson(inputPath, sourceFormat, targetFormat, outputDir)
  }

  // Office document conversions
  if (
    (sourceFormat === "pdf" && targetFormat === "docx") ||
    (sourceFormat === "docx" && targetFormat === "pdf") ||
    (sourceFormat === "pdf" && targetFormat === "pptx") ||
    (sourceFormat === "pptx" && targetFormat === "pdf")
  ) {
    return await convertOffice(inputPath, sourceFormat, targetFormat, outputDir)
  }

  throw new Error(`Unsupported conversion: ${format}`)
}
