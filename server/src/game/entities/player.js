import { PLAYER_SPEED, DEATH_COOLDOWN } from "../../config/constans.js";
class Player {
  constructor(id, socket, name, spawnX, spawnY) {
    this.id = id;
    this.socket = socket;
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
    this.isDead = false;
    this.lastMoveTime = Date.now();
    this.movement = {
      right: false,
      left: false,
      up: false,
      down: false,
    };
  }

  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.isAlive = true;
  }

  death() {
    this.lives--;
    if (this.lives === 0) {
      this.isDead = true;
      return;
    }
    this.maxBomb = 1;
    this.flameRange = 1;
    this.speed = PLAYER_SPEED;
    this.isAlive = false;
    setTimeout(() => {
      this.respawn();
    }, DEATH_COOLDOWN);
  }

  powerUp(type) {
    switch (type) {
      case "BOMB":
        this.maxBomb = Math.min(this.maxBomb + 1, 3);
        break;
      case "FLAME":
        this.flameRange = Math.min(this.flameRange + 1, 5);
        break;
      case "SPEED":
        this.speed = Math.min(this.speed + 0.2, 0.8);
        break;
    }
  }

  setMovement(direction, isMoving) {
    switch (direction) {
      case "right":
        this.movement.right = isMoving;
        break;
      case "left":
        this.movement.left = isMoving;
        break;
      case "up":
        this.movement.up = isMoving;
        break;
      case "down":
        this.movement.down = isMoving;
    }
  }

  updateMovement() {
    const now = Date.now();
    const deltaTime = (now - this.lastMoveTime) / 1000;
    this.movement.lastUpdate = now;

    if (this.movement.up) this.y -= this.speed * deltaTime;
    if (this.movement.down) this.y += this.speed * deltaTime;
    if (this.movement.left) this.x -= this.speed * deltaTime;
    if (this.movement.right) this.x += this.speed * deltaTime;
  }

  canPlaceBomb() {
    return this.bombCount <= this.maxBomb;
  }
}

export default Player;
