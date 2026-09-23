import type { Styles } from "../types";

export const navbar: Styles = {
  ".navbar": "z-20 py-3 relative",
  ".navbar > .container-fluid, .navbar > .container": "flex flex-wrap justify-between md:flex-nowrap px-3 md:px-5",
  ".navbar-brand": "flex flex-row items-center space-x-3 ml-5 md:ml-0 text-primary font-bold text-xl",
  ".navbar-btn": "w-6 mr-5 cursor-pointer select-none rounded-sm md:hidden",
  ".navbar-dark .navbar-btn": "focus:ring-white",
  // `md:h-auto!` beats the inline height the collapse script sets on mobile
  ".navbar-row":
    "hidden w-screen items-center md:flex md:grow md:justify-between md:w-auto md:ml-4 transition-all duration-300 opacity-0 h-0 md:opacity-100 md:h-auto! md:overflow-visible",
  ".navbar-row.show": "opacity-100",
  ".navbar-col": "flex flex-col items-center mt-3 space-y-4 md:flex-row md:space-x-4 md:space-y-0 md:mt-0",
};
