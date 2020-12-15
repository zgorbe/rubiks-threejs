import {
  BoxBufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
} from 'three';

// for 3x3x3 cube only :(
const visibleCubeFaces = [
  // Back
  [1, 3, 5],
  [3, 5],
  [0, 3, 5],
  [1, 5],
  [5],
  [0, 5],
  [1, 2, 5],
  [2, 5],
  [0, 2, 5],
  // Center
  [1, 3],
  [3],
  [0, 3],
  [1],
  [],
  [0],
  [1, 2],
  [2],
  [0, 2],
  // Front
  [1, 3, 4],
  [3, 4],
  [0, 3, 4],
  [1, 4],
  [4],
  [0, 4],
  [1, 2, 4],
  [2, 4],
  [0, 2, 4],
];


const getMaterials = (size, cubeIndex) => {
  if (size === 3) {
    const visibleFaces = visibleCubeFaces[cubeIndex];
    // red, orange, white, yellow, green, blue
    return [0xb90000, 0xff5900, 0xffffff, 0xffd500, 0x009b48, 0x0045ad].map(
      (color, index) =>
        new MeshBasicMaterial({ color: visibleFaces ? visibleFaces.includes(index) ? color : 0x222222 : color })
    );
  }

  return [0xb90000, 0xff5900, 0xffffff, 0xffd500, 0x009b48, 0x0045ad].map(
    color => new MeshBasicMaterial({ color })
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
