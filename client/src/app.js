import Network from "./core/network.js";
import Menu from "./views/menuViews.js";
import Lobby from "./views/lobbyViews.js";
import SOCKET_TYPES from "../utils/protocols.js";
const root = document.getElementById("root");

const ws = new Network("ws://localhost:8080");
ws.connect();

ws.on(SOCKET_TYPES.Auth, () => {
  root.innerHTML = "";
  root.append(new Menu(ws).render());
});

ws.on(SOCKET_TYPES.Lobby, () => {
  root.innerHTML = "";
  root.append(new Lobby(ws).render());
});

ws.on(SOCKET_TYPES.GameStart, (data) => {
  root.innerHTML = "";
  root.append;
});
