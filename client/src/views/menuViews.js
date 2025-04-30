class Menu {
    constructor(ws) {
      this.ws = ws;
      this.nickname = "";
    }
  
    render() {
      const template = `
        <div>
          <h1>BOMBER MAN</h1>
          <input id="nicknameInput" type="text">
          <button id="playButton">Play</button>
        </div>
      `;
      
      const div = document.createElement('div');
      div.innerHTML = template;
      
      const input = div.querySelector('#nicknameInput');
      const btn = div.querySelector('#playButton');
      
      input.addEventListener('input', (e) => {
        this.nickname = e.target.value;
      });
      
      btn.onclick = () => {
        this.handleSubmition();
      };
      
      return div;
    }
  
    handleSubmition() {
      this.ws.send({
        type: "authentification",
        nickname: this.nickname,
      });
    }
  }
  
  export default Menu;