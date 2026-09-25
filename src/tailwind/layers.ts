import type { Layer } from "./types";

/** Cascade layers like daisyUI's: inside a layer, its own rules beat the nested layers, so `l3` is the weakest. */
export const LAYERS: Record<Exclude<Layer, "unlayered"> | "forms", string> = {
  forms: "versoly.l1.l2.l3.forms",
  base: "versoly.l1.l2.l3",
  modifier: "versoly.l1.l2",
  color: "versoly.l1",
  state: "versoly",
};
