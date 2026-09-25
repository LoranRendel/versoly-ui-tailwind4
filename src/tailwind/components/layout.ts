import type { Component } from "../types";

export const layout: Component = {
  base: {
    ".container-fluid": "w-full max-w-full mx-auto px-5",
    ".row": "flex flex-wrap flex-row -mx-5",
    ".col": "relative w-full px-5",
  },
  // overrides Tailwind's own `container` utility
  unlayered: {
    ".container": "w-full max-w-full lg:max-w-[calc(min(100vw-60px,1220px))] mx-auto px-5",
  },
};
