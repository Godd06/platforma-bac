import React, { useEffect, useState } from 'react'

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let animationFrameId: number | null = null

    const handleScroll = () => {
      if (animationFrameId !== null) return

      animationFrameId = window.requestAnimationFrame(() => {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight
        if (totalHeight > 0) {
          const currentScroll = window.scrollY
          const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100))
          setScrollProgress(progress)
        } else {
          setScrollProgress(0)
        }
        animationFrameId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-transparent no-print"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-300 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(6,182,212,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
