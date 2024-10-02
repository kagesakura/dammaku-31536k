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

let prev = -1, spf = NaN;
Reflect.defineProperty(globalThis, "FPS", {
  __proto__: null,
  get: () => (1000 / spf) >>> 0
});
let qqq = null;
Reflect.defineProperty(globalThis, "APP", {
  __proto__: null,
  get: () => qqq >>> 0
});
let started = false;
export const startMainLoop = () => void(!started && function mainLoop() {
  const n = now();
  spf = n - prev;
  prev = n;
  clearCanvas();
  movePlayer();
  drawPlayer();
  const ppp = now();
  moveAndDrawShots(arg);
  qqq = now() - n;
  drawCollision();
  requestAnimationFrame(mainLoop);
}());
