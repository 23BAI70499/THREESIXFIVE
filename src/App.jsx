import { useState, useEffect } from 'react'
import StorySection from './components/StorySection'
import WhisperSection from './components/WhisperSection'
import EndingSection from './components/EndingSection'

/* ===== STORY TIMELINE ===== */
const storyTimeline = [
  {
    image: 'https://res.cloudinary.com/disxidyvq/image/upload/v1768119694/qxzjedsfugwlugsin27d.jpg',
    timeline: '18-01-25 · first meet',
    text: 'met this human. didn’t expect much.',
    mood: 'shy'
  },
  {
    image: 'https://res.cloudinary.com/disxidyvq/image/upload/v1768119694/vbxyhxs8xwaewcnnje3k.jpg',
    timeline: 'bench talks',
    text: 'she is the same as she was during her 11th.',
    mood: 'intimate'
  },
  {
    image: 'https://res.cloudinary.com/disxidyvq/image/upload/v1768119695/o5jgioc2cvnufxii4z8v.jpg',
    timeline: 'somewhere in between',
    text: 'now nikunj, you got someone you can trust.',
    mood: 'joyful'
  },
  {
    image: 'https://res.cloudinary.com/disxidyvq/image/upload/v1768119696/bobfl9gdksup4lyl4j6w.jpg',
    timeline: 'comfort zone',
    text: 'now sharing everything is the key.',
    mood: 'peaceful'
  },
  {
    image: 'https://res.cloudinary.com/disxidyvq/image/upload/v1768119699/du0fiiz0b0ycrvizvwlj.jpg',
    timeline: 'one year later',
    text: '365 days of choosing each other.',
    mood: 'devoted'
  },
  {
    image: 'https://res.cloudinary.com/disxidyvq/image/upload/v1768119700/xfbkvr2hkx1zaq46cyx9.jpg',
    timeline: 'always',
    text: 'same hand. different years.',
    mood: 'timeless'
  }
]

/* ===== FLOATING CARDS DATA ===== */
const floatingMessages = [
  {
    title: 'Too playful for her own good',
    message: 'Always finding ways to make things fun.'
  },
  {
    title: 'Makes boring days better',
    message: 'Turns ordinary moments into something special.'
  },
  {
    title: 'Pretends not to care (lies)',
    message: 'But we all know the truth.'
  },
  {
    title: 'Comfort human',
    message: 'The person who makes everything okay.'
  }
]

export default function App() {
  const [currentSection, setCurrentSection] = useState(0)
  const [flippedCards, setFlippedCards] = useState(new Set())

  /* ===== SCROLL LOGIC ===== */
  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight
      const scrollTop = window.scrollY
      const max = storyTimeline.length - 1

      let index = Math.round(scrollTop / h)

      if (scrollTop + h >= document.documentElement.scrollHeight - 2) {
        index = max
      }

      setCurrentSection(index)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleCardFlip = (index) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className="app">
      {/* subtle progress indicator */}
      <div className="progress-line" />

      {/* STORY SECTIONS */}
      {storyTimeline.map((scene, i) => (
        <StorySection
          key={i}
          image={scene.image}
          text={scene.text}
          timeline={scene.timeline}
          mood={scene.mood}
          isActive={currentSection === i}
        />
      ))}

      {/* FLOATING CARDS SECTION */}
      <section className="floating-cards-section">
        <h2 className="cards-title">things she is, without trying</h2>

        <div className="cards-grid">
          {floatingMessages.map((item, i) => (
            <div
              key={i}
              className={`flip-card ${flippedCards.has(i) ? 'flip-card--flipped' : ''}`}
              onClick={() => handleCardFlip(i)}
            >
              <div className="flip-card-inner">
                {/* Number - visible when not flipped */}
                {!flippedCards.has(i) && <div className="card-number">{i + 1}</div>}
                
                {/* Text - fades in/out on click */}
                <p className={`card-message ${flippedCards.has(i) ? 'card-message--visible' : ''}`}>
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHISPER SECTION - Emotional Confession */}
      <WhisperSection />

      {/* ENDING SECTION - Final Moment */}
      <EndingSection />
    </div>
  )
}
