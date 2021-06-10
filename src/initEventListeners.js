import { Raycaster, Vector2 } from 'three';
import { getRotationDetails } from './rubiks';
import { scheduleFlip, scheduleRotation, rotateInfo, scrambleInfo } from './rotations';

const raycaster = new Raycaster();

export const initHtmlControls = (cube, sound) => {
  const restartButton = document.getElementById('restart-btn');
  const scrambleButton = document.getElementById('scramble-btn');
  const undoButton = document.getElementById('undo-btn');
  const flipButton = document.getElementById('flip-btn');
  const sizeSelector = document.getElementById('size-select');
  const debugCheckbox = document.getElementById('debug-checkbox');

  restartButton.addEventListener('click', () => window.location.reload());
  scrambleButton.addEventListener('click', () => {
    scrambleInfo.overlay.style.display = 'block';
    scrambleInfo.isScrambling = true;
    rotateInfo.rotateHistory.length = 0;
    undoButton.disabled = true;
  });

  flipButton.addEventListener('click', () => {
    scheduleFlip(cube);
  });

  undoButton.addEventListener('click', () => {
    if (rotateInfo.isRotating) {
      return;
    }

    scheduleRotation(cube, rotateInfo.rotateHistory.pop());
    sound.play();
    if (!rotateInfo.rotateHistory.length) {
      undoButton.disabled = true;
    }
  });

  sizeSelector.addEventListener('change', () => {
    const url = window.location.href.split('?')[0];
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('size', sizeSelector.value);
    window.location.href = `${url}?${queryParams.toString()}`;
  });

  debugCheckbox.addEventListener('change', () => {
    rotateInfo.overlay.style.display = debugCheckbox.checked ? 'block' : 'none';
  });
};

const logRotationDebug = (controls, startObject, endObject) => {
  const startPosition = startObject.position.round();
  const endPosition = endObject.position.round();
  const azimuthalAngle = Math.floor(controls.getAzimuthalAngle() * 180 / Math.PI);
  const polarAngle = Math.floor(controls.getPolarAngle() * 180 / Math.PI);

  const positions = document.createTextNode(
    `Start:(${startPosition.x}, ${startPosition.y}, ${startPosition.z}), end:(${endPosition.x}, ${endPosition.y}, ${endPosition.z})`
  );
  const angles = document.createTextNode(`Azimuthal angle: ${azimuthalAngle}°, polar angle: ${polarAngle}°`);
  const p = document.createElement('p');
  p.appendChild(positions);
  p.appendChild(document.createElement('br'));
  p.appendChild(angles);
  rotateInfo.overlay.appendChild(p);
  rotateInfo.overlay.scrollTop = rotateInfo.overlay.scrollHeight;
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
    const { rotateHistory } = rotateInfo;

    if (rotateInfo.isRotating) {
      return;
    }

    const endVector = getEventVector(event);
    const endObject = getSelectedObject(endVector);

    if (startObject && endObject) {
      const rotationDetails = getRotationDetails(controls, startObject, endObject);
      if (rotationDetails) {
        if (rotateInfo.overlay.style.display === 'block') {
          logRotationDebug(controls, startObject, endObject);
        }

        scheduleRotation(cube, rotationDetails);
        document.getElementById('undo-btn').disabled = false;
        rotateHistory.push({
          axisToRotate: rotationDetails.axisToRotate,
          layer: rotationDetails.layer,
          direction: rotationDetails.direction * -1
        });
        if (rotateHistory.length > rotateInfo.maxHistoryLength) {
          rotateHistory.shift();
        }
        sound.play();
      }
      startObject = null;
    }

    controls.enabled = true;
  };
  controls.domElement.addEventListener('pointerup', handleEndEvent);
  controls.domElement.addEventListener('touchend', handleEndEvent);
};
