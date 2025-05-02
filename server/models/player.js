import { safeStringify } from "../utils/helpers.js";
import { GAME_CONFIG } from "../config/gameConfig.js";
import { logger } from "../utils/logger.js";
import { SOCKET_TYPES } from "../config/protocols.js";
export default class Player {
  constructor(nickname, id, conn, room) {
    this.room = room;
    this.x = 0;
    this.y = 0;
    this.nickname = nickname;
    this.id = id;
    this.conn = conn;
    this.width = 21;
    this.height = 40;
    this.lives = 3;
    this.speed = 25;
    this.isMoving = false;
    this.isDead = false;
    this.direction = "up";
    this.movementStartTime = null;
    this.timePlaceBomb = 3000;
    this.lastTimePlaceBomb = 0;
    this.fireRange = 1;
    this.maxBombs = 1;
    this.placedBombs = new Set();
    this.userPx = 5;
  }

  loseLife() {
    if (this.isDead) return;
    this.lives -= 1;
    if (this.lives == 0) {
      this.isDead = true;
    }
  }

  updateMove(data, room) {
    if (this.isDead) return;
    const deltaTime = data.deltaTime || 0.016;
    const moveSpeed = this.speed * deltaTime;
    const prevX = this.x;
    const prevY = this.y;

    switch (data.direction) {
      case "up":
        this.y -= moveSpeed;
        this.direction = "up";
        this.isMoving = true;
        break;
      case "down":
        this.y += moveSpeed;
        this.direction = "down";
        this.isMoving = true;
        break;
      case "left":
        this.x -= moveSpeed;
        this.direction = "left";
        this.isMoving = true;
        break;
      case "right":
        this.x += moveSpeed;
        this.direction = "right";
        this.isMoving = true;
        break;
      default:
        this.isMoving = false;
        break;
    }

    if (this._checkCollision(room)) {
      this.x = prevX;
      this.y = prevY;
    } else {
      this._checkpowerupCollection(room);
      this._updateBombOverlap(room);
    }

    if (this.isMoving) {
      const moveData = {
        type: SOCKET_TYPES.PLAYER_MOVE,
        position: {
          x: this.x,
          y: this.y,
        },
        direction: this.direction,
        Id: this.id,
      };

      room.broadcast(moveData);
    }
  }

