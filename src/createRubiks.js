import {
  BoxBufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
} from 'three';

import { getCubeSize, getVisibleCubeFaces } from './rubikUtils';

// red, orange, white, yellow, green, blue
const COLORS = [0xb90000, 0xff5900, 0xffffff, 0xffd500, 0x009b48, 0x0045ad];
const INSIDE_COLOR = 0x222222;
const SIZE = getCubeSize();
const VISIBLE_CUBE_FACES = getVisibleCubeFaces(SIZE);

const getMaterials = cubeIndex => {
  const faces = VISIBLE_CUBE_FACES[cubeIndex];
  return COLORS.map((color, index) => {
    const parameters = { color: faces.includes(index) ? color : INSIDE_COLOR };
    return SIZE > 6 ? new MeshBasicMaterial(parameters) : new MeshPhongMaterial(parameters);
  });
};

export const createRubiks = () => {
  const geometry = new BoxBufferGeometry(0.96, 0.96, 0.96);

  const mesh = new Group();
  const meshPosition = (SIZE / 2 - 0.5) * -1;
  mesh.position.set(meshPosition, meshPosition, meshPosition);

  let index = 0;
  for (let z = 0; z < SIZE; z++) {
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const smallCube = new Mesh(geometry, getMaterials(index++));
        smallCube.position.set(x, y, z);
        mesh.add(smallCube);
      }
    }
  }

  return mesh;
};
