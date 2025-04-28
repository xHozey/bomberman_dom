export class Collision {
    constructor(map, tileWidth, tileHeight) {
      this.map = map;
      this.width = tileWidth;
      this.height = tileHeight;
    }
  
    isBlocked(tileType, object) {
      return (
        tileType === 'wall' ||
        tileType === 'soft-wall' ||
        (tileType === 'bomb-wall' && !this.isInsideBomb(object))
      );
    }
  
    isInsideBomb(object) {
      const row = Math.round(object.y / this.height);
      const col = Math.round(object.x / this.width);
      return this.map[row][col] === 'bomb-wall';
    }
  
    checkMove(direction, object) {
      const speed = object.speed;
      const x = object.x;
      const y = object.y;
  
      const rowTop = Math.floor((y - speed) / this.height);
      const rowBot = Math.floor((y + speed) / this.height);
      const colLeft = Math.floor((x - speed) / this.width);
      const colRight = Math.floor((x + speed) / this.width);
  
      const getTile = (row, col) => this.map?.[row]?.[col] || 'wall';
  
      switch (direction) {
        case 'up': {
          const leftTile = getTile(rowTop, Math.floor(x / this.width));
          const rightTile = getTile(rowTop, Math.ceil(x / this.width));
          const leftBlocked = this.isBlocked(leftTile, object);
          const rightBlocked = this.isBlocked(rightTile, object);
  
          if (leftBlocked && !rightBlocked) return [true, x + speed];
          if (!leftBlocked && rightBlocked) return [true, x - speed];
          if (leftBlocked && rightBlocked) return [true, x];
          return [false, x];
        }
  
        case 'down': {
          const leftTile = getTile(rowBot, Math.floor(x / this.width));
          const rightTile = getTile(rowBot, Math.ceil(x / this.width));
          const leftBlocked = this.isBlocked(leftTile, object);
          const rightBlocked = this.isBlocked(rightTile, object);
  
          if (leftBlocked && !rightBlocked) return [true, x + speed];
          if (!leftBlocked && rightBlocked) return [true, x - speed];
          if (leftBlocked && rightBlocked) return [true, x];
          return [false, x];
        }
  
        case 'left': {
          const topTile = getTile(Math.floor(y / this.height), colLeft);
          const bottomTile = getTile(Math.ceil(y / this.height), colLeft);
          const topBlocked = this.isBlocked(topTile, object);
          const bottomBlocked = this.isBlocked(bottomTile, object);
  
          if (topBlocked && !bottomBlocked) return [true, y + speed];
          if (!topBlocked && bottomBlocked) return [true, y - speed];
          if (topBlocked && bottomBlocked) return [true, y];
          return [false, y];
        }
  
        case 'right': {
          const topTile = getTile(Math.floor(y / this.height), colRight);
          const bottomTile = getTile(Math.ceil(y / this.height), colRight);
          const topBlocked = this.isBlocked(topTile, object);
          const bottomBlocked = this.isBlocked(bottomTile, object);
  
          if (topBlocked && !bottomBlocked) return [true, y + speed];
          if (!topBlocked && bottomBlocked) return [true, y - speed];
          if (topBlocked && bottomBlocked) return [true, y];
          return [false, y];
        }
  
        default:
          return [false, null];
      }
    }
  
    checkIfBombed(x, y) {
      const row = Math.round(y / this.height);
      const col = Math.round(x / this.width);
      return this.map?.[row]?.[col] === 'explosion';
    }
  }
  