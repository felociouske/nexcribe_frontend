import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { usersAPI, paymentsAPI } from '@/api/endpoints'
import useAuthStore from '@/store/authStore'
import { fmtUSD, fmtKES, fmtRelative, getErrorMessage } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07 },
})

// ── Virtual Card ──────────────────────────────────────────────────────────────
function VirtualCard({ card }) {
  if (!card) return null
  const parts = (card.card_number || '').split(' ')
  return (
    <div
      className="relative w-full h-44 rounded-2xl overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #0d1b2e 0%, #1e3a5f 50%, #0a7c5c 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />
      <div className="relative h-full flex flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="font-display text-white text-lg tracking-tight">Nexcribe</span>
          <div className="flex">
            <div className="w-7 h-7 rounded-full bg-coral-500/80" />
            <div className="w-7 h-7 rounded-full bg-yellow-400/60 -ml-3" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {parts.map((group, i) => (
            <span key={i} className="font-mono text-white text-base tracking-widest">
              {i < 3 ? '••••' : group}
            </span>
          ))}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Card Holder</p>
            <p className="text-white font-display font-semibold text-sm tracking-wide">{card.card_name}</p>
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

// ── Wallet Card ───────────────────────────────────────────────────────────────
function WalletCard({ label, icon, balance_usd, balance_kes, sub, subValue, color }) {
  const colors = {
    teal:  { border: 'border-teal-200',  icon: 'bg-teal-50 text-teal-600',   amount: 'text-teal-700',  bg: 'bg-teal-50/30' },
    coral: { border: 'border-coral-200', icon: 'bg-coral-50 text-coral-600', amount: 'text-coral-700', bg: 'bg-coral-50/30' },
    green: { border: 'border-green-200', icon: 'bg-green-50 text-green-600', amount: 'text-green-700', bg: 'bg-green-50/30' },
  }
  const c = colors[color] || colors.teal
  return (
    <div className={`card ${c.bg} border ${c.border} p-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl ${c.icon} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <span className="text-navy-400 text-xs font-display font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="border-t border-dashed border-navy-100" />
      <div>
        <p className={`font-display text-2xl ${c.amount}`}>{fmtUSD(balance_usd)}</p>
        <p className="text-navy-400 text-xs mt-0.5">{fmtKES(balance_kes)}</p>
      </div>
      {sub && (
        <div className="flex items-center justify-between text-xs border-t border-navy-100 pt-2 mt-auto">
          <span className="text-navy-400">{sub}</span>
          <span className="font-display font-semibold text-navy-600">{subValue}</span>
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [depositModal, setDepositModal] = useState(false)
  const [withdrawModal, setWithdrawModal] = useState(false)

  const depositForm = useForm()
  const withdrawForm = useForm()
  const withdrawMethod = withdrawForm.watch('method', 'MPESA')

  // ── Queries ──
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

  const { data: mpesaDetails } = useQuery({
    queryKey: ['mpesa-details'],
    queryFn: () => paymentsAPI.getMpesaDetails().then(r => r.data),
    staleTime: 5 * 60 * 1000,
  })

  // ── Mutations ──
  const deposit = useMutation({
    mutationFn: (data) => paymentsAPI.requestDeposit(data),
    onSuccess: (res) => {
      toast.success(`Deposit submitted! Txn: ${res.data.transaction_code}`)
      qc.invalidateQueries({ queryKey: ['my-deposits'] })
      setDepositModal(false)
      depositForm.reset()
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const withdraw = useMutation({
    mutationFn: (data) => paymentsAPI.requestWithdrawal(data),
    onSuccess: (res) => {
      toast.success(`Withdrawal submitted! Txn: ${res.data.transaction_code}`)
      qc.invalidateQueries({ queryKey: ['wallets'] })
      qc.invalidateQueries({ queryKey: ['my-withdrawals'] })
      setWithdrawModal(false)
      withdrawForm.reset()
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const onDeposit = (data) => {
    deposit.mutate({
      mpesa_code: data.mpesa_code.trim().toUpperCase(),
      phone_number: data.phone_number.trim(),
      amount_kes: parseFloat(data.amount_kes),
    })
  }

  const onWithdraw = (data) => {
    withdraw.mutate({
      ...data,
      wallet_type: 'ACCOUNT',
      amount_usd: parseFloat(data.amount_usd),
    })
  }

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
        <p className="text-navy-500 text-sm mt-1">Here's your financial overview for today.</p>
      </motion.div>

      {/* Virtual Card + Wallets */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8 items-start">

        {/* Virtual Card */}
        <motion.div {...fade(1)}>
          <p className="text-xs font-display font-semibold text-navy-500 uppercase tracking-widest mb-3">
            Virtual Card
          </p>
          <VirtualCard card={card} />
          <p className="text-navy-500 text-sm mt-2">
            Use this card for online purchases and subscriptions. It's linked to your account wallet.
          </p>
          <p className="text-navy-500 text-sm mt-2">
            Nexcribe is a global platform, based in the UK, supporting transactions in multiple currencies.
            Your card automatically converts to local currency at competitive exchange rates.
          </p>
        </motion.div>

        {/* Wallets — full width on mobile, 3 cols on sm+ */}
        <motion.div {...fade(2)}>
          <p className="text-xs font-display font-semibold text-navy-500 uppercase tracking-widest mb-3">
            My Wallets
          </p>

          {/* grid-cols-1 on mobile → each card is full width */}
          {/* sm:grid-cols-3 on tablet+ → 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <WalletCard
              label="Account"
              icon="💼"
              balance_usd={aw?.balance_usd}
              balance_kes={aw?.balance_kes}
              sub="Total earned"
              subValue={fmtUSD(aw?.total_earned_usd)}
              color="teal"
            />
            <WalletCard
              label="Deposit"
              icon="🏦"
              balance_usd={dw?.balance_usd}
              balance_kes={dw?.balance_kes}
              sub="Total deposited"
              subValue={fmtUSD(dw?.total_deposited_usd)}
              color="coral"
            />
            <WalletCard
              label="Extras"
              icon="🎁"
              balance_usd={cw?.balance_usd}
              balance_kes={cw?.balance_kes}
              sub="Total earned"
              subValue={fmtUSD(cw?.total_earned_usd)}
              color="green"
            />
          </div>

          {/* Deposit + Withdraw action buttons below wallets */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => setDepositModal(true)}
              className="btn-primary flex items-center justify-center gap-2 py-3"
            >
              <span>⬇️</span>
              <span className="font-display font-semibold">Deposit</span>
            </button>
            <button
              onClick={() => setWithdrawModal(true)}
              disabled={parseFloat(aw?.balance_usd || 0) < 2}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-display font-semibold text-sm
                bg-white border-2 border-teal-500 text-teal-700 hover:bg-teal-50
                disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span>⬆️</span>
              <span>Withdraw</span>
            </button>
          </div>
          {parseFloat(aw?.balance_usd || 0) < 2 && (
            <p className="text-navy-400 text-xs mt-2 text-center">
              Minimum withdrawal is $2.00
            </p>
          )}
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div {...fade(3)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Transactions</h2>
          <Link to="/dashboard/wallet" className="text-sm text-teal-600 font-semibold hover:text-teal-500">
            See all →
          </Link>
        </div>

        {recentTxns.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-3xl mb-3">💳</p>
            <p className="font-display font-bold text-navy-700 mb-1">No transactions yet</p>
            <p className="text-navy-500 text-sm">Make a deposit to get started.</p>
            <button onClick={() => setDepositModal(true)} className="btn-primary mt-4 inline-flex">
              Make a Deposit
            </button>
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
                    <td><span className="txn-code">{t.transaction_code}</span></td>
                    <td className="max-w-[180px] truncate text-navy-600 text-sm">{t.description}</td>
                    <td><span className="badge-navy text-xs">{t.wallet_type}</span></td>
                    <td className={`text-right font-display font-bold text-sm ${
                      t.type === 'CREDIT' ? 'text-teal-600' : 'text-coral-600'
                    }`}>
                      {t.type === 'CREDIT' ? '+' : '-'}{fmtUSD(t.amount_usd)}
                    </td>
                    <td className="text-right text-navy-400 text-xs">{fmtRelative(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Deposit Modal — exact same as WalletPage ── */}
      <Modal
        open={depositModal}
        onClose={() => { setDepositModal(false); depositForm.reset() }}
        title="Submit M-Pesa Deposit"
      >
        <form onSubmit={depositForm.handleSubmit(onDeposit)} className="space-y-4">
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 space-y-2">
            <p className="font-display font-semibold text-teal-800 text-sm">How to deposit:</p>
            <ol className="space-y-1 text-sm text-teal-700">
              <li>1. Send money via M-Pesa to <strong>{mpesaDetails?.phone_number || 'Loading…'} ({mpesaDetails?.account_name || 'Loading…'})</strong></li>
              <li>2. Copy the M-Pesa confirmation code (e.g. QJK2ABC123)</li>
              <li>3. Fill in the form below and submit</li>
              <li>4. Admin approves within 5–10 minutes → funds appear in Deposit Wallet</li>
            </ol>
          </div>

          <div>
            <label className="label">M-Pesa confirmation code</label>
            <input
              {...depositForm.register('mpesa_code', { required: 'Required' })}
              placeholder="e.g. QJK2ABC123"
              className="input font-mono uppercase tracking-wider"
            />
            {depositForm.formState.errors.mpesa_code && (
              <p className="text-red-500 text-xs mt-1">{depositForm.formState.errors.mpesa_code.message}</p>
            )}
          </div>

          <div>
            <label className="label">Phone number used</label>
            <input
              {...depositForm.register('phone_number', { required: 'Required' })}
              placeholder="+254 700 000 000"
              className="input"
            />
            {depositForm.formState.errors.phone_number && (
              <p className="text-red-500 text-xs mt-1">{depositForm.formState.errors.phone_number.message}</p>
            )}
          </div>

          <div>
            <label className="label">Amount (KES)</label>
            <input
              {...depositForm.register('amount_kes', {
                required: 'Required',
                min: { value: 100, message: 'Minimum KES 100' },
              })}
              type="number"
              placeholder="e.g. 1500"
              className="input"
            />
            {depositForm.formState.errors.amount_kes && (
              <p className="text-red-500 text-xs mt-1">{depositForm.formState.errors.amount_kes.message}</p>
            )}
            <p className="text-navy-400 text-xs mt-1">$1 = KES 120</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setDepositModal(false); depositForm.reset() }}
              className="btn-ghost flex-1 justify-center border border-navy-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={deposit.isPending}
              className="btn-primary flex-1 justify-center"
            >
              {deposit.isPending ? 'Submitting…' : 'Submit Deposit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Withdraw Modal — Account Wallet only, exact same as WalletPage ── */}
      <Modal
        open={withdrawModal}
        onClose={() => { setWithdrawModal(false); withdrawForm.reset() }}
        title="Withdraw from Account Wallet"
      >
        <form onSubmit={withdrawForm.handleSubmit(onWithdraw)} className="space-y-4">
          <div className="bg-navy-50 rounded-xl p-4 flex items-center justify-between">
            <p className="text-navy-600 text-sm">Available balance</p>
            <p className="font-display font-extrabold text-teal-600">{fmtUSD(aw?.balance_usd)}</p>
          </div>

          <div>
            <label className="label">Amount (USD)</label>
            <input
              {...withdrawForm.register('amount_usd', {
                required: 'Required',
                min: { value: 2, message: 'Minimum $2' },
              })}
              type="number"
              step="0.01"
              min="2"
              placeholder="e.g. 5.00"
              className={`input ${withdrawForm.formState.errors.amount_usd ? 'input-error' : ''}`}
            />
            {withdrawForm.formState.errors.amount_usd && (
              <p className="text-red-500 text-xs mt-1">{withdrawForm.formState.errors.amount_usd.message}</p>
            )}
          </div>

          <div>
            <label className="label">Method</label>
            <div className="flex gap-3">
              {['MPESA', 'CARD'].map(m => (
                <label
                  key={m}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                    border-2 cursor-pointer text-sm font-display font-semibold transition-all ${
                    withdrawMethod === m
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-navy-200 text-navy-500'
                  }`}
                >
                  <input
                    {...withdrawForm.register('method')}
                    type="radio"
                    value={m}
                    className="hidden"
                    defaultChecked={m === 'MPESA'}
                  />
                  {m === 'MPESA' ? '📱 M-Pesa' : '💳 Card'}
                </label>
              ))}
            </div>
          </div>

          {withdrawMethod === 'MPESA' && (
            <div>
              <label className="label">M-Pesa phone number</label>
              <input
                {...withdrawForm.register('phone_number', { required: 'Required for M-Pesa' })}
                placeholder="+254 700 000 000"
                className="input"
              />
            </div>
          )}
          {withdrawMethod === 'CARD' && (
            <div>
              <label className="label">Account details</label>
              <input
                {...withdrawForm.register('account_details', { required: 'Required for card' })}
                placeholder="Card or account info"
                className="input"
              />
            </div>
          )}

          <p className="text-navy-400 text-xs">Processing within 24 hours. Rate: $1 = KES 120.</p>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setWithdrawModal(false); withdrawForm.reset() }}
              className="btn-ghost flex-1 justify-center border border-navy-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={withdraw.isPending}
              className="btn-primary flex-1 justify-center"
            >
              {withdraw.isPending ? 'Submitting…' : 'Request Withdrawal'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  )
}