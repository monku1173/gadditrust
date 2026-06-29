'use client'

import Link from 'next/link'
import { ChevronRight, ShieldCheck, UserCircle2 } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account access and profile preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/dashboard/profile" className="group rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex rounded-2xl bg-teal-50 p-3 text-teal-700">
                <UserCircle2 size={24} />
              </div>
              <h2 className="mt-5 text-xl font-bold text-gray-900">Edit public profile</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">Update your avatar, seller name, business info, location, and buyer-facing profile details.</p>
            </div>
            <ChevronRight className="text-gray-400 transition group-hover:translate-x-1" />
          </div>
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <div className="inline-flex rounded-2xl bg-sky-50 p-3 text-sky-700">
            <ShieldCheck size={24} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-gray-900">Account status</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">Your seller account is active and linked to the marketplace API. Use the profile page to manage visible information.</p>
        </div>
      </div>
    </div>
  )
}
