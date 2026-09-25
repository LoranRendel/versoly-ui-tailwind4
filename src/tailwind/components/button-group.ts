import type { Component } from "../types";

export const buttonGroup: Component = {
  base: {
    ".btn-group": "inline-flex",
  },
  modifier: {
    ".btn-group .btn": "rounded-none first:rounded-l-field last:rounded-r-field",
  },
  state: {
    ".btn-group > .btn-outline:not(:first-child)": "border-l-0 border-r",
  },
};
