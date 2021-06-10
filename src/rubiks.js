const DEFAULT_CUBE_SIZE = 3;

const AXLES = ['x', 'y', 'z'];

const DELTA_THRESHOLD = 50;

const getAxisToRotate = (absDeltaX, absDeltaY, orbitHorizontal) => {
  console.log(orbitHorizontal, absDeltaX, absDeltaY);
  if (-45 < orbitHorizontal && orbitHorizontal < 45) {
    return absDeltaX > absDeltaY ? 'y' : 'x';
  }

  if (45 <= orbitHorizontal && orbitHorizontal < 135) {
    return absDeltaX > absDeltaY ? 'x' : 'z';
  }

  return absDeltaX > absDeltaY ? 'x' : 'y';
};

export const getRotationDetails = (orbitControls, startObject, startCoordinates, endCoordinates) => {
  const startPosition = startObject.position.round();

  const deltaX = endCoordinates.x - startCoordinates.x;
  const deltaY = endCoordinates.y - startCoordinates.y;

  if (Math.abs(deltaX) < DELTA_THRESHOLD && Math.abs(deltaY) < DELTA_THRESHOLD) {
    return null;
  }

  const orbitHorizontal = orbitControls.getAzimuthalAngle() * 180 / Math.PI;
  const axisToRotate = getAxisToRotate(Math.abs(deltaX), Math.abs(deltaY), orbitHorizontal);

  const direction = (() => {
    if (axisToRotate === 'x') {
      return Math.sign(deltaY);
    }

    if (axisToRotate === 'y') {
      return Math.sign(deltaX);
    }

    if (axisToRotate === 'z') {
      return Math.sign(deltaY) * -1;
    }
  })();

  return {
    axisToRotate,
    layer: startPosition[axisToRotate],
    direction
  };
};

export const getScrambleRotation = size => {
  const axisToRotate = AXLES[Math.floor(Math.random() * Math.floor(3))];
  const layer = Math.floor(Math.random() * Math.floor(size));
  const direction = Math.floor(Math.random() * Math.floor(2)) ? 1 : -1;

  return {
    axisToRotate,
    layer,
    direction
  };
};

// TODO: investigate if this could be done in a simpler way
export const getVisibleCubeFaces = size => {
  const faces = [];

  // Back
  faces.push([1, 3, 5]); // corner 1
  for (let i = 0; i < size - 2; i++) {
    faces.push([3, 5]);
  }
  faces.push([0, 3, 5]); // corner 2
  if (size > 2) {
    for (let i = 0; i < size - 2; i++) {
      faces.push([1, 5]);
      for (let j = 0; j < size - 2; j++) {
        faces.push([5]);
      }
      faces.push([0, 5]);
    }
  }
  faces.push([1, 2, 5]); // corner 3
  for (let i = 0; i < size - 2; i++) {
    faces.push([2, 5]);
  }
  faces.push([0, 2, 5]); // corner 4
  // Center
  if (size > 2) {
    for (let k = 0; k < size - 2; k++) {
      faces.push([1, 3]);
      for (let i = 0; i < size - 2; i++) {
        faces.push([3]);
      }
      faces.push([0, 3]);
      for (let i = 0; i < size - 2; i++) {
        faces.push([1]);
        for (let j = 0; j < size - 2; j++) {
          faces.push([]);
        }
        faces.push([0]);
      }
      faces.push([1, 2]);
      for (let i = 0; i < size - 2; i++) {
        faces.push([2]);
      }
      faces.push([0, 2]);
    }
  }
  // Front
  faces.push([1, 3, 4]); // corner 5
  for (let i = 0; i < size - 2; i++) {
    faces.push([3, 4]);
  }
  faces.push([0, 3, 4]); // corner 6
  if (size > 2) {
    for (let i = 0; i < size - 2; i++) {
      faces.push([1, 4]);
      for (let j = 0; j < size - 2; j++) {
        faces.push([4]);
      }
      faces.push([0, 4]);
    }
  }
  faces.push([1, 2, 4]); // corner 7
  for (let i = 0; i < size - 2; i++) {
    faces.push([2, 4]);
  }
  faces.push([0, 2, 4]); // corner 8

  return faces;
}

export const getCubeSize = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const sizeSelector = document.getElementById('size-select');

  const size = queryParams.get('size');
  if (size) {
    sizeSelector.value = size;
  } else {
    queryParams.set('size', DEFAULT_CUBE_SIZE);
    sizeSelector.value = DEFAULT_CUBE_SIZE;
    history.replaceState(null, null, `?${queryParams.toString()}`);
  }

  return size || DEFAULT_CUBE_SIZE;
};
