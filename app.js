const heroImg = document.querySelector("#hero-img");

heroImg.onclick = (event) => {
  event.preventDefault();
};

const imgBlock = document.querySelector("#img-block");

const canvas = document.querySelector("#canvas");
const fsnBtn = document.querySelector("#fsn-btn");

fsnBtn.onclick = () => {
  if (window.document.fullscreenElement) {
    fsnBtn.src = "./img/fullscreen.png";
    window.document.exitFullscreen();
  } else {
    fsnBtn.src = "./img/cancel.png";
    canvas.requestFullscreen();
  }
};

const halfScreen = window.screen.width / 2;
console.log(halfScreen);

let rightPosition = 0; // отвечвет за номер кадра
let imgBlockPosition = 0;

const rightHandler = () => {
  heroImg.style.transform = "scale(-1,1)";
  rightPosition++;
  imgBlockPosition++;
  if (rightPosition > 5) rightPosition = 0;
  heroImg.style.left = `-${rightPosition * 288}px`;
  imgBlock.style.left = `${imgBlockPosition * 20}px`;
};

const leftHandler = () => {
  heroImg.style.transform = "scale(1,1)";
  rightPosition++;
  imgBlockPosition--;
  if (rightPosition > 5) rightPosition = 0;
  heroImg.style.left = `-${rightPosition * 288}px`;
  imgBlock.style.left = `${imgBlockPosition * 20}px`;
};

let timer = null;
let x = 0;

const onTouchStart = (event) => {
  clearInterval(timer);
  x = event.type === "mousedown" ? event.screenX : event.touches[0].screenX;
  timer = setInterval(() => {
    x > halfScreen ? rightHandler() : leftHandler();
  }, 140);
};
const onTouchEnd = (event) => {
  clearInterval(timer);
};

window.onmousedown = onTouchStart;
window.ontouchstart = onTouchStart;

window.onmouseup = onTouchEnd;
window.ontouchend = onTouchEnd;
