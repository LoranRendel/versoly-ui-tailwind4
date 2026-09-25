import type { Component } from "../types";

export const badge: Component = {
  base: {
    ".badge": "inline-block px-2 py-0.5 rounded-selector text-xs text-white font-semibold",
  },
  modifier: {
    ".badge-lg": "px-3 py-1 rounded-selector text-sm text-white font-semibold",
  },
};
