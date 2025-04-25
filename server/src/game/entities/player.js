import { PLAYER_SPEED } from "../../config/constans.js";
export class Player {
  constructor(id, name, spawnX, spawnY) {
    this.id = id;
    this.name = name;
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.x = spawnX;
    this.y = spawnY;
    this.lives = 3;
    this.bombCount = 0;
    this.maxBomb = 1;
    this.speed = PLAYER_SPEED;
    this.flameRange = 1;
    this.powerups = new Set();
    this.isAlive = true;
    this.lastMoveTime = Date.now();
  }

  respawn() {}
}
