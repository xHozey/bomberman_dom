import { Div, Input, Button, H1 } from "../../../core/components.js";

class Login {
  constructor(ws) {
    this.ws = ws;
    this.nickname = "";
  }

  render() {
    return Div({}, [
      H1({}, "BOMBER MAN"),
      Input({
        placeholder: "enter your name",
        value: this.nickname,
        onInput: (e) => {
          this.nickname = e.target.value;
        },
      }),
      Button(
        {
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
