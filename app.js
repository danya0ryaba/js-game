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

  heroImg.style.left = `-${rightPosition * 96}px`;

  heroImg.style.top = `-192px`;

  imgBlock.style.left = `${imgBlockPosition * 20}px`;
};

const leftHandler = () => {
  heroImg.style.transform = "scale(1,1)";
  rightPosition++;
  imgBlockPosition--;
  if (rightPosition > 5) rightPosition = 0;

  heroImg.style.left = `-${rightPosition * 96}px`;

  heroImg.style.top = `-192px`;

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
  heroImg.style.left = `-${rightPosition * 96}px`;
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
  heroImg.style.left = `-${rightPosition * 96}px`;
  heroImg.style.top = `-288px`;
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
  heroImg.style.left = `-${rightPosition * 96}px`;
  heroImg.style.top = `-96px`;
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

const createTilePlatform = (startX, startY, length) => {
  for (let i = 0; i < length; i++) {
    createTile(startX + i, startY);
  }
};

const createTile = (x, y = 1) => {
  let tile = document.createElement("img");
  tile.src = "assets/1 Tiles/Tile_02.png";
  tile.style.position = "absolute";
  tile.style.left = `${x * 32}px`;
  tile.style.bottom = `${y * 32}px`;
  canvas.appendChild(tile);
};

const addTiles = (i) => {
  createTile(i);
  let tileBlack = document.createElement("img");
  tileBlack.src = "assets/1 Tiles/Tile_04.png";
  tileBlack.style.position = "absolute";
  tileBlack.style.left = `${i * 32}px`;
  tileBlack.style.bottom = 0;
  canvas.appendChild(tileBlack);
};

const start = () => {
  lifeCycle();
  for (let i = 0; i < window.screen.width / 32; i++) {
    addTiles(i);
  }
  createTilePlatform(10, 10, 10);
};

start();
