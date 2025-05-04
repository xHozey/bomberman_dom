import { waitingContainer } from "./game.js";
import { jsx } from "../src/framework.js";
import { Ref } from "./utils.js";
import { updateRender } from "../src/vdom.js";
import { playersElement } from "./map.js";
import createSpriteAnimator from "./spriteanimator.js";

// Game state variable
export let gameState = {
  name: "",
  playerCount: 0,
};
function removePlayer(id) {
  const playerElement = playersElement.get(id);
  if (playerElement) {
    playerElement.remove();
    playersElement.delete(id);
  }
}
function updatePlayerStats(data) {
  const status = Ref.StatusRef.current;
  const statsNode = jsx(
    "div",
    { className: "stella-status" },
    jsx(
      "h3",
      { style: "color:rgb(0, 0, 0); margin-bottom: 8px;" },
      "✨ Stella's Power Stats ✨"
    ),
    jsx(
      "div",
      { style: "list-style: none; padding: 0; margin: 0;" },
      jsx("p", {}, `💣 Bomb Power: ${data.bombPower}`),
      jsx("p", {}, `⚡ Speed: ${data.speed}`),
      jsx("p", {}, `🔥 Fire Range: ${data.fire}`)
    )
  );
  updateRender(statsNode, status);
}
function hearts() {
  const hearts = Ref.hearts.current;

  if (hearts.lastElementChild) {
    hearts.lastElementChild.remove();
  }
}

function animationPlayerDead(data) {
  let playerElement = playersElement.get(data.Id);
  playerElement.style.backgroundImage = `url('../images/player_death.png')`;

  if (!playerElement) {
    console.log("player not found", data.Id);
    return;
  }

  const deathFrames = [
    { x: -17, y: 1 }, // Frame 1
    { x: -55, y: 1 }, // Frame 2
    { x: -91, y: 1 }, // Frame 3
    { x: -126, y: 1 }, // Frame 4
    { x: -162, y: 1 }, // Frame 5
    { x: -198, y: 1 }, // Frame 6
    { x: -235, y: 1 }, // Frame 7
  ];

  let currentFrame = 0;
  const frameDuration = 100;

  const animateDeath = () => {
    if (currentFrame >= deathFrames.length) {
      playerElement.remove();
      return;
    }

    playerElement.style.backgroundPositionX = `${deathFrames[currentFrame].x}px`;
    playerElement.style.backgroundPositionY = `${deathFrames[currentFrame].y}px`;
    currentFrame++;

    setTimeout(animateDeath, frameDuration);
  };

  animateDeath();
}

const playerAnimator = createSpriteAnimator({
  spriteWidth: 28,
  spriteHeight: 40,
  frameIndices: [0, 1, 2, 3],
  frameSlow: 6,
  directionRows: {
    right: 1,
    left: 3,
    up: 2,
    down: 4,
  },
});
function updateOtherPlayerPosition(data) {
  let playerElement = playersElement.get(data.Id);
  if (!playerElement) {
    console.log("player not found", data.Id);
    return;
  }

  const sprite = playerAnimator.getSpritePosition(data.direction);
  playerElement.style.backgroundPosition = `${sprite.x}px ${sprite.y}px`;

  // Convert world units to pixels
  const pixelX = data.position.x * 40; // 40 is the default tileSize
  const pixelY = data.position.y * 40;

  playerElement.style.transform = `translate(${pixelX}px, ${pixelY}px)`;
}

function updatePlayerCount(count, playerId, countP) {
  gameState.playerCount = count;
  let progressText = "";
  if (countP === null) {
    progressText = "Game...";
  } else {
    progressText =
      countP < 20
        ? `Game starting soon... ${countP}s`
        : "Game starting soon...";
  }
  if (waitingContainer) {
    console.log(progressText);
    const updatedWaitingContent = jsx(
      "div",
      { className: "here" },
      jsx("p", { id: "playercount" }, `Players1: ${count}/4`),
      jsx(
        "div",
        { className: "waiting-animation" },
        jsx("img", {
          src: "/images/taytmzk.gif",
          alt: "Waiting...",
          style: "margin-top: 10px;",
          className: "lmomzik",
        }),
        jsx("p", { class: "countPlayer" }, progressText)
      )
    );

    updateRender(updatedWaitingContent, waitingContainer);
  }
}

export {
  updatePlayerCount,
  updateOtherPlayerPosition,
  animationPlayerDead,
  hearts,
  updatePlayerStats,
  removePlayer,
};
