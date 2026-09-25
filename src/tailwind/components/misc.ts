import type { Component } from "../types";

export const disabled: Component = {
  state: {
    ".disabled": "opacity-80 pointer-events-none",
  },
};

export const fontawesome: Component = {
  base: {
    ".fa-ul": "ml-6",
  },
};

export const taos: Component = {
  base: {
    "html :where(.taos-init)": "duration-400",
  },
};
