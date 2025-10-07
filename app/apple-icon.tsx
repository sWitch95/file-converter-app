import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 180,
  height: 180,
}

export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #14B8A6 0%, #4F46E5 100%)",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 200 200" fill="none">
        <rect x="30" y="50" width="70" height="90" rx="8" fill="white" opacity="0.9" />
        <rect x="100" y="60" width="70" height="90" rx="8" fill="white" />
        <path
          d="M105 95L125 95M125 95L118 88M125 95L118 102"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    {
      ...size,
    },
  )
}
