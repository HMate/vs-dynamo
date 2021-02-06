(function () {
    const counter = document.getElementById("lines-of-code-counter");

    let count = 0;
    setInterval(() => {
        counter.textContent = count++;
    }, 100);
})();
