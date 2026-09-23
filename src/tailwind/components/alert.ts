import { eachColor } from "../colors";
import type { Styles } from "../types";

export const alert: Styles = {
  ".alert": "flex flex-row rounded-md px-3 py-2 text-gray-700 bg-gray-100 transition-opacity duration-300",
  ...eachColor(({ name, palette }) => ({ [`.alert-${name}`]: `text-${palette}-600 bg-${palette}-50` })),
};
