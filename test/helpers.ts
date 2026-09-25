import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import postcss from "postcss";
import { components, type ComponentName } from "../src/tailwind/components/index";

export const root = fileURLToPath(new URL("..", import.meta.url));

/** The plugin as users import it: through the package `exports`, so `dist/` has to be built. */
export const PLUGIN = "@loranrendel/versoly-ui/plugin";

/**
 * Compiles CSS like the Tailwind CLI / Vite plugin do, with `candidates` as the classes found in the markup.
 * `tailwind` is the import line, e.g. `@import "tailwindcss" prefix(tw);`.
 */
export const build = async (css: string, candidates: string[] = [], tailwind = '@import "tailwindcss";') => {
  const compiler = await compile(`${tailwind}\n${css}`, { base: root, onDependency: () => {} });
  return compiler.build(candidates);
};

export const plugin = (options = "") => `@plugin "${PLUGIN}"${options ? ` { ${options} }` : ";"}`;

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whether the CSS has a rule with exactly this selector. */
export const hasRule = (css: string, selector: string) => new RegExp(`^\\s*${escape(selector)}\\s*\\{`, "m").test(css);

/** Position of a rule in the CSS, -1 if missing. */
export const ruleIndex = (css: string, selector: string) =>
  css.search(new RegExp(`^\\s*${escape(selector)}\\s*\\{`, "m"));

/** Value of a CSS variable declaration, e.g. `--color-primary-600: …;` */
export const variable = (css: string, name: string) => css.match(new RegExp(`${escape(name)}:\\s*([^;]+);`))?.[1];

/** Values of every declaration of a CSS variable. */
export const variables = (css: string, name: string) =>
  [...css.matchAll(new RegExp(`${escape(name)}:\\s*([^;]+);`, "g"))].map((match) => match[1]);

/** Cascade layers a rule is in, from the outside: `utilities > versoly.l1.l2.l3`. undefined if there's no such rule. */
export const layerOf = (css: string, selector: string) => {
  let layers: string | undefined;
  postcss.parse(css).walkRules((rule) => {
    if (layers === undefined && rule.selector === selector) {
      const path: string[] = [];
      for (let node = rule.parent; node && node.type !== "root"; node = node.parent) {
        if (node.type === "atrule" && node.name === "layer") {
          path.unshift(node.params);
        }
      }
      layers = path.join(" > ");
    }
  });
  return layers;
};

/** The content of Tailwind's `utilities` layer, where the components are. */
export const utilitiesLayer = (css: string) => {
  let content = "";
  postcss.parse(css).walkAtRules("layer", (rule) => {
    if (rule.params === "utilities" && rule.nodes) {
      content += rule.toString();
    }
  });
  return content;
};

/** Class names a component defines, e.g. `btn`, `btn-primary`, `btn-outline`… */
export const classesOf = (name: ComponentName) => [
  ...new Set(
    Object.values(components[name])
      .flatMap((styles) => Object.keys(styles))
      .flatMap((selector) => [...selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1])),
  ),
];

export const componentNames = Object.keys(components) as ComponentName[];
