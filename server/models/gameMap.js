import { GAME_CONFIG } from '../config/gameConfig.js';

export default class GameMap {
  constructor() {
    // Deep copy the map and clear bombs (tile value 4)
    this.map = JSON.parse(JSON.stringify(GAME_CONFIG.MAP));
    this.tileSize = GAME_CONFIG.TILE_SIZE;
    this.clearBombs();
  }

  /**
   * Clears bombs (tile value 4) from the map during initialization.
   */
  clearBombs() {
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[0].length; col++) {
        if (this.map[row][col] === 4) {
          this.map[row][col] = 0;
        }
      }
    }
  }

  /**
   * Initializes player positions on the map.
   * @param {Array<Player>} players - Array of Player instances
   */
  initializePlayers(players) {
    for (let i = 0; i < players.length; i++) {
      const pos = GAME_CONFIG.PLAYER_POSITIONS[i];
      if (pos) {
        const [row, col] = pos;
        this.map[row][col] = 5 + i; // Player tile (5 for P1, 6 for P2, etc.)
        players[i].x = col * this.tileSize;
        players[i].y = row * this.tileSize;
      }
    }
  }

  /**
   * Checks if a position is valid.
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  isValidPosition(row, col) {
    return (
      row >= 0 &&
      row < this.map.length &&
      col >= 0 &&
      col < this.map[0].length
    );
  }

  /**
   * Gets the tile value at a position.
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {number}
   */
  getTile(row, col) {
    return this.isValidPosition(row, col) ? this.map[row][col] : null;
  }

  /**
   * Checks if a tile is a wall (indestructible).
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  isWall(row, col) {
    return this.getTile(row, col) === 1;
  }

  /**
   * Checks if a tile is a destructible wall.
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  isDestructibleWall(row, col) {
    return this.getTile(row, col) === 3;
  }

  /**
   * Checks if a tile is a bomb.
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  isBomb(row, col) {
    return this.getTile(row, col) === 4;
  }

  /**
   * Sets a tile value.
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @param {number} value - Tile value
   */
  setTile(row, col, value) {
    if (this.isValidPosition(row, col)) {
      this.map[row][col] = value;
    }
  }
}