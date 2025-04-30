import { WebSocketServer as WSServer } from "ws";
import { logger } from "../utils/logger.js";
import MatchMaker from "./match_maker.js";
import SocketHandler from "./socket_handler.js";

class WebSocketServer {
  constructor(port) {
    this.server = new WSServer({ port });
    this.matchmaker = new MatchMaker();
    this.socketHandler = new SocketHandler();
  }

  SetupEventsHandler() {
    this.server.on("connection", (socket) => {
      socket.id = crypto.randomUUID?.();
      this.socketHandler.handleConnection(socket, this.matchmaker);
    });

    logger.info(`WebSocket server started on port ${this.server.options.port}`);
  }
}

export default WebSocketServer;
