import { drawPlayer, drawCollision, movePlayer, resetPlayerPos } from "./player.mjs";
import { moveAndDrawShots } from "./shotManager.mjs";
import { clearCanvas } from "./canvas.mjs";

const { requestAnimationFrame } = globalThis;

export const startMainLoop = () => void function mainLoop() {
  clearCanvas();
  movePlayer();
  drawPlayer();
  moveAndDrawShots({
    hit() {
      console.error("Hit!");
      resetPlayerPos();
      return true;
    },
    grazed() {
      console.info("Graze!");
    }
  });
  drawCollision();
  requestAnimationFrame(mainLoop);
}();
