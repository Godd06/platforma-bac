import React from 'react'

export type AmbientVariant =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'catalog'
  | 'romanian'
  | 'history'
  | 'math'
  | 'lesson'
  | 'pro'
  | 'settings'
  | 'admin'

interface AmbientBackgroundProps {
  variant?: AmbientVariant
  children?: React.ReactNode
  className?: string
  showSymbols?: boolean
}

/* ==========================================================
   ACADEMIC & EDUCATIONAL VECTOR LINE-ART SYMBOLS
   ========================================================== */

const QuillSymbol: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 sm:w-7 sm:h-7 ${className}`}
    aria-hidden="true"
  >
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
)

const BookSymbol: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 sm:w-8 sm:h-8 ${className}`}
    aria-hidden="true"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M6 6h10" />
    <path d="M6 10h10" />
    <path d="M6 14h6" />
  </svg>
)

const ColumnSymbol: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 sm:w-8 sm:h-8 ${className}`}
    aria-hidden="true"
  >
    <line x1="3" y1="3" x2="21" y2="3" />
    <line x1="5" y1="6" x2="19" y2="6" />
    <line x1="7" y1="6" x2="7" y2="18" />
    <line x1="12" y1="6" x2="12" y2="18" />
    <line x1="17" y1="6" x2="17" y2="18" />
    <line x1="5" y1="18" x2="19" y2="18" />
    <line x1="3" y1="21" x2="21" y2="21" />
  </svg>
)

const CrownSymbol: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 sm:w-7 sm:h-7 ${className}`}
    aria-hidden="true"
  >
    <path d="M2 19h20M2 19l3-13 5 6 4-9 4 9 5-6 3 13H2z" />
    <circle cx="12" cy="4" r="1" fill="currentColor" />
  </svg>
)

const ShieldSymbol: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 sm:w-7 sm:h-7 ${className}`}
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 7v8M8 11h8" strokeWidth="1" />
  </svg>
)

const ScrollSymbol: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 sm:w-7 sm:h-7 ${className}`}
    aria-hidden="true"
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" />
    <path d="M18 3v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
  </svg>
)

const CompassSymbol: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 sm:w-7 sm:h-7 ${className}`}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
)

const CoordinateAxisSymbol: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 sm:w-7 sm:h-7 ${className}`}
    aria-hidden="true"
  >
    <line x1="3" y1="20" x2="21" y2="20" />
    <line x1="4" y1="3" x2="4" y2="21" />
    <path d="M4 18 Q 12 16, 20 4" strokeWidth="1" />
    <circle cx="12" cy="14" r="1.5" fill="currentColor" />
  </svg>
)

const GeometryDeltaSymbol: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 sm:w-7 sm:h-7 ${className}`}
    aria-hidden="true"
  >
    <polygon points="12 3 22 21 2 21 12 3" />
    <circle cx="12" cy="14" r="2" strokeWidth="1" />
  </svg>
)

const TimelineSymbol: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 sm:w-7 sm:h-7 ${className}`}
    aria-hidden="true"
  >
    <line x1="2" y1="12" x2="22" y2="12" />
    <circle cx="6" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="18" cy="12" r="2" fill="currentColor" />
  </svg>
)

