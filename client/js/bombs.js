import { Ref } from "./utils.js"
import { Selectbyrowcol, hasclass } from "./game.js"
import { jsx } from '../src/framework.js';
import { createElement } from '../src/framework.js';

// bomb.js
export default class Bomb {
  constructor(row, col, tileSize, timer, radius) {
    this.row = row;
    this.col = col;
    this.x = col * tileSize;
    this.y = row * tileSize;
    this.timer = timer;       // time left before explode
    this.radius = radius;     // explosion range
    this.exploded = false;
    this.tileSize = tileSize;
    this.canvas = null;
  }
}
function drawBomb(row, col) {
  const canvas = Ref.gameCanvasRef.current;
  const tileElement = Selectbyrowcol(canvas, row, col);
  if (tileElement && !hasclass(tileElement, "bomb")) {
    const bombDiv = jsx("div", {
      className: "bomb",
      style:
        "background-image: url('../images/bomb.png'); width: 38px; height: 38px; z-index: 5; left: 50%; top: 50%;",
    });
    const bombElement = createElement(bombDiv);
    tileElement.appendChild(bombElement);
  }
}
function removeBomb(row, col) {
  const canvas = Ref.gameCanvasRef.current;
  const tileElement = Selectbyrowcol(canvas, row, col);
  const bombImg = hasclass(tileElement, "bomb");
  if (bombImg) {
    tileElement.innerHTML = "";
  }
}
function drawExplosion(row, col, frames) {
  const canvas = Ref.gameCanvasRef.current;
  const tileElement = Selectbyrowcol(canvas, row, col);

  let currentFrame = 0;
  const frameDuration = 75;

  const explosionDiv = jsx("div", {
    className: "damage",
    style: `background-position: ${frames[0].x}px ${frames[0].y}px;
            background-image: url('../images/explosion.png');
            width: 38px;
            height: 38px;
            z-index: 6;
            left: 50%;
            top: 50%;`,
  });

  const explosionElement = createElement(explosionDiv);
  tileElement.appendChild(explosionElement);

  const animate = () => {
    if (currentFrame >= frames.length) {
      explosionElement.remove();
      return;
    }

    explosionElement.style.backgroundPosition = `${frames[currentFrame].x}px ${frames[currentFrame].y}px`;
    currentFrame++;

    setTimeout(animate, frameDuration);
  };

  animate();
}

export {
  drawBomb,
  removeBomb,
  drawExplosion,
}