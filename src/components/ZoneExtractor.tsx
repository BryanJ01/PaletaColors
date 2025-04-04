"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import ColorThief from "colorthief"
import { Crop, Pipette } from "lucide-react"
import type { Color } from "../types"
import { toast } from "react-hot-toast"

interface ZoneExtractorProps {
  imageUrl: string | null
  onExtract: (colors: Color[]) => void
  darkMode: boolean
  colorCount: number
}

export function ZoneExtractor({ imageUrl, onExtract, darkMode, colorCount }: ZoneExtractorProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selection, setSelection] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [isExtracting, setIsExtracting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const img = new Image()
      img.crossOrigin = "Anonymous"
      img.onload = () => {
        imageRef.current = img
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
          }
        }
      }
      img.src = imageUrl
    }
  }, [imageUrl])

  const startSelection = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting && !isExtracting) {
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (canvas.width / rect.width)
        const y = (e.clientY - rect.top) * (canvas.height / rect.height)
        setStartPoint({ x, y })
        setSelection({ x, y, width: 0, height: 0 })
        setIsSelecting(true)
      }
    }
  }

  const updateSelection = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSelecting) {
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (canvas.width / rect.width)
        const y = (e.clientY - rect.top) * (canvas.height / rect.height)
        setSelection({
          x: Math.min(startPoint.x, x),
          y: Math.min(startPoint.y, y),
          width: Math.abs(x - startPoint.x),
          height: Math.abs(y - startPoint.y),
        })
      }
    }
  }

  const endSelection = () => {
    if (isSelecting) {
      setIsSelecting(false)
      if (selection.width > 10 && selection.height > 10) {
        // Extraer colores automáticamente cuando la selección es válida
        extractColorsFromZone()
      }
    }
  }

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

  const extractColorsFromZone = () => {
    if (isExtracting) return // Evitar extracciones simultáneas

    setIsExtracting(true)

    const canvas = canvasRef.current
    if (canvas && imageRef.current) {
      // Mostrar indicador visual de que se está procesando
      toast.loading("Extrayendo colores...", { id: "extracting" })

      // Crear un canvas temporal para la zona seleccionada
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d")

      if (tempCtx) {
        // Asegurarse de que las dimensiones sean válidas
        const width = Math.max(10, selection.width)
        const height = Math.max(10, selection.height)

        tempCanvas.width = width
        tempCanvas.height = height

        // Dibujar solo la parte seleccionada de la imagen en el canvas temporal
        tempCtx.drawImage(imageRef.current, selection.x, selection.y, width, height, 0, 0, width, height)

        try {
          // Usar ColorThief para extraer los colores
          const colorThief = new ColorThief()

          // Convertir el canvas a una imagen para que ColorThief pueda procesarla
          const dataUrl = tempCanvas.toDataURL("image/png")
          const img = new Image()
          img.crossOrigin = "Anonymous"

          img.onload = () => {
            try {
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

              // Notificar al usuario que la extracción fue exitosa
              toast.dismiss("extracting")
              toast.success("Colores extraídos de la zona seleccionada")

              // Pasar los colores extraídos al componente padre
              onExtract(colors)

              // Resetear la selección para permitir una nueva
              setSelection({ x: 0, y: 0, width: 0, height: 0 })
              setIsExtracting(false)
            } catch (error) {
              console.error("Error al extraer colores:", error)
              toast.dismiss("extracting")
              toast.error("No se pudieron extraer colores. Intenta con una zona más grande.")
              setIsExtracting(false)
            }
          }

          img.onerror = () => {
            toast.dismiss("extracting")
            toast.error("Error al procesar la imagen seleccionada")
            setIsExtracting(false)
          }

          img.src = dataUrl
        } catch (error) {
          console.error("Error al extraer colores de la zona:", error)
          toast.dismiss("extracting")
          toast.error("Error al extraer colores. Intenta con otra zona.")
          setIsExtracting(false)
        }
      } else {
        toast.dismiss("extracting")
        toast.error("No se pudo crear el contexto del canvas")
        setIsExtracting(false)
      }
    } else {
      setIsExtracting(false)
    }
  }

  const drawSelectionOverlay = () => {
    const canvas = canvasRef.current
    if (canvas && imageRef.current) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Clear and redraw the image
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(imageRef.current, 0, 0)

        // Draw selection rectangle
        if (selection.width > 0 && selection.height > 0) {
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.strokeRect(selection.x, selection.y, selection.width, selection.height)

          // Draw semi-transparent overlay outside selection
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
          ctx.fillRect(0, 0, canvas.width, selection.y) // top
          ctx.fillRect(0, selection.y, selection.x, selection.height) // left
          ctx.fillRect(
            selection.x + selection.width,
            selection.y,
            canvas.width - selection.x - selection.width,
            selection.height,
          ) // right
          ctx.fillRect(0, selection.y + selection.height, canvas.width, canvas.height - selection.y - selection.height) // bottom
        }
      }
    }
  }

  useEffect(() => {
    drawSelectionOverlay()
  }, [selection])

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {isExtracting ? "Extrayendo colores..." : "Extractor de Zona"}
          </h3>
          <div className="flex items-center gap-2">
            <Crop className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
            <Pipette className={`w-5 h-5 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
          </div>
        </div>

        {imageUrl ? (
          <div className="relative">
            <canvas
              ref={canvasRef}
              className={`w-full h-auto rounded-lg ${isExtracting ? "cursor-wait" : "cursor-crosshair"}`}
              onMouseDown={startSelection}
              onMouseMove={updateSelection}
              onMouseUp={endSelection}
              onMouseLeave={endSelection}
            />

            <div className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {isExtracting
                ? "Procesando la selección..."
                : "Haz clic y arrastra para seleccionar una zona. Los colores se extraerán automáticamente."}
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center justify-center h-48 rounded-lg border-2 border-dashed ${darkMode ? "border-gray-700" : "border-gray-300"}`}
          >
            <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Sube una imagen para usar el extractor de zonas
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

