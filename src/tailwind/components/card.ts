import type { Component } from "../types";

export const card: Component = {
  base: {
    ".card": "relative flex flex-col overflow-hidden shadow-md rounded-box bg-white",
    ".card-header": "px-5 py-3 bg-gray-100",
    ".card-body": "p-5 grow",
    ".card-footer": "px-5 py-3 bg-gray-100",
  },
};
