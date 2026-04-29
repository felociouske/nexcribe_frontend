import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { gamesAPI } from '@/api/endpoints'
import { fmtUSD, getErrorMessage } from '@/utils'

// ── Sub-components ──

function QuizGame({ questions, onSubmit, loading }) {
  const [answers, setAnswers] = useState({})
  const answered = Object.keys(answers).length

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={q.id} className="card p-5">
          <p className="font-display font-600 text-navy-900 mb-4">
            <span className="text-teal-600 mr-2">{i + 1}.</span>{q.question}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(q.options).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setAnswers(a => ({ ...a, [q.id]: k }))}
                className={`p-3 rounded-xl border-2 text-sm font-body text-left transition-all ${
                  answers[q.id] === k
                    ? 'border-teal-500 bg-teal-50 text-teal-800'
                    : 'border-navy-200 hover:border-teal-300 text-navy-700'
                }`}
              >
                <span className="font-display font-700 mr-2 uppercase">{k}.</span>{v}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={() => onSubmit(answers)}
        disabled={loading || answered < questions.length}
        className="btn-primary w-full justify-center py-3.5"
      >
        {loading ? 'Submitting…' : `Submit Answers (${answered}/${questions.length})`}
      </button>
    </div>
  )
}

function WordPuzzleGame({ scrambled, onSubmit, loading }) {
  const [word, setWord] = useState('')
  return (
    <div className="card p-8 text-center">
      <p className="text-navy-500 text-sm mb-4">Unscramble these letters to find the hidden word:</p>
      <p className="font-display font-800 text-5xl text-teal-600 tracking-[0.3em] mb-8">{scrambled}</p>
      <input
        value={word}
        onChange={e => setWord(e.target.value.toUpperCase())}
        placeholder="Type the word…"
        className="input text-center font-mono text-xl tracking-widest max-w-xs mx-auto mb-6 uppercase"
        maxLength={scrambled?.length || 20}
      />
      <button
        onClick={() => onSubmit({ word })}
        disabled={loading || !word}
        className="btn-primary px-8"
      >
        {loading ? 'Checking…' : 'Submit Answer'}
      </button>
    </div>
  )
}

function SlotsGame({ onSubmit, loading }) {
  const symbols = ['🍒', '🍋', '⭐', '💎', '🔔', '7️⃣']
  const [reels, setReels] = useState(['❓', '❓', '❓'])
  const [spun, setSpun] = useState(false)

  const spin = () => {
    setSpun(false)
    setReels(['🔄', '🔄', '🔄'])
    setTimeout(() => {
      setReels(Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]))
      setSpun(true)
    }, 800)
  }

  return (
    <div className="card p-8 text-center">
      <p className="text-navy-500 text-sm mb-8">Press Spin — the server determines if you win (50/50 chance).</p>
      <div className="flex items-center justify-center gap-4 mb-8">
        {reels.map((r, i) => (
          <div key={i} className="w-20 h-20 rounded-2xl bg-navy-900 flex items-center justify-center text-4xl shadow-inner">
            {r}
          </div>
        ))}
      </div>
      {!spun ? (
        <button onClick={spin} className="btn-primary px-10 py-3.5">🎰 Spin</button>
      ) : (
        <button onClick={() => onSubmit({})} disabled={loading} className="btn-coral px-10 py-3.5">
          {loading ? 'Getting result…' : 'Confirm Spin →'}
        </button>
      )}
    </div>
  )
}

