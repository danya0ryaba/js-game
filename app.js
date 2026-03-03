const heroImg = document.querySelector("#hero-img");
const jumpBlock = document.querySelector("#jump-block");
const hitBlock = document.querySelector("#hit-block");

jumpBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`;
hitBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`;

heroImg.onclick = (event) => {
  event.preventDefault();
};

const imgBlock = document.querySelector("#img-block");
imgBlock.style.bottom = "64px";
imgBlock.style.left = "0px";

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

let rightPosition = 0; // отвечaет за номер кадра
let imgBlockPosition = 0; // отвечaет за блок с hero
let direction = "right";

let hit = false;
let jump = false;
let fall = false;

let heroX = Math.floor((parseInt(imgBlock.style.left) + 32, 10) / 32);
let heroY = Math.floor(parseInt(imgBlock.style.bottom, 10) / 32);

let tileArray = [];

jumpBlock.onclick = () => (jump = true);
hitBlock.onclick = () => (hit = true);

const updateHeroXY = () => {
  heroX = Math.ceil((parseInt(imgBlock.style.left) + 32) / 32);
  heroY = Math.ceil(parseInt(imgBlock.style.bottom) / 32);
  //console.log(heroX, heroY); // почему-то дважды heroX делается!
};
// НОГИ НЕМНОГО УШЛИ ПОД ТЕКСТУРУ С КАЖДЫМ ПРЫЖКОМ ВСЕ БОЛЬШЕ!
const checkFalling = (x, y) => {
  updateHeroXY();
  let isFalling = true;
  for (const arr of tileArray) {
    if (arr[0] === heroX && arr[1] + 1 === heroY) {
      isFalling = false;
    }
  }
  isFalling ? (fall = true) : (fall = false);
};

const fallHandler = () => {
  heroImg.style.top = "-96px";
  imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom) - 32}px`;
  checkFalling();
};

const rightHandler = () => {
  heroImg.style.transform = "scale(-1,1)";
  rightPosition++;
  imgBlockPosition++;
  if (rightPosition > 5) rightPosition = 0;
  heroImg.style.left = `-${rightPosition * 96}px`;
  heroImg.style.top = `-192px`;
  imgBlock.style.left = `${imgBlockPosition * 20}px`;
  checkFalling();
};

const leftHandler = () => {
  heroImg.style.transform = "scale(1,1)";
  rightPosition++;
  imgBlockPosition--;
  if (rightPosition > 5) rightPosition = 0;
  heroImg.style.left = `-${rightPosition * 96}px`;
  heroImg.style.top = `-192px`;
  imgBlock.style.left = `${imgBlockPosition * 20}px`;
  checkFalling();
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
  checkFalling();
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
        imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom) + 150}px`;
        imgBlockPosition = imgBlockPosition + 10;
        imgBlock.style.left = `${imgBlockPosition * 20}px`;
      }
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (rightPosition > 3) {
        rightPosition = 0;
        jump = false;
        imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom) + 150}px`;
        imgBlockPosition = imgBlockPosition - 10;
        imgBlock.style.left = `${imgBlockPosition * 20}px`;
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
    } else if (fall) {
      fallHandler();
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

class Enemy {
  posX;
  posY;
  img;
  block;
  blockSize;
  spritePos; // позиция спрайта на данный момент
  spriteMaxPos;
  timer;
  constructor(x, y) {
    this.posX = x;
    this.posY = y;
    this.blockSize = 96;
    this.spritePos = 0;
    this.spriteMaxPos = 3;
    this.#createImg();
    this.#lifeCycle();
  }
  #createImg() {
    this.block = document.createElement("div");
    this.block.style.position = "absolute";
    this.block.style.left = `${this.posX * 32}px`;
    this.block.style.bottom = `${this.posY * 32}px`;
    this.block.style.width = `${this.blockSize}px`;
    this.block.style.height = `${this.blockSize}px`;
    this.block.style.overflow = "hidden";

    this.img = document.createElement("img");
    this.img.src = "assets/Enemy/1/Idle.png";
    this.img.style.position = "absolute";
    this.img.style.left = 0;
    this.img.style.bottom = 0;
    this.img.style.width = `${this.blockSize * 4}px`;
    this.img.style.height = `${this.blockSize}px`;
    this.block.appendChild(this.img);
    canvas.appendChild(this.block);
  }
  #lifeCycle() {
    this.timer = setInterval(() => {
      this.spritePos++;
      this.#animate();
    }, 140);
  }
  #animate() {
    if (this.spritePos > this.spriteMaxPos) this.spritePos = 0;
    this.img.style.left = `-${this.spritePos * this.blockSize}px`;
  }
}

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
  tileArray.push([x, y]);
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
    if (i > 10 && i < 15) continue;
    else addTiles(i);
  }
  createTilePlatform(10, 10, 10);
  createTilePlatform(5, 5, 10);
  let enemy = new Enemy(10, 2);
};

start();
