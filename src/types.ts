export interface Color {
  hex: string
  rgb: [number, number, number]
}

export interface Palette {
  id: string
  imageUrl: string
  colors: Color[]
  timestamp: number
}

