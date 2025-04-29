import Socket from "./game/core/socket.js";
import { H1, Input, Button, Div } from "../core/components.js";
import { useState } from "../core/state.js";

export const Home = () => {
  const [nickname, setNickname] = useState("");
  const ws = new Socket("ws://localhost:8080");
  ws.connect();
  ws.onopen = () => {
    ws.onmessage = (e) => {
      console.log(e);
    };
  };
  return Div({}, [
    H1({}, "BOMBER MAN"),
    Input({
      placeholder: "enter your name",
      value: nickname,
      onInput: (e) => {
        setNickname(e.target.value);
      },
    }),
    Button(
      {
        onClick: () => {
          ws.send({
            type: "authentification",
            nickname,
          });
          setNickname("");
        },
      },
      "submit"
    ),
  ]);
};
