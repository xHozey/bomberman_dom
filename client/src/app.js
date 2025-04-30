import Network from "./core/network.js";
import Menu from "./views/menuViews.js";
import SOCKET_TYPES from "../utils/protocols.js";
const root = document.getElementById("root");

const ws = new Network("ws://localhost:8080");
ws.connect();

ws.on(SOCKET_TYPES.Auth, () => {
  root.append(new Menu(ws).render());
});
