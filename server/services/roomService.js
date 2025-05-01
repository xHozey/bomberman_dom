import Room from '../models/room.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export default class RoomService {
  constructor() {
    this.rooms = new Map();
    this.roomTimeouts = new Map();
    this.nextRoomId = 1;
  }

  findAvailableRoom() {
    for (const room of this.rooms.values()) {
      if (!room.started && room.players.size < GAME_CONFIG.MAX_PLAYERS) {
        return room;
      }
    }
    const room = new Room(this.nextRoomId++);
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

        // Start countdown
        if (!room.countInterval) {
          room.countP = 0;
          room.countInterval = setInterval(() => {
            room.countP++;
            room.broadcast({
              type: 'updatePlayers',
              playerCount: room.players.size,
              countP: room.countP,
            });
            if (room.countP >= 20) {
              clearInterval(room.countInterval);
              room.countInterval = null;
            }
          }, GAME_CONFIG.UPDATE_INTERVAL);
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