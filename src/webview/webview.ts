export function main() {
    const counter = document.getElementById("lines-of-code-counter");
    if (counter === null) {
        return;
    }
    let count = 0;
    setInterval(() => {
        counter.textContent = (count++).toString();
    }, 100);
}
