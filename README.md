<div align="">
    <a href="https://versoly.com/versoly-ui" >
      <img alt="Versoly UI - Tailwind CSS component library based on Bootstrap" width="50" src="https://d1pnnwteuly8z3.cloudfront.net/images/dafc1e05-b0e8-4c6d-b375-4a62333bbd5a/5a71ada3-f5e4-4de1-bda2-75396a148365.png">
    </a>
    <a href="https://versoly.com/versoly-ui" align=""><h1>Versoly UI</h1></a>
    <p>Tailwind CSS components library based on Bootstrap, build websites without reinventing the wheel.</p>

<p>
    <a href="https://discord.versoly.com"><img src="https://flat.badgen.net/badge/icon/discord?icon=discord&label" alt="Discord"></a>
    <a href="https://versoly.com/versoly-ui/getting-started/license/"><img src="https://img.shields.io/badge/license-MIT-blue" alt="Licenese"></a>
    <a href="https://bundlephobia.com/result?p=@loranrendel/versoly-ui">
        <img src="https://flat.badgen.net/bundlephobia/minzip/@loranrendel/versoly-ui?icon=packagephobia&label&color=blue&cache=10800" alt="gzip bundle size">
    </a>
    <a href="https://unpkg.com/@loranrendel/versoly-ui/dist/versoly-ui.iife.js">
        <img src="https://flat.badgen.net/badgesize/brotli/https://unpkg.com/@loranrendel/versoly-ui/dist/versoly-ui.iife.js?icon=jsdelivr&label&color=blue&cache=10800" alt="brotli bundle size">
    </a>
</p>
</div>

---

