'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { sellerAPI } from '@/lib/sellerAPI'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { isLoggedIn, updateUser, logout } = useAuthStore()

  useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  useEffect(() => {
    if (!isLoggedIn) return

    let cancelled = false

    const syncUser = async () => {
      try {
        const response = await sellerAPI.me()
        if (!cancelled && response?.user) {
          updateUser(response.user)
        }
      } catch (error) {
        if (!cancelled) {
          logout()
          router.push('/login')
        }
      }
    }

    syncUser()

    return () => {
      cancelled = true
    }
  }, [isLoggedIn, updateUser, logout, router])

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
