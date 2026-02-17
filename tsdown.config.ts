import { defineConfig } from "tsdown";
import pkg from "./package.json" with { type: "json" };

const { name } = pkg;
const getPackageName = () => {
  return (name.includes("@") ? name.split("/")[1] : name).replace(".", "-");
};

const sharedConfig = {
  exports: true,
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
    format: ["esm", "cjs", "iife"],
  },
  // {
  //   ...sharedConfig,
  //   format: ["esm"],
  // },
]);
