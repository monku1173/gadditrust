'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function Home() {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    // If logged in, redirect to dashboard
    if (isLoggedIn) {
      router.push('/dashboard')
    } else {
      // If not logged in, redirect to login
      router.push('/login')
    }
  }, [isLoggedIn, router])

  return null
}