function SpeedTypingGame({ onSubmit, loading }) {
  const TEXTS = [
    'The quick brown fox jumps over the lazy dog.',
    'Nexcribe helps you earn through writing and transcription.',
    'Consistent effort leads to consistent results over time.',
  ]
  const [text] = useState(() => TEXTS[Math.floor(Math.random() * TEXTS.length)])
  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState(null)

  const handleChange = (e) => {
    if (!startTime) setStartTime(Date.now())
    setTyped(e.target.value)
  }

  const calcWPM = () => {
    if (!startTime) return 0
    const elapsed = (Date.now() - startTime) / 60000
    const words = typed.trim().split(' ').length
    return Math.round(words / elapsed)
  }

  return (
    <div className="card p-6">
      <p className="text-navy-500 text-sm mb-4">Type the text below as accurately and quickly as you can:</p>
      <div className="bg-navy-50 rounded-xl p-4 mb-4 font-mono text-navy-800 leading-relaxed">
        {text.split('').map((ch, i) => {
          const typedCh = typed[i]
          const color = typedCh === undefined ? 'text-navy-400' : typedCh === ch ? 'text-teal-600' : 'text-red-500'
          return <span key={i} className={color}>{ch}</span>
        })}
      </div>
      <textarea
        value={typed}
        onChange={handleChange}
        rows={3}
        placeholder="Start typing here…"
        className="input font-mono mb-4 resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-navy-500 text-sm">Est. WPM: <strong>{calcWPM()}</strong></span>
        <button
          onClick={() => onSubmit({ wpm: calcWPM() })}
          disabled={loading || typed.length < 10}
          className="btn-primary"
        >
          {loading ? 'Scoring…' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

function NumberMatchGame({ grid, onSubmit, loading }) {
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [selected, setSelected] = useState([])

  const handleClick = (idx) => {
    if (flipped.includes(idx) || matched.includes(idx) || selected.length === 2) return
    const next = [...selected, idx]
    setFlipped(f => [...f, idx])
    setSelected(next)

    if (next.length === 2) {
      const [a, b] = next
      if (grid[a] === grid[b]) {
        const newMatched = [...matched, a, b]
        setMatched(newMatched)
        setSelected([])
        if (newMatched.length === grid.length) {
          setTimeout(() => onSubmit({ matches: grid.length / 2 }), 400)
        }
      } else {
        setTimeout(() => {
          setFlipped(f => f.filter(i => i !== a && i !== b))
          setSelected([])
        }, 800)
      }
    }
  }

  return (
    <div className="card p-6 text-center">
      <p className="text-navy-500 text-sm mb-6">Match all pairs to win. Click two cards to flip them.</p>
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-6">
        {grid.map((num, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={`w-16 h-16 rounded-xl font-display font-800 text-xl transition-all ${
              matched.includes(idx)
                ? 'bg-teal-500 text-white'
                : flipped.includes(idx)
                ? 'bg-navy-900 text-white'
                : 'bg-navy-100 hover:bg-navy-200 text-transparent'
            }`}
          >
            {flipped.includes(idx) || matched.includes(idx) ? num : '?'}
          </button>
        ))}
      </div>
      <p className="text-navy-400 text-sm">{matched.length / 2} / {grid.length / 2} pairs matched</p>
    </div>
  )
}

function MemoryGame({ onSubmit, loading }) {
  const EMOJIS = ['🍒', '🍋', '⭐', '💎', '🔔', '7️⃣', '🎯', '🎪']
  const [cards] = useState(() => {
    const pairs = [...EMOJIS, ...EMOJIS]
    return pairs.sort(() => Math.random() - 0.5).map((e, i) => ({ id: i, emoji: e }))
  })
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [selected, setSelected] = useState([])

  const handleClick = (card) => {
    if (flipped.includes(card.id) || matched.includes(card.id) || selected.length === 2) return
    const next = [...selected, card]
    setFlipped(f => [...f, card.id])
    setSelected(next)

    if (next.length === 2) {
      const [a, b] = next
      if (a.emoji === b.emoji) {
        const newMatched = [...matched, a.id, b.id]
        setMatched(newMatched)
        setSelected([])
        if (newMatched.length === cards.length) {
          setTimeout(() => onSubmit({ matches: cards.length / 2 }), 400)
        }
      } else {
        setTimeout(() => {
          setFlipped(f => f.filter(i => i !== a.id && i !== b.id))
          setSelected([])
        }, 900)
      }
    }
  }

  return (
    <div className="card p-6 text-center">
      <p className="text-navy-500 text-sm mb-6">Flip cards to find matching pairs. Match all 8 pairs to win!</p>
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-4">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleClick(card)}
            className={`w-16 h-16 rounded-xl text-2xl transition-all ${
              matched.includes(card.id)
                ? 'bg-teal-500'
                : flipped.includes(card.id)
                ? 'bg-navy-900'
                : 'bg-navy-200 hover:bg-navy-300'
            }`}
          >
            {flipped.includes(card.id) || matched.includes(card.id) ? card.emoji : ''}
          </button>
        ))}
      </div>
      <p className="text-navy-400 text-sm">{matched.length / 2} / {cards.length / 2} pairs</p>
    </div>
  )
}

