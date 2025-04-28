

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
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from "../../utils/logger.js";

// Get current directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class MapGenerator {
  constructor(mapNumber) {
    this.mapNumber = mapNumber;
    this.templatesPath = path.join(__dirname, 'templates');
  }

  async loadTemplate() {
    try {
      const templatePath = path.join(this.templatesPath, `map_${this.mapNumber}.json`);
      const data = await fs.readFile(templatePath, 'utf-8');
      this.template = JSON.parse(data);
    } catch (err) {
      logger.error(`Failed to load map template: ${err.message}`);
      throw new Error(`Level ${this.mapNumber} not found.`);
    }
  }

  async generateMap() {
    await this.loadTemplate();
    
    const map = JSON.parse(JSON.stringify(this.template.blueprint));
    const powerupCount = this.template.powers || 0;
    const powerupSpots = [];

    // Convert some free cells to soft walls (40% chance)
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        if (map[row][col] === 0 && Math.random() < 0.4) {
          map[row][col] = 2;
          powerupSpots.push({ row, col });
        }
      }
    }

    // Randomly place powerups
    const shuffledSpots = [...powerupSpots].sort(() => 0.5 - Math.random());
    for (let i = 0; i < Math.min(powerupCount, shuffledSpots.length); i++) {
      const { row, col } = shuffledSpots[i];
      map[row][col] = 3;
    }

    return map;
  }
}

export default MapGenerator;