const DEFAULT_CUBE_SIZE = 3;

export const initHtmlControls = handleScrambleClick => {
  document.getElementById('restart-btn').addEventListener('click', () => window.location.reload());
  document.getElementById('scramble-btn').addEventListener('click', handleScrambleClick);

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
