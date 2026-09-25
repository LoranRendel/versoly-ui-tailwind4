import type { Component } from "../types";

export const tab: Component = {
  base: {
    ".tab-list": "flex flex-wrap gap-x-2 mb-2 select-none",
    ".tab": "px-4 py-2 border-b-2 border-gray-200 hover:text-primary ring-0 focus:outline-hidden",
    ".tab-underline": "px-3 py-2 text-muted hover:text-primary focus:outline-hidden",
    ".tab-content": "py-2",
  },
  modifier: {
    ".tab-list-underline": "border-b-2 border-gray-300",
  },
  state: {
    '.tab[aria-selected="true"]': "border-primary text-primary",
    '.tab-underline[aria-selected="true"]': "-mb-1 border-0 border-b-2 border-primary text-primary",
  },
};
