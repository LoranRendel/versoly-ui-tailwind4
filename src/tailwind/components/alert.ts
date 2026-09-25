import { eachColor } from "../colors";
import type { Component } from "../types";

export const alert: Component = {
  base: {
    ".alert": "flex flex-row rounded-field px-3 py-2 text-gray-700 bg-gray-100 transition-opacity duration-300",
  },
  color: eachColor(({ name, palette }) => ({ [`.alert-${name}`]: `text-${palette}-600 bg-${palette}-50` })),
};
