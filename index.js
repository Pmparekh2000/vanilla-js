const container = document.querySelector(".modalContainer");
const button = document.querySelector(".modalButton");

button.addEventListener("click", () => {
    toggleModal(true);
});

container.addEventListener('click', (e) => {
    if (e.target.className === 'modalContainer') {
        toggleModal(false);
    }
});

function toggleModal(toggle) {
    container.style.display = toggle ? "flex" : "none";
}