import type { Styles } from "../types";
import { accordion } from "./accordion";
import { alert } from "./alert";
import { badge } from "./badge";
import { base } from "./base";
import { blockquote } from "./blockquote";
import { button } from "./button";
import { buttonGroup } from "./button-group";
import { card } from "./card";
import { display } from "./display";
import { dropdown } from "./dropdown";
import { form } from "./form";
import { layout } from "./layout";
import { link } from "./link";
import { disabled, fontawesome, taos } from "./misc";
import { modal } from "./modal";
import { navbar } from "./navbar";
import { pagination } from "./pagination";
import { progress } from "./progress";
import { prose } from "./prose";
import { tab } from "./tab";
import { table } from "./table";
import { tooltip } from "./tooltip";

/** Keys are the names accepted by the `include` / `exclude` plugin options. */
export const components = {
  base,
  link,
  display,
  layout,
  button,
  "button-group": buttonGroup,
  alert,
  badge,
  blockquote,
  card,
  modal,
  navbar,
  tab,
  table,
  tooltip,
  progress,
  dropdown,
  accordion,
  form,
  pagination,
  prose,
  disabled,
  fontawesome,
  taos,
} satisfies Record<string, Styles>;

export type ComponentName = keyof typeof components;
