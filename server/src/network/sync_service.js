class SyncService {
  constructor(gameRoom) {
    this.gameRoom = gameRoom;
    this.broadcastInterval = 100;
    this.lastBroadcast = null;
  }

  broadcast() {
    const now = Date.now();
    if (now - this.lastBroadcast < this.broadcastInterval) return;

    const state = {
      t: now,
      players: this._getPlayerStates(),
      bombs: this._getBombStates(),
    };

    this._sendToAll(state);
    this.lastBroadcast = now;
  }

  _getPlayerStates() {
    return Array.from(this.gameRoom.players.values()).map((p) => ({
      nickname: p.nickname,
      x: p.position.x,
      y: p.position.y,
    }));
  }

  _getBombStates() {
    return Array.from(this.gameRoom.bombs.values()).map((b) => ({
      x: b.position.x,
      y: b.position.y,
      t: b.timer,
    }));
  }

  _sendToAll(state) {
    const message = JSON.stringify({ type: "update", data: state });

    this.gameRoom.players.forEach((player) => {
      if (player.ws.readyState === player.ws.OPEN) {
        player.ws.send(message);
      }
    });
  }
}
