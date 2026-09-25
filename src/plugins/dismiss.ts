import { getDuration, getTarget, addEventListenerToSelector, sel, util } from "../utils/index";

const Dismiss = (element: HTMLElement) => {
  let target = getTarget(element);
  if (!target) {
    target = element.closest(sel(element.getAttribute("data-dismiss") ?? ""));
  }

  if (!target) {
    return;
  }

  target.classList.add(...util("opacity-0"));
  setTimeout(() => target.remove(), getDuration(target));
};

export const dismiss = addEventListenerToSelector("[data-dismiss]", "click", Dismiss);
