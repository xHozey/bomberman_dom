import templates from "./templates";
import { logger } from "../../utils/logger";

/*
 p*: player spawn
 x: permently free cell
 0: free cell
 1: wall 
 2: soft wall 
 3: powerup
 4: bomb
 5: explosion
*/

class MapGenerator {
  constructor(mapNumber) {
    try {
      this.template = templates[`map_${mapNumber}`];
      if (!this.template) {
        throw new Error(`Level ${mapNumber} not found.`);
      }
    } catch (err) {
      logger.error(err.message);
      throw err;
    }
  }

  generateMap() {
    const map = JSON.parse(JSON.stringify(this.template.blueprint));
    const powerupCount = this.template.powers || 0;

    const powerupSpots = [];

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        if (map[row][col] === 0 && Math.random() < 0.4) {
          map[row][col] = 2;
          powerupSpots.push({ row, col });
        }
      }
    }

    const shuffledSpots = [...powerupSpots].sort(() => 0.5 - Math.random());
    for (let i = 0; i < Math.min(powerupCount, shuffledSpots.length); i++) {
      const { row, col } = shuffledSpots[i];
      map[row][col] = 3;
    }

    return map;
  }
}

export default MapGenerator;
