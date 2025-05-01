import { WebSocketServer } from "ws";
import Player from "../models/player.js";

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
        } catch (err) {
          console.error("Invalid message:", err);
          return;
        }

        switch (data.type) {
          case "newPlayer":
            const id = Date.now() + Math.floor(Math.random() * 1000);
            currentPlayer = new Player(data.nickname, id, ws);
            currentRoom = this.roomService.findAvailableRoom();
            currentRoom.addPlayer(currentPlayer);

            currentRoom.broadcast({
              type: "updatePlayers",
              playerCount: currentRoom.players.size,
            });

            console.log(
              `Player ${data.nickname} joined Room ${currentRoom.id}`
            );
            this.roomService.scheduleGameStart(currentRoom, this.gameService);
            break;

          case "playerMove":
            if (currentPlayer) currentPlayer.updateMove(data, currentRoom);
            break;

          case "placeBomb":
            if (currentPlayer) currentPlayer.placeBomb(currentRoom);
            break;

          case "HitByExplosion":
            if (currentPlayer)
              currentPlayer.isPlayerHitByExplosion(data, currentRoom);
            break;

          case "chatMsg":
            if (currentRoom) {
              currentRoom.broadcast({
                type: "chatMsg",
                nickname: currentPlayer.nickname,
                messageText: data.messageText || "",
              });
            }
            break;

          default:
            console.log("Unknown message type:", data.type);
            break;
        }
      });

      ws.on("close", () => {
        if (currentRoom && currentPlayer) {
          currentRoom.removePlayer(currentPlayer.id);
          currentRoom.broadcast({
            type: "updatePlayers",
            playerCount: currentRoom.players.size,
          });
        }
      });
    });
  }
}
