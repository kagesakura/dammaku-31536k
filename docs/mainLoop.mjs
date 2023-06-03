import { drawPlayer, drawCollision, movePlayer, resetPlayerPos } from "./player.mjs";
import { moveAndDrawShots } from "./shotManager.mjs";
import { clearCanvas } from "./canvas.mjs";

const now = performance.now.bind(performance);
const { requestAnimationFrame } = globalThis;

let isDebugging = false;
Reflect.defineProperty(globalThis, "DAMMAKU_DEBUG", {
  __proto__: null,
  get: () => isDebugging,
  set: v => isDebugging = !!v
});
const arg = Object.freeze({
  __proto__: null,
  hit() {
    if (isDebugging) return;
    console.error("Hit!");
    resetPlayerPos();
    return true;
  },
  grazed() {
    console.info("Graze!");
  }
});

let prev = -1, fps = NaN;
Reflect.defineProperty(globalThis, "FPS", {
  __proto__: null,
  get: () => fps
});
export const startMainLoop = () => void function mainLoop() {
  const n = now();
  fps = 1000 / prev - n;
  prev = n;
  clearCanvas();
  movePlayer();
  drawPlayer();
  moveAndDrawShots(arg);
  drawCollision();
  requestAnimationFrame(mainLoop);
}();
