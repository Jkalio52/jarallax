'use client';

import { Jarallax, JarallaxImage, JarallaxVideo } from 'jarallax/react';

export default function Page() {
  return (
    <>
      <section className="section section-intro">
        <div className="section-inner">
          <p className="eyebrow">Jarallax</p>
          <h1>Next.js App Router Example</h1>
          <p className="lede">
            A minimal client component with the same React API used in the package docs.
          </p>
        </div>
      </section>

      <Jarallax className="hero" options={{ speed: 0.2 }}>
        <JarallaxImage src="https://jarallax.nkdev.info/images/image-1.jpg" alt="" />
        <div className="hero-content">
          <p className="eyebrow">Image Parallax</p>
          <h2>App Router Image Example</h2>
          <p className="hero-text">Use `Jarallax` and `JarallaxImage` inside a client page.</p>
        </div>
      </Jarallax>

      <section className="section section-copy">
        <div className="section-inner panel">
          <p className="eyebrow">Next.js</p>
          <p>
            The page stays simple: import the React entry in a client component and let Jarallax
            initialize after mount.
          </p>
        </div>
      </section>

      <JarallaxVideo
        className="hero hero-video"
        options={{ speed: 0.2 }}
        videoSrc="https://youtu.be/mru3Q5m4lkY"
      >
        <div className="hero-content">
          <p className="eyebrow">Video Parallax</p>
          <h2>App Router Video Example</h2>
          <p className="hero-text">
            Swap the source type without changing the overall page structure.
          </p>
        </div>
      </JarallaxVideo>
    </>
  );
}
