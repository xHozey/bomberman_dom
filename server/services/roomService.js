import Room from "../models/room.js";
import { GAME_CONFIG } from "../config/gameConfig.js";
import { UUID } from "../utils/helpers.js";
import { SOCKET_TYPES } from "../../client/js/protocols.js";
import { logger } from "../utils/logger.js";

export default class RoomService {
  constructor() {
    this.rooms = new Map();
    this.roomTimeouts = new Map();

  }

  findAvailableRoom() {
    for (const room of this.rooms.values()) {
      if (!room.started && room.players.size < GAME_CONFIG.MAX_PLAYERS) {
        return room;
      }
    }
    const room = new Room(UUID());
    this.rooms.set(room.id, room);
    return room;
  }

  scheduleGameStart(room, gameService) {
    if (room.players.size >= 2 && room.players.size <= 3 && !room.started) {
      if (!this.roomTimeouts.has(room.id)) {
        const timeout = setTimeout(() => {
          gameService.startGame(room);
          this.roomTimeouts.delete(room.id);
        }, GAME_CONFIG.START_TIMEOUT);
        this.roomTimeouts.set(room.id, timeout);
        if (!room.countInterval) {
          room.countP = 20;
          room.countInterval = setInterval(() => {
            room.broadcast({
              type: SOCKET_TYPES.PLAYER_UPDATE,
              playerCount: room.players.size,
              countP: room.countP,
            });
            room.countP--;
            if (room.countP <= 0) {
              clearInterval(room.countInterval);
              room.countInterval = null;
            }
          }, 1000);
        }
      }
    } else if (room.players.size === GAME_CONFIG.MAX_PLAYERS && !room.started) {
      if (this.roomTimeouts.has(room.id)) {
        clearTimeout(this.roomTimeouts.get(room.id));
        this.roomTimeouts.delete(room.id);
      }
      clearInterval(room.countInterval);
      room.countInterval = null;
      gameService.startGame(room);
    }
  }
}
