declare module 'page-flip' {
  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>)
    loadFromHTML(elements: HTMLElement[]): void
    flip(pageNum: number): void
    flipNext(): void
    flipPrev(): void
    on(event: string, callback: (e: { data: number }) => void): void
    getCurrentPageIndex(): number
    getPageCount(): number
    destroy(): void
  }
}
