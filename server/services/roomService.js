import Room from "../models/room.js";
import { GAME_CONFIG } from "../config/gameConfig.js";
import { UUID } from "../utils/helpers.js";
import { SOCKET_TYPES } from "../../client/src/utils.js";

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

  scheduleGameWaiting(room, gameService) {
    if (room.players.size >= 2 && room.players.size <= 3 && !room.started) {
      if (
        !this.roomTimeouts.has(`${room.id}_waiting
        `)
      ) {
        const timeout = setTimeout(() => {
          this.scheduleGameStart(room, gameService);
        }, GAME_CONFIG.WAITING_TIMEOUT);
        this.roomTimeouts.set(
          `${room.id}_waiting
            `,
          timeout
        );
        if (!room.countInterval[1]) {
          room.WaitCount = GAME_CONFIG.WAITING_TIMEOUT / 1000;
          room.countInterval[1] = setInterval(() => {
            room.broadcast({
              type: SOCKET_TYPES.PLAYER_UPDATE,
              playerCount: room.players.size,
              wait: room.WaitCount,
            });
            room.WaitCount--;
            if (room.WaitCount <= 0) {
              clearInterval(room.countInterval[1]);
              room.countInterval[1] = null;
            }
          }, 1000);
        }
      }
    } else if (room.players.size == GAME_CONFIG.MAX_PLAYERS && !room.started) {
      if (
        this.roomTimeouts.has(`${room.id}_waiting
        `)
      ) {
        clearTimeout(
          this.roomTimeouts.get(`${room.id}_waiting
        `)
        );
        this.roomTimeouts.delete(`${room.id}_waiting
        `);
      }
      clearInterval(room.countInterval);
      room.countInterval = null;
      this.scheduleGameStart(room, gameService);
    }
  }

  scheduleGameStart(room, gameService) {
    if (!this.roomTimeouts.has(`start${room.id}_starting`)) {
      const timeout = setTimeout(() => {
        gameService.startGame(room);
        this.roomTimeouts.delete(`${room.id}_starting`);
      }, GAME_CONFIG.START_TIMEOUT);
      this.roomTimeouts.set(`${room.id}_starting`, timeout);
      if (!room.countInterval[0]) {
        room.StartCount = GAME_CONFIG.START_TIMEOUT / 1000;
        room.countInterval[0] = setInterval(() => {
          room.broadcast({
            type: SOCKET_TYPES.PLAYER_UPDATE,
            playerCount: room.players.size,
            start: room.StartCount,
          });
          room.StartCount--;
          if (room.StartCount <= 0) {
            clearInterval(room.countInterval[0]);
            room.countInterval[0] = null;
          }
        }, 1000);
      }
    }
  }
}
