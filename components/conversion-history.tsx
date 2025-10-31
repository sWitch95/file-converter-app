"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getConversionHistory } from "@/lib/supabase-client"
import { RotateCcw, History } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function ConversionHistory() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getConversionHistory()
        setHistory(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load history")
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  if (loading) {
    return <p className="text-muted-foreground text-sm">লোডিং হচ্ছে... (Loading...)</p>
  }

  if (error) {
    return <p className="text-destructive text-sm">{error}</p>
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">কোনো ইতিহাস নেই (No conversion history)</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <History className="h-4 w-4" />
        কনভার্শন ইতিহাস (Conversion History)
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {item.source_format.toUpperCase()} → {item.target_format.toUpperCase()} •{" "}
                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
