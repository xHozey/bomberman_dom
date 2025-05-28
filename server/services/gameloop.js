class GameLoop {
  constructor(room) {
    this.room = room;
    this.id = null;
  }

  start() {
    this.id = setInterval(() => {
      this.room.players.forEach((player) => {
        player.updateMove(1 / 30, this.room);
      });
    }, 1000 / 30);
  }

  stop() {
    clearInterval(this.id);
  }
}

export default GameLoop;
