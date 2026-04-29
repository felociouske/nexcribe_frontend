import { useEffect, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { wheelAPI } from '@/api/endpoints'
import { fmtUSD, fmtKES, fmtRelative, getErrorMessage } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'

// ── Canvas Wheel ──

function WheelCanvas({ slices, winningSliceId, spinning, onSpinEnd }) {
  const canvasRef = useRef(null)
  const rotationRef = useRef(0)
  const animRef = useRef(null)

  const numSlices = slices.length
  const arc = (2 * Math.PI) / numSlices

  const drawWheel = (rotation) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const r = cx - 10

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    slices.forEach((slice, i) => {
      const startAngle = rotation + i * arc
      const endAngle = startAngle + arc

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = slice.color_hex
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(startAngle + arc / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 11px DM Sans, sans-serif'
      ctx.shadowColor = 'rgba(0,0,0,0.3)'
      ctx.shadowBlur = 2
      ctx.fillText(slice.label, r - 12, 4)
      ctx.restore()
    })

    // Center circle
    ctx.beginPath()
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI)
    ctx.fillStyle = '#0d1b2e'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Pointer
    ctx.beginPath()
    ctx.moveTo(cx + r + 8, cy)
    ctx.lineTo(cx + r - 14, cy - 10)
    ctx.lineTo(cx + r - 14, cy + 10)
    ctx.closePath()
    ctx.fillStyle = '#e05a2b'
    ctx.fill()
  }

  useEffect(() => {
    drawWheel(0)
  }, [slices])

  useEffect(() => {
    if (!spinning || !winningSliceId) return

    const winIdx = slices.findIndex(s => s.id === winningSliceId)
    if (winIdx === -1) return

    // Target angle: land pointer on winning slice center
    const targetAngle = -(winIdx * arc + arc / 2)
    const fullSpins = 5 * 2 * Math.PI
    const totalRotation = fullSpins + targetAngle
    const duration = 4000
    const start = performance.now()
    const startRot = rotationRef.current

    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      rotationRef.current = startRot + totalRotation * eased
      drawWheel(rotationRef.current)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        onSpinEnd()
      }
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [spinning, winningSliceId])

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      className="drop-shadow-2xl"
    />
  )
}

// ── Win overlay ──

function WinOverlay({ result, onClose }) {
  const hasReward = parseFloat(result?.reward_usd) > 0 || result?.bonus_spins > 0
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm"
    >
      <div className="card p-8 max-w-sm w-full text-center shadow-2xl">
        <span className="text-6xl mb-4 block">{hasReward ? '🎉' : '😅'}</span>
        <h2 className="font-display font-800 text-2xl text-navy-900 mb-2">{result?.winning_slice_label}</h2>
        {hasReward ? (
          <div className="bg-teal-50 rounded-xl py-3 px-4 my-4">
            {parseFloat(result?.reward_usd) > 0 && (
              <>
                <p className="font-display font-800 text-2xl text-teal-600">+{fmtUSD(result.reward_usd)}</p>
                <p className="text-teal-600 text-xs">Credited to Account Wallet</p>
              </>
            )}
            {result?.bonus_spins > 0 && (
              <p className="font-display font-700 text-blue-600">+{result.bonus_spins} bonus spins</p>
            )}
            {result?.transaction_code && (
              <span className="txn-code mt-2 inline-block">{result.transaction_code}</span>
            )}
          </div>
        ) : (
          <p className="text-navy-500 mb-4">Better luck next spin!</p>
        )}
        <button onClick={onClose} className="btn-primary w-full justify-center">Continue</button>
      </div>
    </motion.div>
  )
}

// ── Main page ──

export default function WheelPage() {
  const qc = useQueryClient()
  const [spinning, setSpinning] = useState(false)
  const [winningSliceId, setWinningSliceId] = useState(null)
  const [spinResult, setSpinResult] = useState(null)

  const { data: config, isLoading } = useQuery({
    queryKey: ['wheel-config'],
    queryFn: () => wheelAPI.getConfig().then(r => r.data),
  })

  const { data: history } = useQuery({
    queryKey: ['spin-history'],
    queryFn: () => wheelAPI.getHistory().then(r => r.data),
  })

  const spin = useMutation({
    mutationFn: () => wheelAPI.spin(),
    onSuccess: (res) => {
      setWinningSliceId(res.data.winning_slice_id)
      setSpinning(true)
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
      setSpinning(false)
    },
  })

  const handleSpinEnd = () => {
    setSpinning(false)
    setSpinResult(spin.data?.data)
    qc.invalidateQueries({ queryKey: ['wallets'] })
    qc.invalidateQueries({ queryKey: ['spin-history'] })
  }

  if (isLoading) return <PageSpinner />

  const slices = config?.slices || []
  const spinsRemaining = spin.data?.data?.spins_remaining
  const recentSpins = history?.results?.slice(0, 8) || []

  return (
    <div className="page">
      <div className="mb-6">
        <h1 className="section-title">Lucky Wheel</h1>
        <p className="section-subtitle">Spin daily for cash prizes and bonus spins. Server picks the winner.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Wheel */}
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            {slices.length > 0 && (
              <WheelCanvas
                slices={slices}
                winningSliceId={winningSliceId}
                spinning={spinning}
                onSpinEnd={handleSpinEnd}
              />
            )}
          </div>

          <button
            onClick={() => spin.mutate()}
            disabled={spinning || spin.isPending}
            className="btn-coral px-12 py-4 text-base shadow-coral-glow"
          >
            {spinning ? '🎡 Spinning…' : spin.isPending ? 'Loading…' : '🎡 Spin Now'}
          </button>

          {spinsRemaining !== undefined && (
            <p className="text-navy-500 text-sm mt-3">
              {spinsRemaining === 'unlimited' ? '∞ spins remaining today' : `${spinsRemaining} spins remaining today`}
            </p>
          )}
        </div>

        {/* Prizes + history */}
        <div className="space-y-5">
          {/* Prize list */}
          <div className="card p-5">
            <h2 className="font-display font-700 text-navy-900 mb-4">Prize List</h2>
            <div className="space-y-2">
              {slices.map(s => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color_hex }} />
                  <span className="text-sm text-navy-700 flex-1">{s.label}</span>
                  {s.reward_type === 'CASH' && parseFloat(s.reward_value_usd) > 0 && (
                    <span className="font-display font-700 text-teal-600 text-sm">{fmtUSD(s.reward_value_usd)}</span>
                  )}
                  {s.reward_type === 'SPINS' && s.reward_spins > 0 && (
                    <span className="font-display font-700 text-blue-600 text-sm">+{s.reward_spins} spins</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent spins */}
          {recentSpins.length > 0 && (
            <div className="card p-5">
              <h2 className="font-display font-700 text-navy-900 mb-4">Recent Spins</h2>
              <div className="space-y-2">
                {recentSpins.map(s => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.slice_color || '#ccc' }} />
                      <span className="text-navy-700">{s.slice_label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {parseFloat(s.reward_usd) > 0 && (
                        <span className="font-display font-700 text-teal-600">+{fmtUSD(s.reward_usd)}</span>
                      )}
                      <span className="text-navy-400 text-xs">{fmtRelative(s.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {spinResult && !spinning && (
          <WinOverlay result={spinResult} onClose={() => setSpinResult(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
