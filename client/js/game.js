import { LoginPage, GamePage, gameState, Ref } from "./utils.js";
import { jsx } from "../src/framework.js";
import { drawExplosion } from "./bombs.js";
import { render, updateRender } from "../src/vdom.js";
import { Router } from "../src/router.js";
import { chat } from "./chat.js";

export const router = new Router({
  "/": () => [LoginPage()],
});

router.init();

export let waitingContainer = null;

export function waiting(element) {
  waitingContainer = element;
  const waitingContent = jsx(
    "div",
    {},
    jsx("p", { id: "playercount" }, `Players: ${gameState.playerCount}/4`),
    jsx(
      "div",
      { className: "waiting-animation" },
      jsx("img", {
        src: "/images/bomberman3d.gif",
        alt: "Waiting...",
        style: "margin-top: 10px;",
      }),
      jsx("p", {}, "Looking for a match...")
    )
  );

  render(waitingContent, element);
}

//game
function startGame(data, tileMap) {
  let count = 10;
  const interval = setInterval(() => {
    count--;
    const updatedWaitingContent = jsx(
      "div",
      {},
      jsx("p", { id: "playercount" }, `start Game in : ${count}s`),
      jsx(
        "div",
        { className: "waiting-animation" },
        jsx("img", {
          src: "/images/bomberman3d.gif",
          alt: "Waiting...",
          style: "margin-top: 10px;",
        }),
        jsx("p", {}, "")
      )
    );

    updateRender(updatedWaitingContent, waitingContainer);
    if (count == 0) {
      GoToGame(data, tileMap);
      clearInterval(interval);
    }
  }, 1000);
}

function powerupCollected(data) {
  const canvas = Ref.gameCanvasRef.current;
  const tileElement = Selectbyrowcol(
    canvas,
    data.position.row,
    data.position.col
  );
  if (tileElement) {
    tileElement.innerHTML = "";
  }
}

let currentTileMap = null;
function GoToGame(data, tileMap) {
  if (currentTileMap) {
    currentTileMap.cleanup();
  }

  const body = document.body;
  render(GamePage(), body);

  let game = Ref.gameCanvasRef.current; //document.getElementById("game");
  function gameLoop() {
    tileMap.drawGame(game, data);
  }
  requestAnimationFrame(gameLoop);
  currentTileMap = tileMap;

  broadcastPlayerInfo(data);
  chat(data.nickname);
}

//wall
function destroyWall(row, col, gift, index, frames) {
  const canvas = Ref.gameCanvasRef.current;
  const tileElement = Selectbyrowcol(canvas, row, col);
  if (tileElement) {
    if (gift) {
      const power = [
        "../images/maxBomb.png",
        "../images/speed.png",
        "../images/firerange.png",
      ];
      tileElement.innerHTML =
        '<img src="' +
        power[index] +
        '" style="width: 38px; height: 38px; position: absolute; top: 0; left: 0;">';
    } else {
      tileElement.innerHTML = "";
      drawExplosion(row, col, frames);
    }
  }
}

function hasclass(tile, className) {
  for (let i = 0; i < tile.children.length; i++) {
    if (tile.children[i].classList.contains(className)) {
      return true;
    }
  }
  return false;
}
function Selectbyrowcol(canvas, row, col) {
  let tileElement = null;
  for (let i = 0; i < canvas.children.length; i++) {
    const child = canvas.children[i];
    if (
      child.dataset &&
      child.dataset.row === String(row) &&
      child.dataset.column === String(col)
    ) {
      tileElement = child;
      break;
    }
  }
  return tileElement;
}
function broadcastPlayerInfo(data) {
  const playersElement = Ref.playersRef.current;

  const playerList = data.players.map((player, index) => {
    return jsx(
      "li",
      { id: `${player.id}` },
      `${player.nickname} - Lives: ${player.lives == 0 ? "dead" : player.lives
      }`,
    );
  });
  const showPlayersTitle = jsx("p", {}, "Players:");

  const playerListContainer = jsx(
    "ul",
    { className: "connected-players" },
    ...playerList
  );

  const wrapper = jsx("div", {}, showPlayersTitle, playerListContainer);
  updateRender(wrapper, playersElement);

}
export {
  hasclass,
  destroyWall,
  startGame,
  Selectbyrowcol,
  broadcastPlayerInfo,
  powerupCollected
}

