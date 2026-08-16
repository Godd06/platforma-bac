import React, { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delayMs?: number
  threshold?: number
  scale?: boolean
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delayMs = 0,
  threshold = 0.01,
  scale = false,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            setTimeout(() => {
              setIsVisible(true)
            }, delayMs)
          } else {
            setIsVisible(true)
          }
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px 80px 0px',
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [delayMs, threshold])

  const transformHidden = scale ? 'opacity-0 translate-y-3.5 scale-[0.985]' : 'opacity-0 translate-y-3.5'
  const transformVisible = scale ? 'opacity-100 translate-y-0 scale-100' : 'opacity-100 translate-y-0'

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] ${
        isVisible ? transformVisible : `${transformHidden} pointer-events-none`
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default ScrollReveal
