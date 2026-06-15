const historyImages = document.querySelectorAll(".history-images img");
const imageViewer = document.createElement("div");
imageViewer.className = "image-viewer";
imageViewer.setAttribute("role", "dialog");
imageViewer.setAttribute("aria-modal", "true");
imageViewer.setAttribute("aria-label", "Full screen historical image viewer");
imageViewer.innerHTML = `
  <button class="image-viewer__close" type="button" aria-label="Close full screen image">×</button>
  <img class="image-viewer__image" alt="" />
  <p class="image-viewer__caption"></p>
`;
document.body.appendChild(imageViewer);

const viewerImage = imageViewer.querySelector(".image-viewer__image");
const viewerCaption = imageViewer.querySelector(".image-viewer__caption");
const closeButton = imageViewer.querySelector(".image-viewer__close");

function closeImageViewer() {
    imageViewer.classList.remove("image-viewer--open");
    document.body.classList.remove("body--viewer-open");
    viewerImage.removeAttribute("src");
    viewerImage.alt = "";
    viewerCaption.textContent = "";
}

function openImageViewer(image) {
    const caption = image.closest("figure")?.querySelector("figcaption")?.textContent ?? image.alt;
    viewerImage.src = image.src;
    viewerImage.alt = image.alt;
    viewerCaption.textContent = caption;
    imageViewer.classList.add("image-viewer--open");
    document.body.classList.add("body--viewer-open");
}

historyImages.forEach((image) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Open full screen image: ${image.alt}`);

    image.addEventListener("click", () => openImageViewer(image));
    image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openImageViewer(image);
        }
    });
});

imageViewer.addEventListener("click", closeImageViewer);
closeButton.addEventListener("click", closeImageViewer);
viewerImage.addEventListener("click", closeImageViewer);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && imageViewer.classList.contains("image-viewer--open")) {
        closeImageViewer();
    }
});