document.addEventListener("DOMContentLoaded", function () {
    // Get elements for text file window
    const textItemContainer = document.querySelector("#open-text");
    const textFakeWindowWrapper = document.getElementById("fake-window-wrapper");
    const textCloseButton = document.getElementById("close-window");

    // Get elements for image file window
    const imageItemContainer = document.querySelector("#open-pic");
    const imageFakeWindowWrapper = document.getElementById("fake-window-wrapper-image");
    const imageCloseButton = document.getElementById("close-window-image");

    // Open the text window on click
    if (textItemContainer) {
        textItemContainer.addEventListener("click", function () {
            textFakeWindowWrapper.style.display = "flex";
        });
    }

    // Open the image window on click
    if (imageItemContainer) {
        imageItemContainer.addEventListener("click", function () {
            imageFakeWindowWrapper.style.display = "flex";
        });
    }

    // Close the text window
    if (textCloseButton) {
        textCloseButton.addEventListener("click", function () {
            textFakeWindowWrapper.style.display = "none";
        });
    }

    // Close the image window
    if (imageCloseButton) {
        imageCloseButton.addEventListener("click", function () {
            imageFakeWindowWrapper.style.display = "none";
        });
    }
});
