// Delays are in millescond not seconds !!!

export const MAP_WIDTH = 30;
export const MAP_HEIGTH = 30;
export const PLAYER_SPEED = 0.2;
export const BOMB_TIMER = 3000;
export const EXPLOTION_TIMER = 1500
export const DEATH_DELAY = 3000;
export const INVINCIBLE_DELAY = 3000;
export const POWERS = ["BOMB", "FLAME", "SPEED"];
export const TOTAL_LEVELS = 1;
export const NICKNAME_MAX_LENGTH = 99;
export const SOCKET_TYPES = {
  error: "error",
  auth: "authentification",
};
export const MAP = {
  player: 0,
  x: 0,
  grass: 0,
  wall: 1,
  soft_wall: 2,
  powerup: 3,
  bomb: 4,
  explotion: 5,
};
