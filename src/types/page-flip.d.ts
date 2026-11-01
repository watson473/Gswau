// Minimal types for page-flip 2.0.7 (StPageFlip), which ships without its own.
declare module "page-flip/dist/js/page-flip.module.js" {
  export interface FlipSettings {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showCover?: boolean;
    usePortrait?: boolean;
    drawShadow?: boolean;
    maxShadowOpacity?: number;
    flippingTime?: number;
    mobileScrollSupport?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    startPage?: number;
  }
  export class PageFlip {
    constructor(element: HTMLElement, settings: FlipSettings);
    loadFromImages(images: string[]): void;
    loadFromHTML(items: HTMLElement[] | NodeListOf<HTMLElement>): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    on(event: "flip" | "init" | "changeOrientation", cb: (e: { data: unknown }) => void): this;
    destroy(): void;
  }
}
