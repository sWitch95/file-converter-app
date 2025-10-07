import request from "supertest"
import app from "../index.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe("File Conversion API", () => {
  describe("POST /api/convert", () => {
    it("should return 400 if no file is uploaded", async () => {
      const response = await request(app).post("/api/convert").field("format", "pdf-to-docx")

      expect(response.status).toBe(400)
      expect(response.body.error).toBe("No file uploaded")
    })

    it("should return 400 if no format is specified", async () => {
      const response = await request(app).post("/api/convert").attach("file", Buffer.from("test"), "test.pdf")

      expect(response.status).toBe(400)
      expect(response.body.error).toBe("No conversion format specified")
    })

    it("should return 400 for invalid format", async () => {
      const response = await request(app)
        .post("/api/convert")
        .attach("file", Buffer.from("test"), "test.pdf")
        .field("format", "invalid-format")

      expect(response.status).toBe(400)
      expect(response.body.error).toBe("Invalid conversion format")
    })
  })

  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health")

      expect(response.status).toBe(200)
      expect(response.body.status).toBe("ok")
    })
  })
})
