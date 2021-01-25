import {
  Clock,
  Object3D,
  Quaternion,
  Vector3
} from 'three';

import { getCubeSize, getScrambleRotation } from './rubiks';

const SIZE = getCubeSize();
// small cubes on the surface = all small cubes - cubes inside
const CUBE_CHILDREN_LENGTH = Math.pow(SIZE, 3) - Math.pow(SIZE - 2, 3);
const clock = new Clock();

const UNIT_VECTORS = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1),
};

export const scrambleInfo = {
  isScrambling: false,
  scramblingSpeed: 20,
  scrambleCount: 100,
  scrambleStep: 0,
  overlay: document.getElementById('scramble-overlay'),
  counterText: document.getElementById('scramble-counter')
};

export const rotateInfo = {
  isRotating: false,
  rotatingSpeed: 2,
  rotatorObject: new Object3D(),
  targetQuaternion: new Quaternion(),
  rotateHistory: [],
  maxHistoryLength: 20,
  overlay: document.getElementById('debug-overlay')
};

export const scheduleRotation = (cube, rotation) => {
  const { axisToRotate, layer, direction } = rotation;
  const { rotatorObject, targetQuaternion } = rotateInfo;
  const faceCubes = cube.children.filter(child => child.position.round()[axisToRotate] === layer);

  // rotate with a rotator object and quaternion
  rotateInfo.isRotating = true;
  rotatorObject.quaternion.identity();
  faceCubes.forEach(f => rotatorObject.attach(f));
  targetQuaternion.setFromAxisAngle(UNIT_VECTORS[axisToRotate], direction * (Math.PI / 2));
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
  // rotation is finished when all small cubes are attached to the group of cubes
  if (cube.children.length === CUBE_CHILDREN_LENGTH) {
    rotateInfo.isRotating = false;
  }
};

export const doScramble = cube => {
  const { overlay, scrambleCount, counterText } = scrambleInfo;
  if (scrambleInfo.isScrambling && !rotateInfo.isRotating) {
    if (scrambleInfo.scrambleStep++ < scrambleCount) {
      scheduleRotation(cube, getScrambleRotation(SIZE));
    } else {
      overlay.style.display = 'none';
      scrambleInfo.isScrambling = false;
      scrambleInfo.scrambleStep = 0;
    }
    counterText.innerText = `${scrambleInfo.scrambleStep} of ${scrambleCount} steps`;
  }
};
