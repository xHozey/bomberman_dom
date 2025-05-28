import { Button, Div, Input, P, render, useState } from "../mostJS/index.js";
import { SOCKET_TYPES } from "./utils.js";
import SocketServer from "./websocket.js";

const ws = new SocketServer("ws://localhost:8080");

const App = () => {
  const [name, setName] = useState("");
  
  return Div({}, [
    P({}, "Enter your name"),
    Input({
      oninput: (e) => {
        setName(e.target.value);
      },
    }),
    Button(
      {
        onClick: () => {
          ws.socket(
            JSON.stringify({
              type: SOCKET_TYPES.PLAYER_JOIN,
              nickname: name,
            })
          );
        },
      },
      ["Start"]
    ),
  ]);
};

render("app", App, {});
