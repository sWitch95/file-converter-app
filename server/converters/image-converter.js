import sharp from "sharp"
import path from "path"

export async function convertImage(inputPath, targetFormat, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath))
  const outputPath = path.join(outputDir, `${filename}.${targetFormat}`)

  console.log(`[v0] Converting image to ${targetFormat}`)

  try {
    if (targetFormat === "jpg") {
      await sharp(inputPath).jpeg({ quality: 90 }).toFile(outputPath)
    } else if (targetFormat === "png") {
      await sharp(inputPath).png({ compressionLevel: 9 }).toFile(outputPath)
    } else {
      throw new Error(`Unsupported image format: ${targetFormat}`)
    }

    console.log(`[v0] Image conversion complete: ${outputPath}`)
    return outputPath
  } catch (error) {
    console.error("[v0] Image conversion error:", error)
    throw new Error(`Image conversion failed: ${error.message}`)
  }
}
