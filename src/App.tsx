"use client"

import { useState, useCallback, useEffect } from "react"
import ColorThief from "colorthief"
import { PaletteIcon, Wand2, Moon, Sun, Plus, Minus, Layers, Palette } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { ImageUploader } from "./components/ImageUploader"
import { ColorCard } from "./components/ColorCard"
import { PaletteHistory } from "./components/PaletteHistory"
import { ColorDetails } from "./components/ColorDetails"
import { GradientGenerator } from "./components/GradientGenerator"
import { ColorHarmony } from "./components/ColorHarmony"
import { PracticalApplications } from "./components/PracticalApplications"
import { ZoneExtractor } from "./components/ZoneExtractor"
import type { Color, Palette as PaletteType } from "./types"

function App() {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [colors, setColors] = useState<Color[]>([])
  const [palettes, setPalettes] = useState<PaletteType[]>([])
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [colorCount, setColorCount] = useState(6)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [activeTab, setActiveTab] = useState<"palette" | "details" | "applications" | "advanced">("palette")
  const [isOfflineSupported, setIsOfflineSupported] = useState(false)

  // Check if service worker is supported
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      setIsOfflineSupported(true)
    }
  }, [])

  // Load saved palettes from localStorage on initial load
  useEffect(() => {
    const savedPalettes = localStorage.getItem("colorPalettes")
    if (savedPalettes) {
      setPalettes(JSON.parse(savedPalettes))
    }

    // Check for user's preferred color scheme
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true)
    }
  }, [])

  // Save palettes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("colorPalettes", JSON.stringify(palettes))
  }, [palettes])

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Función para asegurar que solo se devuelvan exactamente el número de colores solicitados
  const ensureExactColorCount = (
    palette: Array<[number, number, number]>,
    count: number,
  ): Array<[number, number, number]> => {
    if (palette.length === count) {
      return palette
    } else if (palette.length > count) {
      // Si hay más colores de los solicitados, recortar el array
      return palette.slice(0, count)
    } else {
      // Si hay menos colores de los solicitados (caso poco probable), duplicar el último
      // hasta alcanzar el número deseado
      const result = [...palette]
      while (result.length < count) {
        result.push(palette[palette.length - 1])
      }
      return result
    }
  }

  const generatePalette = useCallback(
    async (file: File) => {
      setLoading(true)
      try {
        const imageUrl = URL.createObjectURL(file)
        setCurrentImage(imageUrl)

        const img = new Image()
        img.crossOrigin = "Anonymous"

        img.onload = async () => {
          // Use a Web Worker for better performance if available
          if (window.Worker) {
            // This is a simplified example - in a real app, you'd implement a proper Web Worker
            setTimeout(() => {
              const colorThief = new ColorThief()
              let palette = colorThief.getPalette(img, colorCount)

              // Asegurar que tenemos exactamente el número de colores solicitados
              palette = ensureExactColorCount(palette, colorCount)

              const colors: Color[] = palette.map((rgb) => ({
                rgb: rgb as [number, number, number],
                hex:
                  "#" +
                  rgb
                    .map((x) => {
                      const hex = x.toString(16)
                      return hex.length === 1 ? "0" + hex : hex
                    })
                    .join(""),
              }))

              setColors(colors)
              if (colors.length > 0) {
                setSelectedColor(colors[0])
              }

              const newPalette: PaletteType = {
                id: Date.now().toString(),
                imageUrl,
                colors,
                timestamp: Date.now(),
              }

              setPalettes((prev) => [newPalette, ...prev])
              setLoading(false)
              toast.success("Palette generated successfully!")
            }, 100)
          } else {
            const colorThief = new ColorThief()
            let palette = colorThief.getPalette(img, colorCount)

            // Asegurar que tenemos exactamente el número de colores solicitados
            palette = ensureExactColorCount(palette, colorCount)

            const colors: Color[] = palette.map((rgb) => ({
              rgb: rgb as [number, number, number],
              hex:
                "#" +
                rgb
                  .map((x) => {
                    const hex = x.toString(16)
                    return hex.length === 1 ? "0" + hex : hex
                  })
                  .join(""),
            }))

            setColors(colors)
            if (colors.length > 0) {
              setSelectedColor(colors[0])
            }

            const newPalette: PaletteType = {
              id: Date.now().toString(),
              imageUrl,
              colors,
              timestamp: Date.now(),
            }

            setPalettes((prev) => [newPalette, ...prev])
            setLoading(false)
            toast.success("Palette generated successfully!")
          }
        }

        img.src = imageUrl
      } catch (error) {
        console.error("Error generating palette:", error)
        toast.error("Error generating palette. Please try again.")
        setLoading(false)
      }
    },
    [colorCount],
  )

  const selectPalette = (palette: PaletteType) => {
    setCurrentImage(palette.imageUrl)
    setColors(palette.colors)
    if (palette.colors.length > 0) {
      setSelectedColor(palette.colors[0])
    }
  }

  const increaseColorCount = () => {
    if (colorCount < 10) {
      setColorCount((prev) => prev + 1)
      if (currentImage) {
        regeneratePalette()
      }
    }
  }

  const decreaseColorCount = () => {
    if (colorCount > 3) {
      setColorCount((prev) => prev - 1)
      if (currentImage) {
        regeneratePalette()
      }
    }
  }

  const regeneratePalette = () => {
    if (!currentImage) return

    const img = new Image()
    img.crossOrigin = "Anonymous"

    img.onload = async () => {
      const colorThief = new ColorThief()
      let palette = colorThief.getPalette(img, colorCount)

      // Asegurar que tenemos exactamente el número de colores solicitados
      palette = ensureExactColorCount(palette, colorCount)

      const colors: Color[] = palette.map((rgb) => ({
        rgb: rgb as [number, number, number],
        hex:
          "#" +
          rgb
            .map((x) => {
              const hex = x.toString(16)
              return hex.length === 1 ? "0" + hex : hex
            })
            .join(""),
      }))

      setColors(colors)
      if (colors.length > 0 && !selectedColor) {
        setSelectedColor(colors[0])
      }
    }

    img.src = currentImage
  }

  const handleZoneExtraction = (extractedColors: Color[]) => {
    // Asegurar que solo tenemos el número exacto de colores solicitados
    const limitedColors = extractedColors.slice(0, colorCount)

    setColors(limitedColors)
    if (limitedColors.length > 0) {
      setSelectedColor(limitedColors[0])
    }

    if (currentImage) {
      const newPalette: PaletteType = {
        id: Date.now().toString(),
        imageUrl: currentImage,
        colors: limitedColors,
        timestamp: Date.now(),
      }

      setPalettes((prev) => [newPalette, ...prev])
      toast.success("Zone colors extracted successfully!")
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900"}`}
    >
      {/* Navbar */}
      <nav className={`py-4 px-6 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PaletteIcon className={`w-8 h-8 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
            <span className="text-xl font-bold">Paleta</span>
          </div>
          <div className="flex items-center gap-2">
            {isOfflineSupported && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"}`}
              >
                Offline Ready
              </span>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className={`text-center mb-12 ${darkMode ? "bg-gray-800" : "bg-white"} p-8 rounded-2xl shadow-xl`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <PaletteIcon className={`w-10 h-10 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
            <Wand2 className={`w-8 h-8 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Color Palette Generator
          </h1>
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Upload an image and get a beautiful color palette instantly
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload and Zone Extraction */}
          <div className="space-y-8">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-2xl shadow-lg`}>
              <ImageUploader onImageUpload={generatePalette} darkMode={darkMode} />
              {currentImage && (
                <div className="mt-6">
                  <img
                    src={currentImage || "/placeholder.svg"}
                    alt="Uploaded"
                    className="w-full rounded-lg shadow-lg object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              )}
            </div>

            {currentImage && (
              <ZoneExtractor
                imageUrl={currentImage}
                onExtract={handleZoneExtraction}
                darkMode={darkMode}
                colorCount={colorCount}
              />
            )}
          </div>

          {/* Right Column - Color Palette and Tabs */}
          <div className="space-y-8">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-2xl shadow-lg`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Color Palette</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseColorCount}
                    disabled={colorCount <= 3}
                    className={`p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:opacity-50" : "bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:opacity-50"} transition-colors`}
                    aria-label="Decrease colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={`${darkMode ? "text-white" : "text-gray-900"}`}>{colorCount} colors</span>
                  <button
                    onClick={increaseColorCount}
                    disabled={colorCount >= 10}
                    className={`p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:opacity-50" : "bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:opacity-50"} transition-colors`}
                    aria-label="Increase colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div
                    className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? "border-purple-400" : "border-purple-600"}`}
                  />
                </div>
              ) : colors.length > 0 ? (
                <div
                  className={`grid gap-4 ${
                    colorCount <= 4
                      ? "grid-cols-2"
                      : colorCount <= 6
                        ? "sm:grid-cols-2 md:grid-cols-3"
                        : "sm:grid-cols-2 md:grid-cols-4"
                  }`}
                >
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`cursor-pointer transition-transform hover:scale-105 ${
                        selectedColor?.hex === color.hex ? "ring-2 ring-offset-2 ring-purple-500" : ""
                      }`}
                    >
                      <ColorCard color={color} darkMode={darkMode} />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center h-64 rounded-lg border-2 border-dashed ${darkMode ? "border-gray-700" : "border-gray-300"}`}
                >
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-center`}>
                    Upload an image to generate a color palette
                  </p>
                </div>
              )}
            </div>

            {/* Tabs for Advanced Features */}
            {colors.length > 0 && (
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg overflow-hidden`}>
                <div className="flex border-b overflow-x-auto">
                  <button
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-1 ${
                      activeTab === "palette"
                        ? darkMode
                          ? "border-b-2 border-purple-500 text-purple-400"
                          : "border-b-2 border-purple-600 text-purple-600"
                        : darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("palette")}
                  >
                    <Palette className="w-4 h-4" />
                    <span>Gradients</span>
                  </button>
                  <button
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-1 ${
                      activeTab === "details"
                        ? darkMode
                          ? "border-b-2 border-purple-500 text-purple-400"
                          : "border-b-2 border-purple-600 text-purple-600"
                        : darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Color Details</span>
                  </button>
                  <button
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-1 ${
                      activeTab === "applications"
                        ? darkMode
                          ? "border-b-2 border-purple-500 text-purple-400"
                          : "border-b-2 border-purple-600 text-purple-600"
                        : darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("applications")}
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Applications</span>
                  </button>
                  <button
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-1 ${
                      activeTab === "advanced"
                        ? darkMode
                          ? "border-b-2 border-purple-500 text-purple-400"
                          : "border-b-2 border-purple-600 text-purple-600"
                        : darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("advanced")}
                  >
                    <PaletteIcon className="w-4 h-4" />
                    <span>Harmony</span>
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === "palette" && <GradientGenerator colors={colors} darkMode={darkMode} />}

                  {activeTab === "details" && selectedColor && (
                    <ColorDetails color={selectedColor} darkMode={darkMode} />
                  )}

                  {activeTab === "applications" && <PracticalApplications colors={colors} darkMode={darkMode} />}

                  {activeTab === "advanced" && selectedColor && (
                    <ColorHarmony color={selectedColor} darkMode={darkMode} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className={`mt-12 ${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-2xl shadow-lg`}>
          <PaletteHistory palettes={palettes} onSelect={selectPalette} darkMode={darkMode} />
        </div>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: darkMode ? "#374151" : "#ffffff",
            color: darkMode ? "#ffffff" : "#1f2937",
          },
        }}
      />
    </div>
  )
}

export default App

