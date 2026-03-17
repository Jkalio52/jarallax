'use client';

import { useState } from 'react';
import { Jarallax, JarallaxImage } from 'jarallax/react';

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1280&h=720&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1280&h=720&q=80',
  'https://images.unsplash.com/photo-1520975958225-56d1a57a7d84?auto=format&fit=crop&w=1280&h=720&q=80',
  'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1280&h=720&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1280&h=720&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1280&h=720&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1280&h=720&q=80',
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1280&h=720&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1280&h=720&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1280&h=720&q=80',
];

const PARALLAX_TYPES = ['scroll', 'scale', 'opacity', 'scroll-opacity', 'scale-opacity'];
const PARALLAX_SPEEDS = [-0.6, -0.3, 0.15, 0.35, 0.6, 0.9];

function getRandomImage() {
  return IMAGE_POOL[Math.floor(Math.random() * IMAGE_POOL.length)];
}

function getRandomParallaxType() {
  return PARALLAX_TYPES[Math.floor(Math.random() * PARALLAX_TYPES.length)];
}

function getRandomParallaxSpeed() {
  return PARALLAX_SPEEDS[Math.floor(Math.random() * PARALLAX_SPEEDS.length)];
}

export default function Page() {
  const [blocks, updateBlocks] = useState([
    {
      uid: 1,
      options: {
        type: 'scroll',
        src: IMAGE_POOL[0],
        speed: 0.6,
      },
    },
  ]);

  function addNewBlock() {
    updateBlocks((currentBlocks) => {
      const lastBlock = currentBlocks[currentBlocks.length - 1];
      const uid = lastBlock ? lastBlock.uid + 1 : 1;

      return [
        ...currentBlocks,
        {
          uid,
          options: {
            type: getRandomParallaxType(),
            src: getRandomImage(),
            speed: getRandomParallaxSpeed(),
          },
        },
      ];
    });
  }

  function removeBlock(id) {
    updateBlocks((currentBlocks) => currentBlocks.filter((_data, i) => id !== i));
  }

  function changeBlockOptions(id, newOptions) {
    updateBlocks((currentBlocks) =>
      currentBlocks.map((data, i) => {
        if (id === i) {
          return {
            ...data,
            options: {
              ...data.options,
              ...newOptions,
            },
          };
        }

        return data;
      })
    );
  }

  return (
    <>
      <section className="section section-intro">
        <div className="section-inner">
          <p className="eyebrow">Jarallax</p>
          <h1>Next.js Advanced Example</h1>
          <p className="lede">
            Dynamic blocks with runtime option updates and a fixed pool of ready-to-use images.
          </p>
        </div>
      </section>

      <div className="wrapper">
        {blocks.map(({ uid, options }, i) => (
          <div className="jarallax-wrap" key={uid}>
            <Jarallax
              className="hero hero-block"
              options={{
                type: options.type,
                speed: options.speed,
              }}
            >
              <JarallaxImage src={options.src} alt="" />
              <div className="hero-content">
                <p className="eyebrow">Dynamic Block</p>
                <h2>Block {uid}</h2>
              </div>
            </Jarallax>
            <div className="jarallax-controls">
              <div className="form-group">
                <div className="field">
                  <label htmlFor={`parallax-type-${uid}`}>Parallax Type</label>
                  <select
                    id={`parallax-type-${uid}`}
                    className="form-control"
                    value={options.type}
                    onChange={(e) => {
                      changeBlockOptions(i, {
                        type: e.target.value,
                      });
                    }}
                  >
                    <option value="scroll">Scroll</option>
                    <option value="scale">Scale</option>
                    <option value="opacity">Opacity</option>
                    <option value="scroll-opacity">Scroll Opacity</option>
                    <option value="scale-opacity">Scale Opacity</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor={`parallax-speed-${uid}`}>Parallax Speed</label>
                  <input
                    id={`parallax-speed-${uid}`}
                    className="form-control"
                    type="number"
                    min="-1"
                    max="2"
                    step="0.1"
                    value={options.speed}
                    onChange={(e) => {
                      const nextSpeed = Number.parseFloat(e.target.value);

                      changeBlockOptions(i, {
                        speed: Number.isNaN(nextSpeed) ? options.speed : nextSpeed,
                      });
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-remove"
                  onClick={() => {
                    removeBlock(i);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <section className="section section-copy">
          <button type="button" className="btn btn-primary" onClick={addNewBlock}>
            Add Parallax Block
          </button>
        </section>
      </div>
    </>
  );
}
