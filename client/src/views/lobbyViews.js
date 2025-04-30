class Lobby {
    constructor(ws) {
      this.ws = ws;
      this.players = 1; 
      this.time = null; 
    }
  
    render() {
      const template = `
        <div class="lobby">
          <h1 class="lobbyTitle">Lobby ${this.players}/4</h1>
          ${
            this.players > 1 && this.time !== null
              ? `<div class="timer">Game starts in: ${this.time}s</div>`
              : `<div class="waiting">Waiting for more players...</div>`
          }
        </div>
      `;
  
      const div = document.createElement('div');
      div.innerHTML = template;
  
      return div;
    }
  }
  
  export default Lobby;
  