'use client'

import Link from 'next/link'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

export default function ListingsPage() {
  const listings = [
    {
      id: 1,
      title: 'Honda City 2015',
      price: '6,50,000',
      views: 234,
      inquiries: 12,
      status: 'active',
    },
    {
      id: 2,
      title: 'Maruti Swift 2018',
      price: '5,80,000',
      views: 189,
      inquiries: 8,
      status: 'active',
    },
    {
      id: 3,
      title: 'Bajaj Pulsar 2019',
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
        <Link href="/dashboard/listings/new">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            <Plus size={20} />
            New Listing
          </button>
        </Link>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vehicle</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Views</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Inquiries</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{listing.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">₹{listing.price}</td>
                <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                  <Eye size={16} />
                  {listing.views}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{listing.inquiries}</td>
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
                    <button className="text-blue-600 hover:text-blue-800 transition">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition">
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
