import { Jarallax, JarallaxImage, JarallaxVideo } from 'jarallax/react';

export default function App() {
  return (
    <>
      <section className="section section-intro">
        <div className="section-inner">
          <p className="eyebrow">Jarallax</p>
          <h1>React Example</h1>
          <div className="lede">
            A small component-based setup with an image background and a video background.
          </div>
        </div>
      </section>

      <Jarallax className="hero" options={{ speed: 0.35 }}>
        <JarallaxImage src="https://jarallax.nkdev.info/images/image-1.jpg" alt="" />
        <div className="hero-content">
          <p className="eyebrow">Image Parallax</p>
          <h2>Component Image Example</h2>
          <p className="hero-text">
            Render the wrapper and image components, then tune parallax with options.
          </p>
        </div>
      </Jarallax>

      <section className="section section-copy">
        <div className="section-inner panel">
          <p className="eyebrow">React API</p>
          <p>
            The React entry keeps imports SSR-safe and delays Jarallax initialization until the
            client mount.
          </p>
        </div>
      </section>

      <JarallaxVideo
        className="hero hero-video"
        options={{ speed: -0.2 }}
        videoSrc="https://youtu.be/mru3Q5m4lkY"
      >
        <div className="hero-content">
          <p className="eyebrow">Video Parallax</p>
          <h2>Component Video Example</h2>
          <p className="hero-text">
            Use the same structure when the background source is YouTube or Vimeo.
          </p>
        </div>
      </JarallaxVideo>
    </>
  );
}
