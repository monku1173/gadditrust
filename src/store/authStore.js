import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Create auth store with Zustand
const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      isLoggedIn: false,

      // Actions
      login: (userData) => {
        set({
          user: userData,
          isLoggedIn: true,
        })
      },

      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
        })
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
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