function ResultOverlay({ result, onClose }) {
  const won = result?.result === 'win'
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm"
    >
      <div className="card p-8 max-w-sm w-full text-center shadow-2xl">
        <span className="text-6xl mb-4 block">{won ? '🏆' : '😔'}</span>
        <h2 className="font-display font-800 text-2xl text-navy-900 mb-2">
          {won ? 'You Won!' : 'Not this time'}
        </h2>
        <p className="text-navy-500 mb-1">Score: {result?.score}/{result?.max_score} ({result?.percentage}%)</p>
        {won && parseFloat(result?.reward_usd) > 0 && (
          <div className="bg-teal-50 rounded-xl py-3 px-4 my-4">
            <p className="font-display font-800 text-2xl text-teal-600">+{fmtUSD(result?.reward_usd)}</p>
            <p className="text-teal-600 text-xs">Credited to Account Wallet</p>
            {result?.transaction_code && (
              <span className="txn-code mt-2 inline-block">{result.transaction_code}</span>
            )}
          </div>
        )}
        <button onClick={onClose} className="btn-primary w-full justify-center mt-4">
          {won ? 'Awesome!' : 'Try Again'}
        </button>
      </div>
    </motion.div>
  )
}

// ── Main page ──

export default function GamePlayPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [result, setResult] = useState(null)

  const GAME_NAMES = {
    quiz: 'Daily Quiz', trivia: 'Trivia Challenge', word_puzzle: 'Word Puzzle',
    slots: 'Slots Machine', number_match: 'Number Match', memory: 'Memory Game',
    speed_type: 'Speed Typing', vip_challenge: 'VIP Challenge',
  }

  const startGame = useMutation({
    mutationFn: () => gamesAPI.startGame(slug),
    onSuccess: res => setSession(res.data),
    onError: err => toast.error(getErrorMessage(err)),
  })

  const submitResult = useMutation({
    mutationFn: (answers) => gamesAPI.submitResult(session.session_id, {
      session_token: session.session_token,
      answers,
    }),
    onSuccess: res => setResult(res.data),
    onError: err => toast.error(getErrorMessage(err)),
  })

  const handleClose = () => {
    setSession(null)
    setResult(null)
  }

  return (
    <div className="page max-w-3xl">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2">← Back to Games</button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">{GAME_NAMES[slug] || slug}</h1>
      </div>

      {!session ? (
        <div className="card p-10 text-center">
          <p className="text-navy-500 mb-6">Ready to play? Your score will be validated server-side.</p>
          <button
            onClick={() => startGame.mutate()}
            disabled={startGame.isPending}
            className="btn-primary px-10 py-4 text-base"
          >
            {startGame.isPending ? 'Loading…' : `Start ${GAME_NAMES[slug] || 'Game'} →`}
          </button>
        </div>
      ) : (
        <div>
          {slug === 'quiz' || slug === 'trivia' ? (
            <QuizGame
              questions={session.questions || []}
              onSubmit={answers => submitResult.mutate(answers)}
              loading={submitResult.isPending}
            />
          ) : slug === 'word_puzzle' ? (
            <WordPuzzleGame
              scrambled={session.scrambled}
              onSubmit={ans => submitResult.mutate(ans)}
              loading={submitResult.isPending}
            />
          ) : slug === 'slots' ? (
            <SlotsGame
              onSubmit={ans => submitResult.mutate(ans)}
              loading={submitResult.isPending}
            />
          ) : slug === 'number_match' ? (
            <NumberMatchGame
              grid={session.grid || []}
              onSubmit={ans => submitResult.mutate(ans)}
              loading={submitResult.isPending}
            />
          ) : slug === 'memory' ? (
            <MemoryGame
              onSubmit={ans => submitResult.mutate(ans)}
              loading={submitResult.isPending}
            />
          ) : slug === 'speed_type' ? (
            <SpeedTypingGame
              onSubmit={ans => submitResult.mutate(ans)}
              loading={submitResult.isPending}
            />
          ) : (
            <div className="card p-8 text-center">
              <p className="text-navy-500 mb-6">Complete the challenge and submit your score.</p>
              <button
                onClick={() => submitResult.mutate({ score: Math.floor(Math.random() * 40) + 60 })}
                disabled={submitResult.isPending}
                className="btn-primary px-8"
              >
                {submitResult.isPending ? 'Submitting…' : 'Submit Score'}
              </button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {result && <ResultOverlay result={result} onClose={handleClose} />}
      </AnimatePresence>
    </div>
  )
}