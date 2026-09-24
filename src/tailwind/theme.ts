import type { PluginAPI } from "tailwindcss/plugin";

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/** Theme colors the plugin adds: name → Tailwind color they default to (a palette, or a single color). */
const PALETTES = {
  primary: { palette: "blue", default: 600 },
  secondary: { palette: "pink", default: 600 },
  info: { palette: "sky", default: 400 },
  danger: { palette: "red", default: 600 },
};
const SINGLE_COLORS = {
  dark: "gray.900",
  muted: "gray.500",
};

// Theme keys with the CSS variables they read, e.g. `primary.600` → `--color-primary-600`
type Variable = [key: string, variable: string, fallback: string];

const variables: Variable[] = [
  ...Object.entries(PALETTES).flatMap(([name, { palette, default: shade }]) => [
    [`${name}.DEFAULT`, `--color-${name}`, `${palette}.${shade}`] as Variable,
    ...SHADES.map((s) => [`${name}.${s}`, `--color-${name}-${s}`, `${palette}.${s}`] as Variable),
  ]),
  ...Object.entries(SINGLE_COLORS).map(([name, color]) => [name, `--color-${name}`, color] as Variable),
];

// Colors point to CSS variables, so they can be used in custom CSS: `color: var(--color-primary-600)`
export const colors = Object.fromEntries(
  [...Object.keys(PALETTES), ...Object.keys(SINGLE_COLORS)].map((name) => {
    const own = variables.filter(([key]) => key === name || key.startsWith(`${name}.`));
    if (own.length === 1) {
      return [name, `var(${own[0][1]})`];
    }
    return [name, Object.fromEntries(own.map(([key, variable]) => [key.split(".")[1], `var(${variable})`]))];
  }),
);

/**
 * Default values of the color variables. Plugins can't add to `@theme`, so they go to `:root` in the base layer,
 * which would beat the theme layer: variables the user set in `@theme` are skipped.
 */
export const addColorVariables = ({ addBase, theme }: Pick<PluginAPI, "addBase" | "theme">) => {
  const defaults = Object.fromEntries(
    variables
      .filter(([key, variable]) => theme(`colors.${key}`) === `var(${variable})`)
      .map(([, variable, fallback]) => [variable, theme(`colors.${fallback}`)]),
  );

  if (Object.keys(defaults).length > 0) {
    addBase({ ":root, :host": defaults });
  }
};
