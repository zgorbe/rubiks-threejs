import {
  BoxBufferGeometry,
  DynamicDrawUsage,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
} from 'three';

const dummy = new Object3D();

export const createRubiks = () => {
  const geometry = new BoxBufferGeometry(0.98, 0.98, 0.98);
  const materials =
    // red, orange, white, yellow, green, blue
    [0xb90000, 0xff5900, 0xffffff, 0xffd500, 0x009b48, 0x0045ad].map(
      color => new MeshBasicMaterial({ color })
    );

  const mesh = new InstancedMesh(geometry, materials, 27);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  mesh.position.set(-1, -1, -1);
  let i = 0;
  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      for (let x = 0; x < 3; x++) {
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        mesh.setMatrixAt(i++, dummy.matrix);
      }
    }
  }

  return mesh;
};

export const rotateCubes = cube => {
  cube.instanceMatrix.needsUpdate = true;
};
