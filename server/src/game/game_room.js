import Player from "./entities/player.js";
import Bomb from "./entities/bomb.js";
import MapGenerator from "./maps/map_generator.js";
import GameLoop from "../game/engine/game_loop.js";
import SyncService from "../network/sync_service.js";
import { extractSpawn } from "../utils/helper.js";
import { UUID } from "../utils/helper.js";
import { logger } from "../utils/logger.js";
import { MAP } from "../config/constans.js";
import SOCKET_TYPES from "../config/protocols.js";
class GameRoom {
  constructor(level) {
    this.state = "pending";
    this.startTimer = 20;
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

    const player = new Player(
      `p${playerCount}`,
      socket,
      nickname,
      spawn.x,
      spawn.y
    );
    this.players.push(player);
    player.roomId = this.roomId;
    socket.on("message", (rawData) => {
      try {
        const data = JSON.parse(rawData);
        if (data.type === SOCKET_TYPES.PlayerAction) {
          this.handlePlayerAction(socket.id, payload);
        }
      } catch (err) {
        logger.error(`Invalid action from ${nickname}: ${err.message}`);
      }
    });
    if (this.players.length > 1) {
      const intid = setInterval(() => {
        this.startTimer--;
        if (this.startTimer === 0) {
          this.state = "start";
          this.broadCastRoom({
            type: SOCKET_TYPES.GameStart,
            map: this.map,
            players: this.players.map((player) => {
              return {
                id: player.id,
                nickname: player.nickname,
                spawnX: player.spawnX,
                spawnY: player.spawnY,
              };
            }),
          });
          clearInterval(intid);
        }
        this.gameloop.start();
      }, 1000);
    }
    this.broadCastRoom({
      type: SOCKET_TYPES.Lobby,
      players: this.players.length,
      timer: this.startTimer,
    });
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

  broadCastRoom(data) {
    this.players.forEach((player) => {
      player.socket.send(
        JSON.stringify({
          data,
        })
      );
    });
  }

  update() {
    this.checkExplosions();
  }
}

export default GameRoom;
