import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usersAPI } from '@/api/endpoints'
import useAuthStore from '@/store/authStore'
import { fmtUSD, fmtKES, fmtRelative } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07 },
})

// ── Virtual Card Component ──
function VirtualCard({ card }) {
  if (!card) return null
  const parts = (card.card_number || '').split(' ')

  return (
    <div className="relative w-full max-w-sm mx-auto h-44 rounded-2xl overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #0d1b2e 0%, #1e3a5f 50%, #0a7c5c 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}
    >
      {/* Shimmer circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />

      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span className="font-display text-white text-lg tracking-tight">
            Nexcribe
          </span>
          <div className="flex gap-0.5">
            <div className="w-7 h-7 rounded-full bg-coral-500/80" />
            <div className="w-7 h-7 rounded-full bg-yellow-400/60 -ml-3" />
          </div>
        </div>

        {/* Card number */}
        <div className="flex items-center gap-3">
          {parts.map((group, i) => (
            <span key={i} className="font-mono text-white text-base tracking-widest">
              {i < 3 ? '••••' : group}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Card Holder</p>
            <p className="text-white font-display font-semibold text-sm tracking-wide">
              {card.card_name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Expires</p>
            <p className="text-white font-mono text-sm">{card.expiry}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Bank-style Wallet Card ──
function WalletCard({ label, icon, balance_usd, balance_kes, sub, subValue, to, color }) {
  const colors = {
    teal:    { border: 'border-teal-200',  icon: 'bg-teal-50 text-teal-600',  amount: 'text-teal-700', bg: 'bg-teal-50/30' },
    navy:    { border: 'border-navy-200',  icon: 'bg-navy-50 text-navy-600',  amount: 'text-navy-800', bg: 'bg-navy-50/20' },
    coral:   { border: 'border-coral-200', icon: 'bg-coral-50 text-coral-600',amount: 'text-coral-700',bg: 'bg-coral-50/30' },
    green:   { border: 'border-green-200', icon: 'bg-green-50 text-green-600',amount: 'text-green-700',bg: 'bg-green-50/30' },
  }
  const c = colors[color] || colors.teal

  return (
    <Link to={to} className={`card ${c.bg} border ${c.border} p-5 flex flex-col gap-3 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl ${c.icon} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <span className="text-navy-400 text-xs font-display font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>

      {/* Divider line like bank statement */}
      <div className="border-t border-dashed border-navy-100" />

      <div>
        <p className={`font-display text-2xl ${c.amount}`}>
          {fmtUSD(balance_usd)}
        </p>
        <p className="text-navy-400 text-xs mt-0.5">{fmtKES(balance_kes)}</p>
      </div>

      {sub && (
        <div className="flex items-center justify-between text-xs border-t border-navy-100 pt-2 mt-auto">
          <span className="text-navy-400">{sub}</span>
          <span className="font-display font-semibold text-navy-600">{subValue}</span>
        </div>
      )}
    </Link>
  )
}

export default function DashboardHome() {
  const { user } = useAuthStore()

  const { data: wallets, isLoading: walletsLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => usersAPI.getWallets().then(r => r.data),
    staleTime: 0,
    refetchOnMount: true,
    refetchInterval: 30000,
  })

  const { data: card } = useQuery({
    queryKey: ['virtual-card'],
    queryFn: () => usersAPI.getVirtualCard().then(r => r.data),
    staleTime: Infinity,
  })

  const { data: txnData } = useQuery({
    queryKey: ['transactions-recent'],
    queryFn: () => usersAPI.getTransactions({ page_size: 6 }).then(r => r.data),
    staleTime: 0,
    refetchOnMount: true,
  })

  if (walletsLoading) return <PageSpinner />

  const aw = wallets?.account_wallet
  const dw = wallets?.deposit_wallet
  const cw = wallets?.cashback_wallet
  const recentTxns = txnData?.results || []

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page">

      {/* Greeting */}
      <motion.div {...fade(0)} className="mb-8">
        <h1 className="font-display text-2xl text-navy-900">
          {greeting}, {user?.first_name || user?.username} 👋
        </h1>
        <p className="text-navy-500 text-sm mt-1">
          Here's your financial overview for today.
        </p>
      </motion.div>

      {/* Virtual Card + Wallets side by side */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8 items-start">

        {/* Virtual Card */}
        <motion.div {...fade(1)}>
          <p className="text-xs font-display font-semibold text-navy-500 uppercase tracking-widest mb-3">
            Virtual Card
          </p>
          <VirtualCard card={card} />
        </motion.div>

        {/* 4 Wallet Cards */}
        <motion.div {...fade(2)}>
          <p className="text-xs font-display font-semibold text-navy-500 uppercase tracking-widest mb-3">
            My Wallets
          </p>
          <div className="grid grid-cols-2 gap-3">
            <WalletCard
              label="Account"
              icon="💼"
              balance_usd={aw?.balance_usd}
              balance_kes={aw?.balance_kes}
              sub="Total earned"
              subValue={fmtUSD(aw?.total_earned_usd)}
              to="/dashboard/wallet"
              color="teal"
            />
            <WalletCard
              label="Deposit"
              icon="🏦"
              balance_usd={dw?.balance_usd}
              balance_kes={dw?.balance_kes}
              sub="Total deposited"
              subValue={fmtUSD(dw?.total_deposited_usd)}
              to="/dashboard/wallet"
              color="coral"
            />
            <WalletCard
              label="Cashback"
              icon="🎁"
              balance_usd={cw?.balance_usd}
              balance_kes={cw?.balance_kes}
              sub="Total earned"
              subValue={fmtUSD(cw?.total_earned_usd)}
              to="/dashboard/wallet"
              color="green"
            />
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div {...fade(3)} className="mb-8">
        <h2 className="section-title mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { to: '/dashboard/wallet',        icon: '🏦', label: 'Deposit' },
            { to: '/dashboard/writing',       icon: '✍️', label: 'Writing' },
            { to: '/dashboard/transcription', icon: '🎧', label: 'Transcription' },
            { to: '/dashboard/games',         icon: '🎮', label: 'Games' },
            { to: '/dashboard/wheel',         icon: '🎡', label: 'Wheel' },
          ].map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className="card-hover p-4 flex flex-col items-center gap-2 text-center"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-display font-semibold text-navy-700">{label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent transactions */}
      <motion.div {...fade(4)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Transactions</h2>
          <Link
            to="/dashboard/wallet"
            className="text-sm text-teal-600 font-semibold hover:text-teal-500"
          >
            See all →
          </Link>
        </div>

        {recentTxns.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-3xl mb-3">💳</p>
            <p className="font-display font-bold text-navy-700 mb-1">No transactions yet</p>
            <p className="text-navy-500 text-sm">Make a deposit to get started.</p>
            <Link to="/dashboard/wallet" className="btn-primary mt-4 inline-flex">
              Make a Deposit
            </Link>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="tbl min-w-[640px]">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Wallet</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">When</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.map(t => (
                  <tr key={t.id}>
                    <td>
                      <span className="txn-code">{t.transaction_code}</span>
                    </td>
                    <td className="max-w-[180px] truncate text-navy-600 text-sm">
                      {t.description}
                    </td>
                    <td>
                      <span className="badge-navy text-xs">{t.wallet_type}</span>
                    </td>
                    <td className={`text-right font-display font-bold text-sm ${
                      t.type === 'CREDIT' ? 'text-teal-600' : 'text-coral-600'
                    }`}>
                      {t.type === 'CREDIT' ? '+' : '-'}{fmtUSD(t.amount_usd)}
                    </td>
                    <td className="text-right text-navy-400 text-xs">
                      {fmtRelative(t.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}