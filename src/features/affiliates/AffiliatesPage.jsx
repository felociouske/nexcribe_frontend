import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { affiliatesAPI, usersAPI } from '@/api/endpoints'
import { fmtUSD, fmtRelative } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'

function LevelBadge({ level, active, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center rounded-xl py-3 px-2 transition-all border-2 ${
        active
          ? 'border-teal-500 bg-teal-50'
          : 'border-transparent bg-navy-100 hover:bg-navy-200'
      }`}
    >
      <span className={`font-display font-800 text-base ${active ? 'text-teal-700' : 'text-navy-700'}`}>
        C{level}
      </span>
      <span className={`text-xs mt-0.5 ${active ? 'text-teal-500' : 'text-navy-400'}`}>
        {count}
      </span>
    </button>
  )
}

function MembersPanel({ level, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ['downline-members', level],
    queryFn: () => affiliatesAPI.getDownlineLevel(level).then(r => r.data),
    enabled: level !== null,
  })

  const members = data?.members || []

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 26, stiffness: 280 }}
      className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100">
        <div>
          <h2 className="font-display font-700 text-navy-900">C{level} Members</h2>
          <p className="text-navy-500 text-xs mt-0.5">
            {data?.count ?? '...'} members
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-navy-100 text-navy-500 font-bold text-lg"
        >
          &times;
        </button>
      </div>

      {/* Level selector inside panel */}
      <div className="flex gap-1.5 px-5 py-3 border-b border-navy-100 overflow-x-auto">
        {[1, 2, 3, 4].map(l => (
          <button
            key={l}
            onClick={() => {
              onClose()
              setTimeout(() => onClose(l), 10)
            }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-display font-600 transition-all ${
              l === level
                ? 'bg-teal-600 text-white'
                : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
            }`}
          >
            C{l}
          </button>
        ))}
      </div>

      {/* Member list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-navy-400 text-sm">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-navy-400 text-sm">No members at C{level} yet.</p>
            <p className="text-navy-400 text-xs mt-1">Share your referral link to grow your network.</p>
          </div>
        ) : (
          members.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-4 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-teal-gradient flex items-center justify-center text-white text-sm font-display font-700 flex-shrink-0">
                {m.name?.[0]?.toUpperCase() || m.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-600 text-navy-800 text-sm">{m.name || m.username}</p>
                <p className="text-navy-500 text-xs truncate">{m.email}</p>
                {level === 1 && m.phone && m.phone !== '—' && (
                  <p className="text-navy-400 text-xs mt-0.5">{m.phone}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-navy-400 text-xs">Joined {m.joined}</span>
                  {m.is_active ? (
                    <span className="text-xs text-teal-600 font-600">Active</span>
                  ) : (
                    <span className="text-xs text-red-400">Inactive</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default function AffiliatesPage() {
  const [tab, setTab] = useState('overview')
  const [selectedLevel, setSelectedLevel] = useState(null)

  const { data: node, isLoading } = useQuery({
    queryKey: ['affiliate-node'],
    queryFn: () => affiliatesAPI.getNode().then(r => r.data),
    retry: false,
  })

  const { data: earnings } = useQuery({
    queryKey: ['affiliate-earnings'],
    queryFn: () => affiliatesAPI.getEarnings().then(r => r.data),
    retry: false,
  })

  const { data: commData } = useQuery({
    queryKey: ['commissions'],
    queryFn: () => affiliatesAPI.getCommissions().then(r => r.data),
    enabled: tab === 'commissions',
    retry: false,
  })

  const { data: referral } = useQuery({
    queryKey: ['referral'],
    queryFn: () => usersAPI.getReferral().then(r => r.data),
    retry: false,
  })

  if (isLoading) return <PageSpinner />

  const downline = node?.downline_by_level || {}
  const totalDown = node?.total_downline || 0
  const commissions = commData?.results || []

  const copyLink = () => {
    navigator.clipboard.writeText(referral?.referral_link || '')
    toast.success('Referral link copied!')
  }

  return (
    <div className="page">
      <div className="mb-6">
        <h1 className="section-title">Affiliate Program</h1>
        <p className="section-subtitle">Earn commissions 4 levels deep when your referrals purchase plans.</p>
      </div>

      {/* Referral link card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="card p-6 bg-teal-gradient text-white rounded-2xl mb-6"
      >
        <p className="text-white/70 text-xs font-display font-600 uppercase tracking-widest mb-3">
          Your Referral Link
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <code className="font-mono text-sm bg-white/20 px-4 py-2 rounded-xl flex-1 truncate">
            {referral?.referral_link || '—'}
          </code>
          <button
            onClick={copyLink}
            className="bg-white text-teal-700 px-4 py-2 rounded-xl text-sm font-display font-600 hover:bg-teal-50 transition-colors flex-shrink-0"
          >
            Copy Link
          </button>
        </div>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="font-display font-800 text-2xl">{referral?.total_referrals || 0}</p>
            <p className="text-white/60 text-xs">Direct referrals</p>
          </div>
          <div>
            <p className="font-display font-800 text-2xl">{totalDown}</p>
            <p className="text-white/60 text-xs">Total downline</p>
          </div>
          <div>
            <p className="font-display font-800 text-2xl">{fmtUSD(earnings?.yields_wallet_balance)}</p>
            <p className="text-white/60 text-xs">Yields balance</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['overview', 'commissions'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-600 capitalize transition-all ${
              tab === t ? 'bg-teal-600 text-white' : 'bg-white border border-navy-200 text-navy-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">

          {/* C-levels — tap to see members */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-700 text-navy-900">Your Network</h2>
              <p className="text-xs text-navy-400">Tap a level to see members</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(lvl => (
                <LevelBadge
                  key={lvl}
                  level={lvl}
                  active={selectedLevel === lvl}
                  count={downline[`level_${lvl}`] || 0}
                  onClick={() => setSelectedLevel(lvl)}
                />
              ))}
            </div>
          </div>

          {/* Earnings by level */}
          <div className="card p-6">
            <h2 className="font-display font-700 text-navy-900 mb-4">Earnings by Level</h2>
            <div className="space-y-3">
              {Object.entries(earnings?.by_level || {}).map(([key, val]) => {
                const lvl = key.replace('level_', '')
                const totalUsd = parseFloat(earnings?.total_earned_usd || 1)
                const thisUsd = parseFloat(val.total_usd || 0)
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-16 flex-shrink-0">
                      <span className="badge-teal text-xs">C{lvl}</span>
                    </div>
                    <div className="flex-1 h-2 bg-navy-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-gradient rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((thisUsd / Math.max(totalUsd, 1)) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="w-20 text-right font-display font-600 text-sm text-navy-700">
                      {fmtUSD(val.total_usd)}
                    </span>
                    <span className="w-12 text-right text-xs text-navy-400">{val.count} txns</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-navy-100 flex items-center justify-between">
              <p className="font-display font-700 text-navy-700">Total earned</p>
              <p className="font-display font-800 text-xl text-teal-600">{fmtUSD(earnings?.total_earned_usd)}</p>
            </div>
          </div>

          {/* How it works */}
          <div className="card p-6 bg-navy-50/50">
            <h2 className="font-display font-700 text-navy-900 mb-3">How it works</h2>
            <ol className="space-y-2">
              {[
                'Share your referral link with friends and contacts.',
                'When they register and purchase any plan, you earn a commission.',
                'If they refer others, you earn down to 4 levels deep.',
                'All commissions land instantly in your Yields Wallet.',
                'Withdraw from $2 via M-Pesa or card.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-navy-600">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-display font-700">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {tab === 'commissions' && (
        <div className="card overflow-hidden">
          {commissions.length === 0 ? (
            <EmptyState icon="◉" title="No commissions yet" desc="Share your referral link to start earning." />
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>From</th>
                  <th>Plan</th>
                  <th>Level</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map(c => (
                  <tr key={c.id}>
                    <td><span className="txn-code">{c.transaction_code}</span></td>
                    <td className="font-500">{c.from_user_username}</td>
                    <td>{c.plan_category} {c.plan_name}</td>
                    <td><span className="badge-navy">C{c.level_depth}</span></td>
                    <td className="text-right font-display font-700 text-teal-600">+{fmtUSD(c.amount_usd)}</td>
                    <td className="text-right text-navy-400 text-xs">{fmtRelative(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Members side panel */}
      <AnimatePresence>
        {selectedLevel !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setSelectedLevel(null)}
            />
            <MembersPanel
              level={selectedLevel}
              onClose={(newLevel) => {
                if (typeof newLevel === 'number') {
                  setSelectedLevel(newLevel)
                } else {
                  setSelectedLevel(null)
                }
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}