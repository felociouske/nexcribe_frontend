import { format, formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'

export { clsx }

export const cn = (...args) => clsx(args)

export const fmtUSD = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val ?? 0)

export const fmtKES = (val) =>
  `KES ${new Intl.NumberFormat('en-KE').format(val ?? 0)}`

export const fmtDate = (d) => {
  if (!d) return '—'
  return format(new Date(d), 'dd MMM yyyy')
}

export const fmtDateTime = (d) => {
  if (!d) return '—'
  return format(new Date(d), 'dd MMM yyyy, HH:mm')
}

export const fmtRelative = (d) => {
  if (!d) return '—'
  return formatDistanceToNow(new Date(d), { addSuffix: true })
}

export const fmtDuration = (seconds) => {
  if (!seconds) return '0m'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

export const getErrorMessage = (err) => {
  if (!err?.response?.data) return err?.message || 'Something went wrong.'
  const d = err.response.data
  if (typeof d === 'string') return d
  if (d.detail) return d.detail
  if (d.non_field_errors) return d.non_field_errors.join(' ')
  const first = Object.values(d)[0]
  if (Array.isArray(first)) return first[0]
  if (typeof first === 'string') return first
  return 'Something went wrong.'
}

export const PLAN_LEVEL_COLORS = {
  1: 'bg-gray-100 text-gray-700',
  2: 'bg-blue-50 text-blue-700',
  3: 'bg-teal-50 text-teal-700',
  4: 'bg-green-50 text-green-700',
  5: 'bg-yellow-50 text-yellow-700',
  6: 'bg-orange-50 text-orange-700',
  7: 'bg-coral-50 text-coral-700',
  8: 'bg-purple-50 text-purple-700',
}

export const CATEGORY_ICONS = {
  WRITING: '✍️',
  TRANSCRIPTION: '🎧',
  GAMING: '🎮',
}

export const STATUS_BADGES = {
  PENDING:    'badge-amber',
  APPROVED:   'badge-green',
  COMPLETED:  'badge-green',
  REJECTED:   'badge-red',
  ACTIVE:     'badge-teal',
  EXPIRED:    'badge-navy',
  OPEN:       'badge-teal',
  ASSIGNED:   'badge-navy',
  SUBMITTED:  'badge-amber',
  CANCELLED:  'badge-red',
  CREDIT:     'badge-green',
  DEBIT:      'badge-red',
}
