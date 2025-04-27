import Player from "../game/entities/player.js";
import MapGenerator from "../game/maps/map_generator.js";
import { TOTAL_LEVELS } from "../config/constans.js";
import { UUID, extractSpawn } from "../utils/helper.js";

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
    const pn = room.players.length + 1;
    const spawn = room.playerSpawn[`p${pn}`];
    const player = new Player(socket, nickname, spawn.x, spawn.y);
    room.players.push(player);
    player.roomId = roomId;
  }

  createNewRoom() {
    const level = Math.floor(Math.random() * TOTAL_LEVELS);
    const genMap = new MapGenerator(level);
    const map = genMap.generateMap();
    const playerSpawn = extractSpawn(map);
    const roomId = UUID();

    this.rooms.set(roomId, {
      map,
      playerSpawn,
      players: [],
    });

    return roomId;
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
      const index = room.players.findIndex((p) => p.socket.id === socketId);
      if (index !== -1) {
        room.players.splice(index, 1);

        if (room.players.length === 0) {
          this.rooms.delete(roomId);
        }
        break;
      }
    }
  }
}

export default MatchMaker;
