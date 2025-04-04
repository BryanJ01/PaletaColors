"use client"
import { Clock } from "lucide-react"
import type { Palette } from "../types"

interface PaletteHistoryProps {
  palettes: Palette[]
  onSelect: (palette: Palette) => void
  darkMode: boolean
}

export function PaletteHistory({ palettes, onSelect, darkMode }: PaletteHistoryProps) {
  if (palettes.length === 0) return null

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Clock className={`w-5 h-5 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
        <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Palette History</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {palettes.map((palette) => (
          <div
            key={palette.id}
            className={`
              rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105
              ${darkMode ? "bg-gray-700 shadow-gray-900" : "bg-white shadow-md"}
            `}
            onClick={() => onSelect(palette)}
          >
            <div className="relative h-40">
              <img
                src={palette.imageUrl || "/placeholder.svg"}
                alt="Palette source"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 flex h-8">
                {palette.colors.map((color, index) => (
                  <div key={index} className="flex-1 h-full" style={{ backgroundColor: color.hex }} />
                ))}
              </div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-center">
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {formatDate(palette.timestamp)}
                </p>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {palette.colors.length} colors
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

