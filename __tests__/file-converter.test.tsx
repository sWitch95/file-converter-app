import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import FileConverter from "@/components/file-converter"
import { ThemeProvider } from "@/components/theme-provider"
import jest from "jest" // Import jest to declare the variable

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock fetch
global.fetch = jest.fn()

describe("FileConverter Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the file converter interface", () => {
    render(
      <ThemeProvider>
        <FileConverter />
      </ThemeProvider>,
    )

    expect(screen.getByText(/ফাইল কনভার্টার/i)).toBeInTheDocument()
    expect(screen.getByText(/Convert PDF, Word, PowerPoint/i)).toBeInTheDocument()
  })

  it("displays format selector with options", () => {
    render(
      <ThemeProvider>
        <FileConverter />
      </ThemeProvider>,
    )

    const formatSelect = screen.getByRole("combobox")
    expect(formatSelect).toBeInTheDocument()
  })

  it("shows file upload area", () => {
    render(
      <ThemeProvider>
        <FileConverter />
      </ThemeProvider>,
    )

    expect(screen.getByText(/ফাইল ড্র্যাগ করুন বা ক্লিক করে আপলোড করুন/i)).toBeInTheDocument()
  })

  it("displays selected file information", async () => {
    render(
      <ThemeProvider>
        <FileConverter />
      </ThemeProvider>,
    )

    const file = new File(["test content"], "test.pdf", { type: "application/pdf" })
    const input = screen.getByLabelText(/ফাইল ড্র্যাগ করুন/i) as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument()
    })
  })

  it("shows convert button when file is selected", async () => {
    render(
      <ThemeProvider>
        <FileConverter />
      </ThemeProvider>,
    )

    const file = new File(["test content"], "test.pdf", { type: "application/pdf" })
    const input = screen.getByLabelText(/ফাইল ড্র্যাগ করুন/i) as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      const convertButton = screen.getByRole("button", { name: /কনভার্ট শুরু করুন/i })
      expect(convertButton).toBeInTheDocument()
      expect(convertButton).not.toBeDisabled()
    })
  })

  it("handles successful file conversion", async () => {
    const mockResponse = {
      success: true,
      downloadUrl: "/api/download/test-converted.docx",
      message: "File converted successfully",
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(
      <ThemeProvider>
        <FileConverter />
      </ThemeProvider>,
    )

    const file = new File(["test content"], "test.pdf", { type: "application/pdf" })
    const input = screen.getByLabelText(/ফাইল ড্র্যাগ করুন/i) as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      const convertButton = screen.getByRole("button", { name: /কনভার্ট শুরু করুন/i })
      fireEvent.click(convertButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/সফলভাবে কনভার্ট হয়েছে/i)).toBeInTheDocument()
    })
  })

  it("handles conversion error", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Conversion failed" }),
    })

    render(
      <ThemeProvider>
        <FileConverter />
      </ThemeProvider>,
    )

    const file = new File(["test content"], "test.pdf", { type: "application/pdf" })
    const input = screen.getByLabelText(/ফাইল ড্র্যাগ করুন/i) as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      const convertButton = screen.getByRole("button", { name: /কনভার্ট শুরু করুন/i })
      fireEvent.click(convertButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument()
      expect(screen.getByText(/Conversion failed/i)).toBeInTheDocument()
    })
  })

  it("displays privacy notice", () => {
    render(
      <ThemeProvider>
        <FileConverter />
      </ThemeProvider>,
    )

    expect(screen.getByText(/আপনার ফাইল সম্পূর্ণ নিরাপদ/i)).toBeInTheDocument()
    expect(screen.getByText(/২৪ ঘণ্টার মধ্যে সার্ভার থেকে ফাইল মুছে যায়/i)).toBeInTheDocument()
  })
})
