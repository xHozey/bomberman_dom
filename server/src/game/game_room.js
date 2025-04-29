import Player from "./entities/player.js";
import Bomb from "./entities/bomb.js";
import MapGenerator from "./maps/map_generator.js";
import GameLoop from "../game/engine/game_loop.js";
import SyncService from "../network/sync_service.js";
import { extractSpawn } from "../utils/helper.js";
import { UUID } from "../utils/helper.js";
import { logger } from "../utils/logger.js";
import { MAP } from "../config/constans.js";

class GameRoom {
  constructor(level) {
    this.state = "pending";
    this.roomId = UUID();
    this.map = new MapGenerator(level).generateMap();
    this.playerSpawn = extractSpawn(this.map);
    this.players = [];
    this.sync = new SyncService(this);
    this.gameloop = new GameLoop(this);
  }

  addPlayer(socket, nickname) {
    const playerCount = this.players.length + 1;
    const spawn = this.playerSpawn[`p${playerCount}`];
    logger.debug(this.playerSpawn);

    const player = new Player(socket, nickname, spawn.x, spawn.y);
    this.players.push(player);
    ///reminder
    player.roomId = this.roomId;
    socket.send(JSON.stringify({ type: "map", map: this.map }));
    socket.on("message", (rawData) => {
      try {
        const data = JSON.parse(rawData);
        if (data.type === "player_action") {
          this.handlePlayerAction(socket.id, payload);
        }
      } catch (err) {
        logger.error(`Invalid action from ${nickname}: ${err.message}`);
      }
    });
    if (player.length > 1) {
      this.state = "start";
      this.gameloop.start();
    }
  }

  removePlayer(socketId) {
    const index = this.players.findIndex((p) => p.socket.id === socketId);
    if (index !== -1) {
      this.players.splice(index, 1);
      if (this.players.length === 0) {
        this.gameloop.stop();
        logger.info(`Room ${this.roomId} has been deleted.`);
      }
    }
  }

  handlePlayerAction(socketId, payload) {
    this.players.forEach((p) => {
      if (socketId == p.socket.id) {
        switch (payload.action) {
          case "movement":
            p.setMovement(payload.direction, payload.isMoving);
            break;
          case "attack":
            if (!p.canPlaceBomb()) return;
            new Bomb(p.x, p.y, p.flameRang, this.map).dropBomb();
          default:
            break;
        }
      }
    });
  }

  checkExplosions() {
    this.players.forEach((player) => {
      const cellX = Math.round(player.x);
      const cellY = Math.round(player.y);
      if (this.map[cellX][cellY] === MAP.explosion) {
        player.death();
      }
    });
  }

  update() {
    this.checkExplosions();
  }
}

export default GameRoom;
