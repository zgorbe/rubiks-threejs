import {
  Audio,
  AudioListener,
  AudioLoader,
  AxesHelper,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const initScene = size => {
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(size, size, size * 2);

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new Color(0xAACCDD));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = false;

  document.body.appendChild(renderer.domElement);

  // orbiting camera with mouse
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.update();

  // coordinate system axes: X - red, Y - green, Z - blue
  // const axesHelper = new AxesHelper(5);
  // scene.add(axesHelper);

  const listener = new AudioListener();
  const sound = new Audio(listener);
  const audioLoader = new AudioLoader();
  const wavUrl = `${window.location.origin}${window.location.pathname}sounds/rotate.wav`;
  audioLoader.load(wavUrl, function(buffer) {
    sound.setBuffer(buffer);
    sound.setVolume(0.5);
  });

  return [scene, camera, renderer, controls, sound];
};

export default initScene;
