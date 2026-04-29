import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { usersAPI, authAPI } from '@/api/endpoints'
import useAuthStore from '@/store/authStore'
import { getErrorMessage } from '@/utils'
import Spinner from '@/components/ui/Spinner'

export default function ProfilePage() {
  const { user, refreshUser } = useAuthStore()
  const { register, handleSubmit, reset } = useForm()
  const { register: regPw, handleSubmit: handlePw, reset: resetPw, watch } = useForm()
  const [saving, setSaving] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  useEffect(() => {
    if (user) reset({ first_name: user.first_name, last_name: user.last_name, phone: user.phone })
  }, [user, reset])

  const onSave = async (data) => {
    setSaving(true)
    try {
      await usersAPI.updateMe(data)
      await refreshUser()
      toast.success('Profile updated.')
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  const onChangePw = async (data) => {
    setSavingPw(true)
    try {
      await authAPI.changePassword(data)
      toast.success('Password changed.')
      resetPw()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSavingPw(false) }
  }

  return (
    <div className="page max-w-2xl">
      <h1 className="section-title mb-6">My Profile</h1>

      <div className="card p-6 mb-6">
        {/* Avatar + info */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-navy-100">
          <div className="w-14 h-14 rounded-full bg-teal-gradient flex items-center justify-center text-white text-xl font-display font-800">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-display font-700 text-navy-900">{user?.username}</p>
            <p className="text-navy-500 text-sm">{user?.email}</p>
            <span className={`badge mt-1 ${user?.is_verified ? 'badge-green' : 'badge-amber'}`}>
              {user?.is_verified ? '✓ Verified' : 'Unverified'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First name</label>
              <input {...register('first_name')} className="input" placeholder="Jane" />
            </div>
            <div>
              <label className="label">Last name</label>
              <input {...register('last_name')} className="input" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="label">Phone</label>
            <input {...register('phone')} className="input" placeholder="+254 700 000 000" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Spinner size="sm" /> : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Referral card */}
      <div className="card p-6 mb-6 bg-teal-50/50 border-teal-100">
        <p className="label mb-2">Your referral code</p>
        <div className="flex items-center gap-3">
          <code className="font-mono text-teal-700 bg-teal-100 px-3 py-2 rounded-lg text-sm font-600">
            {user?.profile?.referral_code}
          </code>
          <button
            onClick={() => { navigator.clipboard.writeText(user?.profile?.referral_code); toast.success('Copied!') }}
            className="btn-outline py-2 text-xs"
          >Copy</button>
        </div>
        <p className="text-navy-500 text-xs mt-2">{user?.profile?.total_referrals || 0} total referrals</p>
      </div>

      {/* Change password */}
      <div className="card p-6">
        <h2 className="font-display font-700 text-navy-900 mb-4">Change Password</h2>
        <form onSubmit={handlePw(onChangePw)} className="space-y-4">
          <div>
            <label className="label">Current password</label>
            <input {...regPw('old_password', { required: true })} type="password" className="input" placeholder="••••••••" />
          </div>
          <div>
            <label className="label">New password</label>
            <input {...regPw('new_password', { required: true, minLength: 8 })} type="password" className="input" placeholder="••••••••" />
          </div>
          <div>
            <label className="label">Confirm new password</label>
            <input {...regPw('new_password2', { validate: v => v === watch('new_password') || 'Must match' })} type="password" className="input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={savingPw} className="btn-outline">
            {savingPw ? <Spinner size="sm" /> : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
