import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { writingAPI } from '@/api/endpoints'
import { fmtUSD, fmtKES, fmtDateTime, fmtRelative, getErrorMessage, STATUS_BADGES } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'

export default function WritingJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [wordCount, setWordCount] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const { data: job, isLoading } = useQuery({
    queryKey: ['writing-job', id],
    queryFn: () => writingAPI.getJob(id).then(r => r.data),
    staleTime: 0,
    refetchOnMount: true,
  })

  const { data: historyData } = useQuery({
    queryKey: ['writing-job-history', id],
    queryFn: () => writingAPI.getHistory().then(r => {
      const results = r.data?.results || r.data || []
      return results.filter(h => h.job_title === job?.title)
    }),
    enabled: !!job,
    staleTime: 0,
  })

  const accept = useMutation({
    mutationFn: () => writingAPI.acceptJob(id),
    onSuccess: () => {
      toast.success('Job accepted!')
      qc.invalidateQueries({ queryKey: ['writing-job', id] })
      qc.invalidateQueries({ queryKey: ['writing-jobs'] })
    },
    onError: err => toast.error(getErrorMessage(err)),
  })

  const submit = useMutation({
    mutationFn: () => {
      const formData = new FormData()
      if (selectedFile) {
        formData.append('document', selectedFile)
      }
      formData.append('word_count', wordCount || 0)
      if (!selectedFile) {
        formData.append('filename', selectedFile?.name || 'document.docx')
      }
      return writingAPI.submitJob(id, formData)
    },
    onSuccess: (res) => {
      const amt = res.data?.amount_usd
      toast.success(amt ? `$${amt} credited to your Account Wallet!` : 'Submitted! Payment credited instantly.')
      qc.invalidateQueries({ queryKey: ['writing-job', id] })
      qc.invalidateQueries({ queryKey: ['writing-job-history', id] })
      qc.invalidateQueries({ queryKey: ['wallets'] })
      qc.invalidateQueries({ queryKey: ['my-writing-jobs'] })
      setSelectedFile(null)
      setWordCount('')
    },
    onError: err => toast.error(getErrorMessage(err)),
  })

  if (isLoading) return <PageSpinner />
  if (!job) return <div className="page"><p className="text-navy-500">Job not found.</p></div>

  const isAssignedToMe = job.is_mine
  const canAccept = job.status === 'OPEN'
  const canSubmit = job.status === 'OPEN' && isAssignedToMe
  const history = historyData || []

  return (
    <div className="page max-w-3xl">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2">
        ← Back to Jobs
      </button>

      {/* Job header */}
      <div className="card p-6 mb-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl text-navy-900 mb-2">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              {job.category_name && (
                <span className="badge-navy">{job.category_name}</span>
              )}
              <span className="badge-teal">{job.difficulty}</span>
              <span className="badge-navy">Level {job.minimum_plan_level}+</span>
              <span className={STATUS_BADGES[job.status] || 'badge-navy'}>
                {job.status}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-display text-2xl text-teal-600">
              {fmtUSD(job.budget_usd)}
            </p>
            <p className="text-navy-400 text-sm">{fmtKES(job.budget_kes)}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-navy-100 mb-4">
          <div>
            <p className="text-xs text-navy-400 mb-0.5">Word count</p>
            <p className="font-display font-bold text-navy-800">
              {job.word_count_required} words
            </p>
          </div>
          <div>
            <p className="text-xs text-navy-400 mb-0.5">Deadline</p>
            <p className="font-display font-bold text-navy-800">
              {job.deadline ? fmtDateTime(job.deadline) : 'Flexible'}
            </p>
          </div>
          <div>
            <p className="text-xs text-navy-400 mb-0.5">Posted</p>
            <p className="font-display font-bold text-navy-800">
              {fmtRelative(job.created_at)}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="label mb-2">Description</p>
          <p className="text-navy-600 text-sm leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Instructions */}
        {job.instructions && (
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
            <p className="label mb-1 text-teal-700">Instructions</p>
            <p className="text-teal-800 text-sm leading-relaxed whitespace-pre-line">
              {job.instructions}
            </p>
          </div>
        )}

        {/* Admin feedback */}
        {job.admin_feedback && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
            <p className="label mb-1 text-amber-700">Admin Feedback</p>
            <p className="text-amber-800 text-sm">{job.admin_feedback}</p>
          </div>
        )}
      </div>

      {/* Accept */}
      {canAccept && (
        <div className="card p-6 mb-5">
          <h2 className="font-display font-bold text-navy-900 mb-2">Accept this job</h2>
          <p className="text-navy-500 text-sm mb-4">
            Accepting this job adds it to your <strong>My Jobs</strong> list. The job remains
            visible to other writers — multiple people can complete the same job.
            Upload your document when ready to earn instantly.
          </p>
          <button
            onClick={() => accept.mutate()}
            disabled={accept.isPending}
            className="btn-primary"
          >
            {accept.isPending ? 'Accepting…' : 'Accept Job'}
          </button>
        </div>
      )}

      {/* Submit document */}
      {canSubmit && (
        <div className="card p-6 mb-5">
          <h2 className="font-display font-bold text-navy-900 mb-1">
            Submit Your Document
          </h2>
          <p className="text-navy-500 text-sm mb-5">
            Write your article offline, then upload the completed document here.
            Payment is credited to your Account Wallet <strong>instantly</strong> upon submission — no admin review needed.
          </p>

          <div className="space-y-4">
            {/* File upload */}
            <div>
              <label className="label">Upload Document</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  selectedFile
                    ? 'border-teal-400 bg-teal-50'
                    : 'border-navy-200 hover:border-teal-300 hover:bg-teal-50/30'
                }`}
              >
                {selectedFile ? (
                  <div>
                    <p className="text-2xl mb-2">📄</p>
                    <p className="font-display font-semibold text-teal-700 text-sm">
                      {selectedFile.name}
                    </p>
                    <p className="text-teal-600 text-xs mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                      className="text-coral-500 text-xs mt-2 hover:underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl mb-2">📎</p>
                    <p className="font-display font-semibold text-navy-600 text-sm">
                      Click to upload your document
                    </p>
                    <p className="text-navy-400 text-xs mt-1">
                      Accepted: .docx, .doc, .pdf, .txt
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.doc,.pdf,.txt"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files[0] || null)}
              />
            </div>

            {/* Word count */}
            <div>
              <label className="label">Word Count</label>
              <input
                value={wordCount}
                onChange={e => setWordCount(e.target.value)}
                type="number"
                placeholder={`Minimum ${job.word_count_required} words required`}
                className="input"
              />
            </div>

            <button
              onClick={() => submit.mutate()}
              disabled={submit.isPending || !selectedFile}
              className="btn-primary"
            >
              {submit.isPending ? 'Uploading…' : '📤 Submit Document for Review'}
            </button>
          </div>
        </div>
      )}

      {/* Completed — payment info */}
      {job.status === 'COMPLETED' && (
        <div className="card p-6 mb-5 bg-teal-50 border-teal-200">
          <div className="flex items-center gap-4">
            <span className="text-4xl">✅</span>
            <div>
              <p className="font-display font-extrabold text-teal-800 text-lg">
                Job Completed!
              </p>
              <p className="text-teal-700 text-sm">
                Payment of{' '}
                <strong>{fmtUSD(job.payment_amount_usd || job.budget_usd)}</strong>{' '}
                has been credited to your Account Wallet.
              </p>
              {job.payment_transaction_code && (
                <div className="mt-2">
                  <span className="text-xs text-teal-600">Transaction: </span>
                  <span className="txn-code">{job.payment_transaction_code}</span>
                </div>
              )}
              <p className="text-teal-600 text-xs mt-1">
                Completed {fmtRelative(job.completed_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* History timeline */}
      {history.length > 0 && (
        <div className="card p-6">
          <h2 className="font-display font-bold text-navy-900 mb-4">Activity History</h2>
          <div className="space-y-3">
            {history.map((h, i) => (
              <div key={h.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  h.action === 'APPROVED' ? 'bg-teal-100 text-teal-700' :
                  h.action === 'REJECTED' ? 'bg-red-100 text-red-700' :
                  h.action === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                  'bg-navy-100 text-navy-700'
                }`}>
                  {h.action === 'APPROVED' ? '✓' :
                   h.action === 'REJECTED' ? '✗' :
                   h.action === 'SUBMITTED' ? '↑' : '→'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-display font-semibold text-navy-800 text-sm">
                      {h.action}
                    </p>
                    <span className="text-navy-400 text-xs">{fmtRelative(h.created_at)}</span>
                  </div>
                  {h.note && (
                    <p className="text-navy-500 text-xs mt-0.5">{h.note}</p>
                  )}
                  {h.amount_usd && (
                    <p className="text-teal-600 text-sm font-display font-bold mt-1">
                      +{fmtUSD(h.amount_usd)} credited to Account Wallet
                    </p>
                  )}
                  {h.transaction_code && (
                    <span className="txn-code mt-1 inline-block">{h.transaction_code}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}