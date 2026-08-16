import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  ArrowRight,
  Brain,
  ChevronRight,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Check,
  LayoutDashboard,
  Quote,
  Target,
  Scroll,
  Award,
  CheckCircle2,
  Compass,
  Play,
  Pause,
  Volume2,
  Flame,
  Highlighter,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { AnimatedBorderCard } from '@/components/ui/AnimatedBorderCard'
import { AnimatedBorderButton } from '@/components/ui/AnimatedBorderButton'
import { Skeleton } from '@/components/ui/Skeleton'

export const LandingPage: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [activeStudioTab, setActiveStudioTab] = useState<'reader' | 'dashboard' | 'catalog'>('reader')
  const [isPlayingAudio, setIsPlayingAudio] = useState(true)
  const [highlightBarem, setHighlightBarem] = useState(true)
  const [activeHubTab, setActiveHubTab] = useState<'romana' | 'istorie' | 'barem'>('romana')
  const [romanaGenreFilter, setRomanaGenreFilter] = useState<'all' | 'realism' | 'modernism' | 'romantism' | 'dramaturgie'>('all')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index))
  }

  // Canonical works data for Interactive Hub
  const canonicalWorks = [
    {
      id: 'ion',
      title: 'Ion',
      author: 'Liviu Rebreanu',
      genre: 'realism',
      genreLabel: 'Roman realist obiectiv',
      period: 'Interbelic · 1920',
      keyConcepts: ['Perspectivă narativă dindărăt', 'Simetrie incipit-final (Drumul spre Pripas)', 'Tehnica planurilor paralele'],
      quote: '„Glasul pământului pătrundea în sufletul flăcăului ca o chemare din altă lume.”',
      quoteInsight: 'Simbolizează obsesia atavică a personajului pentru posesia pământului.',
      targetUrl: '/catalog/limba-romana',
    },
    {
      id: 'moara',
      title: 'Moara cu noroc',
      author: 'Ioan Slavici',
      genre: 'realism',
      genreLabel: 'Nuvelă psihologică realistă',
      period: 'Clasicism · 1881',
      keyConcepts: ['Conflict interior & moral', 'Dezumanizarea treptată prin patima banilor', 'Avertismentul bătrânei (Teza morală)'],
      quote: '„Omul să fie mulțumit cu sărăcia sa, căci dacă e vorba, nu bogăția, ci liniștea colibei tale te face fericit.”',
      quoteInsight: 'Rostit de bătrână, sintetizează destinul tragic generat de încălcarea normelor etice.',
      targetUrl: '/catalog/limba-romana',
    },
    {
      id: 'luceafarul',
      title: 'Luceafărul',
      author: 'Mihai Eminescu',
      genre: 'romantism',
      genreLabel: 'Poem filozofic romantic',
      period: 'Marii Clasici · 1883',
      keyConcepts: ['Antiteza om de geniu vs. om comun', 'Motive romantice: noaptea, steaua, marea', 'Metamorfozele Hyperionice'],
      quote: '„Trăind în cercul vostru strâmt / Norocul vă petrece, / Ci eu în lumea mea mă simt / Nemuritor și rece.”',
      quoteInsight: 'Expresie a izolării orgolioase și a conștientizării condiției superioare a geniului.',
      targetUrl: '/catalog/limba-romana',
    },
    {
      id: 'plumb',
      title: 'Plumb',
      author: 'George Bacovia',
      genre: 'modernism',
      genreLabel: 'Poezie simbolistă',
      period: 'Simbolism · 1916',
      keyConcepts: ['Laitmotivul cromatic și mineral (Plumb)', 'Senzația de claustrare existențială', 'Sincronizarea stării sufletești cu decorul funerar'],
      quote: '„Dormeau adânc sicriele de plumb, / Și flori de plumb și funerar veșmânt...”',
      quoteInsight: 'Creează o atmosferă de apăsare ireversibilă și descompunere a materiei.',
      targetUrl: '/catalog/limba-romana',
    },
    {
      id: 'caragiale',
      title: 'O scrisoare pierdută',
      author: 'I.L. Caragiale',
      genre: 'dramaturgie',
      genreLabel: 'Comedie de moravuri',
      period: 'Marii Clasici · 1884',
      keyConcepts: ['Comicul de caracter, limbaj și situație', 'Triunghiul conjugal burghez', 'Șantajul politic ca motor al intrigii'],
      quote: '„Industria română e admirabilă, e sublimă putem zice, dar lipsește cu desăvârșire.”',
      quoteInsight: 'Incoerența discursivă a lui Farfuridi demască impostura politică.',
      targetUrl: '/catalog/limba-romana',
    },
    {
      id: 'testament',
      title: 'Testament',
      author: 'Tudor Arghezi',
      genre: 'modernism',
      genreLabel: 'Artă poetică modernistă',
      period: 'Interbelic · 1927',
      keyConcepts: ['Estetica urâtului', 'Transfigurarea meșteșugului în slovă făurită', 'Datoria morală față de strămoși'],
      quote: '„Din bube, mucegaiuri și noroi / Iscat-am frumuseți și prețuri noi.”',
      quoteInsight: 'Manifestul arghezian prin care orice element al realității poate deveni materie poetică.',
      targetUrl: '/catalog/limba-romana',
    },
  ]

  // History synthesis pillars
  const historyPillars = [
    {
      title: 'Romanitatea Românilor în Viziunea Istoricilor',
      theme: 'Tema 1 · Etnogeneză & Continuitate',
      period: 'Secolele XVIII–XX',
      keyAnchors: [
        'Etapele romanizării Daciei (106–271/275 d.Hr.)',
        'Teoria imigraționistă (Robert Rösler, 1871) combătută științific de B.P. Hasdeu și A.D. Xenopol',
        'Școala Ardeleană (Inochentie Micu-Klein, Gh. Șincai, Petru Maior) — latinitatea ca argument politic',
      ],
      examTip: 'La Subiectul al III-lea, evidențiază întotdeauna utilizarea politică a teoriei imigraționiste în contextul dominației austriece în Transilvania.',
      targetUrl: '/catalog/istorie',
    },
    {
      title: 'Secolul XX între Democrație și Totalitarism',
      theme: 'Tema 2 · Regimuri Politice în România',
      period: '1918–1989',
      keyAnchors: [
        'Democrația interbelică & Pluripartidismul sub Constituția din 1923',
        'Regimurile autoritare: Carol al II-lea (1938), Statul Național-Legionar, Regimul Antonescu (1940–1944)',
        'Totalitarismul comunist: Faza stalinistă (Gheorghe Gheorghiu-Dej) vs. Național-comunismul ceaușist (1965–1989)',
      ],
      examTip: 'Precizează 2 practici politice democratice (vot universal, alegeri libere) vs 2 practici totalitare (cenzură, partid unic, poliție politică).',
      targetUrl: '/catalog/istorie',
    },
    {
      title: 'Constituțiile din România: 1866, 1923, 1938, 1991',
      theme: 'Tema 3 · Drept & Organizare Statală',
      period: 'Evoluție comparativă',
      keyAnchors: [
        'Constituția din 1866: Monarhie constituțională, vot cenzitar, model belgian',
        'Constituția din 1923: Vot universal masculin, consfințirea Marii Uniri, drepturi cetățenești extinse',
        'Constituția din 1938: Monarhie autoritară, limitarea rolului parlamentului',
        'Constituția din 1991: Revenirea la statul de drept democratic, republică semiprezidențială',
      ],
      examTip: 'Formulează relații de tip cauză-efect între adoptarea unei constituții și evenimentul istoric major premergător.',
      targetUrl: '/catalog/istorie',
    },
    {
      title: 'Spațiul Românesc între Diplomație și Conflict în Evul Mediu',
      theme: 'Tema 4 · Relații Internaționale',
      period: 'Secolele XIV–XVIII',
      keyAnchors: [
        'Mircea cel Bătrân (Tratatul de la Radom, 1390 & Tratatul de la Brașov, 1395)',
        'Iancu de Hunedoara (Campania cea Lungă, 1443–1444 & Asediul Belgradului, 1456)',
        'Ștefan cel Mare (Diplomația antiotomană & Tratatul de la Overchelăuți, 1459)',
        'Mihai Viteazul (Tratatul de la Alba Iulia, 1595 & Unirea de la 1600)',
      ],
      examTip: 'Menționează cel puțin două tratate diplomatice pentru a asigura punctajul maxim pe relații internaționale.',
      targetUrl: '/catalog/istorie',
    },
  ]

  // Barem strategy criteria
  const baremRules = [
    {
      subject: 'Subiectul I (30 Puncte)',
      subtitle: 'Înțelegerea textului & Producere de text argumentativ',
      criteria: [
        { label: 'Exercițiile 1-5 (20p)', detail: 'Formulează răspunsul în enunț complet. Citează strict secvența relevantă fără parafraze lungi.' },
        { label: 'Eseul Argumentativ B (10p)', detail: 'Respectă structura obligatorie: Ipoteză clară, Argument 1 (din textul suport), Argument 2 (din experiența personală/culturală), Concluzie sintetică + conectori logici obligatorii (în primul rând, așadar).' },
      ],
    },
    {
      subject: 'Subiectul II (10 Puncte)',
      subtitle: 'Comentariu pe text la prima vedere (Poezie / Proză / Teatru)',
      criteria: [
        { label: 'Text Liric', detail: 'Identifică tema, 2 figuri de stil diferite cu semnificație poetică și mărcile eului liric.' },
        { label: 'Text Epic / Dramatic', detail: 'Precizează perspectiva narativă cu argumente concrete sau rolul indicațiilor scenice (didascalii).' },
      ],
    },
    {
      subject: 'Subiectul III (30 Puncte)',
      subtitle: 'Eseu structurat pe operă canonică / Personaj / Relație între două personaje',
      criteria: [
        { label: 'Cele 4 repere obligatorii (18p)', detail: '1. Încadrare în epocă/curent (6p); 2. Tema reflectată prin 2 secvențe/episoade (6p); 3. Două elemente de structură și compoziție (titlu, incipit, perspectivă, conflict) (6p).' },
        { label: 'Redactare & Conținut (12p)', detail: 'Peste 400 de cuvinte, coerență logică, fără erori gramaticale, așezare pe paragrafe distincte.' },
      ],
    },
    {
      subject: 'Redactare & Stil Global (30 Puncte din 100)',
      subtitle: 'Punctajul transversal acordat pe întreaga lucrare',
      criteria: [
        { label: 'Ortografie & Punctuație', detail: 'Maximum 1 eroare minoră pentru punctaj integral (0.6p pierdute la fiecare abatere repetată).' },
        { label: 'Registru Stilistic', detail: 'Vocabular academic adecvat, claritate conceptuală și lizibilitate impecabilă.' },
      ],
    },
  ]

  const filteredCanonicalWorks = canonicalWorks.filter((w) =>
    romanaGenreFilter === 'all' ? true : w.genre === romanaGenreFilter
  )

  const faqs = [
    {
      q: 'Conținutul este aliniat cu programa oficială de Bacalaureat 2025–2026?',
      a: 'Da. Toate eseurile, comentariile literare și sintezele istorice sunt structurate strict conform reperelor metodologice și baremelor oficiale emise de Ministerul Educației.',
    },
    {
      q: 'Ce diferențiază platforma de culegerile tradiționale?',
      a: 'Fiecare lecție este organizată direct pe structura cerută la examen (Subiectul III / Subiectul II): idei fundamentale, analiză pe citate, concepte operaționale și sinteze audio, eliminând detaliile inutile.',
    },
    {
      q: 'Cum funcționează accesul gratuit versus pachetul PRO?',
      a: 'Catalogul de bază și lecțiile introductive sunt complet gratuite. Abonamentul PRO deblochează analizele complete pentru toate operele canonice, schemele comparative, sintezele audio și grilele de autoevaluare.',
    },
    {
      q: 'Este platforma optimizată pentru învățare de pe telefon?',
      a: 'Da. Întreaga interfață este construită ca un spațiu digital de lectură adaptat pentru mobil, cu bară de progres, butoane rapide de copiere a reperelor și navigare simplă.',
    },
  ]

  return (
    <div className="space-y-24 sm:space-y-32 py-4 sm:py-10">
      {/* 1. HERO SECTION */}
      <section className="text-center max-w-4xl mx-auto space-y-7 px-4 animate-fadeIn">
        {/* Luminous Pulsing Live Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-elevated border border-cyan-500/30 text-xs font-semibold text-text shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
          </span>
          <span className="tracking-wide">Platformă Digitală de Studiu · Bacalaureat 2025–2026</span>
        </div>

        {/* Main Headline with Iridescent Gradient Accent */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text leading-[1.12]">
          Pregătirea pentru Bac, <br className="hidden sm:inline" />
          structurată <span className="text-gradient-cyan drop-shadow-sm">fără compromisuri</span>.
        </h1>

        {/* Subtitle */}
        <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Eseuri model pentru Limba Română și sinteze cauză-efect pentru Istorie.
          Înveți direct pe barem, reții citatele esențiale și asimilezi materia de 10 în ritmul tău.
        </p>

        {/* Hero CTAs with Electric Animated Beam Border */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto">
          {authLoading ? (
            <Skeleton className="h-12 w-48" rounded="xl" />
          ) : isAuthenticated ? (
            <>
              <AnimatedBorderButton
                to="/dashboard"
                variant="cyan"
                glow={true}
                className="w-full sm:w-auto shadow-[0_0_30px_rgba(6,182,212,0.40)]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Continuă studiul</span>
                <ArrowRight className="w-4 h-4" />
              </AnimatedBorderButton>
              <Link
                to="/catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border glass-subtle text-text hover:bg-surface-elevated active:scale-[0.98] transition-all text-xs sm:text-sm font-semibold min-h-[44px]"
              >
                <span>Catalog Materii</span>
              </Link>
            </>
          ) : (
            <>
              <AnimatedBorderButton
                to="/register"
                variant="cyan"
                glow={true}
                className="w-full sm:w-auto shadow-[0_0_30px_rgba(6,182,212,0.40)]"
              >
                <span>Începe pregătirea gratuit</span>
                <ArrowRight className="w-4 h-4" />
              </AnimatedBorderButton>
              <a
                href="#living-studio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border glass-subtle text-text hover:bg-surface-elevated active:scale-[0.98] transition-all text-xs sm:text-sm font-semibold min-h-[44px]"
              >
                <span>Vezi studioul live</span>
              </a>
            </>
          )}
        </div>

        {/* Trust Metrics Pill Bar */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          <div className="p-3 rounded-2xl glass-subtle border border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-subtle">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-text">17 Autori Canonici</div>
              <div className="text-[11px] text-text-muted">Proză, Poezie, Teatru</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl glass-subtle border border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-subtle">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-text">Istorie Cauză-Efect</div>
              <div className="text-[11px] text-text-muted">Toate marile teme</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl glass-subtle border border-border flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-subtle">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-text">100% Barem Oficial</div>
              <div className="text-[11px] text-text-muted">Metodologie Minister</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE LIVING PRODUCT EXPERIENCE STUDIO (Refined Framing & Interactive Software Showcase) */}
      <section id="living-studio" className="max-w-5xl mx-auto px-4 space-y-4">
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-bold text-text uppercase tracking-wider">
              Studioul Digital de Învățare
            </h2>
          </div>

          {/* Interactive Studio View Switcher */}
          <div className="p-1 rounded-2xl glass-elevated border border-border flex flex-wrap sm:inline-flex items-center gap-1 text-xs shadow-subtle w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveStudioTab('reader')}
              className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeStudioTab === 'reader'
                  ? 'bg-surface text-cyan-400 font-bold border border-border shadow-subtle'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Lectură & Audio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStudioTab('dashboard')}
              className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeStudioTab === 'dashboard'
                  ? 'bg-surface text-cyan-400 font-bold border border-border shadow-subtle'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>Monitorizare</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStudioTab('catalog')}
              className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeStudioTab === 'catalog'
                  ? 'bg-surface text-cyan-400 font-bold border border-border shadow-subtle'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Scroll className="w-3.5 h-3.5 text-cyan-400" />
              <span>Catalog</span>
            </button>
          </div>
        </ScrollReveal>

        {/* macOS Style Glass Studio Window with Specular Border Edge */}
        <ScrollReveal className="rounded-3xl p-1.5 sm:p-2 glass-featured shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-border/80 overflow-hidden light-sweep-hover">
          <div className="rounded-2xl border border-border/70 bg-sidebar overflow-hidden">
            {/* Window Chrome Header Bar */}
            <div className="h-11 px-3 sm:px-5 glass-subtle border-b border-border flex items-center justify-between text-xs text-text-muted gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/70 border border-red-500/30" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/70 border border-yellow-500/30" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/70 border border-green-500/30" />
              </div>

              {/* URL Simulator */}
              <div className="px-2.5 sm:px-3.5 py-1 rounded-xl bg-surface/90 border border-border-subtle flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-text-subtle shadow-subtle truncate max-w-[190px] sm:max-w-none">
                <span className="text-cyan-400 font-semibold hidden xs:inline">https://</span>
                <span className="hidden sm:inline">platformabac.ro/</span>
                <span className="text-text font-semibold truncate">
                  {activeStudioTab === 'reader'
                    ? 'lesson/ion-liviu-rebreanu'
                    : activeStudioTab === 'dashboard'
                    ? 'dashboard/elev'
                    : 'catalog/opere-canonice'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-bold text-cyan-400 hidden sm:inline">LIVE</span>
              </div>
            </div>

            {/* Window Interactive Stage Canvas */}
            <div className="p-5 sm:p-8 min-h-[420px] bg-background/95">
              {/* TAB 1: IMMERSIVE READER + AUDIO SIMULATOR */}
              {activeStudioTab === 'reader' && (
                <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn">
                  {/* Top Metadata Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg glass-subtle text-cyan-400 text-[10px] font-bold border border-cyan-500/25">
                        ROMÂNĂ · ROMAN REALIST OBIECTIV
                      </span>
                      <span className="text-text-subtle text-[11px] font-semibold">8 min lectură</span>
                    </div>

                    {/* Interactive Highlight Toggle */}
                    <button
                      type="button"
                      onClick={() => setHighlightBarem((prev) => !prev)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-all border shadow-subtle ${
                        highlightBarem
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35'
                          : 'bg-surface text-text-muted border-border hover:text-text'
                      }`}
                    >
                      <Highlighter className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{highlightBarem ? 'Repere Barem: Evidențiate' : 'Evidențiază Reperele'}</span>
                    </button>
                  </div>

                  {/* Essay Title */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-text leading-tight">
                    Ion de Liviu Rebreanu — Particularități de Construcție a unui Personaj
                  </h3>

                  {/* Interactive Audio Synthesis Bar */}
                  <div className="p-4 rounded-2xl glass-elevated border border-cyan-500/30 flex items-center justify-between gap-4 shadow-subtle">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlayingAudio((prev) => !prev)}
                        aria-label={isPlayingAudio ? 'Pauză sinteză audio' : 'Redă sinteză audio'}
                        className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center hover:bg-cyan-400 transition-colors shadow-subtle shrink-0"
                      >
                        {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>
                      <div>
                        <div className="text-xs font-bold text-text flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4 text-cyan-400" />
                          <span>Sinteză Audio Narată</span>
                          {isPlayingAudio && <span className="text-[10px] text-cyan-400 font-semibold animate-pulse">● În redare</span>}
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5">Ideile esențiale pentru recapitulare rapidă (4:18 / 8:35)</p>
                      </div>
                    </div>

                    {/* Animated Waveform Equalizer */}
                    <div className="flex items-center gap-1.5 h-6">
                      <span className={`w-1 bg-cyan-400 rounded-full ${isPlayingAudio ? 'animate-wave-1' : 'h-2'}`} />
                      <span className={`w-1 bg-cyan-400 rounded-full ${isPlayingAudio ? 'animate-wave-2' : 'h-3'}`} />
                      <span className={`w-1 bg-cyan-400 rounded-full ${isPlayingAudio ? 'animate-wave-3' : 'h-5'}`} />
                      <span className={`w-1 bg-cyan-400 rounded-full ${isPlayingAudio ? 'animate-wave-4' : 'h-2'}`} />
                      <span className={`w-1 bg-cyan-400 rounded-full ${isPlayingAudio ? 'animate-wave-5' : 'h-3'}`} />
                    </div>
                  </div>

                  {/* Essay Content Paragraph with Dynamic Barem Highlighting */}
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    Publicat în 1920, romanul deschide direcția realismului obiectiv interbelic.{' '}
                    <span
                      className={`transition-all duration-300 ${
                        highlightBarem
                          ? 'bg-cyan-500/15 text-cyan-300 px-1 py-0.5 rounded font-semibold border-b border-cyan-400/40'
                          : ''
                      }`}
                    >
                      Perspectiva narativă este heterodiegetică, dindărăt, realizată de un narator omniscient și omniprezent.
                    </span>{' '}
                    Statutul inițial al protagonistului reflectă condiția țăranului sărac confruntat cu ierarhiile rigide ale satului transilvănean.
                  </p>

                  {/* Operational Methodology Callout Box */}
                  <div className="p-4 rounded-2xl border-l-2 border-cyan-400 glass-default space-y-1.5">
                    <span className="font-bold text-cyan-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      REPER OBLIGATORIU BAREM · SECVENȚĂ COMENTATĂ
                    </span>
                    <div className="text-xs sm:text-sm text-text italic font-literary-serif">
                      „Glasul pământului pătrundea în sufletul flăcăului ca o chemare din altă lume...”
                    </div>
                    <p className="text-[11px] text-text-muted pt-1 border-t border-border-subtle/50 not-italic leading-relaxed">
                      Ilustrează conflictul interior dintre patima pentru pământ (glasul pământului) și atracția sentimentală (glasul iubirii).
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: SMART DASHBOARD TELEMETRY */}
              {activeStudioTab === 'dashboard' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Hero Continue Learning Mock */}
                  <div className="p-5 rounded-2xl glass-elevated border border-cyan-500/30 space-y-3 shadow-subtle">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        CONTINUĂ DE UNDE AI RĂMAS
                      </span>
                      <span className="text-text-subtle text-[11px] font-semibold">Limba Română · Eseul 4 din 17</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-text">Moara cu noroc de Ioan Slavici</h4>
                      <p className="text-xs text-text-muted mt-0.5">Analiza conflictului moral și a dezumanizării lui Ghiță.</p>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-text-muted text-[11px] font-semibold">Progres asimilat: 75%</span>
                      <span className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black font-bold text-xs shadow-subtle">
                        Deschide lecția
                      </span>
                    </div>
                  </div>

                  {/* Two-column Metrics: Mastery & Streak */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl glass-default text-xs space-y-2.5 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text">Progres Global Bac</span>
                        <span className="text-cyan-400 font-bold">84%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden">
                        <div className="w-[84%] h-full bg-cyan-400 rounded-full" />
                      </div>
                      <div className="flex justify-between text-[11px] text-text-muted font-medium">
                        <span>24 lecții completate</span>
                        <span>5 rămase</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl glass-default text-xs space-y-2.5 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-amber-400 fill-current" />
                          Ritm Săptămânal
                        </span>
                        <span className="text-amber-400 font-bold">7 zile streak</span>
                      </div>
                      <div className="flex items-center justify-between gap-1.5 pt-0.5">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold ${
                              i < 6
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                                : 'bg-amber-500 text-black shadow-subtle'
                            }`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CANONICAL CATALOG QUICK-EXPLORER */}
              {activeStudioTab === 'catalog' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="p-4 rounded-2xl glass-default border border-border flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                          ROMÂNĂ · CLASIC
                        </span>
                        <span className="font-bold text-text text-sm">O scrisoare pierdută · I.L. Caragiale</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-1">Comedia clasică · Comicul de moravuri și limbaj</p>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-xl bg-surface text-cyan-400 font-bold border border-cyan-500/30 text-xs shadow-subtle">
                      GRATUIT
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl glass-default border border-border flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          ROMÂNĂ · ROMANTISM
                        </span>
                        <span className="font-bold text-text text-sm">Luceafărul · Mihai Eminescu</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-1">Poemul filozofic romantic · Condiția geniului</p>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 text-xs shadow-subtle">
                      PRO
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl glass-default border border-border flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          ISTORIE · CONSTITUȚII
                        </span>
                        <span className="font-bold text-text text-sm">Constituțiile din România · 1866–1991</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-1">Drept și stat de drept · Evoluție comparativă pe articole cheie</p>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 text-xs shadow-subtle">
                      PRO
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. HIGH-UTILITY INTERACTIVE STUDY HUB (Nucleu Interactiv de Studiu) */}
      <section id="nucleu-studiu" className="max-w-5xl mx-auto px-4 space-y-6">
        <ScrollReveal className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 px-3.5 py-1 rounded-full glass-subtle border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nucleu Digital de Pregătire Rapidă</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-text">
            Explorează materia și strategiile direct din platformă
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
            Selectează o secțiune pentru a vizualiza structura eseurilor, hărțile mentale istorice sau ghidul oficial de notă maximă.
          </p>
        </ScrollReveal>

        {/* Hub Category Navigation Bar */}
        <ScrollReveal className="flex justify-center">
          <div className="p-1.5 rounded-2xl glass-elevated border border-border inline-flex flex-wrap gap-1 shadow-raised">
            <button
              type="button"
              onClick={() => setActiveHubTab('romana')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeHubTab === 'romana'
                  ? 'bg-cyan-500 text-black font-bold shadow-subtle'
                  : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Eseuri Română (Subiectul III)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveHubTab('istorie')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeHubTab === 'istorie'
                  ? 'bg-amber-500 text-black font-bold shadow-subtle'
                  : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
              }`}
            >
              <Scroll className="w-4 h-4" />
              <span>Sinteze Istorie (Subiectul I, II & III)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveHubTab('barem')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeHubTab === 'barem'
                  ? 'bg-emerald-500 text-black font-bold shadow-subtle'
                  : 'text-text-muted hover:text-text hover:bg-surface-elevated/60'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Strategia de Barem 10/10</span>
            </button>
          </div>
        </ScrollReveal>

        {/* TAB 1: ROMÂNĂ CANONICAL ESSAYS EXPLORER */}
        {activeHubTab === 'romana' && (
          <ScrollReveal className="space-y-4 animate-fadeIn">
            {/* Genre Sub-filters */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'Toate Operele' },
                { id: 'realism', label: 'Realism' },
                { id: 'modernism', label: 'Modernism' },
                { id: 'romantism', label: 'Romantism' },
                { id: 'dramaturgie', label: 'Dramaturgie' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setRomanaGenreFilter(filter.id as any)}
                  className={`px-3.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    romanaGenreFilter === filter.id
                      ? 'bg-surface text-cyan-400 border border-cyan-500/40 shadow-subtle'
                      : 'text-text-muted hover:text-text bg-surface/40 border border-transparent'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Grid of Canonical Works */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCanonicalWorks.map((work) => (
                <div
                  key={work.id}
                  className="p-6 rounded-2xl glass-elevated interactive-card border border-border/80 hover:border-cyan-500/40 flex flex-col justify-between space-y-4 shadow-subtle"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-md glass-subtle text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                        {work.genreLabel}
                      </span>
                      <span className="text-[11px] text-text-subtle font-medium">{work.period}</span>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-text">
                        {work.title}
                      </h3>
                      <p className="text-xs font-semibold text-text-muted mt-0.5">de {work.author}</p>
                    </div>

                    {/* Operational Concepts Tags */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-text-subtle">
                        Reper Barem · Concepte Cheie
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {work.keyConcepts.map((concept, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-lg bg-surface text-[11px] text-text-muted border border-border-subtle font-medium"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quote Highlight Box */}
                    <div className="p-3.5 rounded-xl glass-subtle border-l-2 border-cyan-400 space-y-1 text-xs">
                      <div className="flex items-start gap-1.5 text-text italic font-literary-serif">
                        <Quote className="w-3.5 h-3.5 text-cyan-400 shrink-0 not-italic mt-0.5" />
                        <span>{work.quote}</span>
                      </div>
                      <p className="text-[11px] text-text-muted pt-1 border-t border-border-subtle/50 not-italic leading-relaxed">
                        {work.quoteInsight}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* TAB 2: ISTORIE SYNTHESIS PILLARS */}
        {activeHubTab === 'istorie' && (
          <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            {historyPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-elevated interactive-card border border-border/80 hover:border-amber-500/40 flex flex-col justify-between space-y-4 shadow-subtle"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md glass-subtle text-amber-300 text-[10px] font-bold border border-amber-500/25">
                      {pillar.theme}
                    </span>
                    <span className="text-[11px] text-text-subtle font-mono font-medium">{pillar.period}</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-text">
                    {pillar.title}
                  </h3>

                  {/* Key Historical Anchors */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-text-subtle">
                      Relații Cauză-Efect & Documente
                    </span>
                    <ul className="space-y-1.5 text-xs text-text-muted">
                      {pillar.keyAnchors.map((anchor, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{anchor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Evaluator Exam Tip */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Truc de Punctaj Maxim:</span>
                    </div>
                    <p className="text-text-muted text-[11px] leading-relaxed">{pillar.examTip}</p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollReveal>
        )}

        {/* TAB 3: BAREM STRATEGY 10/10 */}
        {activeHubTab === 'barem' && (
          <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            {baremRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-elevated border border-border/80 space-y-4 shadow-subtle"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-bold text-text">{rule.subject}</h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-text-muted">{rule.subtitle}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-border-subtle">
                  {rule.criteria.map((c, i) => (
                    <div key={i} className="p-3.5 rounded-xl glass-subtle space-y-1">
                      <div className="text-xs font-bold text-text flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{c.label}</span>
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed pl-3">{c.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ScrollReveal>
        )}
      </section>

      {/* 4. METHODOLOGY (4 Piloni ai Pregătirii Eficiente cu ScrollReveal) */}
      <ScrollReveal className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 px-3.5 py-1 rounded-full glass-subtle border border-cyan-500/20">
            <Brain className="w-3.5 h-3.5" />
            <span>Metodologie Aplicată</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-text">
            Cei 4 piloni ai asimilării rapide
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto">
            Totul este gândit pentru a maximiza reținerea informației în timpul cel mai scurt.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl glass-elevated interactive-card space-y-3 border border-border shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-display text-base font-bold text-text">Eseuri Model pe Barem</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Fără umplutură. Fiecare eseu acoperă cele 4 repere din barem, cu scene reprezentative analizate clar.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-elevated interactive-card space-y-3 border border-border shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-display text-base font-bold text-text">Scheme Cauză-Efect</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Hărți mentale pentru Istorie: înțelegi legătura logică dintre evenimente în loc să memorezi mecanic date.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-elevated interactive-card space-y-3 border border-border shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-display text-base font-bold text-text">Sinteze Audio de Drum</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Recapitulează ideile principale ascultând sintezele audio narate clar în drum spre liceu sau la plimbare.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-elevated interactive-card space-y-3 border border-border shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/25 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-display text-base font-bold text-text">Monitorizare Progres</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Panoul personalizat îți arată exact ce materii ai asimilat, streak-ul zilnic și ce mai ai de parcurs.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 5. TRANSPARENT FREE VS PRO COMPARISON (ScrollReveal) */}
      <ScrollReveal className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 px-3.5 py-1 rounded-full glass-subtle border border-amber-500/25">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Acces Transparent</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-text">
            Pachet Gratuit vs. Abonament PRO
          </h2>
          <p className="text-xs text-text-muted max-w-lg mx-auto">
            Poți începe să înveți imediat cu pachetul gratuit, iar când vrei pregătire completă, treci la PRO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Free Tier Card */}
          <div className="p-7 rounded-3xl glass-default interactive-card border border-border space-y-5 flex flex-col justify-between shadow-subtle">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-surface-elevated text-text-muted border border-border-subtle">
                  GRATUIT · PENTRU TOTDEAUNA
                </span>
                <h3 className="font-display text-xl font-bold text-text mt-1">Acces de Bază</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Tot ce ai nevoie pentru a testa metoda de învățare și a parcurge lecțiile introductive.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-text-muted border-t border-border-subtle pt-4">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Acces la lecțiile demo și introductive</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Navigare completă în catalogul de materii</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Panou de studiu și monitorizare de bază</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Tema Dark / Light cu salvare automată</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-border-subtle">
              <Link
                to={isAuthenticated ? '/catalog' : '/register'}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border glass-subtle text-text hover:bg-surface-elevated active:scale-[0.98] transition-all text-xs font-bold min-h-[44px]"
              >
                <span>{isAuthenticated ? 'Explorează catalogul gratuit' : 'Creează cont gratuit'}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Pro Tier Card with Luxury Gold Orbital Accent */}
          <AnimatedBorderCard
            variant="pro"
            glow={true}
            innerClassName="glass-featured-pro p-7 space-y-5 flex flex-col justify-between shadow-raised"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    PACHET PRO · ACCES INTEGRAL
                  </span>
                  <h3 className="font-display text-xl font-bold text-text mt-1">Pregătire Completă</h3>
                  <p className="text-xs text-text-muted mt-0.5">Toate eseurile de 10, schemele și sintezele audio.</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-text border-t border-border-subtle pt-4">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold">Toate cele 17 eseuri canonice complete pentru Română</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold">Scheme complete de cauză-efect pentru Istorie</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Sinteze audio narate pentru recapitulare</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Grile și teste de autoevaluare pe barem</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Actualizări continue conform programei oficiale</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-border-subtle">
              <Link
                to="/pro"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all text-xs shadow-subtle min-h-[44px]"
              >
                <span>Află mai multe despre pachetul PRO</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedBorderCard>
        </div>
      </ScrollReveal>

      {/* 6. FAQ SECTION (ScrollReveal) */}
      <ScrollReveal className="max-w-3xl mx-auto px-4 space-y-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 px-3.5 py-1 rounded-full glass-subtle border border-cyan-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Întrebări Frecvente</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-text">
            Clarificări despre utilizare și conținut
          </h2>
        </div>

        <div className="space-y-2.5 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl glass-default overflow-hidden border border-border transition-colors shadow-subtle"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-h-[48px]"
                >
                  <span className="text-xs sm:text-sm font-semibold text-text">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-text-subtle shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border-subtle animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollReveal>

      {/* 7. MINIMAL FINAL CTA (ScrollReveal) */}
      <ScrollReveal className="text-center max-w-lg mx-auto px-4 space-y-4">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-text">
          Pregătește-te eficient pentru examen
        </h2>
        <p className="text-xs sm:text-sm text-text-muted">
          Creează un cont gratuit și începe studiul acum.
        </p>
        <div className="flex justify-center pt-1">
          <AnimatedBorderButton
            to={isAuthenticated ? '/dashboard' : '/register'}
            variant="cyan"
            glow={true}
          >
            <span>{isAuthenticated ? 'Deschide Panoul de Studiu' : 'Creează cont gratuit'}</span>
            <ArrowRight className="w-4 h-4" />
          </AnimatedBorderButton>
        </div>
      </ScrollReveal>
    </div>
  )
}

export default LandingPage
