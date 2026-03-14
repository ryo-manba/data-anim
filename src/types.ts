export interface AnimationDef {
  name: string;
  keyframes: string;
  initialStyle?: string;
  supportsDistance?: boolean;
  supportsScale?: boolean;
}

export interface DataAnimConfig {
  offset: number;
  duration: number;
  easing: string;
  once: boolean;
  debug: boolean;
  breakpoints: { mobile: number; tablet: number };
}

export interface DataAnimElement extends HTMLElement {
  _daInit?: boolean;
  _daObs?: IntersectionObserver;
}

declare global {
  interface Window {
    __dataAnim?: Partial<DataAnimConfig>;
  }
}
