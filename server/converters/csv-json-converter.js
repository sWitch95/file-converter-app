import csvtojson from "csvtojson"
import { Parser } from "json2csv"
import fs from "fs/promises"
import path from "path"

export async function convertCsvJson(inputPath, sourceFormat, targetFormat, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath))
  const outputPath = path.join(outputDir, `${filename}.${targetFormat}`)

  console.log(`[v0] Converting ${sourceFormat} to ${targetFormat}`)

  try {
    if (sourceFormat === "csv" && targetFormat === "json") {
      // CSV to JSON
      const jsonArray = await csvtojson().fromFile(inputPath)
      await fs.writeFile(outputPath, JSON.stringify(jsonArray, null, 2))
    } else if (sourceFormat === "json" && targetFormat === "csv") {
      // JSON to CSV
      const jsonData = await fs.readFile(inputPath, "utf-8")
      const data = JSON.parse(jsonData)

      // Handle both array and single object
      const dataArray = Array.isArray(data) ? data : [data]

      const parser = new Parser()
      const csv = parser.parse(dataArray)
      await fs.writeFile(outputPath, csv)
    } else {
      throw new Error(`Unsupported conversion: ${sourceFormat} to ${targetFormat}`)
    }

    console.log(`[v0] CSV/JSON conversion complete: ${outputPath}`)
    return outputPath
  } catch (error) {
    console.error("[v0] CSV/JSON conversion error:", error)
    throw new Error(`CSV/JSON conversion failed: ${error.message}`)
  }
}
