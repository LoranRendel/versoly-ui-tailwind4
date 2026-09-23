import type { Styles } from "../types";

const control =
  "block w-full rounded-md border-gray-300 shadow-xs focus:border-primary-300 focus:ring-3 focus:ring-primary-200/50";

export const form: Styles = {
  ".form-input": `${control} mt-0`,
  ".form-input-sm": "px-2 py-1 text-sm",
  ".form-input-lg": "px-4 py-2 text-lg",
  ".form-select": `${control} mt-1`,
  ".form-select-sm": "pl-2 py-1 text-sm",
  ".form-select-lg": "pl-4 py-2 text-lg",
  ".form-checkbox":
    "rounded-sm border-primary-300 text-primary-600 shadow-xs focus:border-primary-300 focus:ring-3 focus:ring-offset-0 focus:ring-primary-200/50",
  '.form-checkbox[type="checkbox"]': "rounded-sm",
  '.form-radio[type="radio"]': "text-primary-600 ring-offset-2 focus:ring-2 focus:ring-primary-300",
};
