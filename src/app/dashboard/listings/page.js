'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { sellerAPI } from '@/lib/sellerAPI'

export default function ListingsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchListings = async () => {
    const sellerId = user?.id || user?._id
    if (!sellerId) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await sellerAPI.getSellerListings(sellerId)
      const data = Array.isArray(response)
        ? response
        : response?.vehicles || response?.listings || response?.data || []
      setListings(data)
    } catch (err) {
      setError(err.message || 'Unable to load listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [user?.id, user?._id])

  const handleEdit = (listing) => {
    const listingId = listing._id || listing.id
    if (!listingId) return
    router.push(`/dashboard/listings/${listingId}/edit`)
  }

  const handleDelete = async (listing) => {
    const listingId = listing._id || listing.id
    if (!listingId) return

    const confirmed = window.confirm('Are you sure you want to delete this listing?')
    if (!confirmed) return

    setLoading(true)
    setError('')

    try {
      await sellerAPI.deleteVehicle(listingId)
      setListings((prev) => prev.filter((item) => (item._id || item.id) !== listingId))
    } catch (err) {
      setError(err.message || 'Unable to delete listing')
    } finally {
      setLoading(false)
    }
  }

  const formatTitle = (listing) => {
    const titleParts = [listing.brand, listing.model, listing.year].filter(Boolean)
    return titleParts.join(' ')
  }

  const renderPrice = (price) => {
    if (price === undefined || price === null || price === '') return '-'
    return typeof price === 'number' ? price.toLocaleString() : price
  }

  const getStatus = (status) => status || 'active'

  const listingsToRender = listings.length > 0 ? listings : [
    {
      _id: 1,
      brand: 'Honda',
      model: 'City',
      year: 2015,
      price: '6,50,000',
      views: 234,
      inquiries: 12,
      status: 'active',
    },
    {
      _id: 2,
      brand: 'Maruti',
      model: 'Swift',
      year: 2018,
      price: '5,80,000',
      views: 189,
      inquiries: 8,
      status: 'active',
    },
    {
      _id: 3,
      brand: 'Bajaj',
      model: 'Pulsar',
      year: 2019,
      price: '1,20,000',
      views: 156,
      inquiries: 5,
      status: 'sold',
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-1">Manage all your vehicle listings</p>
        </div>
        <button 
          onClick={() => router.push('/dashboard/listings/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          New Listing
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vehicle</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Views</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Wishlist</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Inquiries</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listingsToRender.map((listing) => (
              <tr key={listing._id || listing.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{listing.title || formatTitle(listing)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">₹{renderPrice(listing.price)}</td>
                <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                  <Eye size={16} />
                  {listing.views ?? 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{listing.wishlistCount ?? 0}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{listing.inquiries ?? 0}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    listing.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <button
                    type="button"
                    onClick={() => handleEdit(listing)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(listing)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
