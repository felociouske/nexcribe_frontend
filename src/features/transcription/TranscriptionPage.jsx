import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { transcriptionAPI } from '@/api/endpoints'
import { fmtUSD, fmtKES, fmtDuration, STATUS_BADGES } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'

const DIFF_COLORS = { BASIC: 'badge-teal', EASY: 'badge-green', MEDIUM: 'badge-amber', HARD: 'badge-coral' }

export default function TranscriptionPage() {
  const [tab, setTab] = useState('available')
  const [search, setSearch] = useState('')

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['transcription-tasks', search],
    queryFn: () => transcriptionAPI.getTasks({ search }).then(r => r.data),
    staleTime: 0,
    refetchOnMount: true,
  })

  const { data: myData } = useQuery({
    queryKey: ['my-transcription-tasks'],
    queryFn: () => transcriptionAPI.getMyTasks().then(r => r.data),
    enabled: tab === 'mine',
  })

  const { data: subData } = useQuery({
    queryKey: ['transcription-submissions'],
    queryFn: () => transcriptionAPI.getSubmissions().then(r => r.data),
    enabled: tab === 'submissions',
  })

  const tasks = tasksData?.results || []
  const myTasks = myData?.results || []
  const submissions = subData?.results || []

  if (isLoading && tab === 'available') return <PageSpinner />

  return (
    <div className="page">
      <div className="mb-6">
        <h1 className="section-title">Transcription</h1>
        <p className="section-subtitle">Listen to audio from LibriVox and type the transcript. Audio streams directly — no download needed.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'available', label: 'Available Tasks' },
          { key: 'mine',      label: 'My Tasks' },
          { key: 'submissions', label: 'Submissions' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-600 transition-all ${
              tab === key ? 'bg-teal-600 text-white' : 'bg-white border border-navy-200 text-navy-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'available' && (
        <>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, book or author…"
            className="input max-w-md mb-5"
          />
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <EmptyState
                icon="🎧"
                title="No tasks available"
                desc="You need an active Transcription plan, or no tasks match your plan level."
                action={<Link to="/dashboard/plans" className="btn-primary">Browse Plans</Link>}
              />
            ) : tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/dashboard/transcription/${task.id}`} className="card-hover p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-display font-700 text-navy-900 truncate">{task.title}</h3>
                      <span className={DIFF_COLORS[task.difficulty] || 'badge-navy'}>{task.difficulty}</span>
                      {task.source === 'LIBRIVOX' && <span className="badge-navy text-xs">📚 LibriVox</span>}
                    </div>
                    {task.book_author && (
                      <p className="text-navy-500 text-xs mb-1">by {task.book_author}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-navy-400">
                      <span>⏱ {fmtDuration(task.duration_seconds)}</span>
                      <span>🌐 {task.language}</span>
                      <span>Level {task.minimum_plan_level}+</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-display font-800 text-xl text-teal-600">{fmtUSD(task.pay_usd)}</p>
                    <p className="text-navy-400 text-xs">{fmtKES(task.pay_kes)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {tab === 'mine' && (
        <div className="space-y-4">
          {myTasks.length === 0 ? (
            <EmptyState icon="🎧" title="No claimed tasks" desc="Claim a task from the Available Tasks tab." />
          ) : myTasks.map(task => (
            <Link key={task.id} to={`/dashboard/transcription/${task.id}`} className="card-hover p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-display font-700 text-navy-900">{task.title}</p>
                <p className="text-navy-400 text-xs mt-0.5">{fmtDuration(task.duration_seconds)} · {task.language}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={STATUS_BADGES[task.status] || 'badge-navy'}>{task.status}</span>
                <span className="font-display font-700 text-teal-600">{fmtUSD(task.pay_usd)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === 'submissions' && (
        <div className="card overflow-hidden">
          {submissions.length === 0 ? (
            <EmptyState icon="📋" title="No submissions yet" />
          ) : (
            <table className="tbl">
              <thead>
                <tr><th>Task</th><th>Words</th><th>Status</th><th>Earned</th><th>Txn Code</th></tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <tr key={s.id}>
                    <td className="max-w-[180px] truncate font-500">{s.task_title}</td>
                    <td>{s.word_count}</td>
                    <td><span className={STATUS_BADGES[s.status] || 'badge-navy'}>{s.status}</span></td>
                    <td className="text-teal-600 font-display font-700">
                      {s.status === 'APPROVED' ? fmtUSD(s.task_pay_usd) : '—'}
                    </td>
                    <td>{s.transaction_code ? <span className="txn-code">{s.transaction_code}</span> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}