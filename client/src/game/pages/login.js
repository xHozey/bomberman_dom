import { Div, Input, Button, H1 } from "../../../core/components.js";
// import "./login.css";

class Login {
  constructor(ws) {
    this.ws = ws;
    this.nickname = "";
  }

  render() {
    return Div({}, [
      H1({className: "title"}, "BOMBER MAN"),
      Input({
        className: "nickname",
        placeholder: "enter your name",
        value: this.nickname,
        onInput: (e) => {
          this.nickname = e.target.value;
        },
      }),
      Button(
        {
          className: "play",
          onClick: () => {
            this.ws.send({
              type: "authentification",
              nickname: this.nickname,
            });
            this.nickname = "";
          },
        },
        "Play"
      ),
    ]);
  }
}

export default Login;
