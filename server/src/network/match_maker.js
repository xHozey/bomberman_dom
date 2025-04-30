import GameRoom from "../game/game_room.js";
import { TOTAL_LEVELS, ROOM_STATUS } from "../config/constans.js";
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

    logger.info(`Added player ${nickname} to room ${roomId}`);

    return room;
  }

  _createNewRoom() {
    const level = Math.floor(Math.random() * TOTAL_LEVELS);
    const newRoom = new GameRoom(level);

    this.rooms.set(newRoom.roomId, newRoom);
    logger.info(`Created new room with ID ${newRoom.roomId}`);
    return newRoom.roomId;
  }

  _findAvailableRoom() {
    for (const [roomId, room] of this.rooms) {
      if (
        (room.state === ROOM_STATUS.pending ||
          room.state === ROOM_STATUS.waiting) &&
        room.players.length < room.maxPlayers
      ) {
        return roomId;
      }
    }
    return null;
  }

  removePlayer(socketId) {
    for (const [roomId, room] of this.rooms) {
      const playerIndex = room.players.findIndex(
        (p) => p.socket.id === socketId
      );
      if (playerIndex !== -1) {
        room.removePlayer(socketId);
        logger.info(
          `Removed player with socket ID ${socketId} from room ${roomId}`
        );

        if (room.players.length === 0) {
          this.rooms.delete(roomId);
          logger.info(`Deleted empty room ${roomId}`);
        }
        break;
      }
    }
  }
}

export default MatchMaker;
