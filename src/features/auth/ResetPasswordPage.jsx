import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authAPI } from '@/api/endpoints'
import { getErrorMessage } from '@/utils'
import Spinner from '@/components/ui/Spinner'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const { register, handleSubmit, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    if (!token) { toast.error('Invalid reset link.'); return }
    setLoading(true)
    try {
      await authAPI.confirmReset({ token, new_password: data.new_password, new_password2: data.new_password2 })
      toast.success('Password reset! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-navy-50/40">
      <div className="card p-8 max-w-md w-full">
        <h1 className="font-display font-800 text-2xl text-navy-900 mb-1">Set new password</h1>
        <p className="text-navy-500 text-sm mb-6">Choose a strong password for your account.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">New password</label>
            <input {...register('new_password', { required: true, minLength: 8 })} type="password" placeholder="••••••••" className="input" />
          </div>
          <div>
            <label className="label">Confirm new password</label>
            <input
              {...register('new_password2', { required: true, validate: v => v === watch('new_password') || 'Passwords must match' })}
              type="password" placeholder="••••••••" className="input"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <Spinner size="sm" /> : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  )
}
