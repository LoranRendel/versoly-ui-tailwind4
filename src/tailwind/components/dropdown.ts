import type { Component } from "../types";

export const dropdown: Component = {
  base: {
    ":root": {
      "--svg-caret-down": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4z'/%3E%3C/svg%3E")`,
    },
    '[data-toggle="dropdown"]':
      "flex ml-4 items-center gap-x-1 after:shrink-0 after:w-4 after:h-4 after:[mask:var(--svg-caret-down)_no-repeat_center/cover] after:content-[''] after:bg-current",
    ".dropdown-menu":
      "absolute hidden transition duration-200 opacity-0 w-max py-2 bg-white border border-gray-300 rounded-selector mt-2 min-w-[160px] z-1",
    ".dropdown-item":
      "bg-transparent py-1.5 px-4 hover:text-primary-800 focus:text-primary-800 hover:bg-primary-100 focus:bg-primary-100 focus:outline-hidden",
  },
  state: {
    ".dropdown-menu.show": "opacity-100 block",
  },
};
