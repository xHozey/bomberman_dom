class SyncService {
  constructor(gameRoom) {
    this.gameRoom = gameRoom;
    this.broadcastInterval = 100;
    this.lastBroadcast = 0;
  }

  broadcast() {
    const now = Date.now();
    if (now - this.lastBroadcast < this.broadcastInterval) return;

    const state = {
      t: now,
      map: this.gameRoom.map,
      players: this._getPlayerStates(),
    };

    this._sendToAll(state);
    this.lastBroadcast = now;
  }

  _getPlayerStates() {
    return Array.from(this.gameRoom.players.values()).map((p) => ({
      nickname: p.nickname,
      isAlive: p.isAlive,
      isDead: p.isDead,
      x: p.x,
      y: p.y,
    }));
  }

  _sendToAll(state) {
    const message = JSON.stringify({ type: "update", data: state });
    this.gameRoom.players.forEach((player) => {
      if (player.socket.readyState === player.socket.OPEN) {
        player.socket.send(message);
      }
    });
  }
}

export default SyncService;
