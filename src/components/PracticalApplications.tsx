"use client"

import { useState } from "react"
import { Smartphone, Monitor, CreditCard } from "lucide-react"
import type { Color } from "../types"

interface PracticalApplicationsProps {
  colors: Color[]
  darkMode: boolean
}

type ApplicationType = "ui" | "branding" | "interior"

export function PracticalApplications({ colors, darkMode }: PracticalApplicationsProps) {
  const [applicationType, setApplicationType] = useState<ApplicationType>("ui")

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="p-4">
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Practical Applications
        </h3>

        <div className="flex border-b mb-4 overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              applicationType === "ui"
                ? darkMode
                  ? "border-b-2 border-purple-500 text-purple-400"
                  : "border-b-2 border-purple-600 text-purple-600"
                : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
            }`}
            onClick={() => setApplicationType("ui")}
          >
            UI Design
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              applicationType === "branding"
                ? darkMode
                  ? "border-b-2 border-purple-500 text-purple-400"
                  : "border-b-2 border-purple-600 text-purple-600"
                : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
            }`}
            onClick={() => setApplicationType("branding")}
          >
            Branding
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              applicationType === "interior"
                ? darkMode
                  ? "border-b-2 border-purple-500 text-purple-400"
                  : "border-b-2 border-purple-600 text-purple-600"
                : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
            }`}
            onClick={() => setApplicationType("interior")}
          >
            Interior Design
          </button>
        </div>

        {applicationType === "ui" && (
          <div className="bg-gray-100 rounded-lg p-4 dark:bg-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[0]?.hex || "#000" }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[1]?.hex || "#000" }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[2]?.hex || "#000" }}></div>
              </div>
              <Smartphone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>

            <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: colors[0]?.hex || "#000" }}>
              <h4 className="text-sm font-bold mb-1" style={{ color: colors[3]?.hex || "#fff" }}>
                App Header
              </h4>
              <p className="text-xs" style={{ color: colors[3]?.hex || "#fff" }}>
                This is how your color palette would look in a mobile app header.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
              <div className="w-24 h-6 rounded mb-2" style={{ backgroundColor: colors[1]?.hex || "#000" }}></div>
              <div className="flex gap-2 mb-2">
                <div className="w-16 h-16 rounded" style={{ backgroundColor: colors[2]?.hex || "#000" }}></div>
                <div className="w-16 h-16 rounded" style={{ backgroundColor: colors[3]?.hex || "#000" }}></div>
              </div>
              <div className="w-full h-8 rounded" style={{ backgroundColor: colors[4]?.hex || "#000" }}></div>
            </div>
          </div>
        )}

        {applicationType === "branding" && (
          <div className="bg-gray-100 rounded-lg p-4 dark:bg-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <div
                className="w-48 h-24 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors[0]?.hex || "#000" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors[1]?.hex || "#fff" }}
                >
                  <span className="text-xl font-bold" style={{ color: colors[0]?.hex || "#000" }}>
                    P
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <div
                className="w-24 h-8 rounded flex items-center justify-center"
                style={{ backgroundColor: colors[2]?.hex || "#000" }}
              >
                <span className="text-xs font-bold" style={{ color: colors[3]?.hex || "#fff" }}>
                  BUTTON
                </span>
              </div>
              <div
                className="w-24 h-8 rounded flex items-center justify-center"
                style={{
                  backgroundColor: "transparent",
                  border: `2px solid ${colors[2]?.hex || "#000"}`,
                }}
              >
                <span className="text-xs font-bold" style={{ color: colors[2]?.hex || "#000" }}>
                  BUTTON
                </span>
              </div>
            </div>
          </div>
        )}

        {applicationType === "interior" && (
          <div className="bg-gray-100 rounded-lg p-4 dark:bg-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>

            <div className="relative h-48 rounded-lg overflow-hidden">
              <div className="absolute inset-0" style={{ backgroundColor: colors[4]?.hex || "#f0f0f0" }}></div>
              <div
                className="absolute left-0 bottom-0 right-0 h-1/3"
                style={{ backgroundColor: colors[3]?.hex || "#ddd" }}
              ></div>
              <div
                className="absolute left-10 right-10 bottom-8 h-16 rounded"
                style={{ backgroundColor: colors[1]?.hex || "#aaa" }}
              ></div>
              <div
                className="absolute top-8 left-8 w-16 h-16 rounded-full"
                style={{ backgroundColor: colors[0]?.hex || "#888" }}
              ></div>
              <div
                className="absolute top-12 right-12 w-12 h-20 rounded"
                style={{ backgroundColor: colors[2]?.hex || "#666" }}
              ></div>
            </div>
            <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
              Room design with your color palette
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

