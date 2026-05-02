import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { usersAPI, paymentsAPI } from '@/api/endpoints'
import { fmtUSD, fmtKES, fmtRelative, getErrorMessage, STATUS_BADGES } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'

// ── Bank-style wallet card ──
function BankWalletCard({ label, icon, balance_usd, balance_kes, meta, onAction, actionLabel, actionDisabled, color }) {
  const styles = {
    teal:  'border-teal-200 bg-gradient-to-br from-white to-teal-50/50',
    navy:  'border-navy-200 bg-gradient-to-br from-white to-navy-50/30',
    coral: 'border-coral-200 bg-gradient-to-br from-white to-coral-50/50',
    green: 'border-green-200 bg-gradient-to-br from-white to-green-50/50',
  }
  const amtColors = {
    teal: 'text-teal-700', navy: 'text-navy-800', coral: 'text-coral-700', green: 'text-green-700',
  }
  const btnStyles = {
    teal:  'bg-teal-600 hover:bg-teal-500 text-white',
    navy:  'bg-navy-700 hover:bg-navy-600 text-white',
    coral: 'bg-coral-500 hover:bg-coral-400 text-white',
    green: 'bg-green-600 hover:bg-green-500 text-white',
  }

  return (
    <div className={`card border ${styles[color] || styles.teal} p-5`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="font-display font-semibold text-navy-600 text-sm uppercase tracking-wider">
            {label}
          </span>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-400" title="Active" />
      </div>

      {/* Balance */}
      <div className="border-t border-dashed border-navy-200 pt-4 mb-4">
        <p className="text-navy-400 text-xs uppercase tracking-widest mb-1">Available Balance</p>
        <p className={`font-display text-3xl ${amtColors[color] || amtColors.teal}`}>
          {fmtUSD(balance_usd)}
        </p>
        <p className="text-navy-400 text-xs mt-0.5">{fmtKES(balance_kes)}</p>
      </div>

      {/* Meta rows */}
      {meta && meta.length > 0 && (
        <div className="border-t border-navy-100 pt-3 mb-4 space-y-1.5">
          {meta.map(({ key, val }) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="text-navy-400">{key}</span>
              <span className="font-display text-navy-600">{val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action button */}
      {onAction && (
        <button
          onClick={onAction}
          disabled={actionDisabled}
          className={`w-full py-2.5 rounded-xl text-sm font-display font-semibold transition-all
            ${btnStyles[color] || btnStyles.teal}
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default function WalletPage() {
  const [tab, setTab] = useState('transactions')
  const [depositModal, setDepositModal] = useState(false)
  const [withdrawModal, setWithdrawModal] = useState(null)
  const qc = useQueryClient()

  const depositForm = useForm()
  const withdrawForm = useForm()
  const withdrawMethod = withdrawForm.watch('method', 'MPESA')

  // ── Queries ──
  const { data: wallets, isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => usersAPI.getWallets().then(r => r.data),
    staleTime: 0,
    refetchOnMount: true,
    // Poll every 30s so admin-side actions (deposit/withdrawal approve/reject)
    // update balances without requiring a manual page refresh
    refetchInterval: 30000,
  })

  const { data: txnData } = useQuery({
    queryKey: ['transactions-all'],
    queryFn: () => usersAPI.getTransactions({ page_size: 50 }).then(r => r.data),
    enabled: tab === 'transactions',
    staleTime: 0,
  })

  const { data: depositsData } = useQuery({
    queryKey: ['my-deposits'],
    queryFn: () => paymentsAPI.getDeposits().then(r => r.data),
    enabled: tab === 'deposits',
    staleTime: 0,
  })

  const { data: withdrawalsData } = useQuery({
    queryKey: ['my-withdrawals'],
    queryFn: () => paymentsAPI.getWithdrawals().then(r => r.data),
    enabled: tab === 'withdrawals',
    staleTime: 0,
    // Poll every 30s — withdrawal status changes are made by admin
    refetchInterval: tab === 'withdrawals' ? 30000 : false,
  })

  const { data: mpesaDetails } = useQuery({
    queryKey: ['mpesa-details'],
    queryFn: () => paymentsAPI.getMpesaDetails().then(r => r.data),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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
      setWithdrawModal(null)
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
      wallet_type: withdrawModal,
      amount_usd: parseFloat(data.amount_usd),
    })
  }

  if (isLoading) return <PageSpinner />

  const aw = wallets?.account_wallet
  const yw = wallets?.yields_wallet
  const dw = wallets?.deposit_wallet
  const cw = wallets?.cashback_wallet
  const txns = txnData?.results || []
  const deposits = depositsData?.results || []
  const withdrawals = withdrawalsData?.results || []

  return (
    <div className="page">
      <div className="mb-6">
        <h1 className="section-title">Wallet & Payments</h1>
        <p className="section-subtitle">
          Deposit via M-Pesa to fund your account. Withdraw earnings from $2.
        </p>
      </div>

      {/* 4 Wallet Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <BankWalletCard
          label="Account Wallet"
          icon="💼"
          balance_usd={aw?.balance_usd}
          balance_kes={aw?.balance_kes}
          meta={[
            { key: 'Total earned', val: fmtUSD(aw?.total_earned_usd) },
            { key: 'Withdrawn', val: fmtUSD(aw?.total_withdrawn_usd) },
            ...(parseFloat(aw?.pending_usd) > 0
              ? [{ key: 'Pending', val: fmtUSD(aw?.pending_usd) }]
              : []),
          ]}
          onAction={() => setWithdrawModal('ACCOUNT')}
          actionLabel="Withdraw →"
          actionDisabled={parseFloat(aw?.balance_usd || 0) < 2}
          color="teal"
        />
        <BankWalletCard
          label="Deposit Wallet"
          icon="🏦"
          balance_usd={dw?.balance_usd}
          balance_kes={dw?.balance_kes}
          meta={[
            { key: 'Total deposited', val: fmtUSD(dw?.total_deposited_usd) },
            { key: 'Total spent', val: fmtUSD(dw?.total_spent_usd) },
          ]}
          onAction={() => setDepositModal(true)}
          actionLabel="+ Deposit via M-Pesa"
          actionDisabled={false}
          color="coral"
        />
        <BankWalletCard
          label="Extras"
          icon="🎁"
          balance_usd={cw?.balance_usd}
          balance_kes={cw?.balance_kes}
          meta={[
            { key: 'Total earned', val: fmtUSD(cw?.total_earned_usd) },
          ]}
          color="green"
        />
        <BankWalletCard
          label="Yields Wallet"
          icon="📈"
          balance_usd={yw?.balance_usd}
          balance_kes={yw?.balance_kes}
          meta={[
            { key: 'Total earned', val: fmtUSD(yw?.total_earned_usd) },
            { key: 'Withdrawn', val: fmtUSD(yw?.total_withdrawn_usd) },
            ...(parseFloat(yw?.pending_usd) > 0
              ? [{ key: 'Pending', val: fmtUSD(yw?.pending_usd) }]
              : []),
          ]}
          onAction={() => setWithdrawModal('YIELDS')}
          actionLabel="Withdraw →"
          actionDisabled={parseFloat(yw?.balance_usd || 0) < 2}
          color="navy"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'transactions', label: 'All Transactions' },
          { key: 'deposits',     label: 'Deposits' },
          { key: 'withdrawals',  label: 'Withdrawals' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all ${
              tab === key
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-navy-200 text-navy-600 hover:border-teal-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Transactions */}
      {tab === 'transactions' && (
        <div className="card overflow-x-auto">
          {txns.length === 0 ? (
            <EmptyState icon="💳" title="No transactions yet" desc="Make a deposit to get started." />
          ) : (
            <table className="tbl min-w-[640px]">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Wallet</th>
                  <th>Source</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {txns.map(t => (
                  <tr key={t.id}>
                    <td><span className="txn-code">{t.transaction_code}</span></td>
                    <td className="max-w-[200px] truncate text-navy-600 text-sm">{t.description}</td>
                    <td><span className="badge-navy text-xs">{t.wallet_type}</span></td>
                    <td className="text-navy-500 text-xs">{t.source}</td>
                    <td className={`text-right font-display text-sm ${
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
          )}
        </div>
      )}

      {/* Deposits */}
      {tab === 'deposits' && (
        <div className="card overflow-x-auto">
          {deposits.length === 0 ? (
            <EmptyState
              icon="🏦"
              title="No deposits yet"
              desc="Submit your M-Pesa code after sending money."
              action={
                <button onClick={() => setDepositModal(true)} className="btn-primary">
                  Make a Deposit
                </button>
              }
            />
          ) : (
            <table className="tbl min-w-[640px]">
              <thead>
                <tr>
                  <th>Txn Code</th>
                  <th>M-Pesa Code</th>
                  <th>Phone</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                  <th className="text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map(d => (
                  <tr key={d.id}>
                    <td><span className="txn-code">{d.transaction_code}</span></td>
                    <td className="font-mono text-sm font-semibold text-navy-700">{d.mpesa_code}</td>
                    <td className="text-navy-500 text-sm">{d.phone_number}</td>
                    <td className="text-right text-teal-600">
                      {fmtKES(d.amount_kes)} <span className="text-navy-400 text-xs font-normal">({fmtUSD(d.amount_usd)})</span>
                    </td>
                    <td>
                      <span className={`${STATUS_BADGES[d.status] || 'badge-navy'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="text-right text-navy-400 text-xs">
                      {fmtRelative(d.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Withdrawals */}
      {tab === 'withdrawals' && (
        <div className="card overflow-x-auto">
          {withdrawals.length === 0 ? (
            <EmptyState icon="💸" title="No withdrawals yet" />
          ) : (
            <table className="tbl min-w-[640px]">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Wallet</th>
                  <th>Method</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                  <th className="text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map(w => (
                  <tr key={w.id}>
                    <td><span className="txn-code">{w.transaction_code}</span></td>
                    <td><span className="badge-navy text-xs">{w.wallet_type}</span></td>
                    <td className="text-navy-600 text-sm">{w.method}</td>
                    <td className="text-right font-display font-bold text-coral-600">
                      -{fmtUSD(w.amount_usd)}
                    </td>
                    <td>
                      <span className={STATUS_BADGES[w.status] || 'badge-navy'}>{w.status}</span>
                    </td>
                    <td className="text-right text-navy-400 text-xs">
                      {fmtRelative(w.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Deposit Modal ── */}
      <Modal
        open={depositModal}
        onClose={() => { setDepositModal(false); depositForm.reset() }}
        title="Submit M-Pesa Deposit"
      >
        <form onSubmit={depositForm.handleSubmit(onDeposit)} className="space-y-4">
          {/* Steps */}
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 space-y-2">
            <p className="font-display font-semibold text-teal-800 text-sm">How to deposit:</p>
            <ol className="space-y-1 text-sm text-teal-700">
              <li>1. Send money via M-Pesa to our deposit exchange agent <strong className="font-bold">{mpesaDetails?.phone_number || 'Loading...'} ({mpesaDetails?.account_name || 'Loading...'})</strong></li>
              <li>2. Copy the M-Pesa confirmation code (e.g. QJK2ABC123)</li>
              <li>3. Fill in the form below and submit</li>
              <li>4. Admin approves within 5-10 minutes → funds appear in Deposit Wallet</li>
            </ol>
            <p className="font-display font-semibold text-teal-800 text-sm">NOTE: We are updating our system and more advanced deposit methods will be available soon</p>
          </div>

          <div>
            <label className="label">M-Pesa confirmation code</label>
            <input
              {...depositForm.register('mpesa_code', { required: 'Required' })}
              placeholder="e.g. QJK2ABC123"
              className="input font-mono uppercase tracking-wider"
            />
            {depositForm.formState.errors.mpesa_code && (
              <p className="text-red-500 text-xs mt-1">
                {depositForm.formState.errors.mpesa_code.message}
              </p>
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
              <p className="text-red-500 text-xs mt-1">
                {depositForm.formState.errors.phone_number.message}
              </p>
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
              <p className="text-red-500 text-xs mt-1">
                {depositForm.formState.errors.amount_kes.message}
              </p>
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

      {/* ── Withdrawal Modal ── */}
      <Modal
        open={!!withdrawModal}
        onClose={() => { setWithdrawModal(null); withdrawForm.reset() }}
        title={`Withdraw from ${withdrawModal === 'ACCOUNT' ? 'Account' : 'Yields'} Wallet`}
      >
        <form onSubmit={withdrawForm.handleSubmit(onWithdraw)} className="space-y-4">
          <div className="bg-navy-50 rounded-xl p-4 flex items-center justify-between">
            <p className="text-navy-600 text-sm">Available balance</p>
            <p className="font-display font-extrabold text-teal-600">
              {withdrawModal === 'ACCOUNT' ? fmtUSD(aw?.balance_usd) : fmtUSD(yw?.balance_usd)}
            </p>
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
              <p className="text-red-500 text-xs mt-1">
                {withdrawForm.formState.errors.amount_usd.message}
              </p>
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

          <p className="text-navy-400 text-xs">
            Processing within 24 hours. Rate: $1 = KES 120.
          </p>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setWithdrawModal(null); withdrawForm.reset() }}
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