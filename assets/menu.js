document.addEventListener("DOMContentLoaded", function () {
    const infoBar = document.querySelector(".info-bar");
    const wrapper = document.querySelector(".wrapper-info");
    const content = document.querySelector(".content");

    infoBar.addEventListener("click", function () {
        wrapper.classList.toggle("open");
        content.classList.toggle("open");
    });
});
