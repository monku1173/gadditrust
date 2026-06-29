import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clearAuthToken } from '@/lib/sellerAPI'

// Create auth store with Zustand
const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isLoggedIn: false,

      // Actions
      login: (userData, token) => {
        const normalizedUser = {
          ...userData,
          id: userData.id || userData._id,
        }

        set({
          user: normalizedUser,
          token,
          isLoggedIn: true,
        })
      },

      logout: () => {
        clearAuthToken()
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        })
      },

      updateUser: (userData) => {
        const normalizedUser = {
          ...userData,
          id: userData.id || userData._id,
        }

        set((state) => ({
          user: { ...state.user, ...normalizedUser },
        }))
      },
    }),
    {
      name: 'auth-store', // Key in localStorage
    }
  )
)

export default useAuthStore
export { useAuthStore }
