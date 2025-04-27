import { PLAYER_SPEED } from "../../config/constans.js";
class Player {
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
    this.isAlive = true;
    this.lastMoveTime = Date.now();
  }

  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.isAlive = true;
  }

  death() {
    this.lives--;
    this.maxBomb = 1;
    this.flameRange = 1;
    this.speed = PLAYER_SPEED;
    this.isAlive = false;
  }

  powerUp(type) {
    switch (type) {
      case "BOMB":
        this.maxBomb = Math.min(this.maxBomb++, 3);
        break;
      case "FLAME":
        this.flameRange = Math.min(this.flameRange++, 5);
        break;
      case "SPEED":
        this.speed = Math.min(this.speed + 0.2, 2.0);
        break;
    }
  }

  placeBomb() {
    return this.bombCount <= this.maxBomb;
  }
}


export default Player