import { Button, Div, Input, P, useState } from "../../mostJS/index.js";
import { SOCKET_TYPES } from "../utils.js";

const GameStart = ({ socket }) => {
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
          socket.send(
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

export default GameStart;
