import {
  BoxBufferGeometry,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
} from 'three';

import { getCubeSize, getVisibleCubeFaces } from './rubiks';

// red, orange, white, yellow, green, blue
const COLORS = [0xb90000, 0xff5900, 0xffffff, 0xffd500, 0x009b48, 0x0045ad];
const INSIDE_COLOR = 0x222222;
const SIZE = getCubeSize();
const VISIBLE_CUBE_FACES = getVisibleCubeFaces(SIZE);
const EDGE_LINE_WIDTHS = {
  2: 6,
  3: 5,
  4: 4,
  5: 3
};
const DEFAULT_EDGE_LINE_WIDTH = 2;

const getMaterials = cubeIndex => {
  const faces = VISIBLE_CUBE_FACES[cubeIndex];
  return COLORS.map((color, index) =>
    new MeshPhongMaterial({ color: faces.includes(index) ? color : INSIDE_COLOR, shininess: 50 })
  );
};

export const createRubiks = () => {
  const geometry = new BoxBufferGeometry(0.96, 0.96, 0.96);
  const edgeMaterial = new LineBasicMaterial({
    color: INSIDE_COLOR,
    linewidth: EDGE_LINE_WIDTHS[SIZE] || DEFAULT_EDGE_LINE_WIDTH
  });

  const mesh = new Group();
  const meshPosition = (SIZE / 2 - 0.5) * -1;
  mesh.position.set(meshPosition, meshPosition, meshPosition);

  let index = 0;
  for (let z = 0; z < SIZE; z++) {
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const isVisible = !!VISIBLE_CUBE_FACES[index].length;
        // add only visible small cubes to the group of cubes, inner small cubes are not rendered
        if (isVisible) {
          const smallCube = new Mesh(geometry, getMaterials(index));
          smallCube.position.set(x, y, z);
          mesh.add(smallCube);
          const edges = new EdgesGeometry(geometry);
          const lines = new LineSegments(edges, edgeMaterial);
          smallCube.add(lines);
        }
        index++;
      }
    }
  }

  return mesh;
};
