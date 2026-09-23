/**
 * Styles of a component: selector → Tailwind classes applied via `@apply`,
 * or a raw CSS-in-JS object for things `@apply` can't express.
 */
export type Styles = Record<string, string | CssInJs>;

export interface CssInJs {
  [key: string]: string | string[] | CssInJs | CssInJs[];
}
