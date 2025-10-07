import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 32,
  height: 32,
}

export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="11" height="14" rx="2" fill="#14B8A6" />
        <rect x="17" y="10" width="11" height="14" rx="2" fill="#4F46E5" />
        <path d="M16 16L19 16M19 16L18 15M19 16L18 17" stroke="#4F46E5" strokeWidth="2" />
      </svg>
    </div>,
    {
      ...size,
    },
  )
}
