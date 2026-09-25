import type { Component } from "../types";

export const base: Component = {
  base: {
    body: "bg-white",
    "h1, h2, h3, h4, h5, p": "mb-3",
    "h1, .h1": "text-[calc(1.375rem+1.5vw)] xl:text-5xl",
    "h2, .h2": "text-[calc(1.325rem+0.9vw)] xl:text-4xl",
    "h3, .h3": "text-[calc(1.3rem+0.6vw)] xl:text-3xl",
    "h4, .h4": "text-[calc(1.275rem+0.3vw)] xl:text-2xl",
    "h5, .h5": "text-xl",
  },
};
