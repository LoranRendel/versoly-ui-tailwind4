import { eachColor } from "../colors";
import type { Styles } from "../types";

const transparent = "bg-transparent hover:bg-transparent active:bg-transparent border-transparent border-0";

export const button: Styles = {
  ".btn":
    "inline-flex flex-wrap items-center justify-center text-center cursor-pointer select-none transition duration-200 ease-in-out shrink-0 font-semibold py-2 px-4 rounded-md disabled:opacity-80 disabled:pointer-events-none focus:outline-hidden focus:ring-2 hover:no-underline border-0",

  ".btn-xs, .btn-group-xs>.btn": "py-1 px-1 text-xs",
  ".btn-sm, .btn-group-sm>.btn": "py-1 px-2 text-sm",
  ".btn-lg, .btn-group-lg>.btn": "py-3 px-5 text-lg",
  ".btn-xl, .btn-group-xl>.btn": "py-4 px-6 text-xl",

  ".btn-ani": "transition-all hover:-translate-y-0.5 duration-300 ease-in-out",
  ".btn-cta":
    "bg-linear-to-r from-primary to-secondary hover:from-primary-700 hover:to-secondary-700 border-0 text-white",

  ...eachColor(({ name, palette, contrast }, s) => ({
    [`.btn-${name}`]: `bg-${s()} hover:bg-${s(1)} hover:text-${contrast} active:bg-${s(2)} text-${contrast} border-${s()} hover:border-${s(1)} ring-${s()}/50 focus:ring-${s(2)}/50`,
    [`.btn-outline.btn-${name}`]: `bg-transparent text-${s()} hover:bg-${s(1)} active:bg-${s(2)} active:text-${contrast} hover:text-${contrast} border-${s()} border focus:ring-${s(2)}/50`,
    [`.btn-outline.btn-${name}[aria-current="page"]`]: `bg-${s()} text-${contrast}`,
    [`.btn-ghost.btn-${name}`]: `bg-transparent hover:bg-${palette}-100 hover:text-${s()} active:bg-${palette}-200 text-${s()} border-0 focus:ring-${s(2)}/50`,
    [`.btn-ghost.btn-${name}[aria-current="page"]`]: `hover:text-${s()} bg-${palette}-100 text-${s()}`,
    [`.btn-subtle.btn-${name}`]: `bg-${palette}-100 hover:bg-${palette}-200 hover:text-${s(1)} active:bg-${palette}-300 text-${s()} border-0 focus:ring-${s(2)}/50`,
    [`.btn-link.btn-${name}`]: `${transparent} text-${s()} hover:text-${s(2)} active:text-${s(3)} hover:underline focus:ring-${s(2)}/50`,
  })),
  ".btn-ghost.btn-light:not(.c)": "text-gray-900",

  // colors without a palette
  ".btn-black": "bg-black text-white border-black ring-black/50",
  ".btn-white": "bg-white text-black border-white ring-white/50",
  ".btn-muted": "bg-gray-700 border-gray-700 ring-gray-700/50",

  ".btn-outline.btn-black": "bg-transparent text-black active:text-white hover:text-white border-black border",
  ".btn-outline.btn-white": "bg-transparent text-white active:text-white hover:text-white border-white border",
  ".btn-outline.btn-muted": "bg-transparent text-gray-700 active:text-white hover:text-white border-gray-700 border",
  '.btn-outline.btn-black[aria-current="page"]': "bg-black text-white",
  '.btn-outline.btn-white[aria-current="page"]': "bg-white text-black",
  '.btn-outline.btn-muted[aria-current="page"]': "bg-gray-700",

  ".btn-ghost.btn-black, .btn-subtle.btn-black": "bg-transparent text-black border-0",
  ".btn-ghost.btn-white, .btn-subtle.btn-white": "bg-transparent text-white border-0",
  ".btn-ghost.btn-muted, .btn-subtle.btn-muted": "bg-transparent text-gray-700 border-0",
  '.btn-ghost.btn-black[aria-current="page"]': "text-black",
  '.btn-ghost.btn-white[aria-current="page"]': "text-white",
  '.btn-ghost.btn-muted[aria-current="page"]': "text-gray-700",

  ".btn-link.btn-black, .btn-link.btn-white, .btn-link.btn-muted": `${transparent} hover:underline`,
};
