export function createJarallaxBlock({
  mode = 'background',
  image = 'https://via.placeholder.com/100x50',
} = {}) {
  const block = document.createElement('div');
  block.className = 'jarallax';
  block.style.width = '320px';
  block.style.height = '180px';
  block.style.display = 'block';
  block.style.position = 'relative';

  Object.defineProperty(block, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      top: 0,
      left: 0,
      width: 320,
      height: 180,
      bottom: 180,
      right: 320,
      x: 0,
      y: 0,
      toJSON() {
        return this;
      },
    }),
  });

  if (mode === 'background') {
    block.style.backgroundImage = `url("${image}")`;
  } else {
    const img = document.createElement('img');
    img.className = 'jarallax-img';
    img.src = image;
    img.alt = '';
    Object.defineProperty(img, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        top: 0,
        left: 0,
        width: 320,
        height: 180,
        bottom: 180,
        right: 320,
        x: 0,
        y: 0,
        toJSON() {
          return this;
        },
      }),
    });
    block.appendChild(img);
  }

  document.body.appendChild(block);

  return block;
}
