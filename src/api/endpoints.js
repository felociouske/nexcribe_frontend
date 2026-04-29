import api from './client'

export const authAPI = {
  register:       (data) => api.post('/auth/register/', data),
  login:          (data) => api.post('/auth/login/', data),
  logout:         (data) => api.post('/auth/logout/', data),
  refreshToken:   (data) => api.post('/auth/token/refresh/', data),
  verifyEmail:    (data) => api.post('/auth/verify-email/', data),
  requestReset:   (data) => api.post('/auth/password-reset/', data),
  confirmReset:   (data) => api.post('/auth/password-reset/confirm/', data),
  changePassword: (data) => api.post('/auth/change-password/', data),
}

export const usersAPI = {
  getMe:           ()    => api.get('/users/me/'),
  updateMe:        (data)=> api.patch('/users/me/', data),
  getWallets:      ()    => api.get('/users/wallets/'),
  getVirtualCard:  ()    => api.get('/users/virtual-card/'),
  getTransactions: (p)   => api.get('/users/transactions/', { params: p }),
  getReferral:     ()    => api.get('/users/referral/'),
}

export const plansAPI = {
  getAll:     (p)        => api.get('/plans/', { params: p }),
  getById:    (id)       => api.get(`/plans/${id}/`),
  getMyPlans: ()         => api.get('/plans/mine/'),
  purchase:   (id, data) => api.post(`/plans/${id}/purchase/`, data),
  categories: ()         => api.get('/plans/categories/'),
}

export const affiliatesAPI = {
  getNode:          ()      => api.get('/affiliates/node/'),
  getTree:          ()      => api.get('/affiliates/tree/'),
  getDownlineLevel: (level) => api.get(`/affiliates/downline/${level}/`),
  getCommissions:   (p)     => api.get('/affiliates/commissions/', { params: p }),
  getEarnings:      ()      => api.get('/affiliates/earnings/'),
}

export const writingAPI = {
  getCategories: ()         => api.get('/writing/categories/'),
  getJobs:       (p)        => api.get('/writing/jobs/', { params: p }),
  getMyJobs:     (p)        => api.get('/writing/jobs/mine/', { params: p }),
  getHistory:    ()         => api.get('/writing/jobs/history/'),
  getJob:        (id)       => api.get(`/writing/jobs/${id}/`),
  acceptJob:     (id)       => api.post(`/writing/jobs/${id}/accept/`),
  submitJob:     (id, data) => api.post(`/writing/jobs/${id}/submit/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

export const transcriptionAPI = {
  getTasks:       (p)        => api.get('/transcription/tasks/', { params: p }),
  getTaskById:    (id)       => api.get(`/transcription/tasks/${id}/`),
  getMyTasks:     ()         => api.get('/transcription/tasks/mine/'),
  claimTask:      (id)       => api.post(`/transcription/tasks/${id}/claim/`),
  submitTask:     (id, data) => api.post(`/transcription/tasks/${id}/submit/`, data),
  getSubmissions: (p)        => api.get('/transcription/submissions/', { params: p }),
}

export const gamesAPI = {
  getAll:        ()               => api.get('/games/'),
  getHistory:    ()               => api.get('/games/history/'),
  startGame:     (slug)           => api.post(`/games/${slug}/start/`),
  submitResult:  (sessionId, data)=> api.post(`/games/sessions/${sessionId}/submit/`, data),
  getLeaderboard:(slug)           => api.get(`/games/${slug}/leaderboard/`),
}

export const wheelAPI = {
  getConfig:  () => api.get('/wheel/config/'),
  spin:       () => api.post('/wheel/spin/'),
  getHistory: () => api.get('/wheel/history/'),
}

export const paymentsAPI = {
  requestDeposit:   (data) => api.post('/payments/deposit/', data),
  getDeposits:      ()     => api.get('/payments/deposits/'),
  requestWithdrawal:(data) => api.post('/payments/withdraw/', data),
  getWithdrawals:   ()     => api.get('/payments/withdrawals/'),
}

export const notificationsAPI = {
  getAll:         (p)  => api.get('/notifications/', { params: p }),
  getUnreadCount: ()   => api.get('/notifications/unread-count/'),
  markAllRead:    ()   => api.post('/notifications/mark-read/'),
  markRead:       (id) => api.post(`/notifications/${id}/read/`),
}