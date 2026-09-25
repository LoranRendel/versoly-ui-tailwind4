import type { Component } from "../types";

export const progress: Component = {
  base: {
    ".progress": "flex w-full overflow-hidden bg-gray-200 rounded-full h-2.5",
    ".progress-bar": "h-full",
  },
  modifier: {
    ".progress-sm": "h-1.5",
    ".progress-lg": "h-4",
    ".progress-xl": "h-6",
  },
};
