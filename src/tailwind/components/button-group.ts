import type { Styles } from "../types";

export const buttonGroup: Styles = {
  ".btn-group": "inline-flex",
  ".btn-group .btn": "rounded-none first:rounded-l-md last:rounded-r-md",
  ".btn-group > .btn-outline:not(:first-child)": "border-l-0 border-r",
};
