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

controls.domElement.addEventListener('pointerdown', event => {
  if (isRotating) {
    return;
  }

  const mouseStart = new Vector2();
  mouseStart.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseStart.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (mouseStart.x !== 0 && mouseStart.y !== 0) {
    startObject = getSelectedObject(mouseStart);
    controls.enabled = !startObject;
  }
});

controls.domElement.addEventListener('pointerup', event => {
  if (isRotating) {
    return;
  }

  const mouseEnd = new Vector2();
  mouseEnd.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseEnd.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const endObject = getSelectedObject(mouseEnd);

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
});

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
