
/*
 p*: player spawn
 x: permently free cell
 0: free cell
 1: wall 
 2: breakable wall 
 3: powerup
*/
export class MapGenerator {
  constructor(levelTemplate, powerupCount) {
    this.template = levelTemplate;
    this.powerupCount = powerupCount;
  }

  generateMap() {
    const map = JSON.parse(JSON.stringify(this.template));
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
    for (let i = 0; i < Math.min(this.powerupCount, shuffledSpots.length); i++) {
      const { row, col } = shuffledSpots[i];
      map[row][col] = 3; 
    }
    
    return map;
  }
}