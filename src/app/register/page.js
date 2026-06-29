'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { sellerAPI, setAuthToken } from '@/lib/sellerAPI'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  User,
} from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('individual')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!name || !email || !password || !phone || !city || !state) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        userType: 'seller',
        businessName: businessName.trim(),
        businessType,
        phone: phone.trim(),
        city: city.trim(),
        state: state.trim(),
        address: address.trim(),
      }
      const response = await sellerAPI.register(payload)

      if (!response?.token || !response?.user) throw new Error('Invalid response from server')

      setAuthToken(response.token)
      login(response.user, response.token)

      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_32%),linear-gradient(145deg,_#f8fafc_0%,_#eefbf7_45%,_#e0f2fe_100%)] p-4 md:p-6">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block px-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center rounded-full bg-white/75 px-4 py-1 text-sm font-semibold text-teal-700 shadow-sm">
              Build your seller profile
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900">
              Start selling with a polished storefront that buyers can trust.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Create your seller account, save your business details in MongoDB, and move straight into listing vehicles and managing leads.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="flex items-start gap-3 rounded-3xl bg-white/75 p-5 shadow-sm ring-1 ring-white/80">
                <ShieldCheck className="mt-0.5 text-teal-600" size={22} />
                <div>
                  <h2 className="font-semibold text-slate-900">Trusted onboarding</h2>
                  <p className="mt-1 text-sm text-slate-600">Your seller profile details are stored in the database and used across the dashboard experience.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-3xl bg-white/75 p-5 shadow-sm ring-1 ring-white/80">
                <Store className="mt-0.5 text-sky-600" size={22} />
                <div>
                  <h2 className="font-semibold text-slate-900">Ready for listings</h2>
                  <p className="mt-1 text-sm text-slate-600">Add your business identity, city, and contact details so listing management works from day one.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-3xl bg-white/75 p-5 shadow-sm ring-1 ring-white/80">
                <CheckCircle2 className="mt-0.5 text-emerald-600" size={22} />
                <div>
                  <h2 className="font-semibold text-slate-900">Buyer-ready workflow</h2>
                  <p className="mt-1 text-sm text-slate-600">Once registered, you’ll land directly in the seller dashboard with an authenticated session.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="mx-auto w-full max-w-2xl rounded-[32px] border border-white/80 bg-white/92 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.16)] backdrop-blur-sm md:p-8">
            <div className="mb-8">
              <div className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1 text-sm font-semibold text-teal-700">
                Seller Signup
              </div>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">Create your seller account</h1>
              <p className="mt-2 text-slate-600">Set up your login and business details. Your account will be created in the Gadditrust MongoDB database.</p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Account details</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Full name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500" placeholder="Your full name" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Phone number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500" placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Email address *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500" placeholder="seller@gadditrust.com" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500" placeholder="At least 6 characters" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500" placeholder="Re-enter password" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Business details</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Business name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500" placeholder="Dealer or showroom name" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Business type</label>
                    <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500">
                      <option value="individual">Individual Seller</option>
                      <option value="dealer">Dealer</option>
                      <option value="organization">Organization</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">City *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500" placeholder="Mumbai" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">State *</label>
                    <input value={state} onChange={(e) => setState(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500" placeholder="Maharashtra" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500" placeholder="Showroom or pickup address" />
                  </div>
                </div>
              </div>

              <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 py-3 text-base font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Creating account...' : (
                  <>
                    Create seller account <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-900">
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
