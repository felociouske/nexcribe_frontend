import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Footer from '../../components/layout/Footer'

const EARN_WAYS = [
  {
    icon: '✍️',
    title: 'Writing Jobs',
    color: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    desc: 'Write articles, blog posts and academic content for real clients. Pick your tasks, submit your work, get paid instantly on approval.',
    stat: 'Earn up to KES 1,200/task',
  },
  {
    icon: '🎧',
    title: 'Audio Transcription',
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    desc: 'Listen and transcribe audio files from global sources. No experience needed - just accuracy. Tasks available 24/7.',
    stat: 'Earn up to KES 1,000/task',
  },
  {
    icon: '🎮',
    title: 'Play & Earn Games',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    desc: 'Play quiz, trivia, slots, word puzzles and more. Every win credits your wallet instantly. Daily limits keep it fair.',
    stat: 'Win up to KES 11,400/day',
  },
  {
    icon: '🎡',
    title: 'Lucky Wheel',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    desc: 'Spin the lucky wheel for instant cash prizes. Higher plans unlock more spins and bigger prize pools every day.',
    stat: 'Up to KES 1,000 per spin',
  },
]

const PLANS = [
  {
    category: 'Writing',
    icon: '✍️',
    color: 'teal',
    plans: [
      { name: 'Starter Scribe',  price: 'KES 1,550',  tasks: '3 tasks', earn: 'Up to KES 2,700' },
      { name: 'Advanced Starter',price: 'KES 2,400',  tasks: '5 tasks', earn: 'Up to KES 4,500' },
      { name: 'Nexus Legend',    price: 'KES 9,500',  tasks: '20 tasks',earn: 'Up to KES 24,000', highlight: true },
    ],
  },
  {
    category: 'Transcription',
    icon: '🎧',
    color: 'violet',
    plans: [
      { name: 'Starter Listener',   price: 'KES 1,700', tasks: '4 tasks',  earn: 'Up to KES 3,600' },
      { name: 'Verse Transcriber',  price: 'KES 3,900', tasks: '8 tasks',  earn: 'Up to KES 8,000' },
      { name: 'Nexus Transcriber',  price: 'KES 9,500', tasks: '20 tasks', earn: 'Up to KES 20,000', highlight: true },
    ],
  },
  {
    category: 'Gaming',
    icon: '🎮',
    color: 'amber',
    plans: [
      { name: 'Starter Gamer', price: 'KES 2,400',  daily: '5 plays/day',  earn: 'KES 500/day cap' },
      { name: 'Codex Gamer',   price: 'KES 24,000', daily: '30 plays/day', earn: 'KES 5,500/day cap' },
      { name: 'Nexus Legend',  price: 'KES 50,000', daily: 'Unlimited',    earn: 'KES 11,400/day cap', highlight: true },
    ],
  },
]

const TESTIMONIALS = [
  {
    name: 'Amina W.',
    location: 'Nairobi, Kenya',
    avatar: 'AW',
    color: 'bg-teal-500',
    quote: 'I started with the Starter Scribe plan and cleared my rent in three weeks. The writing tasks are straightforward and the payments are fast.',
    earned: 'KES 14,200 earned',
    plan: 'Advanced Starter',
  },
  {
    name: 'Brian O.',
    location: 'Mombasa, Kenya',
    avatar: 'BO',
    color: 'bg-violet-500',
    quote: 'Transcription is my thing - I type fast and the audio files are clear. I cleared my plan cost in my first 4 tasks and everything after is pure profit.',
    earned: 'KES 8,000 earned',
    plan: 'Folio Transcriber',
  },
  {
    name: 'Cynthia M.',
    location: 'Kisumu, Kenya',
    avatar: 'CM',
    color: 'bg-amber-500',
    quote: 'I play the quiz every single day. It is addictive but in a good way because my account wallet actually grows. Already withdrawn twice this month.',
    earned: 'KES 22,400 earned',
    plan: 'Codex Gamer',
  },
  {
    name: 'David K.',
    location: 'Nakuru, Kenya',
    avatar: 'DK',
    color: 'bg-rose-500',
    quote: 'I bought three plans at once — writing, transcription and gaming. I work on Nexcribe every morning before my day job. Best decision I made in 2026.',
    earned: 'KES 41,000 earned',
    plan: 'Nexus Legend',
  },
  {
    name: 'Fatuma A.',
    location: 'Eldoret, Kenya',
    avatar: 'FA',
    color: 'bg-emerald-500',
    quote: 'The deposit process is smooth and M-Pesa approval is fast. I was skeptical at first but when the money hit my wallet I was convinced.',
    earned: 'KES 6,800 earned',
    plan: 'Starter Scribe',
  },
  {
    name: 'George N.',
    location: 'Thika, Kenya',
    avatar: 'GN',
    color: 'bg-sky-500',
    quote: 'The wheel spins are my favourite. Yesterday I hit KES 500 on a single spin. On top of my transcription earnings this month has been incredible.',
    earned: 'KES 18,600 earned',
    plan: 'Verse Transcriber',
  },
]

