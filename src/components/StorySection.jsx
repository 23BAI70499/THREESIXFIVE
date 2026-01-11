import { useRef, useEffect } from 'react'

export default function StorySection({ image, text, timeline, mood, isActive }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.setProperty('--opacity', isActive ? '1' : '0')
    ref.current.style.setProperty('--scale', isActive ? '1.02' : '1.08')
    ref.current.style.setProperty('--text-opacity', isActive ? '1' : '0')
  }, [isActive])

  return (
    <section ref={ref} className={`story-section story-section--${mood}`}>
      <div className="image-container">
        <img src={image} className="story-image" loading="lazy" />
        <div className="overlay" />
      </div>

      {/* timeline label */}
      <div className="timeline-label">
        {timeline}
      </div>

      {/* main text */}
      <div className="text-container">
        <p className="story-text">{text}</p>
      </div>
    </section>
  )
}
