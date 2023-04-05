import { context, canvasWidth, canvasHeight } from "./canvas.mjs";

const { PI, sin, cos, abs } = Math;
const now = performance.now.bind(performance);

export class NormalShot {
  #size; #angle; #initX; #initY;
  #start; #color; #speed; #x; #y;
  #grazed;
  constructor({ x, y, size, angle, speed, color, startTime, grazed = false }) {
    this.#x = this.#initX = x;
    this.#y = this.#initY = y;
    this.#size = size;
    while (angle < 0) angle += PI * 2;
    while (PI * 2 < angle) angle -= PI * 2;
    this.#angle = angle;
    this.#speed = speed;
    this.#color = color;
    this.#start = startTime;
    this.#grazed = grazed;
  }
  get #time() {
    return now() - this.#start;
  }
  moveAndDraw() {
    const time = this.#time;
    if (time < 0) return true;
    const x = this.#x = this.#initX + cos(this.#angle) * this.#speed * (time / 10);
    const size = this.#size;
    if (x < -size || canvasWidth + size < x) return false;
    const y = this.#y = this.#initY + sin(this.#angle) * this.#speed * (time / 10);
    if (y < -size || canvasHeight + size < y) return false;
    this.draw();
    return true;
  }
  checkCollision(pX, pY) {
    if (this.#time < 0) return undefined;
    const size = this.#size;
    if (abs(this.#x - pX) ** 2 + abs(this.#y - pY) ** 2 < (size * 0.85) ** 2) return -1;
    if (!this.#grazed && abs(this.#x - pX) ** 2 + abs(this.#y - pY) ** 2 < (size * 1.5) ** 2) {
      this.#grazed = true;
      return 1;
    }
    return 0;
  }
  draw() {
    if (this.#time < 0) return;
    context.beginPath();
    context.arc(this.#x, this.#y, this.#size * 1.34, 0, 2 * PI, false);
    context.fillStyle = this.#color;
    context.fill();

    context.beginPath();
    context.arc(this.#x, this.#y, this.#size, 0, 2 * PI, false);
    context.fillStyle = "#ffffff";
    context.fill();
  }
}

export class BouncingShot {
  #size; #angle; #initX; #initY;
  #start; #color; #speed; #x; #y;
  #grazed; #bounced = false;
  constructor({ x, y, size, angle, speed, color, startTime, grazed = false }) {
    this.#x = this.#initX = x;
    this.#y = this.#initY = y;
    this.#size = size;
    while (angle < 0) angle += PI * 2;
    while (PI * 2 < angle) angle -= PI * 2;
    this.#angle = angle;
    this.#speed = speed;
    this.#color = color;
    this.#start = startTime;
    this.#grazed = grazed;
  }
  get #time() {
    return now() - this.#start;
  }
  moveAndDraw() {
    const time = this.#time;
    if (time < 0) return true;
    const x = this.#x = this.#initX + cos(this.#angle) * this.#speed * (time / 10);
    const y = this.#y = this.#initY + sin(this.#angle) * this.#speed * (time / 10);
    const size = this.#size;
    if (this.#bounced) {
      if (x < -size || canvasWidth + size < x) return false;
      const y = this.#y = this.#initY + sin(this.#angle) * this.#speed * (time / 10);
      if (y < -size || canvasHeight + size < y) return false;
    } else if (x < size) {
      let angle = this.#angle;
      if (angle < PI) angle = PI - angle;
      else angle = PI - angle + 2 * PI;
      this.#angle = angle;
      this.#initX = size;
      this.#initY = y;
      this.#start = now();
      this.#bounced = true;
    } else if (canvasWidth - size < x) {
      let angle = this.#angle;
      if (angle < PI) angle = PI - angle;
      else angle = PI - angle + 2 * PI;
      this.#angle = angle;
      this.#initX = canvasWidth - size;
      this.#initY = y;
      this.#start = now();
      this.#bounced = true;
    } else if (y < size) {
      const angle = 2 * PI - this.#angle;
      this.#angle = angle;
      this.#initX = x;
      this.#initY = size;
      this.#start = now();
      this.#bounced = true;
    } else if (canvasHeight - size < y) {
      const angle = 2 * PI - this.#angle;
      this.#angle = angle;
      this.#initX = x;
      this.#initY = canvasHeight - size;
      this.#start = now();
      this.#bounced = true;
    }
    this.draw();
    return true;
  }
  checkCollision (pX, pY) {
    if (this.#time < 0) return undefined;
    const size = this.#size;
    if (abs(this.#x - pX) < size * 0.85 && abs(this.#y - pY) < size * 0.85) return -1;
    if (!this.#grazed && abs(this.#x - pX) < size * 1.5 && abs(this.#y - pY) < size * 1.5) {
      this.#grazed = true;
      return 1;
    }
    return 0;
  }
  draw() {
    if (this.#time < 0) return;
    context.beginPath();
    context.arc(this.#x, this.#y, this.#size * 1.34, 0, 2 * PI, false);
    context.fillStyle = this.#color;
    context.fill();

    context.beginPath();
    context.arc(this.#x, this.#y, this.#size, 0, 2 * PI, false);
    context.fillStyle = "#ffffff";
    context.fill();
  }
}

Reflect.setPrototypeOf(NormalShot, null);
Object.freeze(NormalShot);
Reflect.setPrototypeOf(NormalShot.prototype, null);
Object.freeze(NormalShot.prototype);
Reflect.setPrototypeOf(BouncingShot, null);
Object.freeze(BouncingShot);
Reflect.setPrototypeOf(BouncingShot.prototype, null);
Object.freeze(BouncingShot.prototype);
