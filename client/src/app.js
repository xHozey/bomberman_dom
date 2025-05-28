import { Component, render, useState } from "../mostJS/index.js";
import GameLobby from "./components/game_lobby.js";
import GameMenu from "./components/game_menu.js";
import GameStart from "./components/game_start.js";
import GameEnd from "./components/game_end.js";
import { SOCKET_TYPES } from "./utils.js";

const ws = new WebSocket("ws://localhost:8080");

const App = () => {
  const [screen, setScreen] = useState("game_menu");
  const [socket_data, setData] = useState(null);
  
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log(data.type);
    switch (data.type) {
      // case SOCKET_TYPES.PLAYER_UPDATE:
      //   setScreen("game_lobby");
      //   setData(data);
      //   break;
      case SOCKET_TYPES.GAME_START:
        setScreen("game_start");
        setData(data);
        break;
      case SOCKET_TYPES.WINNER:
        setScreen("game_end");
        setData(data);
        break;
    }
  };

  switch (screen) {
    case "game_menu":
      return Component(GameMenu, { socket: ws }, "game_menu");
    case "game_lobby":
      return Component(GameLobby, { data: socket_data }, "game_lobby");
    case "game_start":
      return Component(GameStart, { data: socket_data, ws }, "game_start");
    case "game_end":
      return Component(GameEnd, { data: socket_data }, "game_end");
  }
};

render("app", App, {});
