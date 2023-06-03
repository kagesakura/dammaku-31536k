import { getPlayerPos } from "./player.mjs";
import { shotStructureSize, moveAndDrawShot, checkCollision } from "./shot.mjs";

const shots = { __proto__: null };
const addRequests = [];
Reflect.setPrototypeOf(addRequests, null);

const { ownKeys } = Reflect;
Reflect.defineProperty(globalThis, "shotsCount", {
  __proto__: null,
  get: () => ownKeys(shots).length / shotStructureSize
});

const deleter = k => delete shots[k];

let locked = false;
let min = 0;
let max = 0;

export const appendShot = shot => {
  if (locked) addRequests[addRequests.length++] = shot;
  else shots[max++] = shot;
};

export const clearShots = () => {
  if (locked) return;
  min = max = 0;
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
  for (let i = max - shotStructureSize; i >= min; i -= shotStructureSize) {
    if (!(i in shots)) continue;
    if (moveAndDrawShot(i)) {
      notFound = false;
      tmpMin = i;
      const collisionState = checkCollision(i, pX, pY);
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
    for (let j = 0; j < shotStructureSize; j++)
      delete shots[i + j];
    if (notFound) tmpMax = i;
  }
  if (tmpMin >= tmpMax) tmpMin = tmpMax = 0;
  min = tmpMin;
  max = tmpMax;
  unlock();
};
