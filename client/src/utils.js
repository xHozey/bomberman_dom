export const SOCKET_TYPES = {
  PLAYER_JOIN: "player_join",
  PLAYER_MOVE: "player_move",
  PLAYER_START_MOVE: "player_start_moving",
  PLAYER_STOP_MOVE: "player_stop_moving",
  PLAYER_PLACE_BOMB: "place_bomb",
  PLAYER_HIT_BY_EXPLOSION: "hit_by_explosion",
  PLAYER_CHAT: "chat_messages",
  PLAYER_UPDATE: "update_players",
  GAME_START: "start_game",
  ADD_POWERUP: "power_up_add",
  PLAYER_REMOVE: "remove_player",
  WINNER: "winner",
  PUT_BOMB: "bomb",
  REMOVE_BOMB: "remove_bomb",
  EXPLOSION: "explosion",
  CLEAR_EXPLOSION: "clear_explosion",
  WALL_DESTROY: "destroy_wall",
  PLAYER_LIVES: "lives",
  PLAYER_DATA: "player_data",
  PLAYER_DEATH: "player_died",
  powerup_COLLECTED: "powerup_collect",
  PLAYER_STATS: "player_stats",
};
export const powerUpTypes = ["purple", "cyan", "crimson"];

export const tileSize = 40;
