import {
  BoxBufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
} from 'three';


export const createRubiks = () => {
  const geometry = new BoxBufferGeometry(0.98, 0.98, 0.98);
  const materials =
    // red, orange, white, yellow, green, blue
    [0xb90000, 0xff5900, 0xffffff, 0xffd500, 0x009b48, 0x0045ad].map(
      color => new MeshBasicMaterial({ color })
    );
  const cube = new Mesh(geometry, materials);

  const mesh = new Group();
  mesh.position.set(-1, -1, -1);

  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      for (let x = 0; x < 3; x++) {
        const smallCube = cube.clone();
        smallCube.position.set(x, y, z);
        mesh.add(smallCube);
      }
    }
  }

  return mesh;
};

export const rotateCubes = cube => {
  cube.instanceMatrix.needsUpdate = true;
};
