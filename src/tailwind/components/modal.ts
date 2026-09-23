import type { Styles } from "../types";

export const modal: Styles = {
  ".modal": "fixed left-0 top-0 w-screen h-screen overflow-auto z-50 transition-opacity duration-500 opacity-0",
  "html :where(.modal-content)": "relative m-auto mt-16 bg-gray-100 shadow-lg z-40 max-w-md",
  ".modal-bg":
    "fixed w-screen h-screen left-0 top-0 z-30 pt-16 bg-gray-900 overflow-auto transition-opacity duration-500 opacity-50",
  ".modal-sm": "max-w-sm",
  ".modal-lg": "max-w-(--breakpoint-md)",
  ".modal-xl": "max-w-(--breakpoint-xl)",
};
