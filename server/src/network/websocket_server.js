import { WebSocketServer as WSServer } from "ws";
import { logger } from "../utils/logger.js";
import { NICKNAME_MAX_LENGTH } from "../config/constans.js";
import SOCKET_TYPES from "../config/protocols.js";
import MatchMaker from "./match_maker.js";
class WebSocketServer {
  constructor(port) {
    this.server = new WSServer({ port });
    this.connections = new Map();
    this.matchmaker = new MatchMaker();
  }

  SetupEventsHandler() {
    this.server.on("connection", (socket) => {
      logger.info(`New connection from ${socket._socket.remoteAddress}`);
      this.connections.set(socket, {
        ip: socket._socket.remoteAddress,
        status: "pending",
      });
      socket.send(
        JSON.stringify({
          type: "authentification",
        })
      );
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
        case SOCKET_TYPES.Auth:
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
          type: SOCKET_TYPES.Error,
          error: "invalid data",
        })
      );
    }
  }

  handleAuthentification(socket, data) {
    if (
      this.connections.get(socket).status == "pending" &&
      !this.connections.get(data.nickname) &&
      data.nickname.trim() &&
      data.nickname.length < NICKNAME_MAX_LENGTH
    ) {
      this.connections.set(socket, {
        nickname: data.nickname,
        status: "connected",
      });
      logger.info(`Welcome ${data.nickname}`);
      this.matchmaker.addPlayer(socket, data.nickname);
      return;
    }
    socket.send(
      JSON.stringify({
        type: SOCKET_TYPES.Error,
        error: "invalid username",
      })
    );
  }

  handleDisconnection(socket) {
    logger.info(`${socket._socket.remoteAddress} has disconnected`);
  }
}

export default WebSocketServer;
