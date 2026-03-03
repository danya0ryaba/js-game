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

let maxLives = 6;
let lives = 6; // текущая жизнь

let heroX = Math.floor((parseInt(imgBlock.style.left) + 32, 10) / 32);
let heroY = Math.floor(parseInt(imgBlock.style.bottom, 10) / 32);

let tileArray = [];
let heartsArray = [];

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
  ATTACK = "attack";
  DEATH = "death";
  HURT = "hurt";
  IDLE = "idle";
  WALK = "walk";

  state; // для состояния врага
  animateWasChanged;

  posX;
  posY;
  blockSize;
  spritePos; // позиция спрайта на данный момент
  spriteMaxPos;

  startX;
  dir;

  stop;

  img;
  block;
  timer;

  soucePath;

  constructor(x, y) {
    this.posX = x;
    this.startX = this.posX;
    this.dir = 1;
    this.stop = false;
    this.posY = y;
    this.blockSize = 96;
    this.spritePos = 0;
    this.spriteMaxPos = 3;
    this.soucePath = "assets/Enemy/1/";

    this.state = this.IDLE;
    this.animateWasChanged = false;

    this.#createImg();
    this.changeAnimate(this.WALK);
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
    this.img.src = this.soucePath + "Idle.png";
    this.img.style.position = "absolute";
    this.img.style.left = 0;
    this.img.style.bottom = 0;
    this.img.style.width = `${this.blockSize * this.state.spriteMaxPos}px`;
    this.img.style.height = `${this.blockSize}px`;
    this.block.appendChild(this.img);
    canvas.appendChild(this.block);
  }
  #lifeCycle() {
    this.timer = setInterval(() => {
      if (this.animateWasChanged) {
        this.animateWasChanged = false;
        switch (this.state) {
          case this.ATTACK: {
            this.setAttack();
            break;
          }
          case this.HURT: {
            this.setHurt();
            break;
          }
          case this.DEATH: {
            this.setDeath();
            break;
          }
          case this.WALK: {
            this.setWalk();
            break;
          }
          case this.IDLE: {
            this.setIdle();
            break;
          }
          default:
            break;
        }
      }
      this.spritePos++;
      this.checkCollide();
      if (!this.stop) {
        this.move();
      } else {
        this.changeAnimate(this.ATTACK);
      }
      this.#animate();
    }, 140);
  }
  #animate() {
    if (this.spritePos > this.spriteMaxPos) {
      this.spritePos = 0;
      if (this.state === this.ATTACK) {
        lives--;
        updateHearts();
      }
    }
    this.img.style.left = `-${this.spritePos * this.blockSize}px`;
  }
  setAttack() {
    this.img.src = this.soucePath + "Attack.png";
    this.spriteMaxPos = 5;
  }
  setDeath() {
    this.img.src = this.soucePath + "Death.png";
    this.spriteMaxPos = 5;
  }
  setHurt() {
    this.img.src = this.soucePath + "Hurt.png";
    this.spriteMaxPos = 1;
  }
  setIdle() {
    this.img.src = this.soucePath + "Idle.png";
    this.spriteMaxPos = 3;
  }
  setWalk() {
    this.img.src = this.soucePath + "Walk.png";
    this.spriteMaxPos = 5;
  }
  changeAnimate(localState) {
    this.state = localState;
    this.animateWasChanged = true;
  }
  move() {
    if (this.posX > this.startX + 10) {
      this.dir *= -1;
      this.img.style.transform = "scale(-1,1)";
    } else if (this.posX <= this.startX) {
      this.dir = Math.abs(this.dir);
      this.img.style.transform = "scale(1,1)";
    }
    this.posX += this.dir;
    this.block.style.left = `${this.posX * 32}px`;
  }
  checkCollide() {
    if (heroY === this.posY) {
      if (heroX === this.posX) {
        this.stop = true;
      } else if (heroX === this.posX + 2) {
        this.stop = true;
        //
      } else {
        this.stop = false;
        this.changeAnimate(this.WALK);
      }
    } else {
      this.stop = false;
      this.changeAnimate(this.WALK);
    }
  }
}

class Heart {
  img;
  x;
  constructor(x, src) {
    this.x = x + 1;
    this.img = document.createElement("img");
    this.img.src = src;
    this.img.style.position = "absolute";
    this.img.style.left = `${this.x * 32}px`;
    this.img.style.bottom = (window.screen.height / 32 - 2) * 32;
    this.img.style.width = 32;
    this.img.style.height = 32;
    canvas.appendChild(this.img);
  }
}

class HeartEmpty extends Heart {
  constructor(x) {
    super(x, "assets/Hearts/heart_empty.png");
  }
}

class HeartRed extends Heart {
  constructor(x) {
    super(x, "assets/Hearts/heart_red.png");
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

const addHearts = () => {
  for (let i = 0; i < maxLives; i++) {
    let heartRed = new HeartRed(i);
    let heartEmpty = new HeartEmpty(i);
    heartsArray.push(heartRed);
  }
};

const updateHearts = () => {
  if (lives < 1) lives = 1;
  for (let i = 0; i < lives; i++) {
    heartsArray[i].img.style.display = "block";
  }
  for (let i = lives; i < maxLives; i++) {
    heartsArray[i].img.style.display = "none";
  }
};

const start = () => {
  lifeCycle();
  for (let i = 0; i < window.screen.width / 32; i++) {
    addTiles(i);
  }
  createTilePlatform(10, 10, 10);
  createTilePlatform(5, 5, 10);
  let enemy = new Enemy(10, 2);

  addHearts();
  updateHearts();
};

start();
