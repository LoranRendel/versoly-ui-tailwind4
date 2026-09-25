import { defineConfig } from "tsdown";
import pkg from "./package.json" with { type: "json" };
import { compileStyles } from "./scripts/compile-styles";

const { name } = pkg;
const getPackageName = () => {
  return (name.includes("@") ? name.split("/")[1] : name).replace(".", "-");
};

const sharedConfig = {
  // package.json "exports" are maintained by hand: tsdown would drop "./plugin"
  exports: false,
  minify: true,
  entry: {
    [getPackageName()]: "./src/index.ts",
  },
  platform: "browser",
} as const;

const browserTargets = ["chrome" + "109", "firefox" + "135", "safari" + "17", "edge" + "135"];

export default defineConfig([
  {
    ...sharedConfig,
    target: browserTargets,
    fixedExtension: true,
    format: ["esm", "cjs"],
  },
  // the <script> build has no package manager to install dependencies, so it bundles them
  {
    ...sharedConfig,
    target: browserTargets,
    format: ["iife"],
    noExternal: [/^@floating-ui\//],
    inlineOnly: [/^@floating-ui\//],
  },
  // {
  //   ...sharedConfig,
  //   format: ["esm"],
  // },
  // Tailwind CSS 4 plugin: `@plugin "versoly-ui/plugin";`
  {
    entry: { plugin: "./src/tailwind/index.ts" },
    platform: "node",
    target: "node20",
    format: ["esm", "cjs"],
    fixedExtension: true,
    dts: true,
    external: [/^tailwindcss/],
    plugins: [compiledStyles()],
  },
]);

/** `virtual:versoly-styles`: the components compiled to plain CSS, see `scripts/compile-styles.ts`. */
function compiledStyles() {
  const id = "virtual:versoly-styles";
  let styles: Promise<string> | undefined;

  return {
    name: "versoly-styles",
    resolveId: (source: string) => (source === id ? `\0${id}` : undefined),
    load: (source: string) => {
      if (source !== `\0${id}`) {
        return undefined;
      }
      styles ??= compileStyles().then((compiled) => `export default ${JSON.stringify(compiled)};`);
      return styles;
    },
  };
}
