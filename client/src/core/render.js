class MapRender {
  constructor(map) {
    this.bluePrint = map;
    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;
    this.tileSize = Math.min(
      this.SCREEN_WIDTH / map[0].length,
      this.SCREEN_HEIGHT / map.length
    );
  }

  render() {
    const container = document.createElement("div");
    container.classList.add("map");
    container.style.width = `${this.SCREEN_WIDTH}px`;
    container.style.height = `${this.SCREEN_HEIGHT}px`;

    const grids = [];
    for (let i = 0; i < this.bluePrint.length; i++) {
      grids[i] = [];
      for (let j = 0; j < this.bluePrint[i].length; j++) {
        const div = document.createElement("div");
        div.style.imageRendering = "pixelated";
        grids[i].push(div);
        container.appendChild(div);
        div.style.width = `${this.tileSize}px`;
        div.style.height = `${this.tileSize}px`;
        if (this.bluePrint[i][j] == 0 || this.bluePrint[i][j] == "x") {
          div.classList.add("empty");
          continue;
        }
        if (this.bluePrint[i][j] == 1) {
          div.classList.add("wall");
          continue;
        }
        if (this.bluePrint[i][j] == 2) {
          div.classList.add("soft-wall");
          continue;
        }
        if (this.bluePrint[i][j] == 3) {
          div.classList.add("soft-wall", "portal");
          continue;
        }
      }
    }
    return grids;
  }
}
