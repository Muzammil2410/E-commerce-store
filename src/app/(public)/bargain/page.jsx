'use client'

import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function BargainPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    otherPrice: '',
    otherUrl: ''
  })

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // No functionality change requested; just return to previous page for now
    navigate(from)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">Best Price Guaranteed</h1>
            <p className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
              We challenge all the websites for the lowest price. Tell us the details and we&apos;ll beat it.
              Share the competitor&apos;s price and link and we&apos;ll get you a better rate.
            </p>
          </div>
          <button
            onClick={() => navigate(from)}
            className="text-gray-500 hover:text-gray-800 transition text-lg"
            aria-label="Close bargain"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <input
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Name"
          />
          <input
            type="email"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Email"
          />
          <input
            value={form.city}
            onChange={e => handleChange('city', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Your City"
          />
          <input
            value={form.phone}
            onChange={e => handleChange('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Phone Number"
          />
          <input
            value={form.otherPrice}
            onChange={e => handleChange('otherPrice', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-1"
            placeholder="Enter Price on Other Website"
          />
          <input
            value={form.otherUrl}
            onChange={e => handleChange('otherUrl', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-1"
            placeholder="Enter URL Of Other Website"
          />

          <div className="sm:col-span-2 flex justify-center pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

