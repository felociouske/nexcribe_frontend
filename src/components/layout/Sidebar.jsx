import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import toast from 'react-hot-toast'
import { cn } from '@/utils'

const NAV = [
  { to: '/dashboard',               icon: '⊞', label: 'Dashboard' },
  { to: '/dashboard/plans',         icon: '◈', label: 'Plans' },
  { to: '/dashboard/writing',       icon: '✍', label: 'Writing' },
  { to: '/dashboard/transcription', icon: '🎧', label: 'Transcription' },
  { to: '/dashboard/games',         icon: '🎮', label: 'Games' },
  { to: '/dashboard/wheel',         icon: '🎡', label: 'Lucky Wheel' },
  { to: '/dashboard/affiliates',    icon: '◉', label: 'Affiliates' },
  { to: '/dashboard/wallet',        icon: '◎', label: 'Wallet' },
  { to: '/dashboard/notifications', icon: '◻', label: 'Notifications' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out.')
    navigate('/login')
  }

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 bottom-0 md:sticky md:top-0 md:h-screen z-30 w-64 flex flex-col',
        'bg-navy-900 transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <span className="font-display font-800 text-xl text-white tracking-tight">Nexcribe</span>
        <button onClick={onClose} className="ml-auto md:hidden text-white/50 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-500 transition-all duration-150',
                isActive
                  ? 'bg-teal-600 text-white shadow-teal-glow/30'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              )
            }
          >
            <span className="text-base w-5 text-center">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-3 pb-6 md:pb-3">
        <NavLink
          to="/dashboard/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-display font-700 flex-shrink-0">
            {user?.username?.[0]?.toUpperCase() || 'N'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-body font-500 truncate">{user?.username}</p>
            <p className="text-white/40 text-xs truncate">{user?.email}</p>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          className="mt-1 w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/50 hover:text-coral-400 hover:bg-coral-500/10 text-sm font-body transition-colors"
        >
          <span className="text-base w-5 text-center">⇤</span>
          Log out
        </button>
      </div>
    </aside>
  )
}
