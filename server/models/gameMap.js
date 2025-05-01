import { GAME_CONFIG } from "../config/gameConfig.js";

export default class GameMap {
  constructor() {
    this.map = JSON.parse(JSON.stringify(GAME_CONFIG.MAP));
    this.tileSize = GAME_CONFIG.TILE_SIZE;
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
}
