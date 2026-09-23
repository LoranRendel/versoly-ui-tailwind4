import { cls, getDuration, getTarget, addEventListenerToSelector, getIsAriaExpanded } from "../utils/index";

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
    target.classList.remove("show");

    setTimeout(() => target.classList.remove("block"), duration);
    return;
  }

  element.setAttribute("aria-expanded", "true");
  target.classList.add("block");
  target.classList.add("show");

  setTimeout(() => {
    target.querySelectorAll(`.${cls("dropdown-menu")}`).forEach((m) => m.classList.add("hidden"));
    const navHeight = target.scrollHeight;
    target.querySelectorAll(`.${cls("dropdown-menu")}`).forEach((m) => m.classList.remove("hidden"));
    target.style.height = `${navHeight}px`;
  }, 32);

  setTimeout(() => (target.style.overflow = ""), duration);
};

export const collapse = addEventListenerToSelector('[data-toggle="collapse"]', "click", Collapse);
