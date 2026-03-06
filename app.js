const heroImg = document.querySelector("#hero-img");
const jumpBlock = document.querySelector("#jump-block");
const hitBlock = document.querySelector("#hit-block");
const backgroundCanvas = document.querySelector("#background-canvas");
let finalTimerText = document.querySelector("#final-timer-text");

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
let objectsArray = [];
let enemiesArray = [];
let heartsArray = [];
let isRightSideBlock = false;
let isLeftSideBlock = false;
let wasHeroHit = false;
let floor1WallArray = [
  [-10, 0],
  [14, 32],
  [42, 53],
  [64, 74],
  [92, 105],
  [119, 129],
];
let floor2WallArray = [[54, 63]];
let isWallRight = false;
let isWallLeft = false;
let heroStep = 3;

jumpBlock.onclick = () => (jump = true);
hitBlock.onclick = () => (hit = true);

const moveWorldLeft = () => {
  objectsArray.map((el, i) => {
    el.style.left = `${parseInt(el.style.left) - 32}px`;
  });
  tileArray.map((el) => el[0]--);
  enemiesArray.map((el) => el.moveLeft());

  floor1WallArray.map((el) => {
    el[0]--;
    el[1]--;
  });
  floor2WallArray.map((el) => {
    el[0]--;
    el[1]--;
  });
};
const moveWorldRight = () => {
  objectsArray.map((el, i) => {
    el.style.left = `${parseInt(el.style.left) + 32}px`;
  });
  tileArray.map((el) => el[0]++);
  enemiesArray.map((el) => el.moveRight());

  floor1WallArray.map((el) => {
    el[0]++;
    el[1]++;
  });
  floor2WallArray.map((el) => {
    el[0]++;
    el[1]++;
  });
};

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
  imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom, 10) - 32}px`;
  checkFalling();
};

const checkRightWallCollide = () => {
  isWallRight = false;
  isWallLeft = false;
  if (heroY === 1) {
    floor1WallArray.map((el) => {
      if (heroX === el[0] - 2) isWallRight = true;
    });
  } else if (heroY === 5) {
    floor2WallArray.map((el) => {
      if (heroX === el[0] - 2) isWallRight = true;
    });
  }
};

const checkLeftWallCollide = () => {
  isWallRight = false;
  isWallLeft = false;
  if (heroY === 1) {
    floor1WallArray.map((el) => {
      if (heroX === el[1]) isWallLeft = true;
    });
  } else if (heroY === 5) {
    floor2WallArray.map((el) => {
      if (heroX === el[1]) isWallLeft = true;
    });
  }
};

const rightHandler = () => {
  if (!isLeftSideBlock && !isWallRight) {
    heroImg.style.transform = "scale(-1,1)";
    rightPosition++;
    imgBlockPosition++;
    if (rightPosition > 5) rightPosition = 0;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = `-192px`;
    imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
    checkFalling();
    wasHeroHit = false;
    moveWorldLeft();
    checkRightWallCollide();
  }
};

const leftHandler = () => {
  if (!isLeftSideBlock && !isWallLeft) {
    heroImg.style.transform = "scale(1,1)";
    rightPosition++;
    imgBlockPosition--;
    if (rightPosition > 5) rightPosition = 0;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = `-192px`;
    imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
    checkFalling();
    wasHeroHit = false;
    moveWorldRight();
    checkLeftWallCollide();
  }
};

const standHandler = () => {
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
        wasHeroHit = true;
      }
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (rightPosition > 3) {
        rightPosition = 0;
        hit = false;
        wasHeroHit = true;
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
  isWallLeft = false;
  isWallRight = false;
  switch (direction) {
    case "right": {
      heroImg.style.transform = "scale(-1,1)";
      if (rightPosition > 4) {
        rightPosition = 1;
        jump = false;
        imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom) + 150}px`;
        imgBlockPosition = imgBlockPosition + 15;
        imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
      }
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (rightPosition > 3) {
        rightPosition = 0;
        jump = false;
        imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom) + 150}px`;
        imgBlockPosition = imgBlockPosition - 15;
        imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
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

class Lever {
  leverImg;
  x;
  y;
  updateTimer;
  dir;
  opacity;
  finalTimer;
  time;
  fountainImg;

  constructor() {
    this.fountainImg = objectsArray.filter(
      (el) => el.outerHTML.split('"')[1] === "assets/3 Objects/Fountain/2.png",
    )[0];

    this.x = heroX - 20;
    this.y = heroY;

    console.log(this.fountainImg);
    this.leverImg = document.createElement("img");
    this.leverImg.src = "assets/lever.png";
    this.leverImg.style.position = "absolute";
    this.leverImg.style.left = this.x * 32 + "px";
    this.leverImg.style.bottom = this.y * 32 + "px";
    this.leverImg.style.width = 64 + "px";
    this.leverImg.style.height = 64 + "px";
    canvas.appendChild(this.leverImg);
    enemiesArray.push(this);

    this.time = 15;
    this.dir = true;
    this.opacity = 1;
    this.updateTimer = setInterval(() => {
      if (heroX === this.x + 1 && heroY === this.y) {
        this.leverImg.style.display = "none";
        clearInterval(this.updateTimer);
        new CutScene(["Беги к фонтану!"]);
      } else {
        this.animate();
      }
    }, 100);

    this.finalTimer = setInterval(() => {
      if (this.time <= 0) {
        finalTimerText.textContent = "Game over";
        clearInterval(this.finalTimer);
      } else {
        finalTimerText.textContent = `${this.time}`;
        this.time--;
        if (heroX === parseInt(this.fountainImg.style.left) / 32) {
          new Terminal();
          clearInterval(this.finalTimer);
        }
      }
    }, 1000);
  }
  animate() {
    this.dir ? (this.opacity += 0.5) : (this.opacity -= 0.5);
    this.leverImg.style.opacity = 1 / this.opacity;
    if (this.opacity <= 0 || this.opacity >= 5) this.dir = !this.dir;
  }
  moveLeft() {
    this.leverImg.style.left = `${parseInt(this.leverImg.style.left) - 32}px`;
    this.x--;
  }
  moveRight() {
    this.leverImg.style.left = `${parseInt(this.leverImg.style.left) + 32}px`;
    this.x++;
  }
}

class CutScene {
  text;
  block;
  p;
  nextButton;
  skipButton;
  page;
  timer;
  constructor(text) {
    this.page = 0;
    this.text = text;
    this.block = document.createElement("div");
    this.block.style.position = "absolute";
    this.block.style.left = "10%";
    this.block.style.bottom = "10vh";
    this.block.style.width = "80%";
    this.block.style.height = "80vh";
    this.block.style.backgroundColor = "#38002c";
    this.block.style.border = "5px solid #8babbf";
    this.appendP();
    this.appendNextButton();
    this.appendSkipButton();
    this.setText(this.text[this.page]);
    canvas.appendChild(this.block);
  }

  appendP() {
    this.p = document.createElement("p");
    this.p.style.position = "absolute";
    this.p.style.left = "10%";
    this.p.style.top = "4vh";
    this.p.style.width = "80%";
    this.p.style.color = "#8babbf";
    this.p.style.fontSize = "8pt";
    this.p.style.lineHeight = "1.5";
    this.p.style.fontFamily = "'Press Start 2P', cursive";
    this.p.style.fontSize = "22pt";
    this.p.style.fontWeight = "400";
    this.p.style.fontStyle = "normal";
    this.p.onclick = () => {
      this.nextButton.style.display = "block";
      clearInterval(this.timer);
      this.p.textContent = this.text[this.page];
    };
    this.block.appendChild(this.p);
  }
  appendNextButton() {
    this.nextButton = document.createElement("button");
    this.setButtonStyle(this.nextButton, "Next");
    this.nextButton.style.right = 0;
    this.nextButton.style.display = "none";
    this.nextButton.onclick = () => {
      if (this.page < this.text.length - 1) {
        this.page++;
        this.setText(this.text[this.page]);
        this.nextButton.style.display = "none";
      } else {
        this.block.style.display = "none";
      }
    };
    this.block.appendChild(this.nextButton);
  }
  appendSkipButton() {
    this.skipButton = document.createElement("button");
    this.setButtonStyle(this.skipButton, "Skip");
    this.skipButton.style.left = 0;
    this.skipButton.onclick = () => {
      this.block.style.display = "none";
    };
    this.block.appendChild(this.skipButton);
  }
  setButtonStyle(button, textButton) {
    button.style.position = "absolute";
    button.style.bottom = 0;
    button.style.backgroundColor = "#8babbf";
    button.style.color = "#38002c";
    button.textContent = textButton;
    button.style.fontSize = "20pt";
    button.style.margin = "10pt";
    button.style.padding = "10pt";
    button.style.border = "none";
    button.style.fontFamily = "'Press Start 2P', cursive";
  }
  setText(text) {
    if (this.page === this.text.length - 1) this.nextButton.textContent = "Go";
    let iinerText = "";
    let targetText = text;
    let pos = 0;
    this.timer = setInterval(() => {
      if (pos <= targetText.length - 1) {
        iinerText += targetText[pos];
        this.p.textContent = iinerText;
        pos++;
      } else {
        clearInterval(this.timer);
        this.nextButton.style.display = "block";
      }
    }, 20);
  }
}

class Terminal extends CutScene {
  btnBlock;
  mainStrLength;
  password;

  constructor() {
    let text = "Скорее вводи пароль : ";
    super([text]);
    this.password = "1123";
    this.mainStrLength = text.length;
    this.btnBlock = document.createElement("div");
    this.btnBlock.style.position = "absolute";
    this.btnBlock.style.left = "33%";
    this.btnBlock.style.bottom = "10vh";
    this.btnBlock.style.width = "33%";
    this.block.appendChild(this.btnBlock);
    this.skipButton.textContent = "Clear";
    this.nextButton.textContent = "Enter";
    this.createNumButtons();

    this.skipButton.onclick = () => {
      if (this.p.textContent.length > this.mainStrLength) {
        let str = "";
        for (let i = 0; i < this.p.textContent.length - 1; i++) {
          str += this.p.textContent[i];
        }
        this.p.textContent = str;
      }
    };
    this.nextButton.onclick = () => {
      if (this.p.textContent.length === this.mainStrLength + 4) {
        let str = "";
        for (
          let i = this.p.textContent.length - 4;
          i < this.p.textContent.length;
          i++
        ) {
          str += this.p.textContent[i];
        }
        if (str === this.password) {
          this.block.style.display = "none";
          finalTimerText.textContent = "You win!";
          imgBlock.style.display = "none";
        } else {
          this.p.textContent = "Пароль неверный, попробуй еще раз :";
          this.mainStrLength = this.p.textContent.length;
        }
      }
    };
  }

  createNumButtons() {
    for (let i = 1; i <= 9; i++) {
      let button = document.createElement("button");
      this.setButtonStyle(button, `${i}`);
      button.style.left =
        i <= 3
          ? `${(i - 1) * 33}%`
          : i <= 6
            ? `${(i - 4) * 33}%`
            : `${(i - 7) * 33}%`;
      button.style.bottom = i <= 3 ? "36vh" : i <= 6 ? "18vh" : 0;

      button.onclick = (event) => {
        if (this.p.textContent.length < this.mainStrLength + 4) {
          this.p.textContent += event.target.textContent;
        }
      };

      this.btnBlock.appendChild(button);
    }
  }
}

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
  spritePos; // позиция спрайта на данный момент(картинки)
  spriteMaxPos;
  startX;
  dir; //отвечает за перемещение вправо влево (1, -1)
  stop;
  img;
  block;
  timer;
  soucePath;
  lives;
  message;

  constructor(x, y, src, message = "", isLast = false) {
    this.isLast = isLast;
    this.message = message;
    this.posX = x + this.getRandomOffset(6);
    this.startX = x;
    this.dir = 1;
    this.stop = false;
    this.posY = y;
    this.blockSize = 96;
    this.spritePos = 0;
    this.spriteMaxPos = 3;
    this.soucePath = src;
    this.state = this.IDLE;
    this.animateWasChanged = false;
    this.animateWasChanged = false;
    this.lives = 30;
    this.#createImg();
    this.changeAnimate(this.WALK);
    enemiesArray.push(this);
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
        this.state !== this.DEATH &&
          this.state !== this.HURT &&
          this.changeAnimate(this.ATTACK);
      }
      this.animate();
    }, 140);
  }
  animate() {
    if (this.spritePos > this.spriteMaxPos) {
      this.spritePos = 0;
      if (this.state === this.ATTACK) {
        lives--;
        updateHearts();
      }
      if (this.state === this.HURT) {
        this.changeAnimate(this.ATTACK);
        if (this.dir > 0) this.spritePos = 1;
      }
      if (this.state === this.DEATH) {
        clearInterval(this.timer);
        isRightSideBlock = false;
        isLeftSideBlock = false;
        if (this.dir > 0) this.spritePos = 5;
        if (this.message) {
          new CutScene([this.message]);
          if (this.isLast) new Lever();
        }
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
    if (this.posX > this.startX + 6) {
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
        this.checkHurt();
        isRightSideBlock = true;
        this.stop = true;
      } else if (heroX === this.posX + 3) {
        this.checkHurt();
        isLeftSideBlock = true;
        this.stop = true;
      } else {
        isLeftSideBlock = false;
        isRightSideBlock = false;
        this.stop = false;
        this.changeAnimate(this.WALK);
      }
    } else {
      isLeftSideBlock = false;
      isRightSideBlock = false;
      this.stop = false;
      this.changeAnimate(this.WALK);
    }
  }
  checkHurt() {
    if (wasHeroHit) {
      if (this.lives <= 10) {
        wasHeroHit = false;
        this.changeAnimate(this.DEATH);
      } else {
        wasHeroHit = false;
        this.changeAnimate(this.HURT);
        this.showHurt();
        this.lives -= 10;
      }
    }
  }
  showHurt() {
    let pos = 0;
    let text = document.createElement("p");
    let blockLeft = parseInt(this.block.style.left);
    text.textContent = "-10";
    text.style.position = "absolute";
    text.style.left =
      this.dir < 0 ? `${blockLeft + 50}px` : `${blockLeft + 10}px`;
    text.style.bottom = `${parseInt(this.block.style.bottom) + 32}px`;
    // подключить в стилях
    text.style.fontFamily = "'Bungee Spice', sans-serif";
    text.style.fontWeight = 400;
    text.style.fontStyle = "normal";

    let hurtTimer = setInterval(() => {
      text.style.bottom = `${parseInt(text.style.bottom) + 16}px`;
      pos++;
      if (pos > 2) {
        clearInterval(hurtTimer);
        text.style.display = "none";
      }
    }, 100);

    canvas.appendChild(text);
  }
  moveRight() {
    this.startX++;
    this.posX++;
    if (this.stop || this.state === this.DEATH) {
      this.block.style.left = `${parseInt(this.block.style.left) + 32}px`;
    }
  }
  moveLeft() {
    this.startX--;
    this.posX--;
    if (this.stop || this.state === this.DEATH) {
      this.block.style.left = `${parseInt(this.block.style.left) - 32}px`;
    }
  }
  getRandomOffset(max) {
    const random = Math.floor(Math.random() * max);
    return random;
  }
}

// нужно для переопределения кадров на анимации, тк там везде разное количество кадров
class Enemy1 extends Enemy {
  constructor(x, y, message) {
    super(x, y, "assets/Enemy/1/", message);
  }
}

class Enemy2 extends Enemy {
  constructor(x, y, message, isLast) {
    super(x, y, "assets/Enemy/2/", message, isLast);
  }
  setWalk() {
    this.img.src = this.soucePath + "Walk.png";
    this.spriteMaxPos = 3;
  }
}

class Enemy5 extends Enemy {
  constructor(x, y, message) {
    super(x, y, "assets/Enemy/5/", message);
  }

  setAttack() {
    this.img.src = this.soucePath + "Attack.png";
    this.spriteMaxPos = 3;
  }
  setDeath() {
    this.img.src = this.soucePath + "Death.png";
    this.spriteMaxPos = 2;
  }
  setWalk() {
    this.img.src = this.soucePath + "Walk.png";
    this.spriteMaxPos = 3;
  }
}

class Enemy6 extends Enemy {
  bullet;
  isShoot;
  bulletX;
  constructor(x, y, message) {
    super(x, y, "assets/Enemy/6/", message);
    this.bullet = document.createElement("img");
    this.bullet.src = this.soucePath + "Ball1.png";
    this.bullet.style.position = "absolute";
    this.bullet.style.left = this.block.style.left;
    this.bullet.style.bottom = `${parseInt(this.block.style.bottom) + 32}px`;
    this.bullet.style.transform = "scale(2,2)";
    this.bullet.style.display = "none";
    canvas.appendChild(this.bullet);
  }

  setAttack() {
    this.img.src = this.soucePath + "Attack.png";
    this.spriteMaxPos = 3;
  }
  setDeath() {
    this.img.src = this.soucePath + "Death.png";
    this.spriteMaxPos = 2;
  }
  setWalk() {
    this.img.src = this.soucePath + "Walk.png";
    this.spriteMaxPos = 3;
  }

  checkCollide() {
    if (heroY === this.posY) {
      this.stop = true;
      if (heroX > this.posX) {
        this.dir = 1;
        this.img.style.transform = "scale(1,1)";
      } else {
        this.dir = -1;
        this.img.style.transform = "scale(-1,1)";
      }
      if (heroX === this.posX) {
        this.checkHurt();
        isRightSideBlock = true;
      } else if (heroX === this.posX + 3) {
        this.checkHurt();
        isLeftSideBlock = true;
      } else {
        isLeftSideBlock = false;
        isRightSideBlock = false;
        this.changeAnimate(this.WALK);
      }
    } else {
      isLeftSideBlock = false;
      isRightSideBlock = false;
      this.stop = false;
      this.changeAnimate(this.WALK);
    }
  }

  shoot() {
    this.isShoot = true;
    this.bullet.style.display = "block";
    this.dir > 0
      ? (this.bulletX = this.posX + 2)
      : (this.bulletX = this.posX + 1);
  }

  bulletFunc() {
    this.dir > 0 ? this.bulletX++ : this.bulletX--;
    this.bullet.style.left = `${parseInt(this.bulletX) * 32}px`;
    if (heroX === this.bulletX && heroY === this.posY) {
      this.isShoot = false;
      this.bullet.style.display = "none";
      lives--;
      updateHearts();
    }
    if (this.dir > 0) {
      if (this.bulletX > this.posX + 6) {
        this.isShoot = false;
        this.bullet.style.display = "none";
      }
    } else {
      if (this.bulletX < this.posX - 5) {
        this.isShoot = false;
        this.bullet.style.display = "none";
      }
    }
  }

  animate() {
    if (this.spritePos > this.spriteMaxPos) {
      this.spritePos = 0;
      if (this.state === this.ATTACK) {
        if (!this.isShoot) this.shoot();
      }
      if (this.state === this.HURT) {
        this.changeAnimate(this.ATTACK);
        if (this.dir > 0) this.spritePos = 1;
      }
      if (this.state === this.DEATH) {
        clearInterval(this.timer);
        isRightSideBlock = false;
        isLeftSideBlock = false;
        if (this.dir > 0) this.spritePos = 5;
        if (this.message) new CutScene([this.message]);
      }
    }
    if (this.isShoot && this.state === this.ATTACK) {
      this.bulletFunc();
    } else {
      this.bullet.style.display = "none";
    }
    this.img.style.left = `-${this.spritePos * this.blockSize}px`;
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

const createTilePlatform = (startX, endX, floor) => {
  for (let xPos = startX - 1; xPos < endX; xPos++) {
    createTile(xPos, floor);
  }
};

const createTile = (x, y = 1) => {
  let tile = document.createElement("img");
  tile.src = "assets/1 Tiles/Tile_02.png";
  tile.style.position = "absolute";
  tile.style.left = `${x * 32}px`;
  tile.style.bottom = `${y * 32}px`;
  backgroundCanvas.appendChild(tile);
  objectsArray.push(tile);
  tileArray.push([x, y]);
};

const createTileBlack = (x, y = 0) => {
  let tileBlack = document.createElement("img");
  tileBlack.src = "assets/1 Tiles/Tile_04.png";
  tileBlack.style.position = "absolute";
  tileBlack.style.left = `${x * 32}px`;
  tileBlack.style.bottom = `${y * 32}px`;
  backgroundCanvas.appendChild(tileBlack);
  objectsArray.push(tileBlack);
};

const createTilesBlackBlock = (startX, endX, floor) => {
  for (let yPos = 0; yPos < floor; yPos++) {
    for (let xPos = startX - 1; xPos < endX; xPos++) {
      createTileBlack(xPos, yPos);
    }
  }
};

const addTiles = (i) => {
  createTile(i);
  createTileBlack(i);
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

const createBackImg = (i) => {
  let img = document.createElement("img");
  img.src = "./assets/2 Background/Day/Background.png";
  img.style.position = "absolute";
  img.alt = "Background";
  img.style.left = `${i * window.screen.width - 32}px`;
  img.style.bottom = 32 + "px";
  img.style.width = `${window.screen.width}px`;
  backgroundCanvas.appendChild(img);
  objectsArray.push(img);
};

const addBackgroundImages = () => {
  for (let i = 0; i < 2; i++) {
    createBackImg(i);
  }
};

const createImgEl = (src, x, y) => {
  const img = document.createElement("img");
  img.src = src;
  img.style.position = "absolute";
  img.style.left = x * 32 + "px";
  img.style.bottom = y * 32 + "px";
  img.style.transform = "scale(2,2) translate(-25%, -25%)";
  backgroundCanvas.appendChild(img);
  objectsArray.push(img);
};

const addDecorationElements = (f1, f2, f3) => {
  const basePath = "assets/3 Objects/";
  //Tree
  createImgEl(basePath + "/Other/Tree4.png", 4, f1);
  createImgEl(basePath + "Other/Tree2.png", 35, f1);
  createImgEl(basePath + "/Other/Tree3.png", 78, f1);
  createImgEl(basePath + "Other/Tree4.png", 108, f1);
  createImgEl(basePath + "/Other/Tree1.png", 65, f2);
  //Stone
  createImgEl(basePath + "/Stones/6.png", 10, f1);
  createImgEl(basePath + "/Stones/4.png", 111, f1);
  createImgEl(basePath + "/Stones/4.png", 38, f1);
  createImgEl(basePath + "/Stones/6.png", 102, f3);
  //Ramp
  createImgEl(basePath + "/Other/Ramp1.png", 22, f2);
  createImgEl(basePath + "/Other/Ramp2.png", 26, f2);
  createImgEl(basePath + "/Other/Ramp1.png", 95, f2);
  createImgEl(basePath + "/Other/Ramp2.png", 99, f2);
  createImgEl(basePath + "/Other/Ramp1.png", 45, f2);
  createImgEl(basePath + "/Other/Ramp2.png", 49, f2);
  //Bushes
  createImgEl(basePath + "/Bushes/17.png", 84, f1);
  createImgEl(basePath + "/Bushes/17.png", 19, f2);
  createImgEl(basePath + "/Bushes/17.png", 50, f2);
  createImgEl(basePath + "/Bushes/17.png", 69, f2);
  createImgEl(basePath + "/Bushes/17.png", 100, f2);
  createImgEl(basePath + "/Bushes/17.png", 13, f3);
  //Fountain
  createImgEl(basePath + "Fountain/2.png", 116, f1);
  //Box
  createImgEl(basePath + "/Other/Box.png", 84, f1);
  createImgEl(basePath + "/Other/Box.png", 48, f2);
  createImgEl(basePath + "/Other/Box.png", 14, f3);
  createImgEl(basePath + "/Other/Box.png", 104, f3);
  // console.log(objectsArray);
};

const addEnemies = () => {
  const enemy1 = new Enemy1(9, 9, "Обнаружена первая цифра пароля - '1'");
  const enemy2 = new Enemy6(19, 5);
  const enemy3 = new Enemy5(44, 5, "Обнаружена первая цифра пароля - '2'");
  const enemy4 = new Enemy2(65, 5);
  const enemy5 = new Enemy1(79, 1, "Обнаружена первая цифра пароля - '3'");
  const enemy6 = new Enemy6(93, 5);
  const enemy7 = new Enemy2(
    100,
    9,
    "Обнаружена первая цифра пароля - '4'\n\n Скорее ищи рычаг, у тебя мало времени",
    true,
  );
};

const buildLevel = () => {
  let floor1 = 0;
  let floor2 = 4;
  let floor3 = 8;

  addDecorationElements(floor1 + 1, floor2 + 1, floor3 + 1);

  createTilePlatform(0, 14, floor1);
  createTilePlatform(33, 41, floor1);
  createTilePlatform(76, 91, floor1);
  createTilePlatform(106, 132, floor1);

  createTilePlatform(15, 32, floor2);
  createTilePlatform(42, 53, floor2);
  createTilePlatform(64, 75, floor2);
  createTilePlatform(92, 105, floor2);

  createTilePlatform(8, 20, floor3);
  createTilePlatform(54, 63, floor3);
  createTilePlatform(75, 87, floor3);
  createTilePlatform(99, 111, floor3);

  createTilesBlackBlock(15, 32, floor2);
  createTilesBlackBlock(42, 53, floor2);
  createTilesBlackBlock(64, 75, floor2);
  createTilesBlackBlock(92, 105, floor2);

  createTilesBlackBlock(54, 63, floor3);

  addEnemies();
};

const start = () => {
  addBackgroundImages();
  buildLevel();
  lifeCycle();
  addHearts();
  updateHearts();

  // let cutScene = new CutScene([
  //   "После неудачной попытки выследить похитетелей своей девушки, Адам был пойман недображелателями.\n\nОни решили протестировать на герое недавно украденную сверхсекретную разработку. В результате - сознание Адама было заключено в виртуальный плен.\n\nВсе это время друзья героя искали его и спустя несколько дней, наконец-то смогли выйти с ним на связь.",
  //   "Оказалось, что из виртуального мира можно сбежать - дверь находиться за одним из фонтанов в конце первого уровня. Но, чтобы ее открыть нужно найти спрятанный рычаг и ввести код пароля. \n\nПароль состоит из 4 чисел. Цифры пароля находятся внутри тщательно охраняемых деревянных ящиков (по одной в каждом).\n\nЧто касается рычага - он спрятан на втором уровне, куда у Адама нет доступа.",
  //   "К счастью друзья нашли способ похитить его. Но, поскольку опасность слышком велика, они передадут рычаг, только когда станут известны все цифры пароля.\n\nКогда появится рычаг у Адама будет 30 секунд чтобы найти его, подбежать к фонтану и ввести пароль. Если герой не успеет - местонохождение его друзей будет обнаружено недоброжелателями.",
  // ]);
  // new Terminal();
};

start();