const BLOGS = [
  {
    tag: 'Success Story',
    tagColor: 'bg-teal-100 text-teal-700',
    title: 'How Brian Earned KES 40,000 in His First Month',
    excerpt: 'Brian, a 24-year-old from Mombasa, started with a Folio Transcriber plan and built a routine around daily tasks. Here is exactly what his schedule looked like.',
    readTime: '3 min read',
    date: 'Apr 2026',
    emoji: '📖',
  },
  {
    tag: 'Platform Guide',
    tagColor: 'bg-violet-100 text-violet-700',
    title: 'Writing vs Transcription — Which Earns More?',
    excerpt: 'We broke down the numbers. Writing offers higher per-task pay while transcription gives faster task completion. The answer depends on your skills.',
    readTime: '4 min read',
    date: 'Mar 2026',
    emoji: '⚖️',
  },
  {
    tag: 'Tips & Tricks',
    tagColor: 'bg-amber-100 text-amber-700',
    title: '7 Ways to Maximise Your Daily Gaming Earnings',
    excerpt: 'Timing your plays, stacking games and combining the lucky wheel - veteran Nexcribe gamers share their exact strategies for hitting the daily cap.',
    readTime: '5 min read',
    date: 'Mar 2026',
    emoji: '🎯',
  },
  {
    tag: 'Success Story',
    tagColor: 'bg-teal-100 text-teal-700',
    title: 'From Side Hustle to Main Income: Amina\'s Story',
    excerpt: 'Amina initially joined Nexcribe to cover a single bill. Six months later it is her primary source of income. She shares her complete journey.',
    readTime: '6 min read',
    date: 'Feb 2026',
    emoji: '🌟',
  },
]

const STATS = [
  { value: '12,000+', label: 'Active earners' },
  { value: 'KES 2',   label: 'Minimum withdrawal' },
  { value: '24hrs',   label: 'Deposit approval' },
  { value: '3',       label: 'Ways to earn' },
]

// ── Animated floating particles for the hero ─────────────────────────────

function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 6,
    opacity: Math.random() * 0.4 + 0.1,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ── Animated grid lines in hero ───────────────────────────────────────────

function GridLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  )
}

// ── Counter animation ─────────────────────────────────────────────────────

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const num = parseInt(value.replace(/\D/g, ''))
          if (isNaN(num)) { setDisplay(value); return }
          let start = 0
          const step = num / 40
          const interval = setInterval(() => {
            start += step
            if (start >= num) { setDisplay(value); clearInterval(interval); return }
            setDisplay(value.replace(/[\d,]+/, Math.floor(start).toLocaleString()))
          }, 30)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, hasAnimated])

  return <span ref={ref}>{hasAnimated ? display : value}</span>
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

// ── Main Component ────────────────────────────────────────────────────────

