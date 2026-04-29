import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { notificationsAPI } from '@/api/endpoints'
import { fmtRelative } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import useAuthStore from '@/store/authStore'

const TYPE_ICONS = {
  COMMISSION:    '◉',
  REFERRAL:      '◈',
  PLAN_PURCHASE: '◆',
  WITHDRAWAL:    '◎',
  TASK_APPROVED: '✓',
  TASK_REJECTED: '✕',
  TASK_ASSIGNED: '✍',
  GAME_REWARD:   '★',
  SPIN_WIN:      '◎',
  SYSTEM:        '!',
}

const TYPE_COLORS = {
  COMMISSION:    'bg-teal-100 text-teal-700',
  REFERRAL:      'bg-teal-100 text-teal-600',
  PLAN_PURCHASE: 'bg-violet-100 text-violet-700',
  WITHDRAWAL:    'bg-amber-100 text-amber-700',
  TASK_APPROVED: 'bg-green-100 text-green-700',
  TASK_REJECTED: 'bg-red-100 text-red-600',
  TASK_ASSIGNED: 'bg-blue-100 text-blue-700',
  GAME_REWARD:   'bg-amber-100 text-amber-700',
  SPIN_WIN:      'bg-pink-100 text-pink-700',
  SYSTEM:        'bg-navy-100 text-navy-600',
}

function NotificationCard({ n, onMarkRead }) {
  const [expanded, setExpanded] = useState(false)
  const isUnread = !n.is_read
  const colorClass = TYPE_COLORS[n.type] || TYPE_COLORS.SYSTEM

  const handleTap = () => {
    setExpanded(prev => !prev)
    if (isUnread) onMarkRead(n.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card overflow-hidden cursor-pointer transition-all ${
        isUnread
          ? 'border-teal-200 bg-teal-50/20'
          : 'hover:bg-navy-50/40'
      }`}
      onClick={handleTap}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-display font-800 text-sm ${colorClass}`}>
          {TYPE_ICONS[n.type] || '!'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`font-display font-600 text-sm leading-tight ${isUnread ? 'text-navy-900' : 'text-navy-700'}`}>
              {n.title}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isUnread && (
                <span className="w-2 h-2 rounded-full bg-teal-500 mt-0.5" />
              )}
              <span className="text-navy-400 text-xs whitespace-nowrap">
                {fmtRelative(n.created_at)}
              </span>
            </div>
          </div>

          {/* Preview — always visible */}
          <p className={`text-navy-500 text-sm mt-0.5 ${expanded ? '' : 'line-clamp-1'}`}>
            {n.message}
          </p>

          {/* Expand indicator */}
          <div className="flex items-center gap-2 mt-1.5">
            {n.metadata?.txn_code && (
              <span className="txn-code text-xs">{n.metadata.txn_code}</span>
            )}
            <span className="text-teal-600 text-xs font-600">
              {expanded ? '▲ Show less' : '▼ Show more'}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded full content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-navy-100 mt-0">
              <div className="mt-3 bg-navy-50 rounded-xl p-4">
                <p className="text-xs font-display font-600 text-navy-500 uppercase tracking-wide mb-2">
                  Full Message
                </p>
                <p className="text-navy-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {n.message}
                </p>

                {/* Admin remark / extra metadata */}
                {n.metadata?.admin_note && (
                  <div className="mt-3 border-t border-navy-200 pt-3">
                    <p className="text-xs font-display font-600 text-navy-500 uppercase tracking-wide mb-1">
                      Admin Remark
                    </p>
                    <p className="text-navy-700 text-sm italic">{n.metadata.admin_note}</p>
                  </div>
                )}

                {n.metadata?.amount && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs font-600 text-navy-500">Amount:</span>
                    <span className="font-display font-700 text-teal-700">${n.metadata.amount}</span>
                  </div>
                )}

                {n.metadata?.txn_code && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-600 text-navy-500">Transaction:</span>
                    <span className="txn-code text-xs">{n.metadata.txn_code}</span>
                  </div>
                )}

                {n.link && (
                  <a
                    href={n.link}
                    onClick={e => e.stopPropagation()}
                    className="mt-3 inline-flex items-center gap-1 text-teal-600 text-sm font-600 hover:underline"
                  >
                    View details &rarr;
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function NotificationsPage() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifications-all'],
    queryFn: () => notificationsAPI.getAll({ page_size: 50 }).then(r => r.data),
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
    retry: false,
  })

  const markAll = useMutation({
    mutationFn: () => notificationsAPI.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications-all'] })
      qc.invalidateQueries({ queryKey: ['unread-count'] })
    },
  })

  const markOne = useMutation({
    mutationFn: (id) => notificationsAPI.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications-all'] })
      qc.invalidateQueries({ queryKey: ['unread-count'] })
    },
  })

  if (!isAuthenticated) {
    return (
      <EmptyState icon="!" title="Not authenticated" desc="Please log in to view notifications." />
    )
  }

  if (isLoading) return <PageSpinner />

  if (isError) {
    return (
      <EmptyState icon="!" title="Failed to load" desc="Something went wrong. Try refreshing." />
    )
  }

  const notifications = data?.results || data || []
  const unread = notifications.filter(n => !n.is_read).length

  return (
    <div className="page max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Notifications</h1>
          {unread > 0 && (
            <p className="section-subtitle">{unread} unread — tap any message to expand</p>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
            className="btn-ghost text-sm border border-navy-200"
          >
            {markAll.isPending ? 'Processing...' : 'Mark all read'}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon="!" title="No notifications" desc="Activity updates will appear here." />
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <NotificationCard
              key={n.id}
              n={n}
              onMarkRead={(id) => markOne.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}