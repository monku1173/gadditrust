'use client'

import { Bell, User, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

const Header = () => {
  const { user } = useAuthStore()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search listings..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-6">
        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-gray-900 transition">
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-gray-700 font-medium">{user?.name}</span>
            <ChevronDown size={18} className="text-gray-600" />
          </button>

          {/* Profile Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                My Profile
              </a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Account Settings
              </a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Help & Support
              </a>
              <hr className="my-2" />
              <a href="#" className="block px-4 py-2 text-red-600 hover:bg-red-50">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
