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

const [scene, camera, renderer, controls] = initScene();

const cube = createRubiks();

// add cube to scene
scene.add(cube);


// mouse and raycaster
const mouse = new Vector2();
const mouseStart = new Vector2();
const raycaster = new Raycaster();

// stuff needed for rotating the cube
const targetQuaternion = new Quaternion();
const clock = new Clock();
const rotatingSpeed = 2;
const rotatorObject = new Object3D();
scene.add(rotatorObject);

let isRotating = false;

const getSelectedObject = mouse => {
  if (mouse && mouse.x !== 0 && mouse.y !== 0) {
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(cube.children);

    if (intersects.length) {
      return intersects[0].object;
    }
  }

  return null;
};

window.addEventListener('mousedown', () => {
  if (isRotating) {
    return;
  }
  mouseStart.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseStart.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('mouseup', () => {
  if (isRotating) {
    return;
  }

  const mouseEnd = new Vector2();
  mouseEnd.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseEnd.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const startObject = getSelectedObject(mouseStart);
  const endObject = getSelectedObject(mouseEnd);

  if (startObject && endObject) {
    const face = getFaceToRotate(cube, controls, startObject, endObject);
    if (face) {
      isRotating = true;
      rotatorObject.quaternion.identity();
      face.forEach(f => rotatorObject.attach(f));
      targetQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
    }
  }

  mouseStart.x = 0;
  mouseStart.y = 0;
});

window.addEventListener('mousemove', () => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (mouse.x !== 0 && mouse.y !== 0) {
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(cube.children);

    if (intersects.length) {
      controls.enabled = false;
    } else {
      controls.enabled = true;
    }
  }
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
