'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { sellerAPI, setAuthToken } from '@/lib/sellerAPI'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email')
      setLoading(false)
      return
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await sellerAPI.login({ email, password })

      if (!response?.token || !response?.user) {
        throw new Error('Invalid login response from server')
      }

      setAuthToken(response.token)
      login(response.user, response.token)

      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.18),_transparent_32%),linear-gradient(135deg,_#f7fbf9_0%,_#e7f4ef_42%,_#dbeafe_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-[28px] shadow-[0_24px_80px_rgba(15,23,42,0.14)] border border-white/70 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1 text-sm font-semibold text-teal-700 mb-4">
              Seller Portal
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Gadditrust</h1>
            <p className="text-slate-600">Sign in to manage your vehicle listings and leads</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-slate-700">Remember me</span>
              </label>
              <button type="button" className="text-teal-700 hover:text-teal-900 font-medium">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-sky-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Logging in...' : (
                <>
                  Login <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-slate-600 text-sm mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-teal-700 hover:text-teal-900 font-semibold">
              Sign up
            </Link>
          </p>

          {/* Backend Credentials Notice */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm">
            <p className="font-semibold text-slate-900 mb-2">New here?</p>
            <p className="text-slate-700">Create a seller account to add listings, receive buyer inquiries, and manage your storefront from the dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
