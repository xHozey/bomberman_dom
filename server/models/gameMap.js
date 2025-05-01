import { GAME_CONFIG } from "../config/gameConfig.js";

export default class GameMap {
  constructor() {
    this.map = JSON.parse(JSON.stringify(GAME_CONFIG.MAP));
    this.tileSize = GAME_CONFIG.TILE_SIZE;
    this.clearBombs();
  }

  clearBombs() {
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[0].length; col++) {
        if (this.map[row][col] === 4) {
          this.map[row][col] = 0;
        }
      }
    }
  }

  initializePlayers(players) {
    for (let i = 0; i < players.length; i++) {
      const pos = GAME_CONFIG.PLAYER_POSITIONS[i];
      if (pos) {
        const [row, col] = pos;
        this.map[row][col] = 5 + i;
        players[i].x = col * this.tileSize;
        players[i].y = row * this.tileSize;
      }
    }
  }

  isValidPosition(row, col) {
    return (
      row >= 0 && row < this.map.length && col >= 0 && col < this.map[0].length
    );
  }

  getTile(row, col) {
    return this.isValidPosition(row, col) ? this.map[row][col] : null;
  }

  isWall(row, col) {
    return this.getTile(row, col) === 1;
  }

  isDestructibleWall(row, col) {
    return this.getTile(row, col) === 3;
  }

  isBomb(row, col) {
    return this.getTile(row, col) === 4;
  }

  setTile(row, col, value) {
    if (this.isValidPosition(row, col)) {
      this.map[row][col] = value;
    }
  }
}
