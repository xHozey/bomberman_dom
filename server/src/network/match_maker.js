import GameRoom from "../game/game_room.js";
import { TOTAL_LEVELS } from "../config/constans.js";
import { logger } from "../utils/logger.js";

class MatchMaker {
  constructor() {
    this.rooms = new Map();
  }

  addPlayer(socket, nickname) {
    let roomId = this._findAvailableRoom();

    if (!roomId) {
      roomId = this._createNewRoom();
    }

    const room = this.rooms.get(roomId);
    room.addPlayer(socket, nickname);
  }

  _createNewRoom() {
    const level = Math.floor(Math.random() * TOTAL_LEVELS);
    const newRoom = new GameRoom(level);

    this.rooms.set(newRoom.roomId, newRoom);
    return newRoom.roomId;
  }

  _findAvailableRoom() {
    for (const [roomId, room] of this.rooms) {
      if (room.players.length < 4) {
        return roomId;
      }
    }
    return null;
  }

  removePlayer(socketId) {
    for (const [roomId, room] of this.rooms) {
      room.removePlayer(socketId);
      if (room.players.length === 0) {
        this.rooms.delete(roomId);
      }
      break;
    }
  }
}

export default MatchMaker;
