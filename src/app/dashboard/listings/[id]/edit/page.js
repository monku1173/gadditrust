'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { sellerAPI } from '@/lib/sellerAPI'

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params?.id
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: '',
    city: '',
    state: '',
    description: '',
    status: 'active',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!listingId) return

    const loadListing = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await sellerAPI.getVehicle(listingId)
        const listing = response?.vehicle || response?.data || response

        setFormData({
          brand: listing.brand || '',
          model: listing.model || '',
          price: listing.price || '',
          city: listing.city || '',
          state: listing.state || '',
          description: listing.description || '',
          status: listing.status || 'active',
        })
      } catch (err) {
        setError(err.message || 'Unable to load listing')
      } finally {
        setLoading(false)
      }
    }

    loadListing()
  }, [listingId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    if (!formData.brand || !formData.model || !formData.price || !formData.city || !formData.state) {
      setError('Please fill in all required fields')
      setSaving(false)
      return
    }

    try {
      await sellerAPI.updateVehicle(listingId, {
        ...formData,
        price: Number(formData.price),
      })
      setSuccess('Listing updated successfully')
      setTimeout(() => {
        router.push('/dashboard/listings')
      }, 1000)
    } catch (err) {
      setError(err.message || 'Unable to update listing')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
        <p className="text-gray-600 mt-1">Update the details for this vehicle</p>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-8 shadow-md">
          <p className="text-gray-700">Loading listing details...</p>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-8 shadow-md">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Model *</label>
                <input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/listings')}
                className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
