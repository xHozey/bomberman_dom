class Menu {
  constructor(ws) {
    this.ws = ws;
    this.nickname = "";
  }

  render() {
    const div = document.createElement("div");
    div.innerHTML += `<h1>BOMBER MAN</h1>`;
    const input = document.createElement("input");
    input.addEventListener("input", (e) => {
      this.nickname = e.target.value;
    });
    div.appendChild(input);
    const btn = document.createElement("button");
    btn.innerText = "Play";
    div.appendChild(btn);

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
