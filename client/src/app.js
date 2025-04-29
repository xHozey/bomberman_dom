import Socket from "./game/core/socket.js";
import Login from "./game/pages/login.js";
import { jsx } from "../core/dom.js";
import { useState } from "../core/state.js";
import SOCKET_TYPES from "./utils/protocols.js";
import Lobby from "./game/pages/lobby.js";
const socket = new Socket("ws://localhost:8080");
socket.connect();

const App = () => {
  console.log("shit")
  const [comp, setComp] = useState(jsx("h1", {}, "loading"));
  socket.on(SOCKET_TYPES.Auth, () => {
    const login = new Login(socket);
    setComp(login.render());
  });
  socket.on(SOCKET_TYPES.Lobby, (data) => {
    console.log(data);
    const lobby = new Lobby(data.players, data.timer);
    setComp(lobby.render());
  });

  return comp;
};

export default App;
