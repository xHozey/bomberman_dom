import { WebSocketServer } from "ws";
import Player from "../models/player.js";
import { SOCKET_TYPES } from "../../client/src/utils.js";
import { logger } from "../utils/logger.js";

export default class WebSocketService {
  constructor(server, roomService, gameService) {
    this.wss = new WebSocketServer({ server });
    this.roomService = roomService;
    this.gameService = gameService;
  }

  initialize() {
    this.wss.on("connection", (ws) => {
      let currentPlayer;
      let currentRoom;
      ws.on("message", (message) => {
        let data;
        try {
          data = JSON.parse(message);

          switch (data.type) {
            case SOCKET_TYPES.PLAYER_JOIN:
              currentRoom = this.roomService.findAvailableRoom();
              currentPlayer = new Player(data.nickname, ws, currentRoom);

              if (currentRoom.players.get(data.nickname)) {
                return;
              }
              currentRoom.addPlayer(currentPlayer);

              currentRoom.broadcast({
                type: SOCKET_TYPES.PLAYER_UPDATE,
                playerCount: currentRoom.players.size,
              });

              logger.info(
                `Player ${data.nickname} joined Room ${currentRoom.id}`
              );
              this.roomService.scheduleGameWaiting(currentRoom, this.gameService);
              break;

            case SOCKET_TYPES.PLAYER_START_MOVE:
              if (currentPlayer) {
                currentPlayer.startMove(data.direction);
              }
              break;
            case SOCKET_TYPES.PLAYER_STOP_MOVE:
              if (currentPlayer) {
                currentPlayer.stopMove(data.direction);
              }
              break;
            case SOCKET_TYPES.PLAYER_PLACE_BOMB:
              if (currentPlayer) currentPlayer.placeBomb(currentRoom);
              break;
            case SOCKET_TYPES.PLAYER_CHAT:
              if (currentRoom) {
                currentRoom.broadcast({
                  type: SOCKET_TYPES.PLAYER_CHAT,
                  nickname: currentPlayer.nickname,
                  messageText: data.messageText || "",
                });
              }
              break;

            default:
              logger.warn("Unknown message type:", data.type);
              break;
          }
        } catch (err) {
          console.error("Invalid message:", err);
          return;
        }
      });

      ws.on("close", () => {
        if (currentRoom && currentPlayer) {
          currentRoom.removePlayer(currentPlayer.nickname, this.gameService);
          currentRoom.broadcast({
            type: SOCKET_TYPES.PLAYER_UPDATE,
            playerCount: currentRoom.players.size,
          });
        }
      });
    });
  }
}
