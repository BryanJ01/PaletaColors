"use client"

import { useState } from "react"
import { getColorHarmony } from "../utils/colorUtils"
import type { Color } from "../types"

interface ColorHarmonyProps {
  color: Color
  darkMode: boolean
}

type HarmonyType = "monochromatic" | "analogous" | "complementary" | "triadic" | "tetradic"

export function ColorHarmony({ color, darkMode }: ColorHarmonyProps) {
  const [harmonyType, setHarmonyType] = useState<HarmonyType>("monochromatic")

  const harmonyColors = getColorHarmony(color.rgb[0], color.rgb[1], color.rgb[2], harmonyType)

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="p-4">
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Color Harmony</h3>

        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Harmony Type
          </label>
          <select
            value={harmonyType}
            onChange={(e) => setHarmonyType(e.target.value as HarmonyType)}
            className={`w-full p-2 rounded border ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="monochromatic">Monochromatic</option>
            <option value="analogous">Analogous</option>
            <option value="complementary">Complementary</option>
            <option value="triadic">Triadic</option>
            <option value="tetradic">Tetradic</option>
          </select>
        </div>

        <div className="flex overflow-hidden rounded-lg h-16">
          {harmonyColors.map((color, index) => (
            <div key={index} className="flex-1" style={{ backgroundColor: color }} title={color}></div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {harmonyColors.map((color, index) => (
            <div key={index} className="text-center">
              <div className="w-full aspect-square rounded-md mb-1" style={{ backgroundColor: color }}></div>
              <span className={`text-xs font-mono ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {color.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

