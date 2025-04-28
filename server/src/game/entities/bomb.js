import { MAP, BOMB_TIMER, explosion_TIMER } from "../../config/constans.js";

export class Bomb {
  constructor(x, y, flameRange, map) {
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.flameRange = flameRange;
    this.map = map;
  }

  explosion() {
    const affectedTiles = [];
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];

    this.map[this.x][this.y] = MAP.explosion;
    affectedTiles.push([this.x, this.y]);

    for (const [dx, dy] of directions) {
      for (let i = 1; i <= this.flameRange; i++) {
        const newX = this.x + dx * i;
        const newY = this.y + dy * i;

        if (this.map[newX]?.[newY] === undefined) break;
        const tile = this.map[newX][newY];
        if (tile === MAP.wall) break;
        if (tile === MAP.soft_wall) {
          this.map[newX][newY] = MAP.explosion;
          affectedTiles.push([newX, newY]);
          break;
        }
      }
    }

    setTimeout(() => {
      affectedTiles.forEach((tile) => {
        this.map[tile[0]][tile[1]] = 0;
      });
    }, explosion_TIMER);
  }

  dropBomb() {
    this.map[this.x][this.y] = MAP.bomb
    setTimeout(() => {
        this.explosion()
    }, BOMB_TIMER)
  }
}

export default Bomb;
