export interface AnimationDef {
  name: string;
  keyframes: string;
  initialStyle?: string;
  supportsDistance?: boolean;
  supportsScale?: boolean;
}

export interface DataAnimElement extends HTMLElement {
  _daInit?: boolean;
  _daObs?: IntersectionObserver;
}
