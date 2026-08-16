import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * SmartScrollRestoration
 * - When navigating to a new page (PUSH): Scrolls immediately to top (or to hash anchor if present).
 * - When navigating back/forward in browser history (POP): Restores the exact previous scroll position.
 */
export const SmartScrollRestoration: React.FC = () => {
  const location = useLocation()
  const navigationType = useNavigationType()
  const scrollPositions = useRef<Map<string, number>>(new Map())
  const prevKeyRef = useRef<string>(location.key)

  // Save current scroll position continuously or right before navigation
  useEffect(() => {
    const handleScroll = () => {
      if (location.key) {
        scrollPositions.current.set(location.key, window.scrollY)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.key])

  useEffect(() => {
    // Save previous page position before handling new location
    if (prevKeyRef.current && prevKeyRef.current !== location.key) {
      scrollPositions.current.set(prevKeyRef.current, window.scrollY)
    }
    prevKeyRef.current = location.key

    // Handle POP navigation (Back / Forward button)
    if (navigationType === 'POP') {
      const savedY = scrollPositions.current.get(location.key)
      if (typeof savedY === 'number') {
        // Use double requestAnimationFrame to ensure DOM is fully painted
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: savedY,
              left: 0,
              behavior: 'instant' as ScrollBehavior,
            })
          })
        })
        return
      }
    }

    // Handle hash scrolling if present (e.g. #living-studio)
    if (location.hash) {
      const targetId = location.hash.slice(1)
      const element = document.getElementById(targetId)
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        })
        return
      }
    }

    // Default for PUSH / new page navigation: scroll to top immediately
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    })
  }, [location.pathname, location.search, location.key, location.hash, navigationType])

  return null
}

export default SmartScrollRestoration
