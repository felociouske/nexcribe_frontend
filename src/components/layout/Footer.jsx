import { Link } from 'react-router-dom'

const legalLinks = [
  { label: 'Terms of Service',  to: '/terms' },
  { label: 'Privacy Policy',    to: '/privacy' },
  { label: 'Refund Policy',     to: '/refund-policy' },
  { label: 'Deposit Agreement', to: '/deposit-agreement' },
  { label: 'Withdrawal Policy', to: '/withdrawal-policy' },
  { label: 'Contact Us',        to: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <h3 className="font-display font-extrabold text-2xl text-white mb-3">Nexcribe</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Africa's leading earn-online platform. Write, transcribe, play
              and earn real money — paid to M-Pesa, fast.
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: 'Facebook', icon: (
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                )},
                { label: 'Twitter', icon: (
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                )},
                { label: 'Instagram', icon: (
                  <>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </>
                )},
                { label: 'WhatsApp', icon: (
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                )},
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-teal-500 flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2.5">
              {['How It Works', 'Writing Jobs', 'Transcription', 'Gaming', 'Lucky Wheel', 'Plans & Pricing'].map(l => (
                <li key={l}>
                  <a href="#features" className="text-white/50 hover:text-teal-400 text-sm transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-widest">Account</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Register Free', to: '/register' },
                { label: 'Log In', to: '/login' },
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'My Wallet', to: '/dashboard/wallet' },
                { label: 'View Plans', to: '/dashboard/plans' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-white/50 hover:text-teal-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-widest">Legal & Payments</h4>
            <ul className="space-y-2.5 mb-6">
              {legalLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-white/50 hover:text-teal-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Accepted Payments</p>
              <div className="flex flex-wrap gap-2">
                {['M-Pesa', 'Card'].map(m => (
                  <span key={m} className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs font-semibold">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="bg-white/5 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <p className="text-white/50 text-xs leading-relaxed">
              <strong className="text-white/70">Deposit Policy:</strong> All deposits are processed manually via M-Pesa to deposit exchange agents.
              Once approved, funds are credited to your Deposit Wallet for plan purchases only.
              Deposited funds are non-refundable once a plan is activated. Withdrawal of earnings is separate from
              deposited funds and requires a minimum of KES 240. By depositing you agree to our
              <Link to="/terms" className="text-teal-400 hover:underline ml-1">Terms of Service</Link> and
              <Link to="/deposit-agreement" className="text-teal-400 hover:underline ml-1">Deposit Agreement</Link>.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">© 2026 Nexcribe Ltd. All rights reserved. Nairobi, Kenya.</p>
          <p className="text-white/30 text-xs">Made with ❤️ by Nexcribe ICT Team.</p>
        </div>
      </div>
    </footer>
  )
}
