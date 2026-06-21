'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, MessageSquare, BarChart3, Settings, LogOut, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const Sidebar = () => {
  const pathname = usePathname()
  const { logout } = useAuthStore()

  // Menu items for sidebar
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', id: 'dashboard' },
    { icon: Package, label: 'My Listings', href: '/dashboard/listings', id: 'listings' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages', id: 'messages' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics', id: 'analytics' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings', id: 'settings' },
  ]

  const isActive = (href) => pathname === href

  return (
    <aside className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">Gadditrust</h1>
        <p className="text-xs text-gray-500 mt-1">Seller Portal</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.id} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {active && <ChevronRight size={20} className="ml-auto" />}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition duration-200 font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
