import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Public pages
import LandingPage from '@/features/landing/LandingPage'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/ResetPasswordPage'
import VerifyEmailPage from '@/features/auth/VerifyEmailPage'

// Dashboard pages
import DashboardHome from '@/features/dashboard/DashboardHome'
import PlansPage from '@/features/plans/PlansPage'
import AffiliatesPage from '@/features/affiliates/AffiliatesPage'
import WritingPage from '@/features/writing/WritingPage'
import WritingJobPage from '@/features/writing/WritingJobPage'
import TranscriptionPage from '@/features/transcription/TranscriptionPage'
import TranscriptionTaskPage from '@/features/transcription/TranscriptionTaskPage'
import GamesPage from '@/features/games/GamesPage'
import GamePlayPage from '@/features/games/GamePlayPage'
import WheelPage from '@/features/wheel/WheelPage'
import WalletPage from '@/features/payments/WalletPage'
import NotificationsPage from '@/features/notifications/NotificationsPage'
import ProfilePage from '@/features/auth/ProfilePage'

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/register/:referralCode" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/ref/:code" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      </Route>

      {/* Dashboard */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/plans" element={<PlansPage />} />
        <Route path="/dashboard/affiliates" element={<AffiliatesPage />} />
        <Route path="/dashboard/writing" element={<WritingPage />} />
        <Route path="/dashboard/writing/:id" element={<WritingJobPage />} />
        <Route path="/dashboard/transcription" element={<TranscriptionPage />} />
        <Route path="/dashboard/transcription/:id" element={<TranscriptionTaskPage />} />
        <Route path="/dashboard/games" element={<GamesPage />} />
        <Route path="/dashboard/games/:slug" element={<GamePlayPage />} />
        <Route path="/dashboard/wheel" element={<WheelPage />} />
        <Route path="/dashboard/wallet" element={<WalletPage />} />
        <Route path="/dashboard/notifications" element={<NotificationsPage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
