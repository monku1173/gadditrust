'use client'

import { Heart, MapPin, Gauge, Zap } from 'lucide-react'

const ListingCard = ({ title, price, image, location, mileage, fuelType, year }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden group">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
        <button className="absolute top-3 right-3 bg-white text-red-500 hover:text-red-600 p-2 rounded-full shadow-md transition">
          <Heart size={20} fill="currentColor" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
        
        <p className="text-2xl font-bold text-blue-600 mb-3">₹{price?.toLocaleString('en-IN')}</p>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
          <MapPin size={16} />
          <span>{location}</span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Mileage</p>
            <p className="font-semibold text-gray-900 text-sm">{mileage}K</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Fuel</p>
            <p className="font-semibold text-gray-900 text-sm">{fuelType}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Year</p>
            <p className="font-semibold text-gray-900 text-sm">{year}</p>
          </div>
        </div>

        {/* View Button */}
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          View Details
        </button>
      </div>
    </div>
  )
}

export default ListingCard
