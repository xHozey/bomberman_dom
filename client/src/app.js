import { Component, render, useState } from "../mostJS/index.js";
import GameStart from "./components/game_start.js";

const ws = new WebSocket("ws://localhost:8080");

const App = () => {
  const [screen, setScreen] = useState("game_start");
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data)
    switch (data.type) {
      
    }
  }
  switch (screen) {
    case "game_start":
      Component(GameStart, {socket: ws}, "game_start");
      break;
  }
};

render("app", App, {});
