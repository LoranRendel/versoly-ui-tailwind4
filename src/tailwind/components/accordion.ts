import type { Component } from "../types";

export const accordion: Component = {
  base: {
    ":root": {
      "--vui-svg-arrow-down": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z'/%3E%3C/svg%3E")`,
    },
    ".accordion-item": "flex flex-col bg-white rounded-box p-4 mb-3",
    ".accordion-header":
      "w-full flex items-center text-xl font-semibold text-left text-dark transition-all duration-300 cursor-pointer hover:text-primary-700 after:w-5 after:h-5 after:shrink-0 after:ml-auto after:content-[''] after:bg-current after:[mask:var(--vui-svg-arrow-down)_no-repeat_center/contain] after:transition after:duration-300",
    ".accordion-collapse": "transition-all duration-300",
    ".accordion-body": "py-3",
  },
  state: {
    '.accordion-header[aria-expanded="true"]': "text-primary hover:text-primary-700 after:rotate-180",
  },
};
