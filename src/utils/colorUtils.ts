// Color conversion and manipulation utilities
export type ColorFormat = "hex" | "rgb" | "hsl" | "cmyk" | "pantone"

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

// Convert RGB to CMYK
export function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  r /= 255
  g /= 255
  b /= 255

  const k = 1 - Math.max(r, g, b)
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k)
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k)
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k)

  return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)]
}

// Get a Pantone-like code (approximation)
export function getPantoneApproximation(r: number, g: number, b: number): string {
  // This is a simplified approximation
  const hsl = rgbToHsl(r, g, b)
  const h = hsl[0]
  const s = hsl[1]
  const l = hsl[2]

  // Generate a Pantone-like code based on HSL values
  const hueCode = Math.round(h / 3.6)
    .toString()
    .padStart(2, "0")
  const satCode = String.fromCharCode(65 + Math.floor(s / 10))
  const lightCode = Math.round(l / 10)

  return `P ${hueCode}-${satCode}${lightCode}`
}

// Determine if a color is warm or cool
export function getColorTemperature(r: number, g: number, b: number): "warm" | "cool" | "neutral" {
  const hsl = rgbToHsl(r, g, b)
  const hue = hsl[0]

  // Warm colors: red, orange, yellow (0-60, 300-360)
  // Cool colors: green, blue, purple (61-299)
  if ((hue >= 0 && hue <= 60) || (hue >= 300 && hue <= 360)) {
    return "warm"
  } else if (hue > 60 && hue < 300) {
    return "cool"
  } else {
    return "neutral"
  }
}

// Get complementary color
export function getComplementaryColor(r: number, g: number, b: number): [number, number, number] {
  return [255 - r, 255 - g, 255 - b]
}

// Get analogous colors
export function getAnalogousColors(
  r: number,
  g: number,
  b: number,
): [[number, number, number], [number, number, number]] {
  const hsl = rgbToHsl(r, g, b)
  const h1 = (hsl[0] + 30) % 360
  const h2 = (hsl[0] + 330) % 360

  // This is a simplified conversion back to RGB
  return [hslToRgb(h1, hsl[1], hsl[2]), hslToRgb(h2, hsl[1], hsl[2])]
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

// Generate a gradient CSS string
export function generateGradient(
  colors: string[],
  type: "linear" | "radial" = "linear",
  direction = "to right",
): string {
  if (type === "linear") {
    return `linear-gradient(${direction}, ${colors.join(", ")})`
  } else {
    return `radial-gradient(circle, ${colors.join(", ")})`
  }
}

// Convert RGB array to CSS color string
export function rgbToString(rgb: [number, number, number]): string {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

// Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? "0" + hex : hex
      })
      .join("")
  )
}

// Convert HEX to RGB
export function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
    : null
}

// Get color harmony (monochromatic, analogous, complementary, etc.)
export function getColorHarmony(
  r: number,
  g: number,
  b: number,
  type: "monochromatic" | "analogous" | "complementary" | "triadic" | "tetradic",
): string[] {
  const hsl = rgbToHsl(r, g, b)
  const h = hsl[0]
  const s = hsl[1]
  const l = hsl[2]

  let colors: [number, number, number][] = []

  switch (type) {
    case "monochromatic":
      colors = [
        hslToRgb(h, s, Math.max(0, l - 30)),
        hslToRgb(h, s, Math.max(0, l - 15)),
        [r, g, b],
        hslToRgb(h, s, Math.min(100, l + 15)),
        hslToRgb(h, s, Math.min(100, l + 30)),
      ]
      break
    case "analogous":
      colors = [hslToRgb((h - 30 + 360) % 360, s, l), [r, g, b], hslToRgb((h + 30) % 360, s, l)]
      break
    case "complementary":
      colors = [[r, g, b], hslToRgb((h + 180) % 360, s, l)]
      break
    case "triadic":
      colors = [[r, g, b], hslToRgb((h + 120) % 360, s, l), hslToRgb((h + 240) % 360, s, l)]
      break
    case "tetradic":
      colors = [
        [r, g, b],
        hslToRgb((h + 90) % 360, s, l),
        hslToRgb((h + 180) % 360, s, l),
        hslToRgb((h + 270) % 360, s, l),
      ]
      break
  }

  return colors.map((rgb) => rgbToHex(rgb[0], rgb[1], rgb[2]))
}

