import type { Styles } from "../types";

export const tooltip: Styles = {
  ".tooltip":
    "hidden absolute invisible top-0 left-0 bg-dark text-white font-normal py-2 px-3 rounded-lg shadow-xs text-sm pointer-events-none opacity-0 transition-opacity duration-300",
  ".tooltip-arrow": "absolute bg-dark w-2 h-2 rotate-45",
  "[data-popper-arrow]::before":
    "content-[''] rotate-45 absolute h-4 w-4 bg-white border-l border-t border-gray-300 rounded-tl-sm",
  "[data-popper-placement^='top'] > [data-popper-arrow]": "-bottom-2",
  "[data-popper-placement^='bottom'] > [data-popper-arrow]": "-top-2",
  "[data-popper-placement^='left'] > [data-popper-arrow]": "-right-2",
  "[data-popper-placement^='right'] > [data-popper-arrow]": "-left-2",
};
