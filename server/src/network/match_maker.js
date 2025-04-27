import GameRoom from "../game/game_room.js";
import { TOTAL_LEVELS } from "../config/constans.js";

class MatchMaker {
  constructor() {
    this.rooms = new Map();
  }

  addPlayer(socket, nickname) {
    let roomId = this.findAvailableRoom();

    if (!roomId) {
      roomId = this.createNewRoom();
    }

    const room = this.rooms.get(roomId);
    room.addPlayer(socket, nickname);
  }

  createNewRoom() {
    const level = Math.floor(Math.random() * TOTAL_LEVELS);
    const newRoom = new GameRoom(level);
    this.rooms.set(newRoom.roomId, newRoom);
    return newRoom.roomId;
  }

  findAvailableRoom() {
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
