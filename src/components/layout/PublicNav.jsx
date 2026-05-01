import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '@/store/authStore'

const NAV_LINKS = [
  { label: 'Features',     href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Plans',        href: '/#plans' },
]

export default function PublicNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 120)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const onHome = isHome && !scrolled
  const navBg = onHome
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md border-b border-navy-100 shadow-sm'

  // If already on home: smooth scroll. Otherwise let href="/#section" do a
  // full navigation which the browser resolves to the section on landing.
  const handleNavClick = (e, href) => {
    if (isHome && href.startsWith('/#')) {
      e.preventDefault()
      const id = href.replace('/#', '')
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      setOpen(false)
    }
    // Not on home → normal href navigation to /#section, browser scrolls to it
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-sm ${
              onHome ? 'bg-white/20 text-white' : 'bg-teal-600 text-white'
            }`}>
              N
            </div>
            <span className={`font-display font-extrabold text-xl tracking-tight ${
              onHome ? 'text-white' : 'text-navy-900'
            }`}>
              Nexcribe
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  onHome
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-navy-600 hover:text-teal-600 hover:bg-teal-50'
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className={`px-5 py-2.5 rounded-xl text-sm font-display font-bold transition-all ${
                  onHome
                    ? 'bg-white text-teal-700 hover:bg-teal-50 shadow-lg'
                    : 'bg-teal-600 text-white hover:bg-teal-500'
                }`}
              >
                Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all ${
                    onHome
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-navy-700 hover:text-teal-600'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className={`px-5 py-2.5 rounded-xl text-sm font-display font-bold shadow-lg hover:-translate-y-0.5 transition-all ${
                    onHome
                      ? 'bg-white text-teal-700 hover:bg-teal-50'
                      : 'bg-teal-600 text-white hover:bg-teal-500'
                  }`}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-xl transition-colors ${
              onHome ? 'text-white hover:bg-white/10' : 'text-navy-700 hover:bg-navy-50'
            }`}
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-navy-100">
                <span className="font-display font-extrabold text-xl text-navy-900">Nexcribe</span>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl text-navy-500 hover:bg-navy-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest px-3 mb-3">Navigation</p>
                {NAV_LINKS.map(({ label, href }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={(e) => { handleNavClick(e, href); setOpen(false) }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-navy-700 hover:bg-teal-50 hover:text-teal-700 font-semibold text-sm transition-all"
                  >
                    <span className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-base">
                      {label === 'Features' ? '✨' : label === 'How It Works' ? '📋' : '💳'}
                    </span>
                    {label}
                  </motion.a>
                ))}

                <div className="border-t border-navy-100 my-4" />
                <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest px-3 mb-3">Account</p>

                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-teal-700 bg-teal-50 font-bold text-sm">
                    <span className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">🏠</span>
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-navy-700 hover:bg-navy-50 font-semibold text-sm">
                      <span className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center">🔑</span>
                      Log In
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white bg-teal-600 hover:bg-teal-500 font-bold text-sm mt-2">
                      <span className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">🚀</span>
                      Get Started Free
                    </Link>
                  </>
                )}

                <div className="border-t border-navy-100 my-4" />
                <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest px-3 mb-3">Legal</p>
                {[
                  { label: 'Terms of Service', to: '/terms' },
                  { label: 'Privacy Policy',   to: '/privacy' },
                  { label: 'Deposit Policy',   to: '/deposit-agreement' },
                ].map(({ label, to }) => (
                  <Link key={label} to={to} onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-navy-500 hover:bg-navy-50 text-sm transition-all">
                    <span className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center">📄</span>
                    {label}
                  </Link>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-navy-100">
                <p className="text-navy-400 text-xs text-center">© 2026 Nexcribe Ltd</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div
        className="h-16"
        style={onHome ? { background: 'linear-gradient(135deg, #0f4c75 0%, #0a7c5c 50%, #0d9488 100%)' } : undefined}
      />
    </>
  )
}