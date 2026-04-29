import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { transcriptionAPI } from '@/api/endpoints'
import { fmtUSD, fmtKES, fmtDuration, fmtDateTime, getErrorMessage, STATUS_BADGES } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'

export default function TranscriptionTaskPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [transcript, setTranscript] = useState('')
  const audioRef = useRef(null)
  const [audioError, setAudioError] = useState(false)
  const [claimedAudioUrl, setClaimedAudioUrl] = useState(null)

  // Fetch task directly by ID
  const { data: task, isLoading } = useQuery({
    queryKey: ['transcription-task-detail', id],
    queryFn: () => transcriptionAPI.getTaskById(id).then(r => r.data),
    staleTime: 0,
    retry: 2,
  })

  const claim = useMutation({
    mutationFn: () => transcriptionAPI.claimTask(id),
    onSuccess: (res) => {
      toast.success('Task claimed! You have 24 hours to submit.')
      if (res.data.audio_url) {
        setClaimedAudioUrl(res.data.audio_url)
      }
      qc.invalidateQueries({ queryKey: ['transcription-task-detail', id] })
      qc.invalidateQueries({ queryKey: ['transcription-tasks'] })
      qc.invalidateQueries({ queryKey: ['my-transcription-tasks'] })
    },
    onError: err => toast.error(getErrorMessage(err)),
  })

  const submit = useMutation({
    mutationFn: () => transcriptionAPI.submitTask(id, { transcript_text: transcript }),
    onSuccess: (res) => {
      const amt = res.data?.amount_usd
      toast.success(amt ? `$${amt} credited to your Account Wallet!` : 'Submitted! Payment credited instantly.')
      qc.invalidateQueries({ queryKey: ['transcription-task-detail', id] })
      qc.invalidateQueries({ queryKey: ['transcription-tasks'] })
      qc.invalidateQueries({ queryKey: ['my-transcription-tasks'] })
      qc.invalidateQueries({ queryKey: ['wallets'] })
    },
    onError: err => toast.error(getErrorMessage(err)),
  })

  if (isLoading) return <PageSpinner />
  if (!task) return (
    <div className="page">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2">← Back</button>
      <div className="card p-10 text-center">
        <p className="text-navy-500">Task not found or no longer available.</p>
      </div>
    </div>
  )

  const isClaimed = task.is_claimed_by_me || task.status === 'ASSIGNED'
  const canClaim = task.status === 'AVAILABLE'
  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length
  // Prefer backend-stored audio file, fall back to external URL
  const audioUrl = claimedAudioUrl || task.audio_file_url || task.audio_url

  // Always route audio through the Django proxy to avoid CORS issues with LibriVox.
  // The proxy endpoint streams the audio from the backend so the browser plays it inline.
  const BASE_URL = import.meta.env.VITE_API_BASE_URL 
  const getPlayableUrl = () => {
    if (task.audio_file_url) return task.audio_file_url  // already served from backend
    // Pass token as query param — browser <audio> tags cannot set Authorization headers
    const token = localStorage.getItem('access_token') ||
      JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.access ||
      ''
    const sep = token ? `?token=${token}` : ''
    return `${BASE_URL}/api/v1/transcription/tasks/${task.id}/audio/${sep}`
  }
  const playableUrl = isClaimed ? getPlayableUrl() : null

  return (
    <div className="page max-w-3xl">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2">
        ← Back to Tasks
      </button>

      {/* Task header */}
      <div className="card p-6 mb-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl text-navy-900 mb-1">
              {task.title}
            </h1>
            {task.book_author && (
              <p className="text-navy-500 text-sm mb-2">by {task.book_author}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge-navy">{task.difficulty}</span>
              <span className="badge-navy">{task.language}</span>
              {task.source === 'LIBRIVOX' && (
                <span className="badge-teal">📚 LibriVox</span>
              )}
              <span className={STATUS_BADGES[task.status] || 'badge-navy'}>
                {task.status}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-display text-2xl text-teal-600">
              {fmtUSD(task.pay_usd)}
            </p>
            <p className="text-navy-400 text-xs">{fmtKES(task.pay_kes)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-navy-100">
          <div>
            <p className="text-xs text-navy-400">Duration</p>
            <p className="font-display font-bold text-navy-800">
              {fmtDuration(task.duration_seconds)}
            </p>
          </div>
          <div>
            <p className="text-xs text-navy-400">Plan required</p>
            <p className="font-display font-bold text-navy-800">
              Level {task.minimum_plan_level}+
            </p>
          </div>
          <div>
            <p className="text-xs text-navy-400">Claim expires</p>
            <p className="font-display font-bold text-navy-800">
              {task.claim_expires_at ? fmtDateTime(task.claim_expires_at) : '—'}
            </p>
          </div>
        </div>

        {task.description && (
          <p className="text-navy-600 text-sm mt-4 leading-relaxed">{task.description}</p>
        )}
      </div>

      {/* Claim */}
      {canClaim && (
        <div className="card p-6 mb-5">
          <h2 className="font-display font-bold text-navy-900 mb-2">Claim this task</h2>
          <p className="text-navy-500 text-sm mb-4">
            Once claimed, you have 24 hours to complete and submit your transcript.
            The audio will stream directly in your browser.
          </p>
          <button
            onClick={() => claim.mutate()}
            disabled={claim.isPending}
            className="btn-primary"
          >
            {claim.isPending ? 'Claiming…' : 'Claim Task'}
          </button>
        </div>
      )}

      {/* Audio player + transcript */}
      {isClaimed && playableUrl && (
        <div className="card p-6 mb-5">
          <h2 className="font-display font-bold text-navy-900 mb-4">
            🎧 Audio Player
          </h2>

          {!audioError ? (
            <div className="bg-navy-900 rounded-xl p-4 mb-4">
              <audio
                ref={audioRef}
                key={playableUrl}
                src={playableUrl}
                controls
                className="w-full"
                style={{ height: '40px' }}
                onError={() => setAudioError(true)}
              />
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="font-display font-semibold text-amber-800 text-sm mb-2">
                ⚠️ Audio failed to load
              </p>
              <p className="text-amber-700 text-xs mb-3">
                The audio server may be temporarily unavailable. Try refreshing the page.
              </p>
              <button
                onClick={() => setAudioError(false)}
                className="btn-outline text-sm py-2"
              >
                🔄 Retry Audio
              </button>
            </div>
          )}

          <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 mb-5 text-xs text-teal-700">
            💡 <strong>Tips:</strong> Type exactly what you hear. Include punctuation.
            Do not paraphrase or summarise — write every word spoken.
            <br/>
            💰 <strong>Payment is credited instantly</strong> when you submit — no admin review needed.
          </div>

          {/* Transcript textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Your Transcript</label>
              <span className="text-xs text-navy-400">{wordCount} words</span>
            </div>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              rows={12}
              placeholder="Type exactly what you hear in the audio. Include all spoken words and punctuation..."
              className="input font-body text-sm leading-relaxed resize-y"
            />
            <p className="text-navy-400 text-xs mt-1">
              Minimum 50 characters required.
            </p>
          </div>

          <button
            onClick={() => submit.mutate()}
            disabled={submit.isPending || transcript.length < 50}
            className="btn-primary mt-4"
          >
            {submit.isPending ? 'Submitting…' : '📤 Submit Transcript'}
          </button>
        </div>
      )}

      {/* Completed */}
      {task.status === 'COMPLETED' && (
        <div className="card p-6 bg-teal-50 border-teal-200">
          <div className="flex items-center gap-4">
            <span className="text-4xl">✅</span>
            <div>
              <p className="font-display font-extrabold text-teal-800 text-lg">
                Task Completed!
              </p>
              <p className="text-teal-700 text-sm">
                Payment of <strong>{fmtUSD(task.pay_usd)}</strong> has been
                credited to your Account Wallet.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}