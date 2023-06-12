import { context, canvasWidth, canvasHeight } from "./canvas.mjs";

const { PI, sin, cos, abs } = Math;
const num2PI = 2 * PI;
const now = performance.now.bind(performance);

const sizeFieldOffset = 1;
const angleFieldOffset = 2;
const initXFieldOffset = 3;
const initYFieldOffset = 4;
const startTimeFieldOffset = 5;
const colorFieldOffset = 6;
const speedFieldOffset = 7;
const xFieldOffset = 8;
const yFieldOffset = 9;
const grazedFieldOffset = 10;
const bouncedFieldOffset = 11;
const angleXFieldOffset = 12;
const angleYFieldOffset = 13;
const glowSizeOffset = 14;
const grazeSizeSquareOffset = 15;
const hitSizeSquareOffset = 16;
export const shotStructureSize = 32;

export const shotsBuffer = { __proto__: null };

export const moveAndDrawShot = (index) => {
  switch (shotsBuffer[index]) {
    case 0: /* normal shot */ {
      const time = now() - shotsBuffer[index + startTimeFieldOffset];
      if (time < 0) return true;
      const angle = shotsBuffer[index + angleFieldOffset];
      const speed = shotsBuffer[index + speedFieldOffset];
      const x = shotsBuffer[index + xFieldOffset] = shotsBuffer[index + initXFieldOffset] + shotsBuffer[index + angleXFieldOffset] * speed * (time / 10);
      const size = shotsBuffer[index + sizeFieldOffset];
      if (x < -size || canvasWidth + size < x) return false;
      const y = shotsBuffer[index + yFieldOffset] = shotsBuffer[index + initYFieldOffset] + shotsBuffer[index + angleYFieldOffset] * speed * (time / 10);
      if (y < -size || canvasHeight + size < y) return false;
      context.beginPath();
      context.arc(x, y, shotsBuffer[index + glowSizeOffset], 0, num2PI, false);
      context.fillStyle = shotsBuffer[index + colorFieldOffset];
      context.fill();
      context.beginPath();
      context.arc(x, y, size, 0, num2PI, false);
      context.fillStyle = "#ffffff";
      context.fill();
      return true;
    }
    case 1: /* bouncing shot */ {
      const time = now() - shotsBuffer[index + startTimeFieldOffset];
      if (time < 0) return true;
      const prevAngle = shotsBuffer[index + angleFieldOffset];
      const speed = shotsBuffer[index + speedFieldOffset];
      const x = shotsBuffer[index + xFieldOffset] = shotsBuffer[index + initXFieldOffset] + shotsBuffer[index + angleXFieldOffset] * speed * (time / 10);
      const y = shotsBuffer[index + yFieldOffset] = shotsBuffer[index + initYFieldOffset] + shotsBuffer[index + angleYFieldOffset] * speed * (time / 10);
      const size = shotsBuffer[index + sizeFieldOffset];
      if (shotsBuffer[index + bouncedFieldOffset]) {
        if (x < -size || canvasWidth + size < x) return false;
        if (y < -size || canvasHeight + size < y) return false;
      } else if (x < size) {
        let angle = prevAngle;
        if (angle < PI) angle = PI - angle;
        else angle = PI - angle + num2PI;
        shotsBuffer[index + angleFieldOffset] = angle;
        shotsBuffer[index + angleXFieldOffset] = cos(angle);
        shotsBuffer[index + angleYFieldOffset] = sin(angle);
        shotsBuffer[index + initXFieldOffset] = size;
        shotsBuffer[index + initYFieldOffset] = y;
        shotsBuffer[index + startTimeFieldOffset] = now();
        shotsBuffer[index + bouncedFieldOffset] = true;
      } else if (canvasWidth - size < x) {
        let angle = prevAngle;
        if (angle < PI) angle = PI - angle;
        else angle = PI - angle + num2PI;
        shotsBuffer[index + angleFieldOffset] = angle;
        shotsBuffer[index + angleXFieldOffset] = cos(angle);
        shotsBuffer[index + angleYFieldOffset] = sin(angle);
        shotsBuffer[index + initXFieldOffset] = canvasWidth - size;
        shotsBuffer[index + initYFieldOffset] = y;
        shotsBuffer[index + startTimeFieldOffset] = now();
        shotsBuffer[index + bouncedFieldOffset] = true;
      } else if (y < size) {
        const angle = num2PI - prevAngle;
        shotsBuffer[index + angleFieldOffset] = angle;
        shotsBuffer[index + angleXFieldOffset] = cos(angle);
        shotsBuffer[index + angleYFieldOffset] = sin(angle);
        shotsBuffer[index + initXFieldOffset] = x;
        shotsBuffer[index + initYFieldOffset] = size;
        shotsBuffer[index + startTimeFieldOffset] = now();
        shotsBuffer[index + bouncedFieldOffset] = true;
      } else if (canvasHeight - size < y) {
        const angle = num2PI - prevAngle;
        shotsBuffer[index + angleFieldOffset] = angle;
        shotsBuffer[index + angleXFieldOffset] = cos(angle);
        shotsBuffer[index + angleYFieldOffset] = sin(angle);
        shotsBuffer[index + initXFieldOffset] = x;
        shotsBuffer[index + initYFieldOffset] = canvasHeight - size;
        shotsBuffer[index + startTimeFieldOffset] = now();
        shotsBuffer[index + bouncedFieldOffset] = true;
      }
      context.beginPath();
      context.arc(x, y, shotsBuffer[index + glowSizeOffset], 0, num2PI, false);
      context.fillStyle = shotsBuffer[index + colorFieldOffset];
      context.fill();
      context.beginPath();
      context.arc(x, y, size, 0, num2PI, false);
      context.fillStyle = "#ffffff";
      context.fill();
      return true;
    }
  }
};

