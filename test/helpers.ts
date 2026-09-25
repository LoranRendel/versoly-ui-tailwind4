import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import { components, type ComponentName } from "../src/tailwind/components/index";

export const root = fileURLToPath(new URL("..", import.meta.url));

/** The plugin as users import it: through the package `exports`, so `dist/` has to be built. */
export const PLUGIN = "@loranrendel/versoly-ui/plugin";

/** Compiles CSS like the Tailwind CLI / Vite plugin do, with `candidates` as the classes found in the markup. */
export const build = async (css: string, candidates: string[] = []) => {
  const compiler = await compile(`@import "tailwindcss";\n${css}`, { base: root, onDependency: () => {} });
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

/** Class names a component defines, e.g. `btn`, `btn-primary`, `btn-outline`… */
export const classesOf = (name: ComponentName) => [
  ...new Set(
    Object.keys(components[name]).flatMap((selector) =>
      [...selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]),
    ),
  ),
];

export const componentNames = Object.keys(components) as ComponentName[];
