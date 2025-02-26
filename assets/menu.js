document.addEventListener("DOMContentLoaded", function () {
    const infoBar = document.querySelector(".info-bar");
    const wrapper = document.querySelector(".wrapper-info");
    const content = document.querySelector(".content");

    infoBar.addEventListener("click", function () {
        wrapper.classList.toggle("open");
        content.classList.toggle("open");
    });

    const contentBar = document.querySelector(".content-bar");
    const wrapperContent = document.querySelector(".wrapper-content");
    const channelBlocks = document.querySelector(".channel-blocks");

    contentBar.addEventListener("click", function () {
        wrapperContent.classList.toggle("open");
        channelBlocks.classList.toggle("expanded");
    });

    document.addEventListener('mousemove', function(event) {
        const x = event.clientX;
        const y = event.clientY;
        const coordsDisplay = document.getElementById('coordinates');
        coordsDisplay.textContent = `(${x}, ${y})`;
    });

});