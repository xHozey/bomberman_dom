import { logger } from "../utils/logger.js";
import { NICKNAME_MAX_LENGTH } from "../config/constans.js";
import SOCKET_TYPES from "../config/protocols.js";

class SocketHandler {
  constructor() {
    this.connections = new Map();
  }

  handleConnection(socket, matchmaker) {
    logger.info(`New connection from ${socket._socket.remoteAddress}`);

    this.connections.set(socket, {
      ip: socket._socket.remoteAddress,
      status: "pending",
      room: null,
    });

    socket.send(
      JSON.stringify({
        type: "authentification",
      })
    );

    socket.on("message", (rawData) => {
      this.handleMessage(socket, rawData, matchmaker);
    });

    socket.on("error", (err) => {
      logger.error(err.message);
    });

    socket.on("close", () => {
      this.handleDisconnection(socket, matchmaker);
    });
  }

  handleMessage(socket, rawData, matchmaker) {
    try {
      const data = JSON.parse(rawData);
      const connection = this.connections.get(socket);

      if (data.type === SOCKET_TYPES.Auth && connection.status === "pending") {
        this.handleAuthentification(socket, data, matchmaker);
        return;
      }

      if (connection.status === "connected" && connection.room) {
        if (data.type === SOCKET_TYPES.PlayerAction) {
          connection.room.handlePlayerAction(socket.id, data.payload);
        } else if (data.type === SOCKET_TYPES.ChatMessage) {
          connection.room.chat.handleMessage(socket.id, data.payload);
        }
      }
    } catch (err) {
      logger.error(`Error handling message: ${err.message}`);
      socket.send(
        JSON.stringify({
          type: SOCKET_TYPES.Error,
          error: "invalid data",
        })
      );
    }
  }

  handleAuthentification(socket, data, matchmaker) {
    if (
      data.nickname?.trim() &&
      data.nickname.length < NICKNAME_MAX_LENGTH &&
      !this.isNicknameTaken(data.nickname)
    ) {
      const connection = this.connections.get(socket);
      connection.nickname = data.nickname;
      connection.status = "connected";

      logger.info(`Welcome ${data.nickname}`);
      const room = matchmaker.addPlayer(socket, data.nickname);
      connection.room = room;
      return;
    }

    socket.send(
      JSON.stringify({
        type: SOCKET_TYPES.Error,
        error: "invalid username",
      })
    );
  }

  isNicknameTaken(nickname) {
    for (const connection of this.connections.values()) {
      if (connection.nickname === nickname) {
        return true;
      }
    }
    return false;
  }

  handleDisconnection(socket, matchmaker) {
    const connection = this.connections.get(socket);
    logger.info(`${socket._socket.remoteAddress} has disconnected`);

    if (connection?.status === "connected") {
      matchmaker.removePlayer(socket.id);
    }

    this.connections.delete(socket);
  }
}

export default SocketHandler;
