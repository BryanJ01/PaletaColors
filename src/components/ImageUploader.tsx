"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, ImageIcon } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (file: File) => void
  darkMode: boolean
}

export function ImageUploader({ onImageUpload, darkMode }: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0])
      }
    },
    [onImageUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
        ${isDragActive ? "border-opacity-100" : "border-opacity-50"} 
        ${
          darkMode
            ? `bg-gray-700 border-gray-500 ${isDragActive ? "bg-gray-600" : ""}`
            : `bg-gray-50 border-gray-300 ${isDragActive ? "bg-blue-50" : ""}`
        }
        hover:border-opacity-100
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        {isDragActive ? (
          <>
            <div className={`p-4 rounded-full ${darkMode ? "bg-gray-600" : "bg-blue-100"}`}>
              <ImageIcon className={`w-8 h-8 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
            </div>
            <p className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Drop the image here...</p>
          </>
        ) : (
          <>
            <div className={`p-4 rounded-full ${darkMode ? "bg-gray-600" : "bg-purple-100"}`}>
              <Upload className={`w-8 h-8 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
            </div>
            <div>
              <p className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                Drag & drop an image here
              </p>
              <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>or click to select a file</p>
            </div>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Supports JPG, PNG, GIF, WEBP</p>
          </>
        )}
      </div>
    </div>
  )
}

