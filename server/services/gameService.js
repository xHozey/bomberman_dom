import GameMap from "../models/gameMap.js";
import { SOCKET_TYPES } from "../../client/src/utils.js";
import { logger } from "../utils/logger.js";
import GameLoop from "./gameloop.js";
export default class GameService {
  constructor() {
    this.activeGameLoops = new Map();
  }

  startGame(room) {
    if (room.started) {
      logger.info(`Room ${room.id} already started`);
      return;
    }

    room.started = true;
    logger.info(`Game started at room ${room.id}`);

    const gameMap = new GameMap();
    const playersArray = Array.from(room.players.values());
    gameMap.initializePlayers(playersArray);
    room.setMapData(gameMap.map, gameMap.tileSize);
    const playerData = playersArray.map((player) => player.getNetworkData());
    for (const player of playersArray) {
      player.conn.send(
        JSON.stringify({
          type: SOCKET_TYPES.GAME_START,
          lives: player.lives,
          players: playerData,
          nickname: player.nickname,
          map: gameMap.map,
        })
      );
    }
    const gameloop = new GameLoop(room);
    gameloop.start();
    this.activeGameLoops.set(room.id, gameloop);
  }
  stopGame(room) {
    if (this.activeGameLoops.has(room.id)) {
      const gameLoop = this.activeGameLoops.get(room.id);
      gameLoop.stop();
      this.activeGameLoops.delete(room.id);
    }
    room.started = false;
  }
}
