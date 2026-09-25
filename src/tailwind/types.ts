/**
 * Styles of a component: selector → Tailwind classes applied via `@apply`,
 * or a raw CSS-in-JS object for things `@apply` can't express.
 */
export type Styles = Record<string, string | CssInJs>;

export interface CssInJs {
  [key: string]: string | string[] | CssInJs | CssInJs[];
}

/**
 * Cascade layer of a group of styles, from the weakest to the strongest. All of them are inside Tailwind's
 * `utilities` layer, so utilities always override components.
 * `unlayered` styles compete with utilities by specificity and order, for overriding classes of Tailwind or other plugins.
 */
export type Layer = "base" | "modifier" | "color" | "state" | "unlayered";

/** Component styles grouped by layer. */
export type Component = Partial<Record<Layer, Styles>>;

/** A rule compiled to plain CSS at build time. */
export interface CompiledRule {
  selector: string;
  layer: Layer | "forms";
  css: CssInJs;
}

export interface CompiledComponent {
  rules: CompiledRule[];
  /** `@property` rules for the `--tw-*` variables the component uses. */
  properties: Record<string, CssInJs>;
  /** Design token variables the component reads, e.g. `--color-gray-300`. */
  variables: string[];
}
