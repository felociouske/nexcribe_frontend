import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gamesAPI, plansAPI } from '@/api/endpoints'
import { fmtUSD, fmtKES } from '@/utils'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'

export default function GamesPage() {
  const { data: games, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: () => gamesAPI.getAll().then(r => r.data.results),
  })

  const { data: plansData } = useQuery({
    queryKey: ['my-plans'],
    queryFn: () => plansAPI.getMyPlans().then(r => r.data.results),
  })

  const gamingPlan = (plansData || []).find(p => p.plan.category === 'GAMING')

  const { data: history } = useQuery({
    queryKey: ['game-history'],
    queryFn: () => gamesAPI.getHistory().then(r => r.data),
  })

  if (isLoading) return <PageSpinner />

  const gameList = Array.isArray(games) ? games : []
  const recentHistory = history?.results?.slice(0, 5) || []

  return (
    <div className="page">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="section-title">Games</h1>
          <p className="section-subtitle">Play daily to earn cash rewards. All results validated server-side.</p>
        </div>
        {gamingPlan && (
          <div className="card px-4 py-2 text-right hidden sm:block">
            <p className="text-xs text-navy-500">Active plan</p>
            <p className="font-display font-700 text-teal-600">{gamingPlan.plan.name} · L{gamingPlan.plan.level}</p>
          </div>
        )}
      </div>

      {!gamingPlan && (
        <div className="card p-5 bg-amber-50 border-amber-200 mb-6 flex items-center gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-display font-700 text-amber-800">No Gaming plan active</p>
            <p className="text-amber-600 text-sm">Purchase a Gaming plan to unlock games and start earning.</p>
          </div>
          <Link to="/dashboard/plans" className="btn-coral ml-auto text-sm flex-shrink-0">Get a Plan</Link>
        </div>
      )}

      {/* Games grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {gameList.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`card flex flex-col p-5 ${!game.is_unlocked ? 'opacity-60' : 'card-hover'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{game.icon}</span>
              {!game.is_unlocked
                ? <span className="badge-navy text-xs">🔒 L{game.min_plan_level}+</span>
                : <span className="badge-teal text-xs">Unlocked</span>
              }
            </div>
            <h3 className="font-display font-700 text-navy-900 mb-1">{game.name}</h3>
            <p className="text-navy-500 text-xs mb-3 flex-1">{game.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="font-display font-700 text-teal-600 text-sm">{fmtUSD(game.reward_per_win_usd)}/win</p>
                <p className="text-navy-400 text-xs">{fmtKES(game.reward_per_win_kes)}</p>
              </div>
              {game.is_unlocked ? (
                <Link to={`/dashboard/games/${game.slug}`} className="btn-primary text-xs px-4 py-2">
                  Play →
                </Link>
              ) : (
                <Link to="/dashboard/plans" className="btn-ghost text-xs px-3 py-2 border border-navy-200">
                  Unlock
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent history */}
      {recentHistory.length > 0 && (
        <div>
          <h2 className="section-title mb-4">Recent Results</h2>
          <div className="card overflow-hidden">
            <table className="tbl">
              <thead>
                <tr><th>Game</th><th>Score</th><th>Result</th><th className="text-right">Earned</th></tr>
              </thead>
              <tbody>
                {recentHistory.map(s => {
                  const pct = Math.round((s.score / Math.max(s.max_score, 1)) * 100)
                  const won = pct >= 60
                  return (
                    <tr key={s.id}>
                      <td className="font-500">{s.game_name}</td>
                      <td>{s.score}/{s.max_score} <span className="text-navy-400 text-xs">({pct}%)</span></td>
                      <td>
                        <span className={won ? 'badge-green' : 'badge-red'}>{won ? '🏆 Win' : '✗ Loss'}</span>
                      </td>
                      <td className="text-right font-display font-700 text-teal-600">
                        {parseFloat(s.reward_earned_usd) > 0 ? `+${fmtUSD(s.reward_earned_usd)}` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
