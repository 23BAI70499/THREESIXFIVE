import { useState, useEffect, useRef, useCallback } from 'react'

const messages = [
  'You made this year easier.',
  'You matter more than you know.',
  "I'm glad it's you."
]

export default function WhisperSection() {
  const [visibleLines, setVisibleLines] = useState([])
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef(null)
  const scrollTimeoutRef = useRef(null)
  const revealTimeoutRef = useRef(null)
  const lastScrollTimeRef = useRef(Date.now())
  const hasStartedRef = useRef(false)

  const revealNext = useCallback((index) => {
    if (index >= messages.length) return

    setVisibleLines((prev) => {
      if (prev.includes(index)) return prev
      return [...prev, index]
    })

    // Calculate delay for next reveal
    // First two lines: 5 seconds, final line: 8 seconds
    const delay = index === messages.length - 2 ? 8000 : 5000

    if (index < messages.length - 1) {
      revealTimeoutRef.current = setTimeout(() => {
        revealNext(index + 1)
      }, delay)
    }
  }, [])

  const startReveal = useCallback(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    // Reveal first line
    revealNext(0)
  }, [revealNext])

  // Intersection Observer to detect when section enters viewport
  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting)
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Scroll stillness detection
  useEffect(() => {
    if (!isInView) return

    const handleScroll = () => {
      lastScrollTimeRef.current = Date.now()

      // Clear any pending reveals (pause the reveal)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = null
      }
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current)
        revealTimeoutRef.current = null
      }

      // Wait for stillness before resuming reveals
      scrollTimeoutRef.current = setTimeout(() => {
        if (!hasStartedRef.current) {
          startReveal()
        } else {
          // Continue revealing from where we left off
          const nextIndex = visibleLines.length
          if (nextIndex < messages.length) {
            revealNext(nextIndex)
          }
        }
      }, 2000) // Wait 2s after scroll stops
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial check if user is already still
    const initialDelay = setTimeout(() => {
      if (Date.now() - lastScrollTimeRef.current > 2000 && !hasStartedRef.current) {
        startReveal()
      }
    }, 2000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current)
      clearTimeout(initialDelay)
    }
  }, [isInView, startReveal, revealNext, visibleLines.length])

  return (
    <section ref={sectionRef} className="whisper-section">
      <div className="whisper-container">
        <h2 className="whisper-title">Things I Never Said Out Loud</h2>
        
        <div className="whisper-messages">
          {messages.map((message, index) => (
            <p
              key={index}
              className={`whisper-line ${visibleLines.includes(index) ? 'whisper-line--visible' : ''}`}
            >
              {message}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
