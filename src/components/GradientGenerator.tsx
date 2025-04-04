"use client"

import { useState } from "react"
import { Copy, Check, RefreshCw } from "lucide-react"
import { generateGradient } from "../utils/colorUtils"
import type { Color } from "../types"

interface GradientGeneratorProps {
  colors: Color[]
  darkMode: boolean
}

export function GradientGenerator({ colors, darkMode }: GradientGeneratorProps) {
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear")
  const [direction, setDirection] = useState<string>("to right")
  const [copied, setCopied] = useState(false)

  const hexColors = colors.map((color) => color.hex)
  const gradientCSS = generateGradient(hexColors, gradientType, direction)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gradientCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const directions = [
    "to right",
    "to left",
    "to top",
    "to bottom",
    "to right top",
    "to right bottom",
    "to left top",
    "to left bottom",
  ]

  const shuffleColors = () => {
    // This function is just for demonstration
    // In a real app, you might want to implement a more sophisticated shuffling algorithm
    setDirection(directions[Math.floor(Math.random() * directions.length)])
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="h-40 w-full" style={{ background: gradientCSS }}></div>

      <div className="p-4">
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Gradient Generator</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Type
            </label>
            <select
              value={gradientType}
              onChange={(e) => setGradientType(e.target.value as "linear" | "radial")}
              className={`w-full p-2 rounded border ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>

          {gradientType === "linear" && (
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Direction
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className={`w-full p-2 rounded border ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                {directions.map((dir) => (
                  <option key={dir} value={dir}>
                    {dir}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={shuffleColors}
            className={`flex items-center gap-1 px-3 py-2 rounded ${
              darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-1 px-3 py-2 rounded ${
              darkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy CSS</span>
              </>
            )}
          </button>
        </div>

        <div
          className={`mt-4 p-3 rounded font-mono text-sm overflow-x-auto ${
            darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-800"
          }`}
        >
          background: {gradientCSS};
        </div>
      </div>
    </div>
  )
}