export const checkCollision = (index, pX, pY) => {
  if (now() < shotsBuffer[index + startTimeFieldOffset]) return undefined;
  const diffSq = (shotsBuffer[index + xFieldOffset] - pX) ** 2 + (shotsBuffer[index + yFieldOffset] - pY) ** 2;
  if (diffSq < shotsBuffer[index + grazeSizeSquareOffset]) return -1;
  if (!shotsBuffer[index + grazedFieldOffset] && diffSq < shotsBuffer[index + hitSizeSquareOffset]) {
    shotsBuffer[index + grazedFieldOffset] = true;
    return 1;
  }
  return 0;
}

export class NormalShot {
  /* #size; #angle; #initX; #initY;
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
  } */
  static createBuffer({ x, y, size, angle, speed, color, startTime, grazed = false }) {
    const buf = new Array(shotStructureSize).fill(null);
    buf[0] = 0;
    buf[xFieldOffset] = buf[initXFieldOffset] = x;
    buf[yFieldOffset] = buf[initYFieldOffset] = y;
    buf[sizeFieldOffset] = size;
    buf[glowSizeOffset] = size * 1.34;
    buf[grazeSizeSquareOffset] = (size * 1.5) ** 2;
    buf[hitSizeSquareOffset] = (size * 0.85) ** 2;
    while (angle < 0) angle += PI * 2;
    while (PI * 2 < angle) angle -= PI * 2;
    buf[angleFieldOffset] = angle;
    buf[angleXFieldOffset] = cos(angle);
    buf[angleYFieldOffset] = sin(angle);
    buf[speedFieldOffset] = speed;
    buf[colorFieldOffset] = color;
    buf[startTimeFieldOffset] = startTime;
    buf[grazedFieldOffset] = grazed;
    return buf;
  }
  /* get #time() {
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
    if ((this.#x - pX) ** 2 + (this.#y - pY) ** 2 < (size * 0.85) ** 2) return -1;
    if (!this.#grazed && (this.#x - pX) ** 2 + (this.#y - pY) ** 2 < (size * 1.5) ** 2) {
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
  } */
}

export class BouncingShot {
  /* #size; #angle; #initX; #initY;
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
  } */
  static createBuffer({ x, y, size, angle, speed, color, startTime, grazed = false }) {
    const buf = new Array(shotStructureSize).fill(null);
    buf[0] = 1;
    buf[xFieldOffset] = buf[initXFieldOffset] = x;
    buf[yFieldOffset] = buf[initYFieldOffset] = y;
    buf[sizeFieldOffset] = size;
    buf[glowSizeOffset] = size * 1.34;
    buf[grazeSizeSquareOffset] = (size * 1.5) ** 2;
    buf[hitSizeSquareOffset] = (size * 0.85) ** 2;
    while (angle < 0) angle += PI * 2;
    while (PI * 2 < angle) angle -= PI * 2;
    buf[angleFieldOffset] = angle;
    buf[angleXFieldOffset] = cos(angle);
    buf[angleYFieldOffset] = sin(angle);
    buf[speedFieldOffset] = speed;
    buf[colorFieldOffset] = color;
    buf[startTimeFieldOffset] = startTime;
    buf[grazedFieldOffset] = grazed;
    buf[bouncedFieldOffset] = false;
    return buf;
  }
  /* get #time() {
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
  } */
}

Reflect.setPrototypeOf(NormalShot, null);
Object.freeze(NormalShot);
Reflect.setPrototypeOf(NormalShot.prototype, null);
Object.freeze(NormalShot.prototype);
Reflect.setPrototypeOf(BouncingShot, null);
Object.freeze(BouncingShot);
Reflect.setPrototypeOf(BouncingShot.prototype, null);
Object.freeze(BouncingShot.prototype);
