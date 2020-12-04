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
const mouseStart = new Vector2();
const raycaster = new Raycaster();

window.addEventListener('mousedown', () => {
  mouseStart.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseStart.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
window.addEventListener('mouseup', () => {
  const mouseEnd = new Vector2();
  mouseEnd.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseEnd.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (mouseEnd.x !== 0 && mouseEnd.y !== 0) {
    raycaster.setFromCamera(mouseStart, camera);
    let intersects = raycaster.intersectObjects(cube.children);

    if (intersects.length) {
      console.log(intersects[0].object.position);

      raycaster.setFromCamera(mouseEnd, camera);
      intersects = raycaster.intersectObjects(cube.children);

      if (intersects.length) {
        console.log(intersects[0].object.position);
      }
    }
  }
});

window.addEventListener('mousemove', () => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (mouse.x !== 0 && mouse.y !== 0) {
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(cube.children);

    if (intersects.length) {
      controls.enabled = false;
    } else {
      controls.enabled = true;
    }
  }
});

// render
const render = () => {
  requestAnimationFrame(render);
  // cube.rotateOnAxis(new THREE.Vector3(1, 1, 1).normalize(), 0.01);
  controls.update();
  renderer.render(scene, camera);
};

render();
