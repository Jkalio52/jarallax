export default function JarallaxImage({ className = "", ...props }) {
  return <img className={`jarallax-img ${className}`.trim()} {...props} />;
}
