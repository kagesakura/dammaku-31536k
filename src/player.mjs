import { context, canvasHeight, canvasWidth } from "./canvas.mjs";

const data = new Image();
data.src = await fetch("./player.png").then(async r => URL.createObjectURL(await r.blob()));
const start = performance.now();
const now = performance.now.bind(performance);
const { floor, PI, sin, cos } = Math;

let playerX = canvasWidth / 2;
let playerY = (canvasHeight / 7) * 6;
let accX = 0;
let accY = 0;
let shift = 0;
let left = 0;
let right = 0;
let up = 0;
let down = 0;

export const getPlayerPos = () => ({ __proto__: null, x: playerX, y: playerY });

export const resetPlayerPos = () => ((playerX = canvasWidth / 2), (playerY = (canvasHeight / 7) * 6));

export const drawPlayer = () => {
  const e = now() - start;
  const i = floor((e / 600 - floor(e / 600)) * 6);
  let sy = 3;
  if (accX < 0) sy += 49;
  else if (0 < accX) sy += 97;
  context.drawImage(data, 32 * i + 4, sy, 26, 40, playerX - 37, playerY - 70, 78, 120);
};

export const movePlayer = () => {
  const speed = shift ? 6 : 9;.5;
  playerX += accX * speed;
  playerY += accY * speed;
  if (playerX < 0) playerX = 0;
  else if (canvasWidth < playerX) playerX = canvasWidth;
  if (playerY < 0) playerY = 0;
  else if (canvasHeight < playerY) playerY = canvasHeight;
};

export const drawCollision = () => {
  context.fillStyle = "#cc0000";
  context.beginPath();
  context.arc(playerX, playerY, 12, 0, 2 * PI);
  context.fill();
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(playerX, playerY, 7.5, 0, 2 * PI);
  context.fill();
  context.lineWidth = 6;
  const a = shift ? ((now() - start) * 0.12) % 360 : -(((now() - start) * 0.36) % 360);
  context.strokeStyle = "#ffffff33";
  context.beginPath();
  context.arc(playerX, playerY, (65 + 37) / 2, 0, PI * 2);
  context.stroke();
  context.strokeStyle = "#ffffff55";
  for (let i = 0; i < 8; i++) {
    const x = sin(((i * 45 - a) * PI) / 180);
    const y = cos(((i * 45 - a) * PI) / 180);
    context.beginPath();
    context.moveTo(playerX - x * 65, playerY - y * 65);
    context.lineTo(playerX - x * 37, playerY - y * 37);
    context.stroke();
  }
};

document.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
    case "A":
    case "4":
    case "ArrowLeft":
      left = 1;
      break;
    case "d":
    case "D":
    case "6":
    case "ArrowRight":
      right = 1;
      break;
    case "w":
    case "W":
    case "8":
    case "ArrowUp":
      up = 1;
      break;
    case "s":
    case "S":
    case "2":
    case "ArrowDown":
      down = 1;
      break;
    case "Shift":
      shift = 1;
  }
  accX = right - left;
  accY = down - up;
});

document.addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
    case "A":
    case "4":
    case "ArrowLeft":
      left = 0;
      break;
    case "d":
    case "D":
    case "6":
    case "ArrowRight":
      right = 0;
      break;
    case "w":
    case "W":
    case "8":
    case "ArrowUp":
      up = 0;
      break;
    case "s":
    case "S":
    case "2":
    case "ArrowDown":
      down = 0;
      break;
    case "Shift":
      shift = 0;
  }
  accX = right - left;
  accY = down - up;
});
