import plugin, { type PluginUtils } from "tailwindcss/plugin";
import { components, type ComponentName } from "./components/index";
import type { CssInJs, Styles } from "./types";

export interface VersolyUIOptions {
  /** Only these components are added. Defaults to all of them. */
  include?: ComponentName | ComponentName[];
  /** These components are skipped. */
  exclude?: ComponentName | ComponentName[];
  /** Prefix for component classes: `v-` → `.v-btn`. */
  prefix?: string;
}

// Classes owned by other libraries, Tailwind utilities and state classes set by the JS keep their names.
const UNPREFIXED_CLASS = /^(show|c|prose|fa-ul|taos-init|text-.*)$/;

// `prefix: "v-";` comes from CSS with quotes, `prefix: v-;` without.
const toPrefix = (value: unknown) => {
  const prefix = String(value ?? "")
    .trim()
    .replace(/^(["'])(.*)\1$/, "$2");
  if (prefix && !/^[_a-zA-Z][\w-]*$/.test(prefix)) {
    console.warn(`[versoly-ui] Invalid prefix "${prefix}", it's ignored.`);
    return "";
  }
  return prefix;
};

// Prefixes class names outside of attribute selectors: `.btn-group > .btn[type=".x"]` → `.v-btn-group > .v-btn[type=".x"]`
const prefixSelector = (selector: string, prefix: string) =>
  selector
    .split(/(\[[^\]]*\])/)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part.replace(/\.(-?[_a-zA-Z][\w-]*)/g, (match, name: string) =>
            UNPREFIXED_CLASS.test(name) ? match : `.${prefix}${name}`,
          ),
    )
    .join("");

const componentNames = Object.keys(components) as ComponentName[];

// From CSS a single value comes as a string and several as an array: `include: button, card;`
const toList = (value: unknown): string[] | undefined => {
  if (value === undefined || value === null || value === true) {
    return undefined;
  }
  if (value === false) {
    return [];
  }
  return (Array.isArray(value) ? value : String(value).split(",")).map((name) => String(name).trim()).filter(Boolean);
};

const validate = (names: string[] | undefined, option: string) => {
  names
    ?.filter((name) => !componentNames.includes(name as ComponentName))
    .forEach((name) =>
      console.warn(`[versoly-ui] Unknown component "${name}" in "${option}". Available: ${componentNames.join(", ")}`),
    );
};

const getComponentNames = (options: VersolyUIOptions = {}) => {
  const include = toList(options.include);
  const exclude = toList(options.exclude);
  validate(include, "include");
  validate(exclude, "exclude");

  return componentNames.filter((name) => (include?.includes(name) ?? true) && !exclude?.includes(name));
};

const toCss = (value: string | CssInJs): CssInJs => (typeof value === "string" ? { [`@apply ${value}`]: {} } : value);

// Tailwind 4 registers `addComponents` rules as utilities keyed by class name (generated only when used),
// so selectors without a class, like `body` or `[data-toggle]`, have to go to `addBase`.
const hasClass = (selector: string) => /\.-?[_a-zA-Z]/.test(selector.replace(/\[[^\]]*\]/g, ""));

const splitStyles = (styles: Styles, prefix: string) => {
  const base: Record<string, CssInJs> = {};
  const classes: Record<string, CssInJs> = {};

  for (const [selector, value] of Object.entries(styles)) {
    const css = toCss(value);
    const parts = prefixSelector(selector, prefix)
      .split(",")
      .map((part) => part.trim());
    const baseSelector = parts.filter((part) => !hasClass(part)).join(", ");
    const classSelector = parts.filter(hasClass).join(", ");

    if (baseSelector) {
      base[baseSelector] = css;
    }
    if (classSelector) {
      classes[classSelector] = css;
    }
  }

  return { base, classes };
};

const versolyUI: ReturnType<typeof plugin.withOptions<VersolyUIOptions>> = plugin.withOptions<VersolyUIOptions>(
  (options) =>
    ({ addBase, addComponents }) => {
      const prefix = toPrefix(options?.prefix);
      if (prefix) {
        // read by the JS to find prefixed elements
        addBase({ ":root": { "--vui-prefix": `"${prefix}"` } });
      }

      for (const name of getComponentNames(options)) {
        const { base, classes } = splitStyles(components[name], prefix);
        if (Object.keys(base).length > 0) {
          addBase(base);
        }
        addComponents(classes);
      }
    },
  () => ({
    theme: {
      extend: {
        // Defaults, override with `@theme { --color-primary-600: …; }`
        colors: ({ theme }: PluginUtils) => ({
          primary: { DEFAULT: theme("colors.blue.600"), ...theme("colors.blue") },
          secondary: { DEFAULT: theme("colors.pink.600"), ...theme("colors.pink") },
          info: { DEFAULT: theme("colors.sky.400"), ...theme("colors.sky") },
          danger: { DEFAULT: theme("colors.red.600"), ...theme("colors.red") },
          dark: theme("colors.gray.900"),
          muted: theme("colors.gray.500"),
        }),
      },
    },
  }),
);

export default versolyUI;
export type { ComponentName };
