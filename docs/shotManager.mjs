import { getPlayerPos } from "./player.mjs";

const shots = { __proto__: null };
const addRequests = [];
Reflect.setPrototypeOf(addRequests, null);

const { ownKeys } = Reflect;
Reflect.defineProperty(globalThis, "shotsCount", {
  __proto__: null,
  get: () => ownKeys(shots).length
});

const deleter = k => delete shots[k];

let locked = false;
let min = 0n;
let max = 0n;

export const appendShot = shot => {
  if (locked) addRequests[addRequests.length++] = shot;
  else shots[max++] = shot;
};

export const clearShots = () => {
  if (locked) return;
  min = max = 0n;
  ownKeys(shots).forEach(deleter);
};

const unlock = () => {
  locked = false;
  for (let i = 0; i < addRequests.length; i++) shots[max++] = addRequests[i];
  addRequests.length = 0;
};

export const moveAndDrawShots = ({ hit, grazed }) => {
  let notFound = true;
  let tmpMin = min;
  let tmpMax = max;
  const { x: pX, y: pY } = getPlayerPos();
  locked = true;
  for (let i = max - 1n; i >= min; i--) {
    if (!(i in shots)) continue;
    const shot = shots[i];
    if (shot.moveAndDraw()) {
      notFound = false;
      tmpMin = i;
      const collisionState = shot.checkCollision(pX, pY);
      if (typeof collisionState === "number") {
        if (collisionState < 0) {
          if (hit()) {
            unlock();
            clearShots();
            return;
          }
        } else if (0 < collisionState) {
          grazed();
        }
      }
      continue;
    }
    delete shots[i];
    if (notFound) tmpMax = i;
  }
  if (tmpMin >= tmpMax) tmpMin = tmpMax = 0n;
  min = tmpMin;
  max = tmpMax;
  unlock();
};
