/** Components compiled to plain CSS at build time, see `scripts/compile-styles.ts`. */
declare module "virtual:versoly-styles" {
  const styles: unknown;
  export default styles;
}
