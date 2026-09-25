// Class prefix set by the Tailwind plugin's `prefix` option, e.g. `"v-"`
export const getPrefix = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue("--vui-prefix")
    .trim()
    .replace(/^(["'])(.*)\1$/, "$2");

// Component classes that are only used on their own, to find Tailwind's prefix in the markup
const COMPONENT_CLASSES = [
  "accordion",
  "accordion-item",
  "alert",
  "badge",
  "btn",
  "card",
  "dropdown-menu",
  "modal",
  "navbar",
  "navbar-row",
  "progress",
  "tab",
  "tab-list",
  "table",
];

/**
 * Tailwind's prefix, `tw` for `@import "tailwindcss" prefix(tw)`. The plugin can't know it, so it's found in the
 * markup (`class="tw:btn"`), or set with `<html data-tw-prefix="tw">`.
 */
export const getTailwindPrefix = (prefix = getPrefix()) => {
  const explicit = document.documentElement.dataset.twPrefix;
  if (explicit !== undefined) {
    return explicit;
  }

  for (const element of document.querySelectorAll('[class*=":"]')) {
    for (const name of element.classList) {
      const [, twPrefix, className] = name.match(/^([a-z]+):(.+)$/) ?? [];
      if (className?.startsWith(prefix) && COMPONENT_CLASSES.includes(className.slice(prefix.length))) {
        return twPrefix;
      }
    }
  }
  return "";
};

const variant = (twPrefix = getTailwindPrefix()) => (twPrefix ? `${twPrefix}:` : "");

/** Component class name with the prefixes: `cls("modal")` → `tw:v-modal` */
export const cls = (name: string) => {
  const prefix = getPrefix();
  return `${variant(getTailwindPrefix(prefix))}${prefix}${name}`;
};

/** Tailwind utility or state class with Tailwind's prefix: `util("hidden")` → `tw:hidden` */
export const util = (...names: string[]) => {
  const twVariant = variant();
  return names.map((name) => `${twVariant}${name}`);
};

/** Selector of a component class: `sel("modal")` → `.tw\:v-modal` */
export const sel = (name: string) => `.${CSS.escape(cls(name))}`;

export const getElementBySelector = (selector: string) => document.querySelector(selector) as HTMLElement;

export const getElementsBySelectors = (selector: string, element: Document | HTMLElement = document) =>
  Array.from(element.querySelectorAll(selector)) as HTMLElement[];

export const getTarget = (element: HTMLElement) => {
  const attrValue = element.dataset.target;
  if (!attrValue) {
    return null;
  }
  return getElementBySelector(attrValue);
};

export const getDuration = (element: HTMLElement) => {
  const duration = window.getComputedStyle(element).getPropertyValue("transition-duration");

  if (!duration) {
    return 0;
  }

  return parseFloat(duration.replace("s", "")) * 1000 + 1;
};

export const getIsAriaExpanded = (element: HTMLElement) => element.getAttribute("aria-expanded") === "true";

export const addEventListeners = (
  element: HTMLElement,
  events: (keyof HTMLElementEventMap)[],
  callback: EventListenerOrEventListenerObject,
) => {
  events.forEach((event) => {
    element.addEventListener(event, callback);
  });
};

export const addEscapeListener = (callback: () => void) => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      callback();
    }
  });
};

export const addEventListenerToSelector = (
  selector: string,
  eventListener: keyof HTMLElementEventMap,
  callback: (element: HTMLElement) => void,
) => {
  return () =>
    getElementsBySelectors(selector).forEach((element) => {
      element.addEventListener(eventListener, () => callback(element));
    });
};

export const handleResize = () => {
  window.addEventListener("resize", () => {
    getElementsBySelectors('[data-toggle="collapse"]').forEach((element) => {
      const target = getTarget(element);

      if (!target) {
        return;
      }

      element.setAttribute("aria-expanded", "false");
      target.classList.remove(...util("show"));
      target.classList.remove(...util("block"));
      target.style.height = "auto";
      target.style.overflow = "";
    });
  });
};

export const waitForElement = (s: string): Promise<HTMLElement> => {
  return new Promise((resolve) => {
    if (getElementBySelector(s)) {
      return resolve(getElementBySelector(s));
    }

    const observer = new MutationObserver(() => {
      if (getElementBySelector(s)) {
        resolve(getElementBySelector(s));
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
};

export const parseElementOptions = (element: HTMLElement): Record<string, any> => {
  // eval('(' + trigger.dataset.options + ')' || '') || {};
  const t = element.dataset.options;
  if (!t) {
    return {};
  }

  try {
    return JSON.parse(t.replaceAll("'", '"'));
  } catch {
    return {};
  }
};

export const getElementsByToggle = (toggleName: string) => {
  const query = `[data-toggle="${toggleName}"]`;
  const elements = getElementsBySelectors(query);
  return elements;
};
