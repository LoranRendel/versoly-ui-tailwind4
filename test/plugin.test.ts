import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { build, classesOf, componentNames, hasRule, plugin, ruleIndex, variable } from "./helpers";

const hasClass = (css: string, name: string) => new RegExp(`\\.${name}(?![\\w-])`).test(css);

let warn: MockInstance<typeof console.warn>;
beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  warn.mockRestore();
});

describe("without options", () => {
  it.each(componentNames)("adds the %s component", async (name) => {
    const classes = classesOf(name);
    const css = await build(plugin(), classes);

    for (const name of classes) {
      expect(css, `.${name}`).toSatisfy((css: string) => hasClass(css, name));
    }
  });

  it("adds global styles", async () => {
    const css = await build(plugin());

    expect(hasRule(css, "body")).toBe(true);
    expect(hasRule(css, "h1")).toBe(true);
    expect(hasRule(css, "html :where(a)")).toBe(true);
    expect(hasRule(css, '[data-toggle="dropdown"]')).toBe(true);
    expect(variable(css, "--svg-caret-down")).toMatch(/^url\(/);
    expect(variable(css, "--svg-arrow-down")).toMatch(/^url\(/);
  });

  it("adds the color variables", async () => {
    const css = await build(plugin());

    for (const name of ["primary", "secondary", "info", "danger"]) {
      expect(variable(css, `--color-${name}`), name).toMatch(/^oklch\(/);
      for (const shade of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) {
        expect(variable(css, `--color-${name}-${shade}`), `${name}-${shade}`).toMatch(/^oklch\(/);
      }
    }
    expect(variable(css, "--color-dark")).toMatch(/^oklch\(/);
    expect(variable(css, "--color-muted")).toMatch(/^oklch\(/);
  });

  it("makes theme colors use the variables", async () => {
    const css = await build(plugin(), ["text-primary", "bg-primary-600", "text-dark"]);

    expect(css).toMatch(/\.text-primary \{\s*color: var\(--color-primary\);/);
    expect(css).toMatch(/\.bg-primary-600 \{\s*background-color: var\(--color-primary-600\);/);
    expect(css).toMatch(/\.text-dark \{\s*color: var\(--color-dark\);/);
  });

  it("adds the @tailwindcss/forms classes", async () => {
    const css = await build(plugin(), ["form-input"]);

    expect(css).toMatch(/\.form-input,\s*\.form-textarea/);
  });

  it("generates only the classes used in the markup", async () => {
    const css = await build(plugin(), ["btn"]);

    expect(hasRule(css, ".btn")).toBe(true);
    expect(hasRule(css, ".card")).toBe(false);
    expect(hasRule(css, ".btn-primary")).toBe(false);
  });

  it("lets utilities override component styles", async () => {
    const css = await build(plugin(), ["btn", "px-8", "modal", "opacity-100", "form-input", "rounded-none"]);

    expect(ruleIndex(css, ".btn")).toBeLessThan(ruleIndex(css, ".px-8"));
    expect(ruleIndex(css, ".modal")).toBeLessThan(ruleIndex(css, ".opacity-100"));
    expect(ruleIndex(css, ".form-input")).toBeLessThan(ruleIndex(css, ".rounded-none"));
  });

  it("doesn't warn", async () => {
    await build(plugin());

    expect(warn).not.toHaveBeenCalled();
  });
});

describe("include", () => {
  it("adds only one component", async () => {
    const css = await build(plugin("include: button;"), ["btn", "btn-primary", "card", "alert"]);

    expect(hasRule(css, ".btn")).toBe(true);
    expect(hasRule(css, ".btn-primary")).toBe(true);
    expect(hasRule(css, ".card")).toBe(false);
    expect(hasRule(css, ".alert")).toBe(false);
    expect(hasRule(css, "body")).toBe(false);
    expect(hasRule(css, '[data-toggle="dropdown"]')).toBe(false);
  });

  it("adds a list of components", async () => {
    const css = await build(plugin("include: button, card, dropdown;"), ["btn", "card", "alert", "dropdown-menu"]);

    expect(hasRule(css, ".btn")).toBe(true);
    expect(hasRule(css, ".card")).toBe(true);
    expect(hasRule(css, ".dropdown-menu")).toBe(true);
    expect(hasRule(css, '[data-toggle="dropdown"]')).toBe(true);
    expect(hasRule(css, ".alert")).toBe(false);
  });

  it("keeps the color variables", async () => {
    const css = await build(plugin("include: card;"));

    expect(variable(css, "--color-primary-600")).toMatch(/^oklch\(/);
    expect(variable(css, "--color-dark")).toMatch(/^oklch\(/);
  });

  it("adds the forms classes only with the form component", async () => {
    const withForm = await build(plugin("include: form;"), ["form-input"]);
    const withoutForm = await build(plugin("include: button;"), ["form-input"]);

    expect(withForm).toMatch(/\.form-input,\s*\.form-textarea/);
    expect(hasRule(withForm, ".form-input")).toBe(true);
    expect(withoutForm).not.toMatch(/\.form-input/);
  });
});

describe("exclude", () => {
  it("skips components", async () => {
    const css = await build(plugin("exclude: base, button;"), ["btn", "card", "h1"]);

    expect(hasRule(css, ".btn")).toBe(false);
    expect(hasRule(css, ".card")).toBe(true);
    expect(hasRule(css, "body")).toBe(false);
    expect(hasRule(css, ".h1")).toBe(false);
    expect(hasRule(css, "html :where(a)")).toBe(true);
  });

  it("is applied after include", async () => {
    const css = await build(plugin("include: button, card; exclude: card;"), ["btn", "card"]);

    expect(hasRule(css, ".btn")).toBe(true);
    expect(hasRule(css, ".card")).toBe(false);
  });

  it("keeps the color variables when everything is excluded", async () => {
    const css = await build(plugin(`exclude: ${componentNames.join(", ")};`), ["btn"]);

    expect(hasRule(css, ".btn")).toBe(false);
    expect(variable(css, "--color-primary-600")).toMatch(/^oklch\(/);
  });

  it("warns about unknown components", async () => {
    await build(plugin("include: buton; exclude: cards;"));

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unknown component "buton" in "include"'));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unknown component "cards" in "exclude"'));
  });
});

describe("prefix", () => {
  it.each(['"v-"', "v-"])("prefixes component classes with %s", async (prefix) => {
    const css = await build(plugin(`prefix: ${prefix};`), [
      "btn",
      "v-btn",
      "v-btn-group",
      "v-btn-primary",
      "v-navbar-row",
      "text-info",
      "prose",
      "v-form-input",
    ]);

    expect(hasRule(css, ".v-btn")).toBe(true);
    expect(hasRule(css, ".v-btn-primary")).toBe(true);
    expect(hasRule(css, ".v-btn-group .v-btn")).toBe(true);
    expect(hasRule(css, ".btn")).toBe(false);
    expect(variable(css, "--vui-prefix")).toBe('"v-"');
    // not prefixed: state classes, Tailwind utilities, other libraries, attribute selectors
    expect(css).toMatch(/&\.show \{/);
    expect(hasRule(css, "html :where(a.text-info)")).toBe(true);
    expect(hasRule(css, ".prose a")).toBe(true);
    expect(hasRule(css, '[data-toggle="dropdown"]')).toBe(true);
    // the forms classes the form component is built on
    expect(css).toMatch(/\.v-form-input,\s*\.v-form-textarea/);
    expect(hasRule(css, ".v-form-input")).toBe(true);
  });

  it("doesn't add the prefix variable without a prefix", async () => {
    const css = await build(plugin());

    expect(variable(css, "--vui-prefix")).toBeUndefined();
  });

  it("ignores an invalid prefix", async () => {
    const css = await build(plugin("prefix: 1x;"), ["btn", "1xbtn"]);

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Invalid prefix "1x"'));
    expect(hasRule(css, ".btn")).toBe(true);
  });
});

describe("theme", () => {
  it("lets @theme override colors", async () => {
    const css = await build(`${plugin()}\n@theme { --color-primary-600: red; --color-dark: #000; }`, [
      "bg-primary-600",
      "text-dark",
    ]);

    expect(css.match(/--color-primary-600:/g)).toHaveLength(1);
    expect(variable(css, "--color-primary-600")).toBe("red");
    expect(variable(css, "--color-dark")).toBe("#000");
    // shades that aren't overridden keep their defaults
    expect(variable(css, "--color-primary-500")).toMatch(/^oklch\(/);
  });

  it("keeps unused overridden colors with @theme static", async () => {
    // like any @theme variable, an overridden color is only emitted when used, unless the theme is static
    const css = await build(`${plugin()}\n@theme static { --color-dark: #000; }`);

    expect(variable(css, "--color-dark")).toBe("#000");
  });

  it("makes the colors available in custom CSS", async () => {
    const css = await build(`${plugin("include: button;")}\n.hero { color: var(--color-primary-600); }`);

    expect(css).toMatch(/\.hero \{\s*color: var\(--color-primary-600\);/);
    expect(variable(css, "--color-primary-600")).toMatch(/^oklch\(/);
  });
});

describe("JavaScript config", () => {
  it("accepts options from @config", async () => {
    const css = await build('@config "./test/fixtures/tailwind.config.mjs";', ["js-btn", "js-card", "btn"]);

    expect(hasRule(css, ".js-btn")).toBe(true);
    expect(hasRule(css, ".js-card")).toBe(false);
    expect(hasRule(css, ".btn")).toBe(false);
    expect(variable(css, "--vui-prefix")).toBe('"js-"');
  });
});
