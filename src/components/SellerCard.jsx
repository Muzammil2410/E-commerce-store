'use client'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Store, ArrowRight } from 'lucide-react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * SellerCard - Displays seller business profile on product detail page
 * @param {string} sellerId - Seller user ID from product
 */
export default function SellerCard({ sellerId }) {
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sellerId) {
      setLoading(false)
      return
    }

    const fetchSeller = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE}/api/sellers/${sellerId}`)
        setSeller(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching seller profile:', err)
        setError(err)
        setSeller(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSeller()
  }, [sellerId])

  // Don't render if no sellerId
  if (!sellerId) {
    return null
  }

  // Loading state
  if (loading) {
    return (
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  // Error or seller not found
  if (error || !seller) {
    return (
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Store size={20} className="text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-600 dark:text-gray-300">Unknown seller</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Seller information unavailable</p>
          </div>
        </div>
      </div>
    )
  }

  // Get initials from business name
  const getInitials = (name) => {
    if (!name) return '?'
    const words = name.trim().split(/\s+/)
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const businessName = seller.businessName || 'Unknown Seller'
  const initials = getInitials(businessName)

  return (
    <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center gap-3">
        {/* Avatar/Logo */}
        {seller.avatarUrl ? (
          <img
            src={seller.avatarUrl}
            alt={businessName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-600"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
        )}

        {/* Seller Info */}
        <div className="flex-1">
          <p className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
            {businessName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
            Seller
          </p>
        </div>

        {/* View Store Link */}
        <Link
          to={`/seller/${seller.id}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
        >
          View store
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

