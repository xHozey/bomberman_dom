export function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  });
}

export const UUID = () => {
  const digits = "0123456789abcdef";
  const n = digits.length;
  let result = "";
  for (let i = 1; i <= 32; i++) {
    result += digits[Math.floor(Math.random() * n)];
    if (i % 4 == 0 && i < 31) {
      result += "-";
    }
  }
  return result;
};

export const getPosImg = (frameX, frameY, div) => {
  const x = frameX * width;
  const y = frameY * height;
  div.style.backgroundPosition = `${x}px ${y}px`;
};

playerElement.style.backgroundPositionY = data.position.spriteY + "px";
playerElement.style.backgroundPositionX = data.position.spriteX + "px";
