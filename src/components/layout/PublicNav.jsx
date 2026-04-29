import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '@/store/authStore'

export default function PublicNav() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <nav className={`sticky top-0 z-50 ${isHome ? 'bg-teal-gradient' : 'bg-white border-b border-navy-100'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className={`font-display font-800 text-xl tracking-tight ${isHome ? 'text-white' : 'text-teal-600'}`}>
            Nexcribe
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {['Features', 'Plans', 'How it works'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className={`text-sm font-body font-500 transition-colors ${
                isHome ? 'text-white/80 hover:text-white' : 'text-navy-600 hover:text-teal-600'
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard" className={`btn-primary text-sm ${isHome ? '' : ''}`}>
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-display font-600 transition-colors ${
                  isHome ? 'text-white/90 hover:text-white' : 'text-navy-700 hover:text-teal-600'
                }`}
              >
                Log In
              </Link>
              <Link to="/register" className="btn-coral text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden p-2 rounded-lg ${isHome ? 'text-white' : 'text-navy-700'}`}
          onClick={() => setOpen(!open)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-navy-100 px-4 pb-4 pt-2 flex flex-col gap-2">
          <Link to="/login" className="btn-ghost w-full justify-center" onClick={() => setOpen(false)}>Log In</Link>
          <Link to="/register" className="btn-coral w-full justify-center" onClick={() => setOpen(false)}>Get Started</Link>
        </div>
      )}
    </nav>
  )
}
