import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import useAuthStore from '@/store/authStore'
import { getErrorMessage } from '@/utils'
import Spinner from '@/components/ui/Spinner'

export default function LoginPage() {
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password)

      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      useAuthStore.getState().setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-navy-50/40">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="mb-8 text-center">
            <h1 className="font-display font-800 text-2xl text-navy-900 mb-1">Welcome back</h1>
            <p className="text-navy-500 text-sm">Log in to your Nexcribe account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email" placeholder="you@example.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-teal-600 hover:text-teal-500">Forgot password?</Link>
              </div>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password" placeholder="••••••••"
                className={`input ${errors.password ? 'input-error' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center py-3.5">
              {isLoading ? <Spinner size="sm" /> : 'Log in'}
            </button>
          </form>

          <p className="text-center text-sm text-navy-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-600 font-600 hover:text-teal-500">Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
