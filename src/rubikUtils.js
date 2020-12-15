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
