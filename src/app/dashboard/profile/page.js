'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  Camera,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Store,
  User,
} from 'lucide-react'
import { sellerAPI } from '@/lib/sellerAPI'
import { useAuthStore } from '@/store/authStore'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  businessName: '',
  businessType: 'individual',
  city: '',
  state: '',
  address: '',
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [formData, setFormData] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const fallbackAvatar = useMemo(() => {
    const name = formData.name || user?.name || user?.businessName || 'Seller'
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=ffffff&size=256`
  }, [formData.name, user?.name, user?.businessName])

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await sellerAPI.getMyProfile()
        const seller = response?.seller
        if (!seller || cancelled) return

        updateUser(seller)
        setFormData({
          name: seller.name || '',
          email: seller.email || '',
          phone: seller.phone || '',
          businessName: seller.businessName || '',
          businessType: seller.businessType || 'individual',
          city: seller.city || '',
          state: seller.state || '',
          address: seller.address || '',
        })
        setAvatarPreview(seller.avatar || '')
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Unable to load profile')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [updateUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value)
      })
      if (avatarFile) {
        payload.append('avatar', avatarFile)
      }

      const response = await sellerAPI.updateMyProfile(payload)
      const seller = response?.seller

      if (seller) {
        updateUser(seller)
        setFormData({
          name: seller.name || '',
          email: seller.email || '',
          phone: seller.phone || '',
          businessName: seller.businessName || '',
          businessType: seller.businessType || 'individual',
          city: seller.city || '',
          state: seller.state || '',
          address: seller.address || '',
        })
        setAvatarPreview(seller.avatar || '')
        setAvatarFile(null)
      }

      setSuccess('Profile updated successfully')
    } catch (saveError) {
      setError(saveError.message || 'Unable to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">My Profile</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Seller identity and business details</h1>
          <p className="mt-2 text-gray-600">Upload your photo, review your storefront details, and edit the information buyers will trust.</p>
        </div>
        <div className="rounded-2xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Profile syncs with your MongoDB seller record.
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
        <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={avatarPreview || user?.avatar || fallbackAvatar}
                alt={formData.name || 'Seller avatar'}
                className="h-36 w-36 rounded-3xl object-cover ring-4 ring-teal-100"
              />
              <label className="absolute bottom-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-gray-900 text-white shadow-lg">
                <Camera size={18} />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">{formData.name || 'Seller'}</h2>
            <p className="mt-1 text-sm text-gray-600">{formData.businessName || 'Independent seller'}</p>
            <div className="mt-4 flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
              <ShieldCheck size={16} />
              Seller account active
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Contact</p>
              <p className="mt-2 text-sm text-slate-700">{formData.email || 'No email'}</p>
              <p className="mt-1 text-sm text-slate-700">{formData.phone || 'No phone added'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Location</p>
              <p className="mt-2 text-sm text-slate-700">{[formData.city, formData.state].filter(Boolean).join(', ') || 'Not added yet'}</p>
              <p className="mt-1 text-sm text-slate-700">{formData.address || 'No address added'}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8">
          {loading ? (
            <div className="py-16 text-center text-gray-500">Loading profile...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Personal details</h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User size={16} />
                      Full name
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail size={16} />
                      Email address
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone size={16} />
                      Phone number
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Store size={16} />
                      Business type
                    </span>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="individual">Individual Seller</option>
                      <option value="dealer">Dealer</option>
                      <option value="organization">Organization</option>
                    </select>
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">Business profile</h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Building2 size={16} />
                      Business name
                    </span>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin size={16} />
                      City
                    </span>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin size={16} />
                      State
                    </span>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin size={16} />
                      Address
                    </span>
                    <textarea
                      name="address"
                      rows={4}
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 px-6 py-3 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save profile'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
