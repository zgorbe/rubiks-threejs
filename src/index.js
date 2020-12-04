import { createRubiks, rotateCubes } from './createRubiks';
import initScene from './initScene';
import { debounce } from './utils';

import {
  Object3D,
  Raycaster,
  Vector2
} from 'three';

const [scene, camera, renderer, controls] = initScene();

const cube = createRubiks();
const dummy = new Object3D();

// add cube to scene
scene.add(cube);

// handle window resize
window.addEventListener('resize', debounce(() => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}));

// mouse and raycaster
const mouse = new Vector2();
window.addEventListener('mousemove', () => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
const raycaster = new Raycaster();

// render
const render = () => {
  requestAnimationFrame(render);
  // cube.rotateOnAxis(new THREE.Vector3(1, 1, 1).normalize(), 0.01);
  controls.update();

  if (mouse.x !== 0 && mouse.y !== 0) {
    raycaster.setFromCamera(mouse, camera);
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(cube.children);

    if (intersects.length) {
      // const instanceId = intersects[0].instanceId;
      console.log(intersects.map(item => item.object.position));
    }
  }
  renderer.render(scene, camera);
};

render();
