import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI, usersAPI } from '@/api/endpoints'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        if (get().isLoading) return

        set({ isLoading: true })

        try {
          const { data } = await authAPI.login({ email, password })

          localStorage.setItem('access_token', data.access)
          localStorage.setItem('refresh_token', data.refresh)

          const { data: me } = await usersAPI.getMe()

          set({
            user: me,
            isAuthenticated: true,
          })

          return me
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (formData) => {
        set({ isLoading: true })
        try {
          const { data } = await authAPI.register(formData)
          localStorage.setItem('access_token', data.access)
          localStorage.setItem('refresh_token', data.refresh)

          // Fetch full user profile so first_name/last_name are available
          // immediately after registration (card holder name, profile, etc.)
          try {
            const { data: me } = await usersAPI.getMe()
            set({ user: me, isAuthenticated: true, isLoading: false })
            return { ...data, user: me }
          } catch (_) {
            // Fallback to registration response user if getMe fails
            set({ user: data.user, isAuthenticated: true, isLoading: false })
            return data
          }
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      logout: async () => {
        try {
          const refresh = localStorage.getItem('refresh_token')
          if (refresh) await authAPI.logout({ refresh })
        } catch (_) {}
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, isAuthenticated: false })
      },

      refreshUser: async () => {
        try {
          const { data } = await usersAPI.getMe()
          set({ user: data })
          return data
        } catch (_) {}
      },

      setLoading: (v) => set({ isLoading: v }),
    }),
    {
      name: 'nexcribe-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
)

export default useAuthStore