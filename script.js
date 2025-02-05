document.addEventListener("DOMContentLoaded", function () {
    const openTxtButton = document.getElementById("open-txt");
    const openPicButton = document.getElementById("open-pic");
    const fakeWindowWrapper = document.getElementById("fake-window-wrapper");
    const fakeWindowWrapperImage = document.getElementById("fake-window-wrapper-image");
    const closeButton = document.getElementById("close-window");
    const closeButtonImage = document.getElementById("close-window-image");

    if (openTxtButton && openPicButton && fakeWindowWrapper && fakeWindowWrapperImage && closeButton && closeButtonImage) {
       
		// console.log("working");

		openTxtButton.addEventListener("click", function () {
            // fakeWindowWrapper.style.display = "";
			fakeWindowWrapper.style.display = "flex";
            fakeWindowWrapperImage.style.display = "none";
        });

        openPicButton.addEventListener("click", function () {
            fakeWindowWrapperImage.style.display = "flex";
            fakeWindowWrapper.style.display = "none";
        });

        closeButton.addEventListener("click", function () {
            fakeWindowWrapper.style.display = "none";
        });

        closeButtonImage.addEventListener("click", function () {
            fakeWindowWrapperImage.style.display = "none";
        });
    } else {
        console.error("something's missing");
    }
});
