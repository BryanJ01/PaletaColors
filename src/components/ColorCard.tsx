"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import type { Color } from "../types"

interface ColorCardProps {
  color: Color
  darkMode: boolean
}

export function ColorCard({ color, darkMode }: ColorCardProps) {
  const [copied, setCopied] = useState(false)
  const { hex, rgb } = color

  // Calculate contrast color (black or white) for text
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
  const textColor = brightness > 128 ? "#000000" : "#FFFFFF"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`
        rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105
        ${darkMode ? "shadow-gray-900" : "shadow-md"}
      `}
    >
      <div className="h-32 flex items-center justify-center relative" style={{ backgroundColor: hex }}>
        <button
          onClick={() => copyToClipboard(hex)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          aria-label="Copy hex code"
        >
          {copied ? (
            <Check className="w-4 h-4" style={{ color: textColor }} />
          ) : (
            <Copy className="w-4 h-4" style={{ color: textColor }} />
          )}
        </button>
      </div>
      <div className={`p-3 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
        <div className="flex justify-between items-center">
          <h3
            className={`font-mono font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            onClick={() => copyToClipboard(hex)}
            style={{ cursor: "pointer" }}
          >
            {hex.toUpperCase()}
          </h3>
          <div
            className={`text-xs font-mono ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            onClick={() => copyToClipboard(`rgb(${rgb.join(", ")})`)}
            style={{ cursor: "pointer" }}
          >
            RGB({rgb.join(", ")})
          </div>
        </div>
      </div>
    </div>
  )
}

