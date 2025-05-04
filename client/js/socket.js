import {
  updatePlayerCount,
  removePlayer,
  updateOtherPlayerPosition,
  updatePlayerStats,
  hearts,
  animationPlayerDead,
} from "./player.js";
import { gameState, Ref } from "./utils.js";
import { notificationPower } from "./powerups.js";
import { jsx } from "../src/framework.js";
import { render } from "../src/vdom.js";
import {
  startGame,
  destroyWall,
  broadcastPlayerInfo,
  powerupCollected,
} from "./game.js";
import { Game } from "./map.js";
import { drawBomb, removeBomb, drawExplosion } from "./bombs.js";
import { SOCKET_TYPES } from "./protocols.js";
import { router } from "./game.js";

export let socket;

function connectToGameServer(name) {
  const host = window.location.hostname;
  socket = new WebSocket(`ws://${host}:8080`);
  socket.onopen = () => {
    console.log("Connected to WebSocket server");
    socket.send(
      JSON.stringify({
        type: SOCKET_TYPES.PLAYER_JOIN,
        nickname: name,
      })
    );
  };
  socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    handleServerMessages(data);
  };

  socket.onclose = () => {
    console.log("Disconnected from WebSocket server");
  };
}

let tileMap;
function handleServerMessages(data) {
  const tileSize = 40;
  if (data.type == SOCKET_TYPES.GAME_START) {
    tileMap = new Game(tileSize, data);
  }
  switch (data.type) {
    case SOCKET_TYPES.PLAYER_UPDATE:
      updatePlayerCount(data.playerCount, data.playerId, data.countP);
      break;
    case SOCKET_TYPES.GAME_START:
      startGame(data, tileMap);
      break;
    case SOCKET_TYPES.PLAYER_CHAT:
      displayMsg(data);
      break;
    case SOCKET_TYPES.PLAYER_MOVE:
      updateOtherPlayerPosition(data);
      break;
    case SOCKET_TYPES.PUT_BOMB:
      drawBomb(data.position.row, data.position.col);
      break;
    case SOCKET_TYPES.REMOVE_BOMB:
      removeBomb(data.position.row, data.position.col);
      break;
    case SOCKET_TYPES.WALL_DESTROY:
      destroyWall(
        data.position.row,
        data.position.col,
        data.gift,
        data.index,
        data.frames
      );
      break;
    case SOCKET_TYPES.EXPLOSION:
      drawExplosion(data.position.row, data.position.col, data.frames);
      break;
    case SOCKET_TYPES.PLAYER_HIT_BY_EXPLOSION:
      socket.send(JSON.stringify(data));
      break;
    case SOCKET_TYPES.PLAYER_DEATH:
      animationPlayerDead(data);
      break;
    case SOCKET_TYPES.PLAYER_LIVES:
      hearts(data);
      break;
    case SOCKET_TYPES.powerup_COLLECTED:
      powerupCollected(data);
      break;
    case SOCKET_TYPES.PLAYER_STATS:
      updatePlayerStats(data);
      notificationPower(data);
      break;
    case SOCKET_TYPES.PLAYER_DATA:
      broadcastPlayerInfo(data);
      break;
    case SOCKET_TYPES.WINNER:
      setTimeout(() => {
        socket.close();
      }, 5000);
      theWinnerIs(data);
      break;
    case SOCKET_TYPES.PLAYER_REMOVE:
      removePlayer(data.id);
      broadcastPlayerInfo(data);
      break;
    default:
      break;
  }
}

function theWinnerIs(data) {
  let gamepage = Ref.gamePageRef.current;
  const winScreen = jsx(
    "div",
    { id: "popup-msg", className: "popup", ref: Ref.popupRef },
    jsx("h2", {}, `🎉 The winner is: ${data.name} 🎉`),
    jsx(
      "button",
      {
        className: "play-again-btn",
        onclick: (e) => {
          gameState.name = "";
          e.preventDefault();
          router.navigate("/");
        },
      },
      "Play Again"
    )
  );
  render(winScreen, gamepage);
}

export { connectToGameServer, handleServerMessages, theWinnerIs };
