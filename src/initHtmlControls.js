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
