import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function LegalPage({ title, subtitle, icon, children, lastUpdated = 'January 2026' }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-navy-950 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-teal-400 text-sm font-semibold mb-8 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Nexcribe
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{icon}</span>
              <div>
                <h1 className="font-display font-extrabold text-3xl md:text-4xl">{title}</h1>
                <p className="text-white/50 text-sm mt-1">Last updated: {lastUpdated}</p>
              </div>
            </div>
            {subtitle && <p className="text-white/60 text-base mt-3 max-w-xl">{subtitle}</p>}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="prose prose-navy max-w-none"
          style={{
            '--tw-prose-headings': '#1e3a5f',
            '--tw-prose-body': '#374151',
          }}
        >
          {children}
        </motion.div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-navy-100 flex flex-wrap gap-4 text-sm text-navy-400">
          {[
            { label: 'Terms of Service',  to: '/terms' },
            { label: 'Privacy Policy',    to: '/privacy' },
            { label: 'Refund Policy',     to: '/refund-policy' },
            { label: 'Deposit Agreement', to: '/deposit-agreement' },
            { label: 'Withdrawal Policy', to: '/withdrawal-policy' },
          ].map(({ label, to }) => (
            <Link key={label} to={to} className="hover:text-teal-600 transition-colors">{label}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// Reusable section components for legal content
export function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="font-display font-bold text-xl text-navy-900 mb-4 pb-2 border-b border-navy-100">
        {title}
      </h2>
      <div className="space-y-3 text-navy-600 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

export function Clause({ number, title, children }) {
  return (
    <div className="flex gap-4 py-3 border-b border-navy-50 last:border-0">
      <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 font-display font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
        {number}
      </span>
      <div>
        {title && <p className="font-display font-semibold text-navy-800 text-sm mb-1">{title}</p>}
        <p className="text-navy-500 text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

export function InfoBox({ icon, title, children, color = 'teal' }) {
  const colors = {
    teal:   'bg-teal-50 border-teal-200 text-teal-800',
    amber:  'bg-amber-50 border-amber-200 text-amber-800',
    red:    'bg-red-50 border-red-200 text-red-800',
    navy:   'bg-navy-50 border-navy-200 text-navy-800',
  }
  return (
    <div className={`border rounded-2xl p-5 mb-6 ${colors[color]}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div>
          {title && <p className="font-display font-bold text-sm mb-1">{title}</p>}
          <p className="text-sm leading-relaxed opacity-90">{children}</p>
        </div>
      </div>
    </div>
  )
}