import { eachColor } from "../colors";
import type { Component } from "../types";

export const blockquote: Component = {
  base: {
    ".blockquote": "text-xl italic font-semibold text-neutral-900",
  },
  color: {
    ...eachColor(({ name, palette }, s) => ({
      [`.blockquote-${name}`]: `p-4 bg-${palette}-50 border-l-4 border-${s()}`,
    })),
    ".blockquote-black": "p-4 border-l-4 border-black",
    ".blockquote-white": "p-4 border-l-4 border-white",
    ".blockquote-muted": "p-4 border-l-4 border-gray-700",
  },
};
