import {
  BoxBufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
} from 'three';

import { getVisibleCubeFaces } from './rubikUtils';

const getMaterials = (size, cubeIndex) => {
  const visibleCubeFaces = getVisibleCubeFaces(size);
  const faces = visibleCubeFaces[cubeIndex];
  // red, orange, white, yellow, green, blue
  return [0xb90000, 0xff5900, 0xffffff, 0xffd500, 0x009b48, 0x0045ad].map(
    (color, index) =>
      new MeshBasicMaterial({ color: faces.includes(index) ? color : 0x222222 })
  );
};

export const createRubiks = (size = 3) => {
  const geometry = new BoxBufferGeometry(0.96, 0.96, 0.96);

  const mesh = new Group();
  const meshPosition = (size / 2 - 0.5) * -1;
  mesh.position.set(meshPosition, meshPosition, meshPosition);

  let index = 0;
  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const smallCube = new Mesh(geometry, getMaterials(size, index++));
        smallCube.position.set(x, y, z);
        mesh.add(smallCube);
      }
    }
  }

  return mesh;
};