/* ==========================================================
   AMBIENT BACKGROUND COMPONENT
   ========================================================== */

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  variant = 'landing',
  children,
  className = '',
  showSymbols = true,
}) => {
  return (
    <div className={`relative min-h-full w-full overflow-hidden ${className}`}>
      {/* LAYER 0: Architectural Fine Mesh / Dot Canvas */}
      <div className="ambient-grid-pattern" aria-hidden="true" />

      {/* LAYER 0.5: Celestial Header Spotlight */}
      <div className="ambient-top-spotlight" aria-hidden="true" />

      {/* LAYER 1: Ambient Glow Orbs & Auroral Depth Fields */}
      <div className="pointer-events-none select-none" aria-hidden="true">
        {variant === 'landing' && (
          <>
            <div className="ambient-glow-cyan top-[-6%] left-[10%] animate-ambient-1 opacity-90" />
            <div className="ambient-glow-teal top-[25%] right-[2%] animate-ambient-2 opacity-80" />
            <div className="ambient-glow-amber top-[52%] left-[4%] animate-ambient-3 opacity-75" />
            <div className="ambient-glow-indigo top-[74%] right-[8%] animate-ambient-1 opacity-70" />
            <div className="ambient-glow-cyan bottom-[4%] left-[12%] animate-ambient-2 opacity-80" />
          </>
        )}

        {variant === 'auth' && (
          <>
            <div className="ambient-glow-cyan top-[-6%] left-[50%] -translate-x-1/2 animate-ambient-1 opacity-85" />
            <div className="ambient-glow-teal bottom-[-4%] right-[10%] animate-ambient-2 opacity-75" />
            <div className="ambient-glow-amber bottom-[22%] left-[6%] animate-ambient-3 opacity-65" />
            <div className="ambient-glow-indigo top-[40%] right-[4%] animate-ambient-1 opacity-60" />
          </>
        )}

        {variant === 'dashboard' && (
          <>
            <div className="ambient-glow-cyan top-[-8%] right-[4%] animate-ambient-1 opacity-80" />
            <div className="ambient-glow-teal top-[42%] left-[-4%] animate-ambient-2 opacity-70" />
            <div className="ambient-glow-indigo top-[70%] right-[8%] animate-ambient-3 opacity-60" />
            <div className="ambient-glow-amber bottom-[-6%] left-[10%] animate-ambient-1 opacity-65" />
          </>
        )}

        {(variant === 'pro' || variant === 'history') && (
          <>
            <div className="ambient-glow-amber top-[-4%] right-[6%] animate-ambient-1 opacity-90" />
            <div className="ambient-glow-cyan top-[44%] left-[4%] animate-ambient-2 opacity-75" />
            <div className="ambient-glow-indigo top-[68%] right-[8%] animate-ambient-3 opacity-65" />
            <div className="ambient-glow-amber bottom-[-4%] left-[12%] animate-ambient-1 opacity-85" />
          </>
        )}

        {(variant === 'catalog' || variant === 'romanian' || variant === 'math') && (
          <>
            <div className="ambient-glow-cyan top-[-8%] right-[4%] animate-ambient-1 opacity-75" />
            <div className="ambient-glow-teal top-[42%] left-[-2%] animate-ambient-2 opacity-65" />
            <div className="ambient-glow-indigo top-[66%] right-[6%] animate-ambient-3 opacity-55" />
            <div className="ambient-glow-amber bottom-[-6%] left-[8%] animate-ambient-1 opacity-60" />
          </>
        )}

        {(variant === 'lesson' || variant === 'settings' || variant === 'admin') && (
          <>
            <div className="ambient-glow-cyan top-[-10%] right-[4%] animate-ambient-1 opacity-65" />
            <div className="ambient-glow-teal bottom-[-6%] left-[4%] animate-ambient-2 opacity-55" />
            <div className="ambient-glow-indigo top-[50%] right-[6%] animate-ambient-3 opacity-45" />
          </>
        )}
      </div>

      {/* LAYER 2 & 3: Floating Educational Academic Line-Art & Typographic Symbols */}
      {showSymbols && (
        <div
          className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          {/* ==========================================================
              1. LANDING VARIANT: 38 Distributed Organic Academic Elements
              ========================================================== */}
          {variant === 'landing' && (
            <>
              {/* --- HERO TOP-LEFT (Literary Focus) --- */}
              <div className="absolute top-[4%] left-[3%] text-cyan-400/20 light:text-sky-600/25 symbol-ambient-glow animate-motion-arc speed-med delay-neg-1">
                <QuillSymbol />
              </div>
              <div className="absolute top-[8%] left-[14%] font-literary-serif text-xl sm:text-2xl text-indigo-300/18 light:text-indigo-600/22 symbol-ambient-glow animate-motion-scurve speed-slow delay-neg-3 hidden sm:block">
                « »
              </div>
              <div className="absolute top-[14%] left-[4%] font-literary-serif text-lg sm:text-xl text-sky-400/18 light:text-sky-700/22 symbol-ambient-glow animate-motion-elliptical speed-medfast delay-neg-2">
                §
              </div>
              <div className="absolute top-[20%] left-[9%] text-cyan-400/18 light:text-sky-600/22 symbol-ambient-glow animate-motion-diagonal speed-fast delay-neg-5">
                <BookSymbol />
              </div>
              <div className="absolute top-[26%] left-[2%] font-literary-serif text-base sm:text-lg text-indigo-300/16 light:text-indigo-600/20 symbol-ambient-glow animate-motion-depth speed-slow delay-neg-4 hidden md:block">
                ¶
              </div>

              {/* --- HERO TOP-RIGHT (STEM & Math Focus) --- */}
              <div className="absolute top-[5%] right-[4%] font-math-glyph text-xl sm:text-3xl text-teal-400/20 light:text-teal-600/25 symbol-ambient-glow animate-motion-orbital speed-med delay-neg-2">
                π
              </div>
              <div className="absolute top-[10%] right-[14%] text-emerald-400/18 light:text-emerald-600/22 symbol-ambient-glow animate-motion-vertical speed-medfast delay-neg-4 hidden sm:block">
                <CoordinateAxisSymbol />
              </div>
              <div className="absolute top-[16%] right-[5%] font-math-glyph text-2xl sm:text-3xl font-light text-teal-400/18 light:text-teal-600/22 symbol-ambient-glow animate-motion-arc speed-slow delay-neg-1">
                ∫
              </div>
              <div className="absolute top-[22%] right-[12%] font-math-glyph text-lg sm:text-2xl text-emerald-400/18 light:text-emerald-600/22 symbol-ambient-glow animate-motion-horizontal speed-vslow delay-neg-6 hidden md:block">
                √x
              </div>
              <div className="absolute top-[28%] right-[3%] font-math-glyph text-xl sm:text-2xl text-teal-400/18 light:text-teal-600/22 symbol-ambient-glow animate-motion-diagonal speed-fast delay-neg-3">
                ∑
              </div>

              {/* --- MID-SECTION & METHODOLOGY (History & Classical Focus) --- */}
              <div className="absolute top-[34%] left-[3%] text-amber-400/20 light:text-amber-600/25 symbol-ambient-glow animate-motion-horizontal speed-slow delay-neg-5">
                <ColumnSymbol />
              </div>
              <div className="absolute top-[38%] left-[12%] font-literary-serif text-sm sm:text-base text-cyan-300/16 light:text-sky-800/20 symbol-ambient-glow animate-motion-scurve speed-med delay-neg-2 hidden lg:block">
                XIX
              </div>
              <div className="absolute top-[42%] right-[4%] text-amber-400/20 light:text-amber-600/25 symbol-ambient-glow animate-motion-elliptical speed-medfast delay-neg-4">
                <CrownSymbol />
              </div>
              <div className="absolute top-[46%] right-[12%] font-literary-serif text-sm sm:text-base text-cyan-300/16 light:text-sky-800/20 symbol-ambient-glow animate-motion-depth speed-vslow delay-neg-6 hidden lg:block">
                XVIII
              </div>
              <div className="absolute top-[50%] left-[5%] text-amber-400/18 light:text-amber-600/22 symbol-ambient-glow animate-motion-vertical speed-med delay-neg-3">
                <ShieldSymbol />
              </div>
              <div className="absolute top-[54%] right-[5%] text-yellow-400/18 light:text-yellow-600/22 symbol-ambient-glow animate-motion-orbital speed-slow delay-neg-1 hidden sm:block">
                <CompassSymbol />
              </div>
              <div className="absolute top-[58%] left-[10%] text-teal-400/18 light:text-teal-600/22 symbol-ambient-glow animate-motion-arc speed-medfast delay-neg-5 hidden md:block">
                <GeometryDeltaSymbol />
              </div>

              {/* --- CURRICULUM & COMPARISON REGION --- */}
              <div className="absolute top-[64%] right-[6%] text-sky-400/18 light:text-sky-700/22 symbol-ambient-glow animate-motion-diagonal speed-fast delay-neg-2">
                <ScrollSymbol />
              </div>
              <div className="absolute top-[68%] left-[4%] font-math-glyph text-lg sm:text-xl text-emerald-400/18 light:text-emerald-600/22 symbol-ambient-glow animate-motion-elliptical speed-slow delay-neg-4">
                ∞
              </div>
              <div className="absolute top-[72%] right-[10%] text-yellow-400/18 light:text-yellow-600/22 symbol-ambient-glow animate-motion-vertical speed-med delay-neg-6 hidden sm:block">
                <TimelineSymbol />
              </div>
              <div className="absolute top-[76%] left-[7%] font-literary-serif text-base sm:text-lg text-indigo-300/18 light:text-indigo-600/22 symbol-ambient-glow animate-motion-scurve speed-medfast delay-neg-1 hidden md:block">
                „ ”
              </div>
              <div className="absolute top-[80%] right-[4%] text-cyan-400/18 light:text-sky-600/22 symbol-ambient-glow animate-motion-arc speed-slow delay-neg-3">
                <BookSymbol />
              </div>
              <div className="absolute top-[84%] left-[3%] text-amber-400/18 light:text-amber-600/22 symbol-ambient-glow animate-motion-horizontal speed-med delay-neg-5">
                <ShieldSymbol />
              </div>

              {/* --- BOTTOM FINAL CTA & FAQ REGION --- */}
              <div className="absolute bottom-[14%] left-[5%] text-cyan-400/20 light:text-sky-600/25 symbol-ambient-glow animate-motion-diagonal speed-med delay-neg-3">
                <QuillSymbol />
              </div>
              <div className="absolute bottom-[12%] right-[7%] font-math-glyph text-xl sm:text-2xl text-teal-400/18 light:text-teal-600/22 symbol-ambient-glow animate-motion-arc speed-slow delay-neg-5">
                3.14
              </div>
              <div className="absolute bottom-[8%] left-[16%] font-literary-serif text-base sm:text-lg text-cyan-300/16 light:text-sky-800/20 symbol-ambient-glow animate-motion-depth speed-vslow delay-neg-2 hidden sm:block">
                XX
              </div>
              <div className="absolute bottom-[6%] right-[14%] font-math-glyph text-lg sm:text-xl text-emerald-400/18 light:text-emerald-600/22 symbol-ambient-glow animate-motion-horizontal speed-med delay-neg-4 hidden md:block">
                x²
              </div>
              <div className="absolute bottom-[3%] left-[8%] text-amber-400/18 light:text-amber-600/22 symbol-ambient-glow animate-motion-vertical speed-slow delay-neg-6 hidden sm:block">
                <ColumnSymbol />
              </div>
              <div className="absolute bottom-[2%] right-[4%] font-math-glyph text-lg text-teal-400/16 light:text-teal-600/20 symbol-ambient-glow animate-motion-elliptical speed-medfast delay-neg-1">
                π
              </div>
            </>
          )}

          {/* ==========================================================
              2. AUTH VARIANT: 12 Framing Elements around Card
              ========================================================== */}
          {variant === 'auth' && (
            <>
              <div className="absolute top-[8%] left-[8%] text-cyan-400/20 light:text-sky-600/25 symbol-ambient-glow animate-motion-arc speed-med delay-neg-1">
                <QuillSymbol />
              </div>
              <div className="absolute top-[12%] right-[10%] font-math-glyph text-2xl text-teal-400/18 light:text-teal-600/22 symbol-ambient-glow animate-motion-elliptical speed-slow delay-neg-3">
                π
              </div>
              <div className="absolute top-[28%] left-[4%] font-literary-serif text-xl text-indigo-300/18 light:text-indigo-600/22 symbol-ambient-glow animate-motion-scurve speed-medfast delay-neg-2 hidden sm:block">
                « »
              </div>
              <div className="absolute top-[35%] right-[4%] text-amber-400/18 light:text-amber-600/22 symbol-ambient-glow animate-motion-vertical speed-slow delay-neg-4 hidden sm:block">
                <ColumnSymbol />
              </div>
              <div className="absolute top-[52%] left-[3%] text-emerald-400/18 light:text-emerald-600/22 symbol-ambient-glow animate-motion-horizontal speed-slow delay-neg-5 hidden md:block">
                √x
              </div>
              <div className="absolute top-[58%] right-[3%] font-literary-serif text-lg text-sky-400/18 light:text-sky-700/22 symbol-ambient-glow animate-motion-arc speed-med delay-neg-6 hidden md:block">
                §
              </div>
              <div className="absolute bottom-[22%] left-[8%] text-sky-400/18 light:text-sky-700/22 symbol-ambient-glow animate-motion-horizontal speed-med delay-neg-5">
                <BookSymbol />
              </div>
              <div className="absolute bottom-[16%] right-[8%] text-amber-400/20 light:text-amber-600/25 symbol-ambient-glow animate-motion-depth speed-vslow delay-neg-2">
                <ShieldSymbol />
              </div>
              <div className="absolute bottom-[8%] left-[18%] font-literary-serif text-sm text-cyan-300/16 light:text-sky-800/20 symbol-ambient-glow animate-motion-arc speed-slow delay-neg-6 hidden md:block">
                XIX
              </div>
              <div className="absolute bottom-[6%] right-[16%] font-math-glyph text-lg text-teal-400/16 light:text-teal-600/20 symbol-ambient-glow animate-motion-diagonal speed-fast delay-neg-1 hidden md:block">
                ∫
              </div>
            </>
          )}

          {/* ==========================================================
              3. DASHBOARD VARIANT: 16 Peripheral Balanced Elements
              ========================================================== */}
          {variant === 'dashboard' && (
            <>
              <div className="absolute top-[6%] right-[3%] text-sky-400/18 light:text-sky-700/22 symbol-ambient-glow animate-motion-arc speed-med delay-neg-2">
                <BookSymbol />
              </div>
              <div className="absolute top-[12%] left-[2%] font-literary-serif text-lg text-indigo-300/16 light:text-indigo-600/20 symbol-ambient-glow animate-motion-scurve speed-slow delay-neg-4 hidden sm:block">
                « »
              </div>
              <div className="absolute top-[22%] right-[2%] font-math-glyph text-xl text-teal-400/16 light:text-teal-600/20 symbol-ambient-glow animate-motion-elliptical speed-medfast delay-neg-1 hidden md:block">
                π
              </div>
              <div className="absolute top-[32%] left-[2%] text-cyan-400/16 light:text-sky-600/20 symbol-ambient-glow animate-motion-horizontal speed-slow delay-neg-3 hidden lg:block">
                <QuillSymbol />
              </div>
              <div className="absolute top-[42%] right-[3%] text-amber-400/18 light:text-amber-600/22 symbol-ambient-glow animate-motion-depth speed-vslow delay-neg-5">
                <CrownSymbol />
              </div>
              <div className="absolute top-[52%] left-[3%] font-literary-serif text-base text-sky-400/16 light:text-sky-700/20 symbol-ambient-glow animate-motion-arc speed-med delay-neg-1 hidden sm:block">
                §
              </div>
              <div className="absolute top-[64%] right-[2%] text-emerald-400/16 light:text-emerald-600/20 symbol-ambient-glow animate-motion-diagonal speed-fast delay-neg-3 hidden lg:block">
                √x
              </div>
              <div className="absolute bottom-[24%] left-[3%] text-amber-400/16 light:text-amber-600/20 symbol-ambient-glow animate-motion-vertical speed-med delay-neg-6 hidden sm:block">
                <ColumnSymbol />
              </div>
              <div className="absolute bottom-[14%] right-[4%] text-amber-400/16 light:text-amber-600/20 symbol-ambient-glow animate-motion-diagonal speed-fast delay-neg-2">
                <ShieldSymbol />
              </div>
              <div className="absolute bottom-[6%] left-[8%] font-literary-serif text-sm text-cyan-300/15 light:text-sky-800/18 symbol-ambient-glow animate-motion-arc speed-slow delay-neg-4 hidden md:block">
                XX
              </div>
              <div className="absolute bottom-[4%] right-[10%] font-math-glyph text-lg text-teal-400/16 light:text-teal-600/20 symbol-ambient-glow animate-motion-horizontal speed-vslow delay-neg-2 hidden sm:block">
                ∫
              </div>
            </>
          )}

          {/* ==========================================================
              4. PRO VARIANT: 14 Prestige Academic & Heraldic Motifs
              ========================================================== */}
          {variant === 'pro' && (
            <>
              <div className="absolute top-[8%] left-[6%] text-amber-400/22 light:text-amber-600/26 symbol-ambient-glow animate-motion-arc speed-med delay-neg-1">
                <CrownSymbol />
              </div>
              <div className="absolute top-[14%] right-[8%] text-amber-400/20 light:text-amber-600/24 symbol-ambient-glow animate-motion-vertical speed-medfast delay-neg-3">
                <ShieldSymbol />
              </div>
              <div className="absolute top-[28%] left-[3%] font-literary-serif text-base text-cyan-300/16 light:text-sky-800/20 symbol-ambient-glow animate-motion-scurve speed-slow delay-neg-2 hidden sm:block">
                XIV
              </div>
              <div className="absolute top-[38%] right-[4%] text-amber-400/18 light:text-amber-600/22 symbol-ambient-glow animate-motion-diagonal speed-fast delay-neg-5">
                <ColumnSymbol />
              </div>
              <div className="absolute top-[52%] left-[4%] font-literary-serif text-lg text-indigo-300/18 light:text-indigo-600/22 symbol-ambient-glow animate-motion-arc speed-med delay-neg-3 hidden sm:block">
                « »
              </div>
              <div className="absolute bottom-[28%] right-[5%] text-amber-400/18 light:text-amber-600/22 symbol-ambient-glow animate-motion-depth speed-slow delay-neg-1 hidden md:block">
                <CrownSymbol />
              </div>
              <div className="absolute bottom-[20%] left-[8%] text-sky-400/18 light:text-sky-700/22 symbol-ambient-glow animate-motion-horizontal speed-med delay-neg-4">
                <BookSymbol />
              </div>
              <div className="absolute bottom-[14%] right-[6%] text-cyan-400/18 light:text-sky-600/22 symbol-ambient-glow animate-motion-depth speed-vslow delay-neg-6">
                <QuillSymbol />
              </div>
              <div className="absolute bottom-[6%] left-[16%] text-yellow-400/16 light:text-yellow-600/20 symbol-ambient-glow animate-motion-orbital speed-slow delay-neg-1 hidden sm:block">
                <TimelineSymbol />
              </div>
            </>
          )}

          {/* ==========================================================
              5. CATALOG & SUBJECT VARIANTS (Romanian, History, Math)
              ========================================================== */}
          {(variant === 'catalog' || variant === 'romanian' || variant === 'history' || variant === 'math') && (
            <>
              <div className="absolute top-[4%] right-[3%] text-sky-400/16 light:text-sky-700/20 symbol-ambient-glow animate-motion-arc speed-med delay-neg-2">
                <BookSymbol />
              </div>
              <div className="absolute top-[14%] left-[2%] font-literary-serif text-lg text-indigo-300/15 light:text-indigo-600/18 symbol-ambient-glow animate-motion-scurve speed-slow delay-neg-4 hidden sm:block">
                « »
              </div>
              <div className="absolute top-[26%] right-[2%] text-amber-400/14 light:text-amber-600/18 symbol-ambient-glow animate-motion-elliptical speed-medfast delay-neg-1 hidden lg:block">
                <ColumnSymbol />
              </div>
              <div className="absolute top-[40%] left-[2%] text-cyan-400/15 light:text-sky-600/18 symbol-ambient-glow animate-motion-horizontal speed-slow delay-neg-3 hidden lg:block">
                <QuillSymbol />
              </div>
              <div className="absolute top-[54%] right-[3%] font-literary-serif text-base text-sky-400/15 light:text-sky-700/18 symbol-ambient-glow animate-motion-arc speed-med delay-neg-5 hidden sm:block">
                §
              </div>
              <div className="absolute top-[68%] left-[3%] text-emerald-400/14 light:text-emerald-600/18 symbol-ambient-glow animate-motion-vertical speed-medfast delay-neg-2 hidden sm:block">
                √x
              </div>
              <div className="absolute bottom-[20%] right-[3%] text-amber-400/16 light:text-amber-600/20 symbol-ambient-glow animate-motion-depth speed-vslow delay-neg-5">
                <ShieldSymbol />
              </div>
              <div className="absolute bottom-[8%] left-[4%] font-math-glyph text-lg text-teal-400/14 light:text-teal-600/18 symbol-ambient-glow animate-motion-orbital speed-med delay-neg-6 hidden sm:block">
                π
              </div>
              <div className="absolute bottom-[4%] right-[8%] font-literary-serif text-sm text-cyan-300/15 light:text-sky-800/18 symbol-ambient-glow animate-motion-arc speed-slow delay-neg-1 hidden md:block">
                XIX
              </div>
            </>
          )}

          {/* ==========================================================
              6. LESSON, SETTINGS & ADMIN: Restrained Peripheral Motifs
              ========================================================== */}
          {(variant === 'lesson' || variant === 'settings' || variant === 'admin') && (
            <>
              <div className="absolute top-[8%] right-[2%] text-sky-400/14 light:text-sky-700/18 symbol-ambient-glow animate-motion-arc speed-slow delay-neg-2">
                <BookSymbol />
              </div>
              <div className="absolute top-[25%] left-[2%] font-literary-serif text-base text-indigo-300/14 light:text-indigo-600/16 symbol-ambient-glow animate-motion-scurve speed-medfast delay-neg-4 hidden sm:block">
                « »
              </div>
              <div className="absolute top-[48%] right-[2%] font-math-glyph text-lg text-teal-400/12 light:text-teal-600/15 symbol-ambient-glow animate-motion-elliptical speed-slow delay-neg-1 hidden md:block">
                π
              </div>
              <div className="absolute top-[68%] left-[2%] font-literary-serif text-base text-sky-400/12 light:text-sky-700/15 symbol-ambient-glow animate-motion-arc speed-med delay-neg-3 hidden sm:block">
                §
              </div>
              <div className="absolute bottom-[12%] left-[2%] text-cyan-400/12 light:text-sky-600/15 symbol-ambient-glow animate-motion-horizontal speed-vslow delay-neg-4 hidden sm:block">
                <QuillSymbol />
              </div>
              <div className="absolute bottom-[6%] right-[3%] text-amber-400/12 light:text-amber-600/15 symbol-ambient-glow animate-motion-depth speed-slow delay-neg-5 hidden md:block">
                <ShieldSymbol />
              </div>
            </>
          )}
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default AmbientBackground
