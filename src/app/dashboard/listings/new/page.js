'use client'

import { useState } from 'react'
import { Upload, X, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { sellerAPI } from '@/lib/sellerAPI'

export default function NewListingPage() {
  const router = useRouter()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    // Vehicle Type & Category
    vehicleType: 'car',
    brand: '',
    model: '',
    variant: '',
    
    // Year & Condition
    year: new Date().getFullYear(),
    condition: 'excellent',
    
    // Specifications
    mileage: '',
    fuelType: 'petrol',
    transmission: 'automatic',
    bodyType: 'sedan',
    color: '',
    
    // Engine & Performance
    engineCapacity: '',
    horsepower: '',
    seatingCapacity: '',
    
    // Pricing & Details
    price: '',
    negotiable: false,
    
    // Location
    city: '',
    state: '',
    
    // Description
    description: '',
    
    // Owner Type
    ownerType: 'individual',
    ownerName: '',
    ownerPhone: '',
    
    // Features
    features: [],
  })

  // Available features
  const availableFeatures = [
    'ABS',
    'Power Steering',
    'Air Conditioning',
    'Power Windows',
    'Central Locking',
    'Airbags',
    'Sunroof',
    'Leather Seats',
    'Touchscreen',
    'Bluetooth',
    'Parking Sensors',
    'Rear Camera',
  ]

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle feature toggle
  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImages(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            file,
            src: event.target.result,
            name: file.name,
          }
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove image
  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!formData.brand || !formData.model || !formData.price || !formData.city || !formData.state) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (images.length === 0) {
      setError('Please upload at least one image')
      setLoading(false)
      return
    }

    try {
      console.log('Form Data:', formData)
      console.log('Images:', images.length)
      
      const payload = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return

        if (Array.isArray(value)) {
          value.forEach((item) => payload.append(key, item))
        } else {
          payload.append(key, value)
        }
      })

      images.forEach((image) => {
        payload.append('images', image.file)
      })

      console.log('Sending payload to API...')
      const response = await sellerAPI.createVehicle(payload)
      console.log('API Response:', response)
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/listings')
      }, 2000)
    } catch (uploadError) {
      console.error('Upload Error:', uploadError)
      setError(uploadError.message || 'Error creating listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
        <p className="text-gray-600 mt-1">Fill in the details to list your vehicle</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg mb-6">
          ❌ {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg mb-6">
          ✅ Listing created successfully! Redirecting...
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ===== IMAGE UPLOAD SECTION ===== */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📸 Vehicle Images</h2>
          
          {/* Image Upload Area */}
          <div className="mb-6">
            <label htmlFor="images" className="block">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50 transition cursor-pointer">
                <Upload className="mx-auto text-blue-600 mb-3" size={40} />
                <p className="text-lg font-semibold text-gray-900 mb-1">Upload Vehicle Images</p>
                <p className="text-sm text-gray-600 mb-4">Drag and drop or click to select (Max 10 images)</p>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={images.length >= 10}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {/* Uploaded Images Preview */}
          {images.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-4">Uploaded Images ({images.length}/10)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 px-2 py-1 rounded text-white text-xs">
                      {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== VEHICLE TYPE & BASIC INFO ===== */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🚗 Vehicle Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g., Honda, Maruti, Bajaj"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="e.g., City, Swift, Pulsar"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Variant */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Variant</label>
              <input
                type="text"
                name="variant"
                value={formData.variant}
                onChange={handleInputChange}
                placeholder="e.g., VX, ZX, SX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1980"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="e.g., White, Black, Silver"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ===== CONDITION & SPECIFICATIONS ===== */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Specifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Condition */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="fair">Fair</option>
              </select>
            </div>

            {/* Mileage (KM) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mileage (KM) *</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="e.g., 45000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type *</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
                <option value="cng">CNG</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission *</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Body Type</label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sedan">Sedan</option>
                <option value="hatchback">Hatchback</option>
                <option value="suv">SUV</option>
                <option value="coupe">Coupe</option>
                <option value="wagon">Wagon</option>
                <option value="van">Van</option>
              </select>
            </div>

            {/* Seating Capacity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Seating Capacity</label>
              <input
                type="number"
                name="seatingCapacity"
                value={formData.seatingCapacity}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                min="1"
                max="9"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Engine Capacity (CC) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Engine Capacity (CC)</label>
              <input
                type="number"
                name="engineCapacity"
                value={formData.engineCapacity}
                onChange={handleInputChange}
                placeholder="e.g., 1200"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Horsepower */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Horsepower (BHP)</label>
              <input
                type="number"
                name="horsepower"
                value={formData.horsepower}
                onChange={handleInputChange}
                placeholder="e.g., 88"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ===== FEATURES ===== */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Features</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableFeatures.map((feature) => (
              <label key={feature} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => toggleFeature(feature)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ===== PRICING ===== */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💰 Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 650000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Negotiable */}
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="negotiable"
                name="negotiable"
                checked={formData.negotiable}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="negotiable" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                Price is negotiable
              </label>
            </div>
          </div>
        </div>

        {/* ===== LOCATION ===== */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📍 Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., Mumbai"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="e.g., Maharashtra"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ===== OWNER INFORMATION ===== */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">👤 Owner Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Type *</label>
              <select
                name="ownerType"
                value={formData.ownerType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="individual">Individual</option>
                <option value="dealer">Dealer</option>
                <option value="organization">Organization</option>
              </select>
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Name *</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Owner Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleInputChange}
                placeholder="Your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ===== DESCRIPTION ===== */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Description</h2>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write a detailed description about the vehicle condition, maintenance history, any damages, modifications, etc."
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">{formData.description.length}/500 characters</p>
          </div>
        </div>

        {/* ===== SUBMIT SECTION ===== */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Listing...' : success ? '✅ Listing Created!' : '✅ Create Listing'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">All fields marked with * are required</p>
        </div>
      </form>
    </div>
  )
}
