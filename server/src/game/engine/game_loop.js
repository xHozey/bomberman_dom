class GameLoop {
  constructor(room) {
    this.room = room;
    this.isRunning = false;
    this.intervalId = null;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000 / 30);
  }

  update() {
    this.room.update()
    this.room.players.forEach(player => {
      player.updateMovement()
    });
    this.room.sync.broadcast()
  }

  stop() {
    if (this.intervalId) {
      this.isRunning = false;
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default GameLoop