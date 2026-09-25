import type { Component } from "../types";

const control =
  "block w-full rounded-field border-gray-300 shadow-xs focus:border-primary-300 focus:ring-3 focus:ring-primary-200/50";

/** Built on top of the @tailwindcss/forms classes, which are compiled into the weakest layer. */
export const form: Component = {
  base: {
    ".form-input": `${control} mt-0`,
    ".form-select": `${control} mt-1`,
    ".form-checkbox":
      "rounded-selector border-primary-300 text-primary-600 shadow-xs focus:border-primary-300 focus:ring-3 focus:ring-offset-0 focus:ring-primary-200/50",
    '.form-radio[type="radio"]': "text-primary-600 ring-offset-2 focus:ring-2 focus:ring-primary-300",
  },
  modifier: {
    ".form-input-sm": "px-2 py-1 text-sm",
    ".form-input-lg": "px-4 py-2 text-lg",
    ".form-select-sm": "pl-2 py-1 text-sm",
    ".form-select-lg": "pl-4 py-2 text-lg",
    '.form-checkbox[type="checkbox"]': "rounded-selector",
  },
};

/** Classes of @tailwindcss/forms that `form` uses. */
export const FORMS_CLASSES = [
  "form-input",
  "form-textarea",
  "form-select",
  "form-multiselect",
  "form-checkbox",
  "form-radio",
];