  _checkCollision(room) {
    const playerLeft = this.x;
    const playerTop = this.y;
    const playerRight = this.x + this.width;
    const playerBottom = this.y + this.height;

    const playerCenterX = this.x + this.width / 2;
    const playerCenterY = this.y + this.height / 2;
    const playerTileX = Math.floor(playerCenterX / GAME_CONFIG.TILE_SIZE);
    const playerTileY = Math.floor(playerCenterY / GAME_CONFIG.TILE_SIZE);

    for (let y = playerTileY - 1; y <= playerTileY + 1; y++) {
      for (let x = playerTileX - 1; x <= playerTileX + 1; x++) {
        if (y >= 0 && y < room.map.length && x >= 0 && x < room.map[0].length) {
          const tileType = room.map[y][x];
          const tileTypes =
            x + 1 < room.map[0].length ? room.map[y][x + 1] : null;

          if (
            tileType === 1 ||
            tileType === 2 ||
            tileType === 3 ||
            (tileType === 4 && !this.placedBombs.has(`${y}_${x}`))
          ) {
            const tileLeft = x * GAME_CONFIG.TILE_SIZE;
            const tileTop = y * GAME_CONFIG.TILE_SIZE;
            const tileRight = tileLeft + GAME_CONFIG.TILE_SIZE;
            const tileBottom = tileTop + GAME_CONFIG.TILE_SIZE;

            if (
              playerLeft < tileRight - 6 &&
              playerRight > tileLeft - 4 &&
              playerTop < tileBottom - 16 &&
              playerBottom > tileTop
            ) {
              if (this.direction === "down") {
                const rightEdgeCollision =
                  Math.abs(playerRight - tileLeft + 5) <= 19.75;
                const right = Math.abs(playerRight - tileLeft) > 38;

                if (tileType === 0 || tileTypes === 0) {
                  if (rightEdgeCollision && playerLeft <= tileLeft) {
                    this.userPx = Math.min(this.userPx + 0.5, 9);
                    this.x -= this.userPx;
                    return false;
                  }
                  if (right && playerLeft >= tileLeft) {
                    this.userPx = Math.min(this.userPx + 1, 6);
                    this.x += this.userPx;
                    return false;
                  }
                }
                return true;
              }

              if (this.direction === "up") {
                const rightEdgeCollision =
                  Math.abs(playerRight - tileLeft + 5) >= 48 ||
                  Math.abs(playerRight - tileLeft) <= 13;

                if (tileType === 0 || tileTypes === 0) {
                  if (rightEdgeCollision) {
                    if (playerLeft <= tileLeft) {
                      this.userPx = Math.min(this.userPx + 1, 9);
                      this.x -= this.userPx;
                    } else if (playerRight >= tileLeft) {
                      this.userPx = Math.min(this.userPx + 1, 9);
                      this.x += this.userPx;
                    }
                    return false;
                  }
                }
                this.y -= this.userPx;
                return true;
              }

              if (this.direction === "left") {
                if (tileType === 0 || tileTypes === 0) {
                  const bottomEdgeCollision =
                    Math.abs(playerBottom - tileTop) < 15 && tileTop > 0;
                  if (bottomEdgeCollision) {
                    this.userPx = Math.min(this.userPx + 1, 6);
                    this.y -= this.userPx;
                    return false;
                  }
                }
                return true;
              }

              if (this.direction === "right") {
                if (tileType === 0 || tileTypes === 0) {
                  const rightEdgeCollision =
                    Math.abs(playerBottom - tileTop) < 15;
                  if (rightEdgeCollision && playerBottom > tileTop) {
                    this.userPx = Math.min(this.userPx + 1, 6);
                    this.y -= this.userPx;
                    this.x += this.userPx;
                    return false;
                  }
                }
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  _updateBombOverlap(room) {
    const playerCenterX = this.x + this.width / 2;
    const playerCenterY = this.y + this.height / 2;
    const playerTileX = Math.floor(playerCenterX / GAME_CONFIG.TILE_SIZE);
    const playerTileY = Math.floor(playerCenterY / GAME_CONFIG.TILE_SIZE);
    const tileKey = `${playerTileY}_${playerTileX}`;

    const toRemove = [];
    for (const bombKey of this.placedBombs) {
      const [bombRow, bombCol] = bombKey.split("_").map(Number);
      const bombTileLeft = bombCol * GAME_CONFIG.TILE_SIZE;
      const bombTileTop = bombRow * GAME_CONFIG.TILE_SIZE;
      const bombTileRight = bombTileLeft + GAME_CONFIG.TILE_SIZE;
      const bombTileBottom = bombTileTop + GAME_CONFIG.TILE_SIZE;

      const outside =
        this.x + this.width < bombTileLeft ||
        this.x > bombTileRight - 6 ||
        this.y + this.height < bombTileTop ||
        this.y > bombTileBottom - 16;

      if (outside) toRemove.push(bombKey);
    }

    for (const key of toRemove) {
      this.placedBombs.delete(key);
    }

    if (
      playerTileY >= 0 &&
      playerTileY < room.map.length &&
      playerTileX >= 0 &&
      playerTileX < room.map[0].length &&
      room.map[playerTileY][playerTileX] === 4
    ) {
      this.placedBombs.add(tileKey);
    }
  }

  canPlaceBomb() {
    return this.placedBombs.length + 1 <= this.maxBombs;
  }

  placeBomb(room) {
    if (this.isDead) return;
    if (
      !this.canPlaceBomb() &&
      Date.now() - this.lastTimePlaceBomb < this.timePlaceBomb
    ) {
      return;
    }
    this.lastTimePlaceBomb = Date.now();
    const row = Math.floor((this.y + 20) / GAME_CONFIG.TILE_SIZE);
    const col = Math.floor((this.x + 20) / GAME_CONFIG.TILE_SIZE);

    const frames = [
      { x: -5, y: 0 },
      { x: -40, y: 0 },
      { x: -75, y: 0 },
      { x: -112, y: 0 },
      { x: -146, y: 0 },
      { x: -75, y: 36 },
      { x: -112, y: 36 },
      { x: -146, y: 36 },
    ];

    this.placedBombs.add(`${row}_${col}`);
    this._drawBomb(row, col, room);

    setTimeout(() => {
      this._removeBomb(row, col, room);
      this._destroyWall(row, col, frames, room);
      this.placedBombs.delete(`${row}_${col}`);
    }, 3000);
  }

  _drawBomb(row, col, room) {
    room.map[row][col] = 4;
    room.broadcast({
      type: SOCKET_TYPES.PUT_BOMB,
      position: { row, col },
    });
  }

  _removeBomb(row, col, room) {
    room.map[row][col] = 0;
    room.broadcast({
      type: SOCKET_TYPES.REMOVE_BOMB,
      position: { row, col },
    });
  }

  _destroyWall(row, col, frames, room) {
    room.broadcast({
      type: SOCKET_TYPES.EXPLOSION,
      position: { row, col },
      frames,
    });

    room.broadcast({
      type: SOCKET_TYPES.PLAYER_HIT_BY_EXPLOSION,
      row,
      col,
    });

    const baseDirections = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ];

    baseDirections.forEach(({ dr, dc }) => {
      for (let i = 1; i <= this.fireRange; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;

        if (
          newRow < 0 ||
          newRow >= room.map.length ||
          newCol < 0 ||
          newCol >= room.map[0].length
        ) {
          break;
        }

        room.broadcast({
          type: SOCKET_TYPES.EXPLOSION,
          position: { row: newRow, col: newCol },
          frames,
        });

        room.broadcast({
          type: SOCKET_TYPES.PLAYER_HIT_BY_EXPLOSION,
          row: newRow,
          col: newCol,
        });

        if (room.map[newRow][newCol] === 3) {
          room.map[newRow][newCol] = 0;
          if (Math.random() < 0.3) {
            const index = Math.floor(Math.random() * 3);
            room.addpowerup(newRow, newCol, index);
            room.broadcast({
              type: SOCKET_TYPES.WALL_DESTROY,
              position: { row: newRow, col: newCol },
              gift: true,
              index,
              frames,
            });
          }
          break;
        } else if (
          room.map[newRow][newCol] !== 0 &&
          room.map[newRow][newCol] < 5
        ) {
          break;
        }
      }
    });
  }

  isPlayerHitByExplosion(data, room) {
    const playerCenterX = this.x + this.width / 2;
    const playerCenterY = this.y + this.height / 2;
    const playerTileRow = Math.floor(playerCenterY / GAME_CONFIG.TILE_SIZE);
    const playerTileCol = Math.floor(playerCenterX / GAME_CONFIG.TILE_SIZE);

    if (data.row === playerTileRow && data.col === playerTileCol) {
      this.loseLife();
      this.conn.send(
        safeStringify({
          type: SOCKET_TYPES.PLAYER_LIVES,
          Id: this.id,
          hearts: this.lives,
        })
      );

      const playersArray = Array.from(room.players.values());
      room.broadcast({
        type: SOCKET_TYPES.PLAYER_DATA,
        players: playersArray,
      });

      this.checkPlayerWin(room, Array.from(room.players));
      if (this.isDead) {
        room.broadcast({
          type: SOCKET_TYPES.PLAYER_DEATH,
          Id: this.id,
        });
      }
    }
  }

  checkPlayerWin(room, players) {
    const alivePlayers = players.filter(([_, player]) => player.lives > 0);

    if (alivePlayers.length === 1) {
      room.started = false;
      room.broadcast({
        type: SOCKET_TYPES.WINNER,
        name: alivePlayers[0][1].nickname,
      });
    } else if (alivePlayers.length === 0) {
      logger.info(`room: ${this.room} Draw!`);
    }
  }

  _checkpowerupCollection(room) {
    const playerCenterX = this.x + this.width / 2;
    const playerCenterY = this.y + this.height / 2;
    const playerTileX = Math.floor(playerCenterX / GAME_CONFIG.TILE_SIZE);
    const playerTileY = Math.floor(playerCenterY / GAME_CONFIG.TILE_SIZE);

    const powerupKey = `${playerTileY}_${playerTileX}`;
    if (room.powerups && room.powerups[powerupKey]) {
      const powerupType = room.powerups[powerupKey];
      this.collectpowerup(powerupType);

      room.broadcast({
        type: SOCKET_TYPES.COLLECT_POWERUP,
        position: { row: playerTileY, col: playerTileX },
        playerId: this.id,
        powerupType,
      });

      room.removepowerup(playerTileY, playerTileX);
    }
  }

  collectpowerup(powerupType) {
    switch (powerupType) {
      case "bomb":
        this.maxBombs++;
        break;
      case "speed":
        this.speed += 10;
        break;
      case "fire":
        this.fireRange++;
        break;
      default:
        logger.warn(`Unknown powerup type: ${powerupType}`);
        return;
    }

    this.sendPlayerStatsUpdate();
  }

  sendPlayerStatsUpdate() {
    this.conn.send(
      safeStringify({
        type: SOCKET_TYPES.PLAYER_STATS,
        bombPower: this.maxBombs,
        speed: this.speed,
        fire: this.fireRange,
      })
    );
  }
}
