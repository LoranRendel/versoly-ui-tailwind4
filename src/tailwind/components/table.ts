import type { Component } from "../types";

export const table: Component = {
  base: {
    ".table": "min-w-full",
    "html :where(.table>thead)": "bg-gray-50",
    "html :where(.table>thead>tr>th)": "py-3 px-4 text-xs font-semibold text-left text-gray-700",
    "html :where(.table>tbody>tr>td)": "py-3 px-4 text-sm text-gray-900",
    ".table>tbody>tr": "bg-white border-b border-gray-200",
  },
  modifier: {
    ".table-hover>tbody>tr": "hover:bg-gray-200",
    ".table-striped>thead>tr": "bg-gray-50 border-b border-gray-300",
    ".table-striped>tbody>tr": "even:bg-gray-100",
    ".table-sm>thead>tr>th, .table-sm>tbody>tr>td": "py-1",
  },
};
