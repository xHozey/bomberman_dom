import Player from "./entities/player.js";
import Bomb from "./entities/bomb.js";
import MapGenerator from "./maps/map_generator.js";
import GameLoop from "../game/engine/game_loop.js";
import SyncService from "../network/sync_service.js";
import { extractSpawn } from "../utils/helper.js";
import { UUID } from "../utils/helper.js";
import { logger } from "../utils/logger.js";
import { MAP, ROOM_STATUS } from "../config/constans.js";
import SOCKET_TYPES from "../config/protocols.js";

class GameRoom {
  constructor(level) {
    this.state = ROOM_STATUS.pending;
    this.roomId = UUID();
    this.level = level;

    this.players = [];
    this.minPlayers = 2;
    this.maxPlayers = 4;

    this.waitingTimer = null;
    this.countdownTimer = null;

    this.map = new MapGenerator(level).generateMap();
    this.playerSpawn = extractSpawn(this.map);
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
          this.handlePlayerAction(socket.id, data.payload);
        }
      } catch (err) {
        logger.error(`Invalid action from ${nickname}: ${err.message}`);
      }
    });

    this._updateLobbyState();
    this._broadcastLobbyUpdate();

    return player;
  }

  removePlayer(socketId) {
    const index = this.players.findIndex((p) => p.socket.id === socketId);
    if (index !== -1) {
      const player = this.players[index];
      logger.info(`Player ${player.nickname} left room ${this.roomId}`);
      this.players.splice(index, 1);

      if (
        this.state === ROOM_STATUS.waiting ||
        this.state === ROOM_STATUS.starting
      ) {
        this._updateLobbyState();
        this._broadcastLobbyUpdate();
      }

      if (this.players.length === 0) {
        this._cleanUp();
        logger.info(`Room ${this.roomId} has been deleted.`);
      } else if (this.state === ROOM_STATUS.ingame) {
        if (this.players.filter((p) => !p.isDead).length <= 1) {
          this._endGame();
        }
      }
    }
  }

  _updateLobbyState() {
    clearTimeout(this.waitingTimer);
    clearInterval(this.countdownTimer);

    if (this.players.length >= this.minPlayers && this.state === ROOM_STATUS.pending) {
      this.state = ROOM_STATUS.waiting;
      this.waitingTimer = setTimeout(() => this._startGameCountdown(), 20000);
      this._broadcastLobbyUpdate(true);
    } else if (this.players.length < this.minPlayers && this.state === ROOM_STATUS.waiting) {
      this.state = ROOM_STATUS.pending;
      this._broadcastLobbyUpdate(true); 
    }
  }

  _startGameCountdown() {
    this.state = ROOM_STATUS.starting;
    this._broadcastLobbyUpdate(true); 

    this.countdownTimer = setTimeout(() => {
      this._startGame();
    }, 10000);
  }

  _startGame() {
    this.state = ROOM_STATUS.ingame;
    clearTimeout(this.waitingTimer);
    clearTimeout(this.countdownTimer);

    this.map = new MapGenerator(this.level).generateMap();
    this.playerSpawn = extractSpawn(this.map);

    this.players.forEach((player, index) => {
      const spawn = this.playerSpawn[`p${index + 1}`];
      player.x = spawn.x;
      player.y = spawn.y;
    });

    this.gameloop.start();

    this.broadCastRoom({
      type: SOCKET_TYPES.GameStart,
      map: this.map,
      players: this.players.map((player) => ({
        id: player.id,
        nickname: player.nickname,
        spawnX: player.x,
        spawnY: player.y,
        character: player.character,
      })),
    });
  }

  _endGame() {
    this.state = ROOM_STATUS.end;
    this.gameloop.stop();

    const winner = this.players.find((p) => !p.isDead);

    this.broadCastRoom({
      type: SOCKET_TYPES.GameEnd,
      winner,
    });

    setTimeout(() => this._cleanUp(), 10000);
  }

  _cleanUp() {
    clearTimeout(this.waitingTimer);
    clearTimeout(this.countdownTimer);
    this.gameloop.stop();
    this.players = [];
  }

  closeRoom() {
    this.broadCastRoom({ type: SOCKET_TYPES.RoomClosed });
    this._cleanUp();
  }

  handlePlayerAction(socketId, payload) {
    const player = this.players.find((p) => p.socket.id === socketId);
    if (!player || player.isDead) return;

    switch (payload.action) {
      case "movement":
        player.setMovement(payload.direction, payload.isMoving);
        break;
      case "placeBomb":
        if (player.canPlaceBomb()) {
          new Bomb(
            player.x,
            player.y,
            player.flameRange,
            this.map,
            this
          ).dropBomb();
        }
        break;
      case "usePowerup":
        player.usePowerup(payload.powerupType);
        break;
      default:
        logger.warn(`Unknown action: ${payload.action}`);
    }
  }

  checkExplosions() {
    this.players.forEach((player) => {
      if (player.isDead) return;

      const cellX = Math.round(player.x);
      const cellY = Math.round(player.y);

      if (this.map[cellY] && this.map[cellY][cellX] === MAP.explosion) {
        player.takeDamage();
        if (player.isDead) {
          this._checkGameEnd();
        }
      }
    });
  }

  _checkGameEnd() {
    const alivePlayers = this.players.filter((p) => !p.isDead);
    if (alivePlayers.length <= 1) {
      this._endGame();
    }
  }

  _broadcastLobbyUpdate(isTimerUpdate = false) {
    this.broadCastRoom({
      type: SOCKET_TYPES.Lobby,
      players: this.players.map((p) => ({
        id: p.id,
        nickname: p.nickname,
      })),
      state: this.state,
      roomId: this.roomId,
      level: this.level,
      isTimerUpdate 
    });
  }

  broadCastRoom(data) {
    this.players.forEach((player) => {
      try {
        player.socket.send(JSON.stringify(data));
      } catch (err) {
        logger.error(`Error sending to ${player.nickname}: ${err.message}`);
      }
    });
  }

  update() {
    if (this.state === ROOM_STATUS.ingame) {
      this.checkExplosions();
      this.sync.update();
    }
  }
}

export default GameRoom;