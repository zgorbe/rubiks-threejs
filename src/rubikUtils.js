const isOnSameFace = (vectorA, vectorB) => {
  let delta = 0;

  if (vectorA.x !== vectorB.x) delta++;
  if (vectorA.y !== vectorB.y) delta++;
  if (vectorA.z !== vectorB.z) delta++;

  return delta === 1;
};

export const getFaceToRotate = (cube, orbitControls, startObject, endObject) => {
  const startPosition = startObject.position.round();
  const endPosition = endObject.position.round();

  if (!startPosition.equals(endPosition) && isOnSameFace(startPosition, endPosition)) {
    console.log(startPosition);
    console.log(endPosition);

    console.log(orbitControls.getAzimuthalAngle() * 180 / Math.PI);
    console.log(orbitControls.getPolarAngle() * 180 / Math.PI);

    return cube.children.filter(child => child.position.x === 1);
  }

  return null;
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
