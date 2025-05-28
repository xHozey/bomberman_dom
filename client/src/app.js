import { Component, render, useState } from "../mostJS/index.js";
import GameStart from "./components/game_start.js";
import SocketServer from "./websocket.js";

const ws = new SocketServer("ws://localhost:8080");

const App = () => {
  const [screen, setScreen] = useState("game_start");

  switch (screen) {
    case "game_start":
      Component(GameStart, {}, "game_start");
      break;
  }
};

render("app", App, {});
