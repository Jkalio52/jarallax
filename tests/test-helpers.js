export function createRect({ top = 0, left = 0, width = 320, height = 180 } = {}) {
  return {
    top,
    left,
    width,
    height,
    bottom: top + height,
    right: left + width,
    x: left,
    y: top,
    toJSON() {
      return this;
    },
  };
}

export function stubElementRect(element, initialRect = {}) {
  let rect = createRect(initialRect);

  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => createRect(rect),
  });

  return (nextRect) => {
    rect = createRect({
      ...rect,
      ...nextRect,
    });

    return rect;
  };
}

export function createJarallaxBlock({
  mode = 'background',
  image = 'https://via.placeholder.com/100x50',
  rect,
} = {}) {
  const block = document.createElement('div');
  block.className = 'jarallax';
  block.style.width = '320px';
  block.style.height = '180px';
  block.style.display = 'block';
  block.style.position = 'relative';

  stubElementRect(block, rect);

  if (mode === 'background') {
    block.style.backgroundImage = `url("${image}")`;
  } else {
    const img = document.createElement('img');
    img.className = 'jarallax-img';
    img.src = image;
    img.alt = '';
    stubElementRect(img, rect);
    block.appendChild(img);
  }

  document.body.appendChild(block);

  return block;
}
