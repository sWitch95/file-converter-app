import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuickConvert – Online File Converter (PDF, Word, PPT, CSV, JSON)",
  description:
    "Convert PDF, Word, PPT, CSV, and JSON online quickly, securely, and free. Support for multiple file formats with automatic deletion after 24 hours.",
  keywords: ["online file converter", "pdf to word", "csv to json", "docx to pdf", "file conversion", "free converter"],
  authors: [{ name: "QuickConvert" }],
  openGraph: {
    title: "QuickConvert – Online File Converter",
    description: "Convert PDF, Word, PPT, CSV, and JSON online quickly, securely, and free.",
    type: "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
