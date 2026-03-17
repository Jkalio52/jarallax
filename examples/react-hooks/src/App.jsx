import { useJarallax, useJarallaxVideo } from 'jarallax/react';

function ImageHookExample() {
  const ref = useJarallax({
    options: {
      speed: 0.35,
    },
  });

  return (
    <section ref={ref} className="jarallax hero">
      <img className="jarallax-img" src="https://jarallax.nkdev.info/images/image-2.jpg" alt="" />
      <div className="hero-content">
        <p className="eyebrow">useJarallax</p>
        <h2>Hook Image Example</h2>
        <p className="hero-text">
          Keep full control over the markup while Jarallax handles the effect.
        </p>
      </div>
    </section>
  );
}

function VideoHookExample() {
  const ref = useJarallaxVideo({
    options: {
      speed: -0.2,
    },
    videoSrc: 'https://youtu.be/mru3Q5m4lkY',
  });

  return (
    <section ref={ref} className="jarallax hero hero-video">
      <img className="jarallax-img" src="https://jarallax.nkdev.info/images/image-3.jpg" alt="" />
      <div className="hero-content">
        <p className="eyebrow">useJarallaxVideo</p>
        <h2>Hook Video Example</h2>
        <p className="hero-text">
          Start from custom HTML and add a video background only where you need it.
        </p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <section className="section section-intro">
        <div className="section-inner">
          <p className="eyebrow">Jarallax</p>
          <h1>React Hooks Example</h1>
          <div className="lede">
            A minimal setup for projects that want custom markup with the React hook API.
          </div>
        </div>
      </section>

      <ImageHookExample />

      <section className="section section-copy">
        <div className="section-inner panel">
          <p className="eyebrow">Custom Markup</p>
          <p>
            The hooks attach Jarallax to your own DOM structure, so you can keep existing section,
            heading, and media markup intact.
          </p>
        </div>
      </section>

      <VideoHookExample />
    </>
  );
}
