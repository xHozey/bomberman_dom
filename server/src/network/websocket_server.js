import WebSocket from "ws";
import { logger } from "../utils/logger.js";
import { SOCKET_TYPES, NICKNAME_MAX_LENGTH } from "../config/constans.js";
export class WebSocketServer {
  constructor(port) {
    this.server = new WebSocket.Server(port);
    this.connections = new Map();
    this.pendingConnections = new Map();
  }

  EventsHandler() {
    this.server.on("connection", function (socket) {
      logger.info(`New connection from ${socket._socket.remoteAddress}`);

      this.pendingConnections.set(socket, {
        ip: socket._socket.remoteAddress,
      });

      socket.on("message", (rawData) => {
        this.handleMessage(socket, rawData);
      });

      socket.on("error", (err) => {
        logger.error(err.message);
      });

      socket.on("close", () => {
        this.handleDisconnection(socket);
      });
    });
  }

  handleMessage(socket, rawData) {
    try {
      const data = JSON.parse(rawData);
      switch (data.type) {
        case SOCKET_TYPES.auth:
          this.handleAuthentification(socket, data);
          break;
        case SOCKET_TYPES:
          break;
        case SOCKET_TYPES:
          break;
      }
    } catch (err) {
      logger.error(err.message);
      socket.send(
        JSON.stringify({
          type: SOCKET_TYPES.error,
          error: "invalid data",
        })
      );
    }
  }

  handleAuthentification(socket, data) {
    if (
      this.pendingConnections.get(socket) &&
      !this.connections.get(data.nickname) &&
      data.nickname.trim() &&
      data.nickname < NICKNAME_MAX_LENGTH
    ) {
      this.connections.set(socket, {
        nickname: data.nickname,
      });
    }
    socket.send(
      JSON.stringify({
        type: SOCKET_TYPES.error,
        error: "invalid username",
      })
    );
  }

  handleDisconnection(socket) {
    logger.info(`${socket._socket.remoteAddress} has disconnected`);
  }
}
