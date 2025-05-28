import { Button, Div, Input, P, useState } from "../../mostJS/index.js";

const GameStart = () => {
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

export default GameStart;
