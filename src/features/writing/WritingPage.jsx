import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { writingAPI } from '@/api/endpoints'
import { fmtUSD, fmtKES, fmtRelative, getErrorMessage, STATUS_BADGES } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'

const DIFF_COLORS = {
  BASIC: 'badge-teal',
  INTERMEDIATE: 'badge-amber',
  ADVANCED: 'badge-coral',
}

export default function WritingPage() {
  const [tab, setTab] = useState('available')
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['writing-jobs', search],
    queryFn: () => writingAPI.getJobs({ search }).then(r => r.data),
    staleTime: 0,
    refetchOnMount: true,
  })

  const { data: myJobsData } = useQuery({
    queryKey: ['my-writing-jobs'],
    queryFn: () => writingAPI.getMyJobs().then(r => r.data),
    enabled: tab === 'mine',
    staleTime: 0,
  })

  const { data: historyData } = useQuery({
    queryKey: ['writing-history'],
    queryFn: () => writingAPI.getHistory().then(r => r.data),
    enabled: tab === 'history',
    staleTime: 0,
  })

  const acceptJob = useMutation({
    mutationFn: (id) => writingAPI.acceptJob(id),
    onSuccess: () => {
      toast.success('Job accepted! Go to My Jobs to submit.')
      qc.invalidateQueries({ queryKey: ['writing-jobs'] })
      qc.invalidateQueries({ queryKey: ['my-writing-jobs'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const jobs = jobsData?.results || jobsData || []
  const myJobs = myJobsData?.results || myJobsData || []
  const history = historyData?.results || historyData || []

  if (isLoading && tab === 'available') return <PageSpinner />

  return (
    <div className="page">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="section-title">Writing Jobs</h1>
          <p className="section-subtitle">
            Jobs are distributed based on your plan level. Accept a job to start working.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'available', label: 'Available Jobs' },
          { key: 'mine',      label: 'My Jobs' },
          { key: 'history',   label: 'History' },
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

      {/* Search */}
      {tab === 'available' && (
        <div className="mb-5">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs by title or keyword…"
            className="input max-w-md"
          />
        </div>
      )}

      {/* Available jobs */}
      {tab === 'available' && (
        <div className="space-y-3">
          {jobs.length === 0 ? (
            <EmptyState
              icon="✍️"
              title="No jobs available"
              desc="You need an active Writing plan, or no jobs match your plan level right now."
              action={
                <Link to="/dashboard/plans" className="btn-primary">
                  Browse Writing Plans
                </Link>
              }
            />
          ) : jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h3 className="font-display font-bold text-navy-900 text-sm">
                    {job.title}
                  </h3>
                  <span className={DIFF_COLORS[job.difficulty] || 'badge-navy'}>
                    {job.difficulty}
                  </span>
                  <span className="badge-navy text-xs">L{job.minimum_plan_level}+</span>
                </div>
                <p className="text-navy-500 text-xs line-clamp-2">{job.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-navy-400 flex-wrap">
                  {job.category_name && <span>📁 {job.category_name}</span>}
                  <span>📝 {job.word_count_required} words</span>
                  {job.deadline && <span>⏰ Due {fmtRelative(job.deadline)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="font-display text-lg text-teal-600">
                    {fmtUSD(job.budget_usd)}
                  </p>
                  <p className="text-navy-400 text-xs">{fmtKES(job.budget_kes)}</p>
                </div>
                <button
                  onClick={() => acceptJob.mutate(job.id)}
                  disabled={acceptJob.isPending}
                  className="btn-primary text-xs px-4 py-2 flex-shrink-0"
                >
                  Accept
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* My jobs */}
      {tab === 'mine' && (
        <div className="space-y-3">
          {myJobs.length === 0 ? (
            <EmptyState
              icon="✍️"
              title="No active jobs"
              desc="Accept a job from the Available tab to start working."
            />
          ) : myJobs.map(job => (
            <Link
              key={job.id}
              to={`/dashboard/writing/${job.id}`}
              className="blcard-hover p-5 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-navy-900 text-sm">{job.title}</p>
                <p className="text-navy-400 text-xs mt-0.5">
                  {job.word_count_required} words required
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={STATUS_BADGES[job.status] || 'badge-navy'}>
                  {job.status}
                </span>
                <span className="font-display font-bold text-teal-600 text-sm">
                  {fmtUSD(job.budget_usd)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div className="card overflow-hidden">
          {history.length === 0 ? (
            <EmptyState icon="📋" title="No history yet" />
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Note</th>
                  <th>Txn Code</th>
                  <th className="text-right">When</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id}>
                    <td>
                      <span className={STATUS_BADGES[h.action] || 'badge-navy'}>
                        {h.action}
                      </span>
                    </td>
                    <td className="text-navy-500 text-xs max-w-[200px] truncate">
                      {h.note || '—'}
                    </td>
                    <td>
                      {h.transaction_code
                        ? <span className="txn-code">{h.transaction_code}</span>
                        : '—'
                      }
                    </td>
                    <td className="text-right text-navy-400 text-xs">
                      {fmtRelative(h.created_at)}
                    </td>
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