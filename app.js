const heroImg = document.querySelector("#hero-img");
const jumpBlock = document.querySelector("#jump-block");
const hitBlock = document.querySelector("#hit-block");

jumpBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`;
hitBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`;

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

let rightPosition = 0; // отвечвет за номер кадра
let imgBlockPosition = 0;
let direction = "right";

let hit = false;
let jump = false;

jumpBlock.onclick = () => (jump = true);
hitBlock.onclick = () => (hit = true);

const rightHandler = () => {
  heroImg.style.transform = "scale(-1,1)";
  rightPosition++;
  imgBlockPosition++;
  if (rightPosition > 5) rightPosition = 0;

  heroImg.style.left = `-${rightPosition * 288}px`;

  heroImg.style.top = `-576px`;

  imgBlock.style.left = `${imgBlockPosition * 20}px`;
};

const leftHandler = () => {
  heroImg.style.transform = "scale(1,1)";
  rightPosition++;
  imgBlockPosition--;
  if (rightPosition > 5) rightPosition = 0;

  heroImg.style.left = `-${rightPosition * 288}px`;

  heroImg.style.top = `-576px`;

  imgBlock.style.left = `${imgBlockPosition * 20}px`;
};

const standHandler = (event) => {
  switch (direction) {
    case "right": {
      heroImg.style.transform = "scale(-1,1)";
      if (rightPosition > 4) rightPosition = 1;
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (rightPosition > 3) rightPosition = 0;
      break;
    }
    default:
      break;
  }

  rightPosition++;
  heroImg.style.left = `-${rightPosition * 288}px`;
  heroImg.style.top = `0px`;
};

const hitHandler = (event) => {
  switch (direction) {
    case "right": {
      heroImg.style.transform = "scale(-1,1)";
      if (rightPosition > 4) {
        rightPosition = 1;
        hit = false;
      }
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (rightPosition > 3) {
        rightPosition = 0;
        hit = false;
      }
      break;
    }
    default:
      break;
  }

  rightPosition++;
  heroImg.style.left = `-${rightPosition * 288}px`;
  heroImg.style.top = `-864px`;
};

const jumpHandler = (event) => {
  switch (direction) {
    case "right": {
      heroImg.style.transform = "scale(-1,1)";
      if (rightPosition > 4) {
        rightPosition = 1;
        jump = false;
      }
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (rightPosition > 3) {
        rightPosition = 0;
        jump = false;
      }
      break;
    }
    default:
      break;
  }

  rightPosition++;
  heroImg.style.left = `-${rightPosition * 288}px`;
  heroImg.style.top = `-288px`;
};

let timer = null;

const lifeCycle = (event) => {
  timer = setInterval(() => {
    if (hit) {
      hitHandler();
    } else if (jump) {
      jumpHandler();
    } else {
      standHandler();
    }
  }, 140);
};

let x = 0;

const onTouchStart = (event) => {
  clearInterval(timer);
  x = event.type === "mousedown" ? event.screenX : event.touches[0].screenX;
  timer = setInterval(() => {
    if (x > halfScreen) {
      direction = "right";
      rightHandler();
    } else {
      direction = "left";
      leftHandler();
    }
  }, 140);
};

const onTouchEnd = (event) => {
  clearInterval(timer);
  lifeCycle();
};

window.onmousedown = onTouchStart;
window.ontouchstart = onTouchStart;

window.onmouseup = onTouchEnd;
window.ontouchend = onTouchEnd;

const start = () => {
  lifeCycle();
};

start();
