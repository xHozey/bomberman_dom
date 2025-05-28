import { Div, Create, useRef } from "../../mostJS/index.js";
import { powerUpTypes, SOCKET_TYPES, tileSize } from "../utils.js";

const GameStart = ({ data, ws }) => {
  ws.onmessage = (e) => {
    const parsedData = JSON.parse(e.data);
    let tile;
    let player;
    switch (parsedData.type) {
      case SOCKET_TYPES.PLAYER_MOVE:
        player = useRef(parsedData.nickname);
        player.style.transform = `translate(${
          parsedData.position.x * tileSize
        }px, ${parsedData.position.y * tileSize}px)`;
        break;
      case SOCKET_TYPES.PUT_BOMB:
        tile = useRef(`${parsedData.position.row}_${parsedData.position.col}`);
        tile.style.backgroundColor = "black";
        break;
      case SOCKET_TYPES.REMOVE_BOMB:
        tile = useRef(`${parsedData.position.row}_${parsedData.position.col}`);
        tile.style.backgroundColor = "beige";
        break;
      case SOCKET_TYPES.EXPLOSION:
        tile = useRef(`${parsedData.position.row}_${parsedData.position.col}`);
        tile.style.backgroundColor = "orange";
        break;
      case SOCKET_TYPES.CLEAR_EXPLOSION:
      case SOCKET_TYPES.WALL_DESTROY:
        tile = useRef(`${parsedData.position.row}_${parsedData.position.col}`);
        if (
          parsedData.index &&
          parsedData.index >= 0 &&
          parsedData.index <= 2
        ) {
          tile.style.backgroundColor = powerUpTypes[parsedData.index];
        } else {
          tile.style.backgroundColor = "beige";
        }
        break;
      case SOCKET_TYPES.PLAYER_DEATH:
        player = useRef(parsedData.nickname);
        player.remove();
        break;
      case SOCKET_TYPES.COLLECT_POWERUP:
        tile = useRef(`${parsedData.position.row}_${parsedData.position.col}`);
        tile.style.backgroundColor = "beige";
        break
    }
  };

  window.addEventListener("keydown", (e) => {
    let direction;
    switch (e.key.toLowerCase()) {
      case "a":
        direction = "left";
        break;
      case "s":
        direction = "down";
        break;
      case "d":
        direction = "right";
        break;
      case "w":
        direction = "up";
        break;
      case " ":
        ws.send(
          JSON.stringify({
            type: SOCKET_TYPES.PLAYER_PLACE_BOMB,
          })
        );
        return;
    }

    ws.send(
      JSON.stringify({
        type: SOCKET_TYPES.PLAYER_START_MOVE,
        direction,
      })
    );
  });

  window.addEventListener("keyup", (e) => {
    let direction;
    switch (e.key.toLowerCase()) {
      case "a":
        direction = "left";
        break;
      case "s":
        direction = "down";
        break;
      case "d":
        direction = "right";
        break;
      case "w":
        direction = "up";
        break;
    }

    ws.send(
      JSON.stringify({
        type: SOCKET_TYPES.PLAYER_STOP_MOVE,
        direction,
      })
    );
  });

  return Div({}, [draw(data.map, data)]);
};

const draw = (map, data) => {
  const rows = map.length;
  const columns = map[0].length;

  const tileElements = [];
  const playerElements = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const tile = map[row][column];
      let blockColor = "";
      let className = "tile";
      let ref = `${row}_${column}`;

      switch (tile) {
        case 0: // Empty path
          className = "tile path";
          blockColor = "beige";
          break;
        case 1: // Solid wall
          blockColor = "brown";
          break;
        case 2: // Breakable wall
          blockColor = "grey";
          break;
        case 5:
        case 6:
        case 7:
        case 8: 
          blockColor = "beige"
          className = "tile spawn";
          break;
      }

      // Create tile element
      const tileElement = Create("div", {
        className,
        reference: ref,
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
        const playerStyles = ["blue", "red", "green", "yellow"];

        const playerX = data.players[playerIndex].x * tileSize;
        const playerY = data.players[playerIndex].y * tileSize;

        const playerElement = Create("div", {
          reference: data.players[playerIndex].nickname,
          className: "player",
          id: `player_${data.players[playerIndex].id}`,
          style: {
            backgroundColor: playerStyles[playerIndex],
            width: `${Math.floor(tileSize)}px`,
            height: `${Math.floor(tileSize)}px`,
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
      reference: "map",
      style: {
        display: "grid",
        gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
        gridTemplateColumns: `repeat(${columns}, ${tileSize}px)`,
        // alignContent: "center",
        // justifyContent: "center",
        position: "relative",
      },
    },
    [...tileElements, ...playerElements]
  );
};

export default GameStart;
