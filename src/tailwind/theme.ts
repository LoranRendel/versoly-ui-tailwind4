import type { PluginAPI } from "tailwindcss/plugin";

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/** Colors the plugin adds: name → Tailwind palette they default to. */
const PALETTES = {
  primary: { palette: "blue", default: 600 },
  secondary: { palette: "pink", default: 600 },
  info: { palette: "sky", default: 400 },
  danger: { palette: "red", default: 600 },
};
/** Single colors the plugin adds: name → Tailwind color they default to. */
const SINGLE_COLORS = {
  dark: "gray-900",
  muted: "gray-500",
};
/** Radius tokens like daisyUI's: `rounded-field` → `--radius-field`, defaults to Tailwind's `--radius-md`. */
const RADII = {
  selector: "sm",
  field: "md",
  box: "lg",
};
/** Tailwind colors the components use, read from variables so they follow the user's theme. */
const TAILWIND_PALETTES = ["gray", "neutral", "green", "yellow", "purple"];
const TAILWIND_COLORS = ["white", "black"];

/**
 * A design token the compiled components read from a CSS variable. `key` is where the value is in the theme,
 * `fallback` where the default is when the user didn't set it. Tailwind's own values are read by variable name,
 * `theme("--radius-md")`: `theme("borderRadius.md")` returns Tailwind 3 defaults.
 */
interface Token {
  variable: string;
  key: string;
  fallback?: string;
}

export const tokens: Token[] = [
  ...Object.entries(PALETTES).flatMap(([name, { palette, default: shade }]) => [
    { variable: `--color-${name}`, key: `colors.${name}.DEFAULT`, fallback: `--color-${palette}-${shade}` },
    ...SHADES.map((s) => ({
      variable: `--color-${name}-${s}`,
      key: `colors.${name}.${s}`,
      fallback: `--color-${palette}-${s}`,
    })),
  ]),
  ...Object.entries(SINGLE_COLORS).map(([name, color]) => ({
    variable: `--color-${name}`,
    key: `colors.${name}`,
    fallback: `--color-${color}`,
  })),
  ...Object.entries(RADII).map(([name, size]) => ({
    variable: `--radius-${name}`,
    key: `borderRadius.${name}`,
    fallback: `--radius-${size}`,
  })),
  ...TAILWIND_PALETTES.flatMap((palette) =>
    SHADES.map((s) => ({ variable: `--color-${palette}-${s}`, key: `--color-${palette}-${s}` })),
  ),
  ...TAILWIND_COLORS.map((color) => ({ variable: `--color-${color}`, key: `--color-${color}` })),
];

/** Tokens the plugin adds to the theme, always set: they can be used in the markup and custom CSS. */
const ownTokens = tokens.filter(({ fallback }) => fallback);

const byVariable = (prefix: string, key: string) =>
  Object.fromEntries(
    ownTokens
      .filter(({ key: k }) => k.startsWith(`${prefix}.${key}`))
      .map(({ key: k, variable }) => [k.split(".")[2] ?? "DEFAULT", `var(${variable})`]),
  );

/** Plugin theme: `bg-primary-600` → `var(--color-primary-600)`, `rounded-field` → `var(--radius-field)`. */
export const theme = {
  colors: {
    ...Object.fromEntries(Object.keys(PALETTES).map((name) => [name, byVariable("colors", `${name}.`)])),
    ...Object.fromEntries(Object.keys(SINGLE_COLORS).map((name) => [name, `var(--color-${name})`])),
  },
  borderRadius: Object.fromEntries(Object.keys(RADII).map((name) => [name, `var(--radius-${name})`])),
};

/**
 * Sets the token variables in `:root`: the plugin's own ones, and the Tailwind colors the included components use.
 * Plugins can't add to `@theme`, so they go to the base layer. The values come from the user's theme: with
 * `prefix(tw)` Tailwind only defines `--tw-color-…`, which the components don't read.
 */
export const addTokenVariables = ({ addBase, theme }: Pick<PluginAPI, "addBase" | "theme">, used: Set<string>) => {
  const values = Object.fromEntries(
    tokens
      .filter(({ variable, fallback }) => fallback || used.has(variable))
      .map(({ variable, key, fallback }) => {
        const value = theme(key);
        return [variable, fallback && value === `var(${variable})` ? theme(fallback) : value];
      }),
  );

  addBase({ ":root, :host": values });
};
