import { createRubiks } from './createRubiks';
import initScene from './initScene';
import { debounce } from './utils';
import { getRotationDetails, getScrambleRotation } from './rubikUtils';
import { initHtmlControls, initSizeParameter } from './initHtmlControls';

import {
  Clock,
  Object3D,
  Quaternion,
  Raycaster,
  Vector2,
} from 'three';

// initialization
initSizeParameter();

const SIZE = new URLSearchParams(window.location.search).get('size');
const [scene, camera, renderer, controls, sound] = initScene(SIZE);
const cube = createRubiks(SIZE);
const CUBE_CHILDREN_COUNT = cube.children.length;

// add cube to scene
scene.add(cube);

// handle scrambling
const scrambleInfo = {
  isScrambling: false,
  scramblingSpeed: 20,
  scrambleCount: SIZE < 5 ? 50 : 100,
  scrambleStep: 0,
  overlay: document.getElementById('scramble-overlay'),
  counterText: document.getElementById('scramble-counter')
};

initHtmlControls(function handleScrambleClick() {
  scrambleInfo.overlay.style.display = 'block';
  scrambleInfo.isScrambling = true;
});

// stuff needed for rotating the cube
const raycaster = new Raycaster();
const targetQuaternion = new Quaternion();
const clock = new Clock();
const rotatingSpeed = 2;
const rotatorObject = new Object3D();
scene.add(rotatorObject);

let isRotating = false;
let startObject;

const scheduleRotation = rotation => {
  const { axis, face, direction } = rotation;
  isRotating = true;
  rotatorObject.quaternion.identity();
  face.forEach(f => rotatorObject.attach(f));
  targetQuaternion.setFromAxisAngle(axis, direction * (Math.PI / 2));
};

const getSelectedObject = mouseVector => {
  if (mouseVector && mouseVector.x !== 0 && mouseVector.y !== 0) {
    raycaster.setFromCamera(mouseVector, camera);
    let intersects = raycaster.intersectObjects(cube.children);

    if (intersects.length) {
      return intersects[0].object;
    }
  }

  return null;
};

const getEventVector = event => {
  const eventVector = new Vector2();
  const eventObj =
    event.changedTouches && event.changedTouches.length ? event.changedTouches[0] : event;

  eventVector.x = (eventObj.clientX / window.innerWidth) * 2 - 1;
  eventVector.y = -(eventObj.clientY / window.innerHeight) * 2 + 1;
  return eventVector;
};

const handleStartEvent = event => {
  if (isRotating) {
    return;
  }

  const startVector = getEventVector(event);
  startObject = getSelectedObject(startVector);
  controls.enabled = !startObject;
};
controls.domElement.addEventListener('pointerdown', handleStartEvent);
controls.domElement.addEventListener('touchstart', handleStartEvent);

const handleEndEvent = event => {
  if (isRotating) {
    return;
  }

  const endVector = getEventVector(event);
  const endObject = getSelectedObject(endVector);

  if (startObject && endObject) {
    const rotationDetails = getRotationDetails(cube, controls, startObject, endObject);
    if (rotationDetails) {
      scheduleRotation(rotationDetails);
      sound.play();
    }
    startObject = null;
  }

  controls.enabled = true;
};
controls.domElement.addEventListener('pointerup', handleEndEvent);
controls.domElement.addEventListener('touchend', handleEndEvent);

// handle window resize
window.addEventListener('resize', debounce(() => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}));

const handleScrambling = () => {
  const { overlay, scrambleCount, counterText } = scrambleInfo;
  if (scrambleInfo.isScrambling && !isRotating) {
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

// render
const render = () => {
  requestAnimationFrame(render);

  controls.update();

  const delta = clock.getDelta();

  if (!rotatorObject.quaternion.equals(targetQuaternion)) {
    const step = (scrambleInfo.isScrambling ? scrambleInfo.scramblingSpeed : rotatingSpeed) * delta;
    rotatorObject.quaternion.rotateTowards(targetQuaternion, step);
  } else {
    if (rotatorObject.children.length) {
      rotatorObject.children.forEach(child => cube.attach(child));
    }
  }

  if (cube.children.length === CUBE_CHILDREN_COUNT) {
    isRotating = false;
  }

  handleScrambling();

  renderer.render(scene, camera);
};

render();
