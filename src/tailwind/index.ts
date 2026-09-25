import plugin from "tailwindcss/plugin";
import compiledStyles from "virtual:versoly-styles";
import type { ComponentName } from "./components/index";
import { LAYERS } from "./layers";
import { addTokenVariables, theme } from "./theme";
import type { CompiledComponent, CssInJs } from "./types";

const styles = compiledStyles as Record<ComponentName, CompiledComponent>;

export interface VersolyUIOptions {
  /** Only these components are added. Defaults to all of them. */
  include?: ComponentName | ComponentName[];
  /** These components are skipped. */
  exclude?: ComponentName | ComponentName[];
  /** Prefix for component classes: `v-` → `.v-btn`. */
  prefix?: string;
}

// Classes owned by other libraries, Tailwind utilities and state classes set by the JS keep their names.
const UNPREFIXED_CLASS = /^(show|prose|fa-ul|taos-init|text-.*)$/;

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

// Prefixes the selectors of nested rules too: `:where(& > .btn)`
const prefixCss = (css: CssInJs, prefix: string): CssInJs =>
  Object.fromEntries(
    Object.entries(css).map(([key, value]) => {
      if (typeof value === "string" || (Array.isArray(value) && typeof value[0] === "string")) {
        return [key, value];
      }
      const nested = Array.isArray(value)
        ? (value as CssInJs[]).map((css) => prefixCss(css, prefix))
        : prefixCss(value as CssInJs, prefix);
      return [key.startsWith("@") ? key : prefixSelector(key, prefix), nested];
    }),
  );

const componentNames = Object.keys(styles) as ComponentName[];

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

// Tailwind 4 registers `addComponents` rules as utilities keyed by class name (generated only when used, and
// prefixed with Tailwind's `prefix(tw)`), so selectors without a class, like `body` or `[data-toggle]`, go to `addBase`.
const hasClass = (selector: string) => /\.-?[_a-zA-Z]/.test(selector.replace(/\[[^\]]*\]/g, ""));

const versolyUI: ReturnType<typeof plugin.withOptions<VersolyUIOptions>> = plugin.withOptions<VersolyUIOptions>(
  (options) => (api) => {
    const { addBase, addComponents } = api;
    const names = getComponentNames(options);
    addTokenVariables(api, new Set(names.flatMap((name) => styles[name].variables)));

    const prefix = toPrefix(options?.prefix);
    if (prefix) {
      // read by the JS to find prefixed elements
      addBase({ ":root": { "--vui-prefix": `"${prefix}"` } });
    }

    const properties: Record<string, CssInJs> = {};

    for (const name of names) {
      Object.assign(properties, styles[name].properties);

      for (const { selector, layer, css } of styles[name].rules) {
        const parts = prefixSelector(selector, prefix)
          .split(",")
          .map((part) => part.trim());
        const baseSelector = parts.filter((part) => !hasClass(part)).join(", ");
        const classSelector = parts.filter(hasClass).join(", ");
        const prefixed = prefix ? prefixCss(css, prefix) : css;

        if (baseSelector) {
          addBase({ [baseSelector]: prefixed });
        }
        if (classSelector) {
          // like daisyUI: `.btn { @layer versoly.l1.l2.l3 { … } }`, Tailwind moves the layer out of the rule
          addComponents({
            [classSelector]: layer === "unlayered" ? prefixed : { [`@layer ${LAYERS[layer]}`]: prefixed },
          });
        }
      }
    }

    // the `--tw-*` variables the components use, Tailwind only registers the ones of the utilities in the markup
    if (Object.keys(properties).length > 0) {
      addBase(Object.fromEntries(Object.entries(properties).map(([name, css]) => [`@property ${name}`, css])));
    }
  },
  () => ({
    theme: {
      // override with `@theme { --color-primary-600: …; --radius-field: …; }`
      extend: theme,
    },
  }),
);

export default versolyUI;
export type { ComponentName };
