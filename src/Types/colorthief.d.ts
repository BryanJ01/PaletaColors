declare module "colorthief" {
    export default class ColorThief {
      /**
       * Get the dominant color from an image.
       * @param img - HTML Image Element or Canvas Element
       * @param quality - Optional. Value from 1 to 10. Default is 10.
       * @returns An array with three values representing RGB colors [r, g, b]
       */
      getColor(img: HTMLImageElement | HTMLCanvasElement, quality?: number): [number, number, number]
  
      /**
       * Get a color palette from an image.
       * @param img - HTML Image Element or Canvas Element
       * @param colorCount - The number of colors to return
       * @param quality - Optional. Value from 1 to 10. Default is 10.
       * @returns An array of arrays with three values representing RGB colors [[r, g, b], [r, g, b], ...]
       */
      getPalette(
        img: HTMLImageElement | HTMLCanvasElement,
        colorCount: number,
        quality?: number,
      ): Array<[number, number, number]>
    }
  }
  
  