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
/** Radius tokens like daisyUI's: `rounded-vui-field` → `--radius-vui-field`, defaults to Tailwind's `--radius-md`. */
const RADII = {
  selector: "sm",
  field: "md",
  box: "lg",
};
/** Tailwind colors the components use, read from variables so they follow the user's theme. */
const TAILWIND_PALETTES = ["gray", "neutral", "green", "yellow", "purple"];
const TAILWIND_COLORS = ["white", "black"];

/**
 * Every variable the plugin defines has `vui` after the Tailwind namespace, so it doesn't clash with Tailwind,
 * daisyUI… and has the same name as in `@theme`: `--color-primary-600` → `--color-vui-primary-600`.
 */
export const toVuiVariable = (variable: string) => variable.replace(/^--([a-z]+)-/, "--$1-vui-");

/**
 * A design token the compiled components read from a CSS variable.
 * - `variable`: the plugin's variable, `--color-vui-primary-600`.
 * - `themeVariable`: the Tailwind theme variable the component sources use (`bg-primary-600` → `--color-primary-600`),
 *   compiled to `var(--color-vui-primary-600)`.
 * - `key`: where the value is in the user's theme, `fallback`: the default when the user didn't set it.
 *   Tailwind's own values are read by variable name, `theme("--radius-md")`: `theme("borderRadius.md")` returns
 *   Tailwind 3 defaults.
 */
interface Token {
  variable: string;
  themeVariable: string;
  key: string;
  fallback?: string;
}

const token = (themeVariable: string, key: string, fallback?: string): Token => ({
  variable: toVuiVariable(themeVariable),
  themeVariable,
  key,
  fallback,
});

export const tokens: Token[] = [
  ...Object.entries(PALETTES).flatMap(([name, { palette, default: shade }]) => [
    token(`--color-${name}`, `colors.vui-${name}.DEFAULT`, `--color-${palette}-${shade}`),
    ...SHADES.map((s) => token(`--color-${name}-${s}`, `colors.vui-${name}.${s}`, `--color-${palette}-${s}`)),
  ]),
  ...Object.entries(SINGLE_COLORS).map(([name, color]) =>
    token(`--color-${name}`, `colors.vui-${name}`, `--color-${color}`),
  ),
  ...Object.entries(RADII).map(([name, size]) =>
    token(`--radius-${name}`, `borderRadius.vui-${name}`, `--radius-${size}`),
  ),
  ...TAILWIND_PALETTES.flatMap((palette) =>
    SHADES.map((s) => token(`--color-${palette}-${s}`, `--color-${palette}-${s}`)),
  ),
  ...TAILWIND_COLORS.map((color) => token(`--color-${color}`, `--color-${color}`)),
];

/** Tokens the plugin adds to the theme, always set: they can be used in the markup and custom CSS. */
const ownTokens = tokens.filter(({ fallback }) => fallback);

/**
 * Plugin theme, with the `vui-` prefix so it doesn't take over `bg-primary` of daisyUI or the user's theme:
 * `bg-vui-primary-600` → `var(--color-vui-primary-600)`, `rounded-vui-field` → `var(--radius-vui-field)`.
 */
export const theme = {
  colors: Object.fromEntries(
    [...Object.keys(PALETTES), ...Object.keys(SINGLE_COLORS)].map((name) => {
      const own = ownTokens.filter(({ key }) => key === `colors.vui-${name}` || key.startsWith(`colors.vui-${name}.`));
      return [
        `vui-${name}`,
        own.length === 1
          ? `var(${own[0].variable})`
          : Object.fromEntries(own.map(({ key, variable }) => [key.split(".")[2], `var(${variable})`])),
      ];
    }),
  ),
  borderRadius: Object.fromEntries(Object.keys(RADII).map((name) => [`vui-${name}`, `var(--radius-vui-${name})`])),
};

/**
 * Sets the token variables in `:root`: the plugin's own ones, and the Tailwind colors the included components use.
 * Plugins can't add to `@theme`, so they go to the base layer. The values come from the user's theme, which works
 * with `prefix(tw)` too, where Tailwind's variables are `--tw-color-…`.
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
