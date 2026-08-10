import React from 'react'

export const LandingPage: React.FC = () => {
  return (
    <div className="py-12 text-center max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Pregătire Bacalaureat <span className="text-accent">Română & Istorie</span>
      </h1>
      <p className="text-text-muted text-lg">
        Platformă educațională bazată pe lecții structurate, progres activ și conținut optimizat pentru Bacalaureat.
      </p>
      <div className="pt-4 flex items-center justify-center gap-4">
        <a
          href="/register"
          className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors shadow-glow"
        >
          Începe gratuit
        </a>
        <a
          href="/catalog"
          className="px-6 py-3 rounded-lg border border-border bg-surface text-text hover:bg-surface-hover transition-colors"
        >
          Explorează catalogul
        </a>
      </div>
    </div>
  )
}
