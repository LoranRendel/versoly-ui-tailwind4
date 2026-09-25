import { getDuration, getTarget, addEventListenerToSelector, getIsAriaExpanded, sel, util } from "../utils/index";

const Collapse = (element: HTMLElement) => {
  const target = getTarget(element);
  if (!target) {
    return;
  }

  const duration = getDuration(target);
  target.style.overflow = "hidden";
  target.style.height = "0px";

  if (getIsAriaExpanded(element)) {
    element.setAttribute("aria-expanded", "false");
    target.classList.remove(...util("show"));

    setTimeout(() => target.classList.remove(...util("block")), duration);
    return;
  }

  element.setAttribute("aria-expanded", "true");
  target.classList.add(...util("block"));
  target.classList.add(...util("show"));

  setTimeout(() => {
    target.querySelectorAll(sel("dropdown-menu")).forEach((m) => m.classList.add(...util("hidden")));
    const navHeight = target.scrollHeight;
    target.querySelectorAll(sel("dropdown-menu")).forEach((m) => m.classList.remove(...util("hidden")));
    target.style.height = `${navHeight}px`;
  }, 32);

  setTimeout(() => (target.style.overflow = ""), duration);
};

export const collapse = addEventListenerToSelector('[data-toggle="collapse"]', "click", Collapse);
