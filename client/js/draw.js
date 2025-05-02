import TileMap from "./map.js";

// export default function draw(canvas ){
const tileSize = 40;
const tileMap = new TileMap(tileSize);
function gameLoop() {
    tileMap.drawGame()
}
setInterval(gameLoop, 1000 / 60)
// }
