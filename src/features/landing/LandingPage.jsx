import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const EARN_WAYS = [
  { icon: '✍️', title: 'Writing',       desc: 'Get paid for articles, blog posts and academic content. Plans from $10.' },
  { icon: '🎧', title: 'Transcription', desc: 'Transcribe audio from LibriVox and premium sources. Earn per task.' },
  { icon: '🎮', title: 'Gaming',        desc: 'Play daily quiz, trivia, slots and more. Earn real cash every day.' },
  { icon: '🎡', title: 'Lucky Wheel',   desc: 'Spin the wheel for cash prizes up to KES 1,000 per spin.' },
  { icon: '◉',  title: 'Affiliates',   desc: 'Earn up to 45% commission across 8 referral levels. Passive income.' },
]

const PLANS = [
  { name: 'Scribe',  level: 1, price: '$10',  tag: 'Entry',       features: ['2 writing tasks/mo', '3 audio tasks/mo', '5 games/day', '2 spins/day'] },
  { name: 'Codex',   level: 5, price: '$54',  tag: 'Most Popular', features: ['18 writing tasks/mo', '30 audio tasks/mo', '30 games/day', '10 spins/day'] },
  { name: 'Nexus',   level: 8, price: '$150', tag: 'Elite',        features: ['Unlimited tasks', 'Elite clients', 'VIP tournaments', 'Unlimited spins'] },
]

const STATS = [
  { value: '8 levels', label: 'Referral depth' },
  { value: '45%',      label: 'Top commission' },
  { value: '$2',       label: 'Min withdrawal' },
  { value: '24 plans', label: 'Across 3 categories' },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="bg-teal-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-mesh opacity-60" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-display font-600 tracking-widest uppercase mb-6">
              Earn Online — Africa's Platform
            </span>
            <h1 className="font-display font-800 text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              Write. Play. Refer.
              <br />
              <span className="text-teal-200">Get Paid.</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10 font-body">
              Nexcribe is the all-in-one earning platform combining writing jobs, audio transcription,
              games, lucky wheel, and an 8-level affiliate system. Start earning from $10.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/register" className="btn-coral text-base px-8 py-3.5 shadow-coral-glow">
                Start Earning Free →
              </Link>
              <a href="#how-it-works" className="text-white/90 font-display font-600 text-sm hover:text-white transition-colors">
                How it works ↓
              </a>
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" fill="none">
          <path d="M0 60V30C240 0 480 60 720 40C960 20 1200 60 1440 30V60H0Z" fill="white" />
        </svg>
      </section>

      {/* ── Stats ── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...fade(i * 0.1)} className="text-center">
                <p className="font-display font-800 text-3xl text-teal-600">{s.value}</p>
                <p className="text-navy-500 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ways to earn ── */}
      <section id="features" className="py-16 bg-navy-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fade()} className="text-center mb-12">
            <h2 className="font-display font-800 text-3xl md:text-4xl text-navy-900 mb-3">5 Ways to Earn</h2>
            <p className="text-navy-500 max-w-xl mx-auto">Pick one stream or stack them all. Every activity credits your Account Wallet — withdraw from $2.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EARN_WAYS.map((w, i) => (
              <motion.div key={w.title} {...fade(i * 0.08)} className="card-hover p-6">
                <span className="text-3xl mb-4 block">{w.icon}</span>
                <h3 className="font-display font-700 text-navy-900 text-lg mb-2">{w.title}</h3>
                <p className="text-navy-500 text-sm leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Affiliate ── */}
      <section id="how-it-works" className="py-20 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-mesh opacity-20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fade()} className="text-center mb-12">
            <h2 className="font-display font-800 text-3xl md:text-4xl mb-3">8-Level Affiliate System</h2>
            <p className="text-white/60 max-w-xl mx-auto">Invite one person and earn commissions 8 levels deep. Your Yields Wallet grows while you sleep.</p>
          </motion.div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-2xl mx-auto">
            {[
              { l: 1, pct: '45%', col: 'bg-teal-500' },
              { l: 2, pct: '20%', col: 'bg-teal-600' },
              { l: 3, pct: '10%', col: 'bg-teal-700' },
              { l: 4, pct: '7%',  col: 'bg-navy-600' },
              { l: 5, pct: '5%',  col: 'bg-navy-600' },
              { l: 6, pct: '4%',  col: 'bg-navy-700' },
              { l: 7, pct: '3%',  col: 'bg-navy-700' },
              { l: 8, pct: '2%',  col: 'bg-navy-800' },
            ].map((item, i) => (
              <motion.div
                key={item.l} {...fade(i * 0.06)}
                className={`${item.col} rounded-xl p-3 text-center`}
              >
                <p className="font-display font-800 text-white text-lg">{item.pct}</p>
                <p className="text-white/60 text-xs mt-0.5">L{item.l}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-white/40 text-xs mt-6">Commission rates on every plan purchase in your downline</p>
        </div>
      </section>

      {/* ── Plans ── */}
      <section id="plans" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fade()} className="text-center mb-12">
            <h2 className="font-display font-800 text-3xl md:text-4xl text-navy-900 mb-3">Choose Your Plan</h2>
            <p className="text-navy-500 max-w-xl mx-auto">Plans are per category — Writing, Transcription, or Gaming. Own multiple independently. Upgrade anytime.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PLANS.map((p, i) => (
              <motion.div
                key={p.name} {...fade(i * 0.1)}
                className={`card p-6 flex flex-col ${p.tag === 'Most Popular' ? 'ring-2 ring-teal-500 shadow-teal-glow' : ''}`}
              >
                {p.tag === 'Most Popular' && (
                  <span className="badge-teal mb-3 self-start">⭐ {p.tag}</span>
                )}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display font-800 text-3xl text-navy-900">{p.price}</span>
                  <span className="text-navy-400 text-sm">one-time</span>
                </div>
                <p className="font-display font-700 text-navy-700 mb-4">{p.name} · Level {p.level}</p>
                <ul className="space-y-2 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-navy-600">
                      <span className="text-teal-500 font-700">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`mt-6 ${p.tag === 'Most Popular' ? 'btn-primary' : 'btn-outline'} w-full justify-center`}>
                  Get {p.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-teal-gradient">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fade()}>
            <h2 className="font-display font-800 text-3xl md:text-4xl text-white mb-4">Ready to start earning?</h2>
            <p className="text-white/80 mb-8">Join Nexcribe today. No monthly fees — pay once, earn for life.</p>
            <Link to="/register" className="btn-coral text-base px-10 py-4 shadow-coral-glow">
              Create Free Account →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-navy-950 text-white/50 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-800 text-white text-lg">Nexcribe</span>
          <p className="text-sm">© 2026 Nexcribe. All rights reserved.</p>
          <p className="text-sm">support@nexcribe.com</p>
        </div>
      </footer>
    </div>
  )
}
