import GameMap from '../models/gameMap.js';
import { safeStringify } from '../utils/helpers.js';

export default class GameService {
  constructor(roomService) {
    this.roomService = roomService;
  }

  startGame(room) {
    if (room.started) {
      console.log(`Room ${room.id} already started`);
      return;
    }

    room.started = true;
    console.log(`Starting game in room ${room.id}`);

    const gameMap = new GameMap();
    const playersArray = Array.from(room.players.values());

    gameMap.initializePlayers(playersArray);
    room.setMapData(gameMap.map, gameMap.tileSize);

    for (const player of playersArray) {
      player.conn.send(safeStringify({
        type: 'startGame',
        nickname: player.nickname,
        lives: player.lives,
        players: playersArray,
        MyId: player.id,
        map: gameMap.map,
      }));
    }
  }
}