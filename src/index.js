import { createRubiks } from './createRubiks';
import initScene from './initScene';
import { debounce } from './utils';
import { getRotationDetails, getSizeParameter } from './rubikUtils';
import { doRotate, doScramble, scheduleRotation, scrambleInfo, rotateInfo } from './rotateRubiks';
import { initHtmlControls } from './initHtmlControls';

import { Raycaster, Vector2 } from 'three';

const SIZE = getSizeParameter();
const [scene, camera, renderer, controls, sound] = initScene(SIZE);
const cube = createRubiks(SIZE);
const raycaster = new Raycaster();

scene.add(cube);
scene.add(rotateInfo.rotatorObject);

initHtmlControls(function handleScrambleClick() {
  scrambleInfo.overlay.style.display = 'block';
  scrambleInfo.isScrambling = true;
});

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
  if (rotateInfo.isRotating) {
    return;
  }

  const startVector = getEventVector(event);
  rotateInfo.startObject = getSelectedObject(startVector);
  controls.enabled = !rotateInfo.startObject;
};
controls.domElement.addEventListener('pointerdown', handleStartEvent);
controls.domElement.addEventListener('touchstart', handleStartEvent);

const handleEndEvent = event => {
  if (rotateInfo.isRotating) {
    return;
  }

  const endVector = getEventVector(event);
  const endObject = getSelectedObject(endVector);

  if (rotateInfo.startObject && endObject) {
    const rotationDetails = getRotationDetails(cube, controls, rotateInfo.startObject, endObject);
    if (rotationDetails) {
      scheduleRotation(rotationDetails);
      sound.play();
    }
    rotateInfo.startObject = null;
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

  doRotate(cube, SIZE);
  doScramble(cube, SIZE);

  renderer.render(scene, camera);
};

render();