export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div className="overflow-x-hidden bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f4c75 0%, #0a7c5c 50%, #0d9488 100%)' }}
      >
        <GridLines />
        <Particles />

        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #5eead4 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #0891b2 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-32 grid md:grid-cols-2 gap-16 items-center"
        >
          {/* Left */}
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold tracking-widest uppercase mb-6 border border-white/20"
            >
              <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" />
              Kenya's #1 Earning Platform
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl text-white leading-[1.05] tracking-tight mb-6"
            >
              Write.
              <br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #5eead4, #a7f3d0)' }}>
                Transcribe.
              </span>
              <br />
              Play.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/75 text-lg leading-relaxed mb-10 max-w-lg"
            >
              Nexcribe turns your skills and time into real money. Complete writing
              tasks, transcribe audio, win at games - and withdraw to M-Pesa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-teal-700 font-display font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Earning Today
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-display font-semibold text-base hover:bg-white/10 transition-all duration-200"
              >
                See How It Works
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-5 text-white/60 text-sm"
            >
              {['M-Pesa Payments', 'No monthly fees', 'Lifetime plans', 'Instant withdrawal'].map(b => (
                <span key={b} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {b}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — floating dashboard card */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden md:block"
          >
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20"
              style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
            >
              {/* Mock dashboard UI */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">Account Wallet</p>
                    <p className="text-white font-display font-extrabold text-3xl mt-0.5">KES 24,650</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-400/20 flex items-center justify-center text-2xl">
                    💼
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="flex items-end gap-1.5 h-16 mb-5">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.6 + i * 0.07, duration: 0.5 }}
                      className="flex-1 rounded-t-lg"
                      style={{ background: i === 5 ? '#5eead4' : 'rgba(255,255,255,0.15)' }}
                    />
                  ))}
                </div>

                <div className="space-y-2.5">
                  {[
                    { label: 'Writing task approved', amount: '+KES 1,200', color: 'text-teal-400' },
                    { label: 'Game win — Quiz',       amount: '+KES 500',   color: 'text-teal-400' },
                    { label: 'Audio transcription',   amount: '+KES 900',   color: 'text-teal-400' },
                    { label: 'Wheel spin win',         amount: '+KES 750',   color: 'text-teal-400' },
                  ].map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                    >
                      <span className="text-white/60 text-xs">{t.label}</span>
                      <span className={`font-display font-bold text-sm ${t.color}`}>{t.amount}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-5 w-full py-3 rounded-xl bg-teal-500/30 border border-teal-400/30 text-teal-300 text-sm font-display font-semibold hover:bg-teal-500/40 transition-all"
                >
                  Withdraw to M-Pesa →
                </motion.button>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3"
            >
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-navy-900 font-display font-bold text-sm">Just paid out</p>
                <p className="text-teal-600 font-bold text-base">KES 3,200</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Wave bottom */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0 80V50C200 10 400 80 720 50C1040 20 1240 80 1440 40V80H0Z" fill="white" />
        </svg>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...fade(i * 0.1)} className="text-center">
                <p className="font-display font-extrabold text-4xl text-teal-600">
                  <AnimatedNumber value={s.value} />
                </p>
                <p className="text-navy-500 text-sm mt-1.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fade()} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-400 text-xs font-semibold tracking-widest uppercase mb-4">
              Simple Process
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-4">Start in 4 Steps</h2>
            <p className="text-white/50 max-w-xl mx-auto">No complicated setup. No approvals. Just deposit, pick a plan and start earning.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '📱', title: 'Create Account', desc: 'Sign up free in under a minute. No documents needed.' },
              { step: '02', icon: '💳', title: 'Deposit via M-Pesa', desc: 'Send money via M-Pesa. Automatically approved..' },
              { step: '03', icon: '🎯', title: 'Buy Your Plan', desc: 'Choose Writing, Transcription or Gaming - no renewals.' },
              { step: '04', icon: '💸', title: 'Earn & Withdraw', desc: 'Complete tasks, win games, spin the wheel. Withdraw from KES 240.' },
            ].map((s, i) => (
              <motion.div key={s.step} {...fade(i * 0.1)} className="relative">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-display font-black text-5xl text-white/10 leading-none select-none">
                      {s.step}
                    </span>
                    <span className="text-3xl">{s.icon}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10 text-white/20 text-2xl">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARN WAYS ─────────────────────────────────────────────────── */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fade()} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold tracking-widest uppercase mb-4">
              4 Income Streams
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-navy-900 mb-4">
              Multiple Ways to Earn
            </h2>
            <p className="text-navy-500 max-w-xl mx-auto">
              Stack your income streams. Every activity credits your Account Wallet - withdraw to M-Pesa anytime.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {EARN_WAYS.map((w, i) => (
              <motion.div
                key={w.title}
                {...fade(i * 0.08)}
                className="group relative overflow-hidden rounded-2xl border border-navy-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br ${w.color}`} />

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${w.bg} flex items-center justify-center text-3xl mb-5`}>
                    {w.icon}
                  </div>
                  <h3 className="font-display font-bold text-xl text-navy-900 mb-2">{w.title}</h3>
                  <p className="text-navy-500 text-sm leading-relaxed mb-5">{w.desc}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-display font-bold bg-gradient-to-r ${w.color} text-white`}>
                    {w.stat}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMAGE SHOWCASE ─────────────────────────────────────────────── */}
      <section className="py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f0fdfa 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fade()} className="text-center mb-14">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-navy-900 mb-4">
              Real Earnings. Real People.
            </h2>
            <p className="text-navy-500 max-w-xl mx-auto">
              Thousands of Kenyans are building reliable income on Nexcribe every day.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large feature image */}
            <motion.div {...fade(0.1)} className="md:col-span-2 relative rounded-3xl overflow-hidden h-80 md:h-96"
              style={{ background: 'linear-gradient(135deg, #0a7c5c 0%, #0d9488 100%)' }}>
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="absolute top-8 right-8 text-8xl opacity-20">✍️</div>
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-9xl opacity-10">📝</div>
                <span className="badge bg-white/20 text-white w-fit mb-3">Writing</span>
                <h3 className="font-display font-extrabold text-3xl text-white mb-2">Craft Content, Earn Cash</h3>
                <p className="text-white/70 text-sm">Professional writing tasks from real clients across Africa and beyond.</p>
              </div>
            </motion.div>

            <div className="flex flex-col gap-6">
              <motion.div {...fade(0.2)} className="relative rounded-3xl overflow-hidden h-44"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="absolute top-4 right-4 text-6xl opacity-20">🎧</div>
                  <span className="badge bg-white/20 text-white w-fit mb-2 text-xs">Transcription</span>
                  <h3 className="font-display font-bold text-xl text-white">Listen & Earn</h3>
                  <p className="text-white/70 text-xs mt-1">Turn audio into text, earn per task.</p>
                </div>
              </motion.div>

              <motion.div {...fade(0.3)} className="relative rounded-3xl overflow-hidden h-44"
                style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="absolute top-4 right-4 text-6xl opacity-20">🎮</div>
                  <span className="badge bg-white/20 text-white w-fit mb-2 text-xs">Gaming</span>
                  <h3 className="font-display font-bold text-xl text-white">Play to Win</h3>
                  <p className="text-white/70 text-xs mt-1">Daily games, real cash prizes.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS ─────────────────────────────────────────────────────── */}
      <section id="plans" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fade()} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold tracking-widest uppercase mb-4">
              One-Time Purchase
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-navy-900 mb-4">
              Plans for Every Goal
            </h2>
            <p className="text-navy-500 max-w-xl mx-auto">
              Pay once. Earn for life. Plans are per category — own Writing, Transcription and Gaming independently. Upgrade anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((cat, ci) => (
              <motion.div key={cat.category} {...fade(ci * 0.1)} className="flex flex-col">
                {/* Category header */}
                <div className={`rounded-t-2xl p-5 flex items-center gap-3 ${
                  cat.color === 'teal'   ? 'bg-teal-600' :
                  cat.color === 'violet' ? 'bg-violet-600' : 'bg-amber-500'
                }`}>
                  <span className="text-3xl">{cat.icon}</span>
                  <h3 className="font-display font-extrabold text-xl text-white">{cat.category}</h3>
                </div>

                {/* Plan rows */}
                <div className="flex-1 border border-t-0 border-navy-100 rounded-b-2xl divide-y divide-navy-50 overflow-hidden">
                  {cat.plans.map((plan, pi) => (
                    <div
                      key={plan.name}
                      className={`p-5 ${plan.highlight
                        ? 'bg-navy-950 text-white'
                        : 'bg-white hover:bg-navy-50/50 transition-colors'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className={`font-display font-bold text-sm ${plan.highlight ? 'text-white' : 'text-navy-900'}`}>
                            {plan.name}
                          </p>
                          {plan.highlight && (
                            <span className="text-xs text-teal-400 font-semibold">⭐ Best Value</span>
                          )}
                        </div>
                        <span className={`font-display font-extrabold text-lg ${
                          plan.highlight ? 'text-teal-400' :
                          cat.color === 'teal'   ? 'text-teal-600' :
                          cat.color === 'violet' ? 'text-violet-600' : 'text-amber-600'
                        }`}>
                          {plan.price}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between text-xs ${plan.highlight ? 'text-white/60' : 'text-navy-500'}`}>
                        <span>{plan.tasks || plan.daily}</span>
                        <span className={plan.highlight ? 'text-teal-400' : 'text-teal-600'} >{plan.earn}</span>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-white">
                    <Link
                      to="/register"
                      className={`block text-center py-3 rounded-xl text-sm font-display font-bold transition-all ${
                        cat.color === 'teal'   ? 'bg-teal-600 hover:bg-teal-500 text-white' :
                        cat.color === 'violet' ? 'bg-violet-600 hover:bg-violet-500 text-white' :
                                                  'bg-amber-500 hover:bg-amber-400 text-white'
                      }`}
                    >
                      View All {cat.category} Plans →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p {...fade(0.4)} className="text-center text-navy-400 text-sm mt-8">
            All plans are lifetime purchases - no monthly fees, no expiry.
            Upgrade by purchasing a higher plan in the same category anytime.
          </motion.p>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-20 bg-navy-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fade()} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold tracking-widest uppercase mb-4">
              Real Users
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-navy-900 mb-4">
              What Our Earners Say
            </h2>
            <p className="text-navy-500 max-w-xl mx-auto">
              Thousands of people across Kenya are earning daily on Nexcribe.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                {...fade(i * 0.07)}
                className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm hover:shadow-md transition-all"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-navy-600 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-display font-bold`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-display font-bold text-navy-900 text-sm">{t.name}</p>
                      <p className="text-navy-400 text-xs">{t.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-teal-600 text-sm">{t.earned}</p>
                    <p className="text-navy-400 text-xs">{t.plan}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG CARDS ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fade()} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold tracking-widest uppercase mb-4">
              Stories & Guides
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-navy-900 mb-4">
              From the Nexcribe Community
            </h2>
            <p className="text-navy-500 max-w-xl mx-auto">
              Real stories, practical guides and tips from earners on the platform.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BLOGS.map((b, i) => (
              <motion.div
                key={b.title}
                {...fade(i * 0.08)}
                className="group bg-white rounded-2xl border border-navy-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Emoji header */}
                <div className="h-32 flex items-center justify-center text-7xl"
                  style={{ background: i % 2 === 0
                    ? 'linear-gradient(135deg, #f0fdf4, #d1fae5)'
                    : 'linear-gradient(135deg, #f5f3ff, #ede9fe)'
                  }}>
                  {b.emoji}
                </div>

                <div className="p-5">
                  <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold mb-3 ${b.tagColor}`}>
                    {b.tag}
                  </span>
                  <h3 className="font-display font-bold text-navy-900 text-sm leading-snug mb-2 group-hover:text-teal-600 transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-navy-500 text-xs leading-relaxed mb-4 line-clamp-3">
                    {b.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-navy-400 text-xs">
                    <span>{b.date}</span>
                    <span>{b.readTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QR SECTION ────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #0f4c75 0%, #0a7c5c 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fade()}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold tracking-widest uppercase mb-4">
                Mobile Friendly
              </span>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-5">
                Earn Anywhere,
                <br />
                <span className="text-teal-300">Anytime</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-8 text-lg">
                Nexcribe is fully optimised for mobile. Open tasks, complete games
                and track your wallet right from your phone. No app download needed -
                just scan, register and start.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-teal-700 font-display font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Open on this Device
                </Link>
                <a
                  href="https://nexcribe.com"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-display font-semibold hover:bg-white/10 transition-all"
                >
                  nexcribe.com
                </a>
              </div>
            </motion.div>

            {/* QR Code (SVG) */}
            <motion.div {...fade(0.2)} className="flex justify-center">
              <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-xs w-full">
                <p className="font-display font-bold text-navy-900 mb-4">Scan to Open Nexcribe</p>

                {/* SVG QR code pattern */}
                <div className="mx-auto w-48 h-48 mb-4">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Corner squares */}
                    <rect x="10" y="10" width="60" height="60" rx="6" fill="#0a7c5c"/>
                    <rect x="20" y="20" width="40" height="40" rx="3" fill="white"/>
                    <rect x="28" y="28" width="24" height="24" rx="2" fill="#0a7c5c"/>

                    <rect x="130" y="10" width="60" height="60" rx="6" fill="#0a7c5c"/>
                    <rect x="140" y="20" width="40" height="40" rx="3" fill="white"/>
                    <rect x="148" y="28" width="24" height="24" rx="2" fill="#0a7c5c"/>

                    <rect x="10" y="130" width="60" height="60" rx="6" fill="#0a7c5c"/>
                    <rect x="20" y="140" width="40" height="40" rx="3" fill="white"/>
                    <rect x="28" y="148" width="24" height="24" rx="2" fill="#0a7c5c"/>

                    {/* Data dots */}
                    {[
                      [85,15],[95,15],[105,15],[115,15],
                      [85,25],[105,25],
                      [85,35],[95,35],[105,35],
                      [85,45],[115,45],
                      [85,55],[95,55],[105,55],[115,55],
                      [85,65],[105,65],
                      [15,85],[25,85],[35,85],[55,85],[65,85],
                      [85,85],[95,85],[115,85],[125,85],[135,85],[155,85],[165,85],
                      [15,95],[45,95],[65,95],[85,95],[105,95],[135,95],[165,95],
                      [25,105],[35,105],[55,105],[95,105],[115,105],[155,105],
                      [15,115],[45,115],[65,115],[85,115],[105,115],[125,115],[145,115],[165,115],
                      [25,125],[55,125],[95,125],[135,125],[165,125],
                      [85,135],[105,135],[125,135],[145,135],
                      [85,145],[95,145],[125,145],[155,145],
                      [85,155],[95,155],[105,155],[115,155],[145,155],
                      [85,165],[105,165],[135,165],[155,165],[165,165],
                      [85,175],[95,175],[115,175],[125,175],[145,175],
                    ].map(([x, y], k) => (
                      <rect key={k} x={x} y={y} width="8" height="8" rx="1.5" fill="#0a7c5c" />
                    ))}

                    {/* Center logo */}
                    <rect x="88" y="88" width="24" height="24" rx="4" fill="#0a7c5c"/>
                    <text x="100" y="104" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">N</text>
                  </svg>
                </div>

                <p className="text-navy-500 text-xs">Point your camera at this code</p>
                <p className="text-teal-600 font-display font-bold text-sm mt-1">nexcribe.com</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fade()}>
            <span className="text-5xl block mb-6">🚀</span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-navy-900 mb-4">
              Your First KES Waiting
            </h2>
            <p className="text-navy-500 text-lg mb-10 max-w-xl mx-auto">
              Join 12,000+ Kenyans already earning on Nexcribe.
              Registration is free. Pay only when you pick your plan.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-display font-bold text-base shadow-xl shadow-teal-200 hover:-translate-y-0.5 transition-all"
              >
                Create Free Account →
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl border-2 border-navy-200 text-navy-700 font-display font-semibold text-base hover:border-teal-500 hover:text-teal-600 transition-all"
              >
                I have an account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      < Footer />
    </div>
  )
}