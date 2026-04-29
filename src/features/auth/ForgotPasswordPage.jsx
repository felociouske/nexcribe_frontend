import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authAPI } from '@/api/endpoints'
import { getErrorMessage } from '@/utils'
import Spinner from '@/components/ui/Spinner'

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authAPI.requestReset(data)
      setSent(true)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <span className="text-4xl mb-4 block">📧</span>
          <h2 className="font-display font-800 text-xl text-navy-900 mb-2">Check your email</h2>
          <p className="text-navy-500 text-sm mb-6">If that email exists, we've sent a reset link. Check your inbox.</p>
          <Link to="/login" className="btn-primary w-full justify-center">Back to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-navy-50/40">
      <div className="card p-8 max-w-md w-full">
        <h1 className="font-display font-800 text-2xl text-navy-900 mb-1">Reset password</h1>
        <p className="text-navy-500 text-sm mb-6">Enter your email and we'll send a reset link.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Email address</label>
            <input {...register('email', { required: true })} type="email" placeholder="you@example.com" className="input" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <Spinner size="sm" /> : 'Send reset link'}
          </button>
        </form>
        <Link to="/login" className="block text-center text-sm text-teal-600 mt-4 hover:text-teal-500">← Back to login</Link>
      </div>
    </div>
  )
}
