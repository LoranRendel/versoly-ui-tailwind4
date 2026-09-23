import type { Styles } from "./types";

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
type Shade = (typeof SHADES)[number];

export interface Color {
  /** Name used in the component class, e.g. `btn-primary`. */
  name: string;
  /** Tailwind color palette the component uses, e.g. `primary` → `bg-primary-600`. */
  palette: string;
  /** Base shade of the palette. */
  shade: Shade;
  /** Text color on top of a solid background. */
  contrast: string;
}

export const COLORS: Color[] = [
  { name: "primary", palette: "primary", shade: 600, contrast: "white" },
  { name: "secondary", palette: "secondary", shade: 600, contrast: "white" },
  { name: "tertiary", palette: "purple", shade: 600, contrast: "white" },
  { name: "info", palette: "info", shade: 400, contrast: "white" },
  { name: "success", palette: "green", shade: 500, contrast: "white" },
  { name: "warning", palette: "yellow", shade: 500, contrast: "white" },
  { name: "danger", palette: "danger", shade: 600, contrast: "white" },
  { name: "neutral", palette: "neutral", shade: 600, contrast: "white" },
  { name: "dark", palette: "gray", shade: 800, contrast: "white" },
  { name: "light", palette: "gray", shade: 100, contrast: "black" },
];

/** Returns `palette-shade` shifted by `step` shades from the base one, e.g. `primary-800` for step 2. */
export type ShadeFn = (step?: number) => string;

const shadeOf =
  ({ palette, shade }: Color): ShadeFn =>
  (step = 0) => {
    const index = Math.min(Math.max(SHADES.indexOf(shade) + step, 0), SHADES.length - 1);
    return `${palette}-${SHADES[index]}`;
  };

/** Builds styles for every theme color. */
export const eachColor = (build: (color: Color, s: ShadeFn) => Styles): Styles =>
  Object.assign({}, ...COLORS.map((color) => build(color, shadeOf(color))));
