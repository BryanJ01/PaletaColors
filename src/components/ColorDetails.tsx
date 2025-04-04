"use client"

import { useState } from "react"
import { Copy, Check, Info } from "lucide-react"
import { rgbToHsl, rgbToCmyk, getPantoneApproximation, getColorTemperature } from "../utils/colorUtils"
import type { Color } from "../types"

interface ColorDetailsProps {
  color: Color
  darkMode: boolean
}

export function ColorDetails({ color, darkMode }: ColorDetailsProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const { hex, rgb } = color

  const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2])
  const cmyk = rgbToCmyk(rgb[0], rgb[1], rgb[2])
  const pantone = getPantoneApproximation(rgb[0], rgb[1], rgb[2])
  const temperature = getColorTemperature(rgb[0], rgb[1], rgb[2])

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="h-32 flex items-center justify-center" style={{ backgroundColor: hex }}>
        <span className="sr-only">Color preview: {hex}</span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Color Details</h3>
          <div
            className={`px-2 py-1 rounded-full text-xs ${
              temperature === "warm"
                ? "bg-orange-100 text-orange-800"
                : temperature === "cool"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {temperature.charAt(0).toUpperCase() + temperature.slice(1)}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>HEX</span>
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => copyToClipboard(hex, "hex")}
            >
              <span className="font-mono">{hex.toUpperCase()}</span>
              {copied === "hex" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>RGB</span>
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => copyToClipboard(`rgb(${rgb.join(", ")})`, "rgb")}
            >
              <span className="font-mono">rgb({rgb.join(", ")})</span>
              {copied === "rgb" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>HSL</span>
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => copyToClipboard(`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`, "hsl")}
            >
              <span className="font-mono">
                hsl({hsl[0]}, {hsl[1]}%, {hsl[2]}%)
              </span>
              {copied === "hsl" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>CMYK</span>
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => copyToClipboard(`cmyk(${cmyk.join("%, ")}%)`, "cmyk")}
            >
              <span className="font-mono">cmyk({cmyk.join("%, ")}%)</span>
              {copied === "cmyk" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Pantone</span>
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => copyToClipboard(pantone, "pantone")}
            >
              <span className="font-mono">{pantone}</span>
              {copied === "pantone" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1">
          <Info className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Click on any format to copy to clipboard
          </p>
        </div>
      </div>
    </div>
  )
}

