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
    try {
      await execAsync("libreoffice --version")
      console.log("[v0] LibreOffice found - performing real conversion")

      // Use LibreOffice for conversion
      const command = `libreoffice --headless --convert-to ${targetFormat} --outdir ${outputDir} "${inputPath}"`
      const { stdout, stderr } = await execAsync(command, { timeout: 60000 })

      console.log(`[v0] Office conversion complete: ${outputPath}`)

      // Verify output file was created
      try {
        await fs.access(outputPath)
        return outputPath
      } catch (err) {
        // If conversion didn't create expected file, check what was created
        const files = await fs.readdir(outputDir)
        const createdFile = files.find((f) => f.startsWith(filename) && f.endsWith(`.${targetFormat}`))
        if (createdFile) {
          const createdPath = path.join(outputDir, createdFile)
          console.log(`[v0] File created with different name: ${createdPath}`)
          return createdPath
        }
        throw new Error("Output file not created")
      }
    } catch (libreError) {
      console.warn("[v0] LibreOffice conversion failed, trying fallback methods")

      try {
        await execAsync("pandoc --version")
        console.log("[v0] Pandoc found - using as fallback")

        const pandocCommand = `pandoc "${inputPath}" -o "${outputPath}"`
        await execAsync(pandocCommand, { timeout: 60000 })

        await fs.access(outputPath)
        console.log(`[v0] Pandoc conversion successful: ${outputPath}`)
        return outputPath
      } catch (pandocError) {
        console.warn("[v0] Pandoc also not available")
        throw new Error(
          "Office document conversion requires LibreOffice or Pandoc to be installed on the server. Please install one of these tools.",
        )
      }
    }
  } catch (error) {
    console.error("[v0] Office conversion error:", error.message)
    throw new Error(`Office document conversion failed: ${error.message}`)
  }
}
