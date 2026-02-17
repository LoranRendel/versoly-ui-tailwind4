import { addEventListeners, addEscapeListener, getElementsByToggle, parseElementOptions } from "../utils/index";

const Dropdown = (trigger: HTMLElement) => {
  const { computePosition, shift, offset } = window.FloatingUIDOM;
  const target = trigger.nextElementSibling as HTMLElement;
  const parent = trigger.parentElement as HTMLElement;

  if (!target || !parent || !(target instanceof HTMLElement) || !(parent instanceof HTMLElement)) {
    return;
  }

  const options = parseElementOptions(trigger);

  const middleware = [
    offset(6),
    shift({
      padding: 5,
    }),
  ];

  function update() {
    computePosition(trigger, target, {
      placement: options.placement || "bottom",
      middleware,
    }).then(({ x, y }: { x: number; y: number }) => {
      Object.assign(target.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }

  const show = () => {
    target.style.display = "block";
    trigger.setAttribute("aria-expanded", "true");

    window.requestAnimationFrame(() => {
      target.classList.add("opacity-100", "visible");
    });
    update();
  };

  const hide = () => {
    target.style.display = "";
    trigger.setAttribute("aria-expanded", "false");
    target.classList.remove("opacity-100", "visible");
  };

  const toggle = () => {
    if (target.style.display === "block") {
      hide();
      return;
    }
    show();
  };

  parent.addEventListener("focusout", (event) => {
    // If relatedTarget is null, the user clicked a non-focusable area (background)
    // or left the document entirely. Both should usually trigger a close.
    const isClickOutside = !event.relatedTarget;

    // Check if focus moved to something outside the parent
    const isFocusMovingOutside = event.relatedTarget && !parent.contains(event.relatedTarget as Node);

    if (isClickOutside || isFocusMovingOutside) {
      // Optional: Only hide if the document still has focus to avoid
      // closing when the user just switched browser tabs
      if (document.hasFocus()) {
        hide();
      }
    }
  });
  addEventListeners(trigger, ["click"], toggle);
  addEscapeListener(hide);
};

export const dropdown = () => getElementsByToggle("dropdown").forEach(Dropdown);
