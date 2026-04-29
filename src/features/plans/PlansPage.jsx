import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { plansAPI } from '@/api/endpoints'
import { fmtUSD, fmtKES, getErrorMessage, CATEGORY_ICONS } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'

const CATEGORIES = ['WRITING', 'TRANSCRIPTION', 'GAMING']

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState('WRITING')
  const [purchasing, setPurchasing] = useState(null)
  const [payRef, setPayRef] = useState('') // kept (safe if you re-enable later)
  const [payMethod, setPayMethod] = useState('MPESA')
  const qc = useQueryClient()

  const { data: allPlans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () =>
      plansAPI.getAll({ page_size: 100 }).then(r => {
        const d = r.data
        return Array.isArray(d) ? d : d.results || []
      }),
    staleTime: 0,
    refetchOnMount: true,
  })

  const { data: myPlansRaw } = useQuery({
    queryKey: ['my-plans'],
    queryFn: () =>
      plansAPI.getMyPlans().then(r => {
        const d = r.data
        return Array.isArray(d) ? d : d.results || []
      }),
    staleTime: 0,
    refetchOnMount: true,
  })

  const purchase = useMutation({
    mutationFn: ({ planId, data }) => plansAPI.purchase(planId, data),
    onSuccess: (res) => {
      toast.success(`Plan activated! Txn: ${res.data.transaction_code}`)
      qc.invalidateQueries({ queryKey: ['my-plans'] })
      qc.invalidateQueries({ queryKey: ['wallets'] })
      qc.invalidateQueries({ queryKey: ['transactions-all'] })
      // Invalidate job/task caches so Writing & Transcription pages
      // immediately show available work after the new plan is active
      qc.invalidateQueries({ queryKey: ['writing-jobs'] })
      qc.invalidateQueries({ queryKey: ['transcription-tasks'] })
      setPurchasing(null)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const plans = (allPlans || []).filter(p => p.category === activeTab)

  const myPlanMap = {}
  ;(myPlansRaw || []).forEach(up => {
    myPlanMap[up.plan.category] = up.plan.level
  })

  const handleBuy = () => {
    const payload =
      payMethod === 'MPESA'
        ? { mpesa_reference: payRef.trim() }
        : { card_reference: payRef.trim() }

    purchase.mutate({ planId: purchasing.id, data: payload })
  }

  if (isLoading) return <PageSpinner />

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-6">
        <h1 className="section-title">Plans</h1>
        <p className="section-subtitle">
          One-time purchase per category. Upgrade anytime — your higher plan always wins.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all ${
              activeTab === cat
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white border border-navy-200 text-navy-600 hover:border-teal-300 hover:text-teal-600'
            }`}
          >
            {CATEGORY_ICONS[cat]}{' '}
            {cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* My active plan banner */}
      {myPlanMap[activeTab] && (
        <div className="card p-4 bg-teal-50 border-teal-200 mb-6 flex items-center gap-3">
          <span className="text-xl">{CATEGORY_ICONS[activeTab]}</span>
          <div>
            <p className="font-display font-semibold text-teal-800 text-sm">
              You have an active {activeTab.toLowerCase()} plan — Level {myPlanMap[activeTab]}
            </p>
            <p className="text-teal-600 text-xs">
              You can upgrade to a higher level anytime.
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {plans.length === 0 && (
        <div className="card p-10 text-center text-navy-500">
          <p className="text-2xl mb-3">📋</p>
          <p className="font-display font-bold text-navy-700 mb-1">No plans found</p>
          <p className="text-sm">
            Run{' '}
            <code className="bg-navy-100 px-2 py-0.5 rounded text-navy-800 font-mono text-xs">
              python manage.py seed_plans
            </code>{' '}
            then reload.
          </p>
        </div>
      )}

      {/* Plans grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan, i) => {
          const myLevel = myPlanMap[plan.category] || 0
          const isOwned = myLevel === plan.level
          const isLower = myLevel > plan.level
          const isUpgrade = myLevel > 0 && plan.level > myLevel

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`card flex flex-col p-5 ${
                isOwned ? 'ring-2 ring-teal-500 shadow-teal-glow' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap min-h-[24px]">
                {isOwned && <span className="badge-teal">✓ Active</span>}
                {!isOwned && plan.level === 5 && myLevel < 5 && (
                  <span className="badge-coral">⭐ Popular</span>
                )}
              </div>

              <p className="font-display text-navy-900 text-lg leading-tight">
                {plan.name}
              </p>
              <p className="text-navy-400 text-xs mb-3">Level {plan.level}</p>

              <div className="mb-4">
                <span className="font-display text-2xl text-navy-900">
                  {fmtUSD(plan.price_usd)}
                </span>
                <span className="text-navy-400 text-xs ml-1 font-body">
                  {fmtKES(plan.price_kes)}
                </span>
              </div>

              <ul className="space-y-1.5 flex-1 mb-5">
                {(plan.features_list || []).map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-xs text-navy-600">
                    <span className="text-teal-500 mt-0.5 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !isOwned && !isLower && setPurchasing(plan)}
                disabled={isOwned || isLower}
                className={`w-full justify-center text-sm ${
                  isOwned
                    ? 'btn-ghost cursor-default opacity-60'
                    : isLower
                    ? 'btn-ghost opacity-30 cursor-not-allowed'
                    : isUpgrade
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
              >
                {isOwned
                  ? 'Current plan'
                  : isLower
                  ? 'Below your level'
                  : isUpgrade
                  ? `Upgrade → ${plan.name}`
                  : `Get ${plan.name}`}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Purchase modal */}
      <Modal
        open={!!purchasing}
        onClose={() => setPurchasing(null)}
        title={purchasing ? `Purchase ${purchasing.name}` : ''}
      >
        {purchasing && (
          <div className="space-y-5">
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-navy-900">
                  {purchasing.name} · Level {purchasing.level}
                </p>

                <p className="text-navy-500 text-sm">
                  {purchasing.category_display}
                </p>

                <ul className="mt-2 space-y-1">
                  {(purchasing.features_list || []).map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-teal-700"
                    >
                      <span className="font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-right flex-shrink-0 ml-4">
                <p className="font-display text-2xl text-teal-600">
                  {fmtUSD(purchasing.price_usd)}
                </p>
                <p className="text-navy-400 text-xs">
                  {fmtKES(purchasing.price_kes)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPurchasing(null)}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleBuy}
                disabled={purchase.isPending}
                className="btn-primary flex-1"
              >
                {purchase.isPending ? 'Activating…' : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}