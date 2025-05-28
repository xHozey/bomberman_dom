import { useState, Create, Div, Li, Span, Input, Button } from "../../mostJS/index.js";
import { SOCKET_TYPES } from "../utils.js";

const Chat = ({ ws, messages }) => {
  const [msg, setMsg] = useState("");

  return Div({}, [
    messages.map((message) =>
      Div({}, [Span({}, message.nickname), Span({}, message.message)])
    ),
    Input({
      oninput: (e) => {
        setMsg(e.target.value);
      },
    }),
    Button({onclick: () => {
        ws.send(JSON.stringify({
            type: SOCKET_TYPES.PLAYER_CHAT,
            
        }))
    }}, "send")
  ]);
};
