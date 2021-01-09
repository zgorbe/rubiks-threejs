import { Raycaster, Vector2 } from 'three';
import { getRotationDetails } from './rubikUtils';
import { scheduleRotation, rotateInfo, scrambleInfo } from './rotateRubiks';

const raycaster = new Raycaster();

export const initHtmlControls = () => {
  document.getElementById('restart-btn').addEventListener('click', () => window.location.reload());
  document.getElementById('scramble-btn').addEventListener('click', () => {
    scrambleInfo.overlay.style.display = 'block';
    scrambleInfo.isScrambling = true;
  });

  const sizeSelector = document.getElementById('size-select');

  sizeSelector.addEventListener('change', () => {
    const url = window.location.href.split('?')[0];
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('size', sizeSelector.value);
    window.location.href = `${url}?${queryParams.toString()}`;
  });
};

export const initPointerAndTouchListeners = (cube, controls, camera, sound) => {
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
    if (rotateInfo.isRotating) {
      return;
    }

    const startVector = getEventVector(event);
    startObject = getSelectedObject(startVector);
    controls.enabled = !startObject;
  };
  controls.domElement.addEventListener('pointerdown', handleStartEvent);
  controls.domElement.addEventListener('touchstart', handleStartEvent);

  const handleEndEvent = event => {
    if (rotateInfo.isRotating) {
      return;
    }

    const endVector = getEventVector(event);
    const endObject = getSelectedObject(endVector);

    if (startObject && endObject) {
      const rotationDetails = getRotationDetails(controls, startObject, endObject);
      if (rotationDetails) {
        scheduleRotation(cube, rotationDetails);
        sound.play();
      }
      startObject = null;
    }

    controls.enabled = true;
  };
  controls.domElement.addEventListener('pointerup', handleEndEvent);
  controls.domElement.addEventListener('touchend', handleEndEvent);
};
