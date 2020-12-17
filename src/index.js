import { createRubiks } from './createRubiks';
import initScene from './initScene';
import { debounce } from './utils';
import { getFaceToRotate } from './rubikUtils';

import {
  Clock,
  Object3D,
  Quaternion,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';

const SIZE = 3;
const [scene, camera, renderer, controls] = initScene(SIZE);

const cube = createRubiks(SIZE);

// add cube to scene
scene.add(cube);

// stuff needed for rotating the cube
const raycaster = new Raycaster();
const targetQuaternion = new Quaternion();
const clock = new Clock();
const rotatingSpeed = 2;
const rotatorObject = new Object3D();
scene.add(rotatorObject);

let isRotating = false;
let startObject;

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
  if (startVector.x !== 0 && startVector.y !== 0) {
    startObject = getSelectedObject(startVector);
    controls.enabled = !startObject;
  }
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
    const face = getFaceToRotate(cube, controls, startObject, endObject);
    if (face) {
      isRotating = true;
      rotatorObject.quaternion.identity();
      face.forEach(f => rotatorObject.attach(f));
      targetQuaternion.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
    }
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

// render
const render = () => {
  requestAnimationFrame(render);

  controls.update();

  const delta = clock.getDelta();

  if (!rotatorObject.quaternion.equals(targetQuaternion)) {
    const step = rotatingSpeed * delta;
    rotatorObject.quaternion.rotateTowards(targetQuaternion, step);
  } else {
    rotatorObject.children.forEach(child => cube.attach(child));
    isRotating = false;
  }

  renderer.render(scene, camera);
};

render();
