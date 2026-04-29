import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import useAuthStore from '@/store/authStore'
import { getErrorMessage } from '@/utils'
import Spinner from '@/components/ui/Spinner'

export default function RegisterPage() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm()
  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const { referralCode, code } = useParams()

  useEffect(() => {
    // Silently grab referral code from URL — not shown in form
    const refCode = referralCode || code
    if (refCode) setValue('referral_code', refCode)
    const params = new URLSearchParams(window.location.search)
    const refParam = params.get('ref')
    if (refParam) setValue('referral_code', refParam)
  }, [referralCode, code, setValue])

  const onSubmit = async (data) => {
    try {
      await registerUser(data)
      toast.success('Account created! Welcome to Nexcribe.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-navy-50/40">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-gradient flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-display font-extrabold">N</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-navy-900 mb-1">
              Create your account
            </h1>
            <p className="text-navy-500 text-sm">Start earning on Nexcribe today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Hidden referral code field — populated from URL only */}
            <input type="hidden" {...register('referral_code')} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First name</label>
                <input
                  {...register('first_name')}
                  placeholder="Jane"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Last name</label>
                <input
                  {...register('last_name')}
                  placeholder="Doe"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Username</label>
              <input
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Min 3 characters' },
                  pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers and underscores only' },
                })}
                placeholder="janedoe123"
                className={`input ${errors.username ? 'input-error' : ''}`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="label">Email address</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="jane@example.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Phone <span className="text-navy-400 font-normal normal-case">(optional)</span></label>
              <input
                {...register('phone')}
                placeholder="+254 700 000 000"
                className="input"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Min 8 characters' },
                })}
                type="password"
                placeholder="••••••••"
                className={`input ${errors.password ? 'input-error' : ''}`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="label">Confirm password</label>
              <input
                {...register('password2', {
                  required: 'Please confirm your password',
                  validate: v => v === watch('password') || 'Passwords do not match',
                })}
                type="password"
                placeholder="••••••••"
                className={`input ${errors.password2 ? 'input-error' : ''}`}
              />
              {errors.password2 && (
                <p className="text-red-500 text-xs mt-1">{errors.password2.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 mt-2"
            >
              {isLoading ? <Spinner size="sm" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-navy-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-500">
              Log in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}