> Fork of [versoly/versoly-ui](https://github.com/versoly/versoly-ui) rebuilt as a Tailwind CSS 4 plugin with `include` / `exclude` / `prefix` options. Published to npm as `@loranrendel/versoly-ui`.

## Documentation

For full documentation, visit [versoly.com/versoly-ui](https://versoly.com/versoly-ui).

## Components

Versoly UI is an open source components library built on Tailwind CSS and based on Bootstrap classes and components. Websites usually always include a small number of the same components such as buttons, cards and navbars. Versoly UI provides these components similar to Bootstrap and allows for developers to easily swap styling between projects without the manual work.

- **Components**
  - [Accordion](https://versoly.com/versoly-ui/components/accordion)
  - [Alert](https://versoly.com/versoly-ui/components/alert)
  - [Badge](https://versoly.com/versoly-ui/components/badge)
  - [Button](https://versoly.com/versoly-ui/components/button)
  - [Button Group](https://versoly.com/versoly-ui/components/button-group)
  - [Card](https://versoly.com/versoly-ui/components/card)
  - [Footer](https://versoly.com/versoly-ui/components/footer)
  - [Icon](https://versoly.com/versoly-ui/components/icon)
  - [Modal](https://versoly.com/versoly-ui/components/modal)
  - [Navbar](https://versoly.com/versoly-ui/components/navbar)
  - [Pagination](https://versoly.com/versoly-ui/components/pagination)
  - [Parallax](https://versoly.com/versoly-ui/components/parallax)
  - [Progress](https://versoly.com/versoly-ui/components/progress)
  - [Tab](https://versoly.com/versoly-ui/components/tab)
  - [Table](https://versoly.com/versoly-ui/components/table)

- **Forms**
  - [Inputs](https://versoly.com/versoly-ui/forms/inputs)
  - [Select](https://versoly.com/versoly-ui/forms/select)
  - [Checkbox](https://versoly.com/versoly-ui/forms/checkbox)
  - [Radio](https://versoly.com/versoly-ui/forms/radio)
  - [Layout](https://versoly.com/versoly-ui/forms/layout)

## Getting started

Versoly UI can be included as a plugin into an existing Tailwind CSS project and will help you build websites faster by having a set of components to work with.

For more examples go to [versoly.com/versoly-ui/getting-started/quickstart](https://versoly.com/versoly-ui/getting-started/quickstart).

Versoly UI has two parts:

- **Tailwind CSS plugin** (`@loranrendel/versoly-ui/plugin`) – component classes such as `.btn`, `.card`, `.navbar`. Requires Tailwind CSS 4.
- **JavaScript** (`@loranrendel/versoly-ui`) – behaviour for accordions, collapse, dropdowns, modals, tabs and dismissible elements.

### Installation

```sh
npm install -D @loranrendel/versoly-ui tailwindcss
# or
pnpm add -D @loranrendel/versoly-ui tailwindcss
```

Dependencies ([Floating UI](https://floating-ui.com/) for dropdowns, [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms) for form controls) are installed with the package, you don't need to add them yourself.

### Tailwind CSS plugin

Add the plugin to your main CSS file:

```css
@import "tailwindcss";
@plugin "@loranrendel/versoly-ui/plugin";
```

The `form` component includes the `@tailwindcss/forms` classes (`.form-input`, `.form-checkbox`…). To also reset unstyled inputs globally, add `@plugin "@tailwindcss/forms";` yourself.

A component's classes end up in the CSS only when your markup uses them, just like Tailwind utilities. Utilities always override component styles, so `class="btn btn-primary px-8"` works as expected.

#### Options

Options are set in the `@plugin` block:

```css
@plugin "@loranrendel/versoly-ui/plugin" {
  include: button, card, navbar, dropdown;
  exclude: navbar;
  prefix: "v-";
}
```

| Option    | Default        | Description                                                              |
| --------- | -------------- | ------------------------------------------------------------------------ |
| `include` | all components | Comma separated list of components to add. Everything else is skipped.   |
| `exclude` | none           | Comma separated list of components to skip. Applied after `include`.     |
| `prefix`  | none           | Prefix for component classes: `prefix: "v-"` turns `.btn` into `.v-btn`. |

Unknown component names and invalid prefixes are reported as warnings in the build output.

**Include / exclude.** Useful to keep global styles out of an existing project, or to avoid clashes with another library:

```css
/* only buttons and cards */
@plugin "@loranrendel/versoly-ui/plugin" {
  include: button, button-group, card;
}

/* everything except global element styles */
@plugin "@loranrendel/versoly-ui/plugin" {
  exclude: base, link;
}
```

**Prefix.** Component classes get the prefix, the markup has to use the prefixed names:

```html
<button class="v-btn v-btn-primary">Save</button>
<div class="v-card"><div class="v-card-body">…</div></div>
```

These names are never prefixed: Tailwind utilities (`text-info`, `hidden`…), classes of other libraries (`prose`, `fa-ul`, `taos-init`) and the `show` state class. The JavaScript picks the prefix up automatically from the `--vui-prefix` CSS variable the plugin adds, so no extra configuration is needed. With a prefix, `data-dismiss="alert"` looks for the closest `.v-alert`.

Tailwind's own prefix (`@import "tailwindcss" prefix(tw)`) is not supported.

#### Components

| Name           | Classes                                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base`         | Global styles for `body`, `h1`–`h5`, `p` and the `.h1`–`.h5` classes                                                                                |
| `link`         | Global link colors: `a`, `a.text-primary`, `a.text-secondary`…                                                                                      |
| `display`      | `.display-1` – `.display-6`                                                                                                                         |
| `layout`       | `.container`, `.container-fluid`, `.row`, `.col`                                                                                                    |
| `button`       | `.btn`, sizes `.btn-xs` – `.btn-xl`, colors `.btn-{color}`, styles `.btn-outline`, `.btn-ghost`, `.btn-subtle`, `.btn-link`, `.btn-cta`, `.btn-ani` |
| `button-group` | `.btn-group`, `.btn-group-{size}`                                                                                                                   |
| `alert`        | `.alert`, `.alert-{color}`                                                                                                                          |
| `badge`        | `.badge`, `.badge-lg`                                                                                                                               |
| `blockquote`   | `.blockquote`, `.blockquote-{color}`                                                                                                                |
| `card`         | `.card`, `.card-header`, `.card-body`, `.card-footer`                                                                                               |
| `modal`        | `.modal`, `.modal-content`, `.modal-bg`, `.modal-sm`, `.modal-lg`, `.modal-xl`                                                                      |
| `navbar`       | `.navbar`, `.navbar-brand`, `.navbar-btn`, `.navbar-row`, `.navbar-col`, `.navbar-dark`                                                             |
| `tab`          | `.tab-list`, `.tab-list-underline`, `.tab`, `.tab-underline`, `.tab-content`                                                                        |
| `table`        | `.table`, `.table-hover`, `.table-striped`, `.table-sm`                                                                                             |
| `tooltip`      | `.tooltip`, `.tooltip-arrow`, Popper arrows `[data-popper-arrow]`                                                                                   |
| `progress`     | `.progress`, `.progress-sm`, `.progress-lg`, `.progress-xl`, `.progress-bar`                                                                        |
| `dropdown`     | `[data-toggle="dropdown"]`, `.dropdown-menu`, `.dropdown-item`                                                                                      |
| `accordion`    | `.accordion-item`, `.accordion-header`, `.accordion-collapse`, `.accordion-body`                                                                    |
| `form`         | `.form-input`, `.form-select`, `.form-checkbox`, `.form-radio` and their `-sm` / `-lg` sizes                                                        |
| `pagination`   | `.pagination`                                                                                                                                       |
| `prose`        | Tweaks for `@tailwindcss/typography`'s `.prose`                                                                                                     |
| `disabled`     | `.disabled`                                                                                                                                         |
| `fontawesome`  | Font Awesome list `.fa-ul`                                                                                                                          |
| `taos`         | [TAOS](https://versoly.com/taos) animation duration                                                                                                 |

`{color}` is one of `primary`, `secondary`, `tertiary`, `info`, `success`, `warning`, `danger`, `neutral`, `dark`, `light`, `black`, `white`, `muted`.

#### Colors

The plugin adds these colors to the theme:

| Color       | Default         | Used by                            |
| ----------- | --------------- | ---------------------------------- |
| `primary`   | Tailwind `blue` | `*-primary`, links, focus states   |
| `secondary` | Tailwind `pink` | `*-secondary`, `.btn-cta` gradient |
| `info`      | Tailwind `sky`  | `*-info`                           |
| `danger`    | Tailwind `red`  | `*-danger`                         |
| `dark`      | `gray-900`      | `text-dark`, tooltips              |
| `muted`     | `gray-500`      | `text-muted`                       |

`tertiary`, `success`, `warning` and `neutral` use Tailwind's `purple`, `green`, `yellow` and `neutral`.

The colors are CSS variables (`--color-primary`, `--color-primary-50` … `--color-primary-950`, `--color-dark`, `--color-muted`…), always added to `:root` whatever components are included, so they can be used in your own CSS:

```css
.hero {
  background: var(--color-primary-600);
}
```

Override any color in `@theme`, shades you don't set keep their defaults. Like any `@theme` variable, an overridden color is only added to the CSS when something uses it, use `@theme static` to always keep it.

```css
@theme {
  --color-primary: oklch(51.1% 0.262 276.966);
  --color-primary-50: oklch(96.2% 0.018 272.314);
  --color-primary-100: oklch(93% 0.034 272.788);
  /* … */
  --color-primary-950: oklch(25.7% 0.09 281.288);

  --color-dark: #111827;
  --color-muted: #6b7280;
}
```

Or reuse a Tailwind palette:

```css
@theme inline {
  --color-primary: var(--color-indigo-600);
  --color-primary-50: var(--color-indigo-50);
  /* … */
  --color-primary-950: var(--color-indigo-950);
}
```

#### JavaScript config

The plugin also works from a JavaScript config loaded with `@config`:

```js
// tailwind.config.js
import versolyUI from "@loranrendel/versoly-ui/plugin";

export default {
  plugins: [versolyUI({ include: ["button", "card"], prefix: "v-" })],
};
```

### JavaScript

**Bundler.** Versoly UI initializes itself when imported:

```js
import "@loranrendel/versoly-ui";
```

**CDN.** The script build already includes Floating UI:

```html
<script src="https://cdn.jsdelivr.net/npm/@loranrendel/versoly-ui/dist/versoly-ui.iife.js"></script>
```

Components are controlled with data attributes:

| Attribute                 | Description                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `data-toggle="accordion"` | On `.accordion`. Toggles `.accordion-collapse` of the clicked `.accordion-item`.          |
| `data-toggle="collapse"`  | Toggles the element from `data-target`, e.g. the navbar menu.                             |
| `data-toggle="dropdown"`  | Toggles the next sibling `.dropdown-menu`.                                                |
| `data-toggle="modal"`     | Opens a modal with `data-html` content, or an image / iframe from `data-options`.         |
| `role="tab"`              | Switches tabs inside `role="tablist"` using `aria-controls` / `aria-labelledby`.          |
| `data-dismiss="alert"`    | Removes the element from `data-target`, or the closest `.alert`.                          |
| `data-options="{…}"`      | Component options, e.g. `{'min': 1, 'max': 1}` for an accordion that keeps one item open. |

Tailwind doesn't scan `node_modules`, so utilities the JavaScript adds at runtime have to be listed in your CSS:

```css
@source inline("block hidden opacity-0 opacity-100 visible fixed right-0 top-0 z-50 text-white px-5 text-4xl aspect-video w-full");
```

### Upgrading from Tailwind CSS 3

- Remove the old `@tailwind` directives and the Versoly UI CSS, use `@import "tailwindcss"` and `@plugin "@loranrendel/versoly-ui/plugin"`.
- Move custom colors from `tailwind.config.js` to `@theme` (see [Colors](#colors)).
- Remove the Floating UI `<script>` tags and `window.FloatingUIDOM`, and `@tailwindcss/forms` if you only used it for Versoly UI forms.
- The accordion arrow and the dropdown caret are CSS masks now and use the current text color, `bg-arrow-down` and `--svg-caret-down` don't need to be defined.
- `.btn-ghost.btn-dark` uses gray instead of pink on hover.

## 💡 Inspiration

- [Tailwind](https://tailwindcss.com/): created an easy to use utility library that is easily extendable and flexible. Their variant and just in time compiler changed the game for developers.
- [Bootstrap](https://getbootstrap.com/): built so many useful components and saved developers billions of hours recreating the wheel.
- [Daisy UI](https://daisyui.com/): an interesting approach to building a Tailwind CSS library.
- [Flowbite](https://flowbite.com/): clean Tailwind CSS components built with only Tailwind classes.
- [Twind](https://github.com/tw-in-js/twind): is a tiny Tailwind-in-JS that makes working with multiple themes very easy.

## Community

If you need help or just want to discuss about the library join the community on Github:

[Discuss about Versoly on GitHub](https://github.com/versoly/versoly-ui/discussions)

For casual chatting with others using the library:

[Join the Versoly Discord Server](https://discord.versoly.com)
