import type { Styles } from "../types";

const sizes = [
  ["calc(1.625rem+4.5vw)", "5rem"],
  ["calc(1.575rem+3.9vw)", "4.5rem"],
  ["calc(1.525rem+3.3vw)", "4rem"],
  ["calc(1.475rem+2.7vw)", "3.5rem"],
  ["calc(1.425rem+2.1vw)", "3rem"],
  ["calc(1.375rem+1.6vw)", "2.5rem"],
];

export const display: Styles = Object.fromEntries(
  sizes.map(([fluid, max], i) => [`.display-${i + 1}`, `text-[${fluid}] lg:text-[${max}] leading-[1.2] font-light`]),
);
