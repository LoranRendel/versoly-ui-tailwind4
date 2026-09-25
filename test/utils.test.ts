// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { accordion } from "../src/plugins/accordion";
import { cls, getTailwindPrefix, sel, util } from "../src/utils/index";

const setPrefix = (prefix: string) => document.documentElement.style.setProperty("--vui-prefix", `"${prefix}"`);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("style");
  delete document.documentElement.dataset.twPrefix;
});

describe("prefixes", () => {
  it("uses plain class names without prefixes", () => {
    document.body.innerHTML = '<button class="btn md:px-8">Save</button>';

    expect(getTailwindPrefix()).toBe("");
    expect(cls("modal")).toBe("modal");
    expect(util("hidden", "block")).toEqual(["hidden", "block"]);
    expect(sel("accordion-item")).toBe(".accordion-item");
  });

  it("finds Tailwind's prefix in the markup", () => {
    document.body.innerHTML = '<button class="tw:btn tw:md:px-8">Save</button>';

    expect(getTailwindPrefix()).toBe("tw");
    expect(cls("modal")).toBe("tw:modal");
    expect(util("hidden")).toEqual(["tw:hidden"]);
    expect(sel("accordion-item")).toBe(".tw\\:accordion-item");
  });

  it("combines Tailwind's prefix with the plugin prefix", () => {
    setPrefix("v-");
    document.body.innerHTML = '<div class="tw:v-card"></div>';

    expect(getTailwindPrefix()).toBe("tw");
    expect(cls("modal")).toBe("tw:v-modal");
    expect(util("show")).toEqual(["tw:show"]);
  });

  it("ignores variants that look like a prefix", () => {
    document.body.innerHTML = '<div class="md:container lg:flex"></div>';

    expect(getTailwindPrefix()).toBe("");
  });

  it("takes Tailwind's prefix from data-tw-prefix", () => {
    document.documentElement.dataset.twPrefix = "ui";

    expect(cls("modal")).toBe("ui:modal");
  });
});

describe("accordion", () => {
  it.each([
    ["", ""],
    ["tw", ""],
    ["tw", "v-"],
  ])("works with Tailwind prefix %j and plugin prefix %j", (twPrefix, prefix) => {
    setPrefix(prefix);
    const c = (name: string) => `${twPrefix ? `${twPrefix}:` : ""}${prefix}${name}`;
    const u = (name: string) => `${twPrefix ? `${twPrefix}:` : ""}${name}`;
    document.body.innerHTML = `
      <div class="${c("accordion")}" data-toggle="accordion">
        <div class="${c("accordion-item")}">
          <button class="${c("accordion-header")}" aria-expanded="false">Title</button>
          <div class="${c("accordion-collapse")} ${u("hidden")}">Body</div>
        </div>
      </div>`;

    accordion();
    document.querySelector("button")!.click();

    const target = document.querySelector("[aria-expanded] + div")!;
    expect(document.querySelector("button")!.getAttribute("aria-expanded")).toBe("true");
    expect([...target.classList]).toEqual(expect.arrayContaining([u("block"), u("show")]));
    expect(target.classList.contains(u("hidden"))).toBe(false);
  });
});
