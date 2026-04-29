import { useSearchParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { authAPI } from '@/api/endpoints'
import Spinner from '@/components/ui/Spinner'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    authAPI.verifyEmail({ token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="card p-10 max-w-sm w-full text-center">
        {status === 'loading' && <><Spinner size="lg" className="mx-auto mb-4" /><p className="text-navy-500">Verifying…</p></>}
        {status === 'success' && (
          <>
            <span className="text-5xl mb-4 block">✅</span>
            <h2 className="font-display font-800 text-xl text-navy-900 mb-2">Email verified!</h2>
            <p className="text-navy-500 text-sm mb-6">Your account is fully activated.</p>
            <Link to="/dashboard" className="btn-primary w-full justify-center">Go to Dashboard</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <span className="text-5xl mb-4 block">❌</span>
            <h2 className="font-display font-800 text-xl text-navy-900 mb-2">Verification failed</h2>
            <p className="text-navy-500 text-sm mb-6">The link may have expired. Please request a new one.</p>
            <Link to="/login" className="btn-outline w-full justify-center">Back to login</Link>
          </>
        )}
      </div>
    </div>
  )
}
