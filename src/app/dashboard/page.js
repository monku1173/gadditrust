'use client'

import { useRouter } from 'next/navigation'
import { BarChart3, TrendingUp, Package, Eye } from 'lucide-react'
import StatsCard from '@/components/StatsCard'

export default function DashboardPage() {
  const router = useRouter()

  const stats = [
    {
      title: 'Total Listings',
      value: '24',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Listings',
      value: '18',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Total Views',
      value: '1,234',
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      title: 'Inquiries',
      value: '42',
      icon: BarChart3,
      color: 'bg-orange-500',
    },
  ]

  const quickActions = [
    {
      label: '+ New Listing',
      href: '/dashboard/listings/new',
      className: 'w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition',
    },
    {
      label: 'View All Listings',
      href: '/dashboard/listings',
      className: 'w-full bg-gray-200 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-300 transition',
    },
    {
      label: 'View Inquiries',
      href: '/dashboard/messages',
      className: 'w-full bg-gray-200 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-300 transition',
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      className: 'w-full bg-gray-200 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-300 transition',
    },
  ]

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your selling overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Listings */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Listings</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Honda City 2015</p>
                    <p className="text-sm text-gray-600">Posted 2 days ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹6,50,000</p>
                  <p className="text-sm text-green-600">Active</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => router.push(action.href)}
                className={action.className}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
