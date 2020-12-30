import {
  Clock,
  Object3D,
  Quaternion
} from 'three';

import { getScrambleRotation, getSizeParameter } from './rubikUtils';

const SIZE = getSizeParameter();
const CUBE_CHILDREN_LENGTH = Math.pow(SIZE, 3);
const clock = new Clock();

export const scrambleInfo = {
  isScrambling: false,
  scramblingSpeed: 20,
  scrambleCount: SIZE < 5 ? 50 : 100,
  scrambleStep: 0,
  overlay: document.getElementById('scramble-overlay'),
  counterText: document.getElementById('scramble-counter')
};

export const rotateInfo = {
  isRotating: false,
  rotatingSpeed: 2,
  startObject: null,
  rotatorObject: new Object3D(),
  targetQuaternion: new Quaternion()
};

export const scheduleRotation = rotation => {
  const { axis, face, direction } = rotation;
  const { rotatorObject, targetQuaternion } = rotateInfo;

  rotateInfo.isRotating = true;
  rotatorObject.quaternion.identity();
  face.forEach(f => rotatorObject.attach(f));
  targetQuaternion.setFromAxisAngle(axis, direction * (Math.PI / 2));
};

export const doRotate = cube => {
  const { rotatorObject, targetQuaternion, rotatingSpeed } = rotateInfo;
  const delta = clock.getDelta();

  if (!rotatorObject.quaternion.equals(targetQuaternion)) {
    const step = (scrambleInfo.isScrambling ? scrambleInfo.scramblingSpeed : rotatingSpeed) * delta;
    rotatorObject.quaternion.rotateTowards(targetQuaternion, step);
  } else {
    if (rotatorObject.children.length) {
      rotatorObject.children.forEach(child => cube.attach(child));
    }
  }

  if (cube.children.length === CUBE_CHILDREN_LENGTH) {
    rotateInfo.isRotating = false;
  }
};

export const doScramble = cube => {
  const { overlay, scrambleCount, counterText } = scrambleInfo;
  if (scrambleInfo.isScrambling && !rotateInfo.isRotating) {
    if (scrambleInfo.scrambleStep++ < scrambleCount) {
      scheduleRotation(getScrambleRotation(cube, SIZE));
    } else {
      overlay.style.display = 'none';
      scrambleInfo.isScrambling = false;
      scrambleInfo.scrambleStep = 0;
    }
    counterText.innerText = `${scrambleInfo.scrambleStep} of ${scrambleCount} steps`;
  }
};
