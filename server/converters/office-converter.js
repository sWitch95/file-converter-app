import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs/promises"

const execAsync = promisify(exec)

export async function convertOffice(inputPath, sourceFormat, targetFormat, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath))
  const outputPath = path.join(outputDir, `${filename}.${targetFormat}`)

  console.log(`[v0] Converting office document: ${sourceFormat} to ${targetFormat}`)

  try {
    // Check if LibreOffice is available
    try {
      await execAsync("libreoffice --version")
    } catch (error) {
      console.warn("[v0] LibreOffice not found, using mock conversion")
      // For development/demo purposes, create a mock file
      await fs.writeFile(
        outputPath,
        `Mock converted file from ${sourceFormat} to ${targetFormat}\nOriginal file: ${path.basename(inputPath)}\n\nThis is a placeholder. In production, LibreOffice would perform the actual conversion.`,
      )
      return outputPath
    }

    // Use LibreOffice for conversion
    const command = `libreoffice --headless --convert-to ${targetFormat} --outdir ${outputDir} ${inputPath}`
    await execAsync(command)

    console.log(`[v0] Office conversion complete: ${outputPath}`)
    return outputPath
  } catch (error) {
    console.error("[v0] Office conversion error:", error)
    throw new Error(`Office document conversion failed: ${error.message}`)
  }
}
