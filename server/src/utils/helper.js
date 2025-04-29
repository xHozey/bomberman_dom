export const UUID = () => {
  const digits = "0123456789abcdef";
  const n = digits.length;
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += digits[Math.floor(Math.random() * n)];
    if (i < 31) {
      result += "-";
    }
  }
  return result;
};

export const extractSpawn = (map) => {
  const result = {};
  const players = new Set(["p1", "p2", "p3", "p4"]);
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (players.has(map[i][j])) {
        result[map[i][j]] = { x: i, y: j };
      }
    }
  }

  return result;
};
