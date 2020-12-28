import { getScrambleRotation } from './rubikUtils';

const DEFAULT_CUBE_SIZE = 3;
const SCRAMBLE_COUNT = 50;
const SCRAMBLE_TIMEOUT = 300;

const handleScrambleClick = (cube, handleScrambleRotation) => {
  const overlay = document.getElementById('scramble-overlay');
  const scrambleCounter = document.getElementById('scramble-counter');
  const queryParams = new URLSearchParams(window.location.search);
  const size = queryParams.get('size');

  overlay.style.display = 'block';
  let counter = 0;
  const doRotation = () => {
    if (document.hidden) {
      overlay.style.display = 'none';
      handleScrambleRotation(null, false);
      return;
    }
    const rotation = getScrambleRotation(cube, size);
    handleScrambleRotation(rotation, counter === SCRAMBLE_COUNT);

    // TODO: investigate if this timeout based scrambling could be replaced with a more robust one
    if (counter < SCRAMBLE_COUNT) {
      setTimeout(doRotation, SCRAMBLE_TIMEOUT);
      counter++;
    } else {
      overlay.style.display = 'none';
    }
    scrambleCounter.innerText = `${counter} of ${SCRAMBLE_COUNT} steps`;
  };

  doRotation();
}

export const initHtmlControls = (cube, handleScrambleRotation) => {
  document.getElementById('restart-btn').addEventListener('click', () => window.location.reload());
  document.getElementById('scramble-btn').addEventListener('click', () => handleScrambleClick(cube, handleScrambleRotation));

  const sizeSelector = document.getElementById('size-select');
  const queryParams = new URLSearchParams(window.location.search);

  sizeSelector.addEventListener('change', () => {
    const url = window.location.href.split('?')[0];
    queryParams.set('size', sizeSelector.value);
    window.location.href = `${url}?${queryParams.toString()}`;
  });
};

export const initSizeParameter = () => {
  const sizeSelector = document.getElementById('size-select');
  const queryParams = new URLSearchParams(window.location.search);

  const sizeParam = queryParams.get('size');
  if (sizeParam) {
    sizeSelector.value = sizeParam;
  } else {
    queryParams.set('size', DEFAULT_CUBE_SIZE);
    sizeSelector.value = DEFAULT_CUBE_SIZE;
    history.replaceState(null, null, `?${queryParams.toString()}`);
  }
};
