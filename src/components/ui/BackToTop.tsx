import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Mergi sus la începutul paginii"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-surface-elevated/90 backdrop-blur-md border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-500 shadow-glow transition-all duration-200 active:scale-95 no-print min-h-[44px] min-w-[44px] flex items-center justify-center animate-fadeIn"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
