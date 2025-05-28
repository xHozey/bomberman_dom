import { Create } from "../../mostJS/core/dom.js";
import { tileSize } from "../utils.js";

const GameStart = ({ data }) => {
    console.log(data)
  return draw(data.map, data);
};

const draw = (map, data) => {
  const rows = map.length;
  const columns = map[0].length;

  // Create all tile elements
  const tileElements = [];
  const playerElements = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const tile = map[row][column];
      let blockColor = "";
      let className = "tile";
      let id = `tile_${row}_${column}`;

      // Handle different tile types
      switch (tile) {
        case 0: // Empty path
          className = "tile path";
          break;
        case 1: // Solid wall
          blockColor = "black";
          id = "wallfix";
          break;
        case 2: // Breakable wall
          blockColor = "white";
          id = "WallBreak";
          break;
        case 5:
        case 6:
        case 7:
        case 8: // Player spawn positions
          className = "tile spawn";
          break;
      }

      // Create tile element
      const tileElement = Create("div", {
        className,
        "data-row": row,
        "data-column": column,
        id,
        style: {
          width: `${tileSize}px`,
          height: `${tileSize}px`,
          backgroundSize: "contain",
          backgroundColor: blockColor,
        },
      });

      tileElements.push(tileElement);

      // Handle player elements (tiles 5-8)
      if (tile >= 5 && tile <= 8) {
        const playerIndex = tile - 5;
        const playerStyles = [
          "yellow",
          "blue",
          "red",
          "purple",
        ];

        const playerX = data.players[playerIndex].x * tileSize;
        const playerY = data.players[playerIndex].y * tileSize;

        const playerElement = Create("div", {
          className: "player",
          id: `player_${data.players[playerIndex].id}`,
          style: {
            backgroundColor: playerStyles[playerIndex],
            width: `${Math.floor(tileSize * 0.8)}px`,
            height: `${Math.floor(tileSize * 0.8)}px`,
            position: "absolute",
            zIndex: 10,
            transform: `translate(${playerX}px, ${playerY}px)`,
            backgroundSize: "contain",
          },
        });

        playerElements.push(playerElement);
      }
    }
  }

  return Create(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
        gridTemplateColumns: `repeat(${columns}, ${tileSize}px)`,
        alignContent: "center",
        justifyContent: "center",
        position: "relative",
      },
    },
    [...tileElements, ...playerElements]
  );
};

export default GameStart;
