import type { Component } from "../types";

export const prose: Component = {
  // has to beat the unlayered @tailwindcss/typography styles
  unlayered: {
    ".prose a": "text-primary hover:text-primary-700",
    ".prose h4": "text-lg",
    ".prose ul ul": "list-disc",
    ".prose ul ul ul": "list-[square]",
    ".prose > blockquote": "border-l-4 border-gray-600 my-3 py-3 pl-4 text-xl -ml-5",
  },
};
