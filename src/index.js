import initScene from './initScene';
import { createRubiks } from './createRubiks';
import { debounce } from './utils';
import { doRotate, doScramble, rotateInfo } from './rotateRubiks';
import { initHtmlControls, initPointerAndTouchListeners } from './initEventListeners';

const [scene, camera, renderer, controls, sound] = initScene();
const cube = createRubiks();

scene.add(cube);
scene.add(rotateInfo.rotatorObject);

initHtmlControls(cube);

initPointerAndTouchListeners(cube, controls, camera, sound);

// handle window resize
window.addEventListener('resize', debounce(() => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}));

// render
const render = () => {
  requestAnimationFrame(render);

  doRotate(cube);
  doScramble(cube);

  renderer.render(scene, camera);
};

render();
