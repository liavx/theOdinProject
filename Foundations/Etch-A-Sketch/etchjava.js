const container = document.querySelector('.grid-container');
for (let i = 0 ; i < 16 * 16 ; i++){
const square = document.createElement('div');
square.classList.add("grid");
container.appendChild(square);
}