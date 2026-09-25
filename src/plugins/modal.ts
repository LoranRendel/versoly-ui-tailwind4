import type { IModalOptions } from "../types";
import {
  cls,
  util,
  waitForElement,
  parseElementOptions,
  addEventListenerToSelector,
  addEscapeListener,
} from "../utils";

const defaults = {
  closeButton: ["fixed", "right-0", "top-0", "z-50", "text-white", "px-5"],
};

// if (element.getAttribute('aria-label')) {
//   return
// }
// element.setAttribute('aria-label', 'modal')

const Modal = async (element: HTMLElement) => {
  const options: IModalOptions = {
    id: "v-modal",
    size: undefined,
    beforeShown: undefined,
    imgSrc: undefined,
    iframeSrc: undefined,
    ...parseElementOptions(element),
  };

  const { size, beforeShown, id, imgSrc, iframeSrc } = options;

  let content = element.dataset.html || "";

  if (imgSrc) {
    content = `<img src="${imgSrc}">`;
  }
  if (iframeSrc) {
    content = `<iframe allow="autoplay" class="${util("aspect-video", "w-full").join(" ")}" src="${iframeSrc}" allowfullscreen="" autoplay=""></iframe>`;
  }

  const modalHTML = `<div class="${cls("modal")}" id="${id}">
  <div class="${cls("modal-content")} ${size ? cls(`modal-${size}`) : ""}">
    ${content}
  </div>
  
  <button class="${util(...defaults.closeButton).join(" ")} close" onclick="removeModal('${id}')" type="button" data-dismiss="modal" aria-label="Close">
    <span class="${util("text-4xl").join(" ")}" aria-hidden="true">&times;</span>
  </button>

  <div class="${cls("modal-bg")}" onclick="removeModal('${id}')"></div>
</div>
`;

  addEscapeListener(() => window.removeModal(id));
  document.body.style.overflow = "hidden";
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  await waitForElement(`#${id}`).then((ele) => {
    if (beforeShown) {
      (window as any)[beforeShown]();
    }

    window.setTimeout(() => ele.classList.add(...util("opacity-100")), 32);
  });
};

const removeModal = (id = "v-modal") => {
  const modal = document.getElementById(id);

  if (!modal) {
    return;
  }

  modal.classList.remove(...util("opacity-100"));
  window.setTimeout(() => {
    modal.remove();
    document.body.style.overflow = "";
  }, 500);
};

window.removeModal = removeModal;

export const modal = addEventListenerToSelector('[data-toggle="modal"]', "click", Modal);
