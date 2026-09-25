import { eachColor } from "../colors";
import type { Component } from "../types";

export const link: Component = {
  base: {
    "html :where(a)": "text-primary hover:text-primary-800",
  },
  color: {
    "html :where(a.text-dark)": "hover:text-gray-600",
    "html :where(a.text-white)": "hover:text-gray-300",
    ...eachColor(({ name }, s) =>
      name === "dark" ? {} : { [`html :where(a.text-${name})`]: `text-${s()} hover:text-${s(2)} active:text-${s(3)}` },
    ),
  },
};
