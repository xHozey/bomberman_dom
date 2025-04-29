import { Div } from "../../../core/components.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT, MAP } from "../../utils/config.js";

class MapRender {
  constructor(map) {
    this.bluePrint = map;
    this.tilesize = Math.min(
      SCREEN_WIDTH / this.bluePrint[0].length,
      SCREEN_HEIGHT / this.bluePrint.length
    );
  }

  render() {
    return Div(
      {
        className: "map",
        style: `
          width: ${SCREEN_WIDTH}px;
          height: ${SCREEN_HEIGHT}px;
          display: flex;
          flex-direction: column;
        `,
      },
      this.bluePrint.map((line, rowIndex) =>
        line.map((cell, colIndex) =>
          Div({
            key: `cell-${rowIndex}-${colIndex}`,
            className: MAP[cell],
            style: `
              width: ${this.tilesize}px;
              height: ${this.tilesize}px;
              image-rendering: pixelated;
            `,
          })
        )
      )
    );
  }
}

export default MapRender;
