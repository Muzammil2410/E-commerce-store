'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Store, Package, ArrowLeft } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import axios from 'axios'
import { useTheme } from '@/contexts/ThemeContext'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Seller Storefront Page - Displays seller's business profile and products
 */
export default function SellerStorefront() {
  const { sellerId } = useParams()
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  
  const [seller, setSeller] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sellerId) {
      setError('Invalid seller ID')
      setLoading(false)
      return
    }

    const fetchSellerData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch seller profile and products in parallel
        const [sellerResponse, productsResponse] = await Promise.all([
          axios.get(`${API_BASE}/api/sellers/${sellerId}`),
          axios.get(`${API_BASE}/api/sellers/${sellerId}/products?status=published`),
        ])

        setSeller(sellerResponse.data)
        
        // Normalize products for ProductCard component
        const normalizedProducts = productsResponse.data.map((product) => ({
          id: product.id,
          name: product.title,
          title: product.title,
          price: product.price,
          images: product.thumbnailUrl ? [product.thumbnailUrl] : [],
          shortDescription: product.shortDescription,
          description: product.shortDescription,
          category: '',
          rating: [],
        }))
        
        setProducts(normalizedProducts)
      } catch (err) {
        console.error('Error fetching seller data:', err)
        if (err.response?.status === 404) {
          setError('Seller not found')
        } else {
          setError('Failed to load seller storefront')
        }
        setSeller(null)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchSellerData()
  }, [sellerId])

  // Get initials from business name
  const getInitials = (name) => {
    if (!name) return '?'
    const words = name.trim().split(/\s+/)
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading storefront...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-200">
        <div className="text-center max-w-md">
          <Package size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
            {error || 'Seller not found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-200">
            {error === 'Seller not found' 
              ? 'This seller does not exist or has been removed.'
              : 'Unable to load the seller storefront. Please try again later.'}
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            <ArrowLeft size={16} className="inline mr-2" />
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  const businessName = seller.businessName || 'Unknown Seller'
  const initials = getInitials(businessName)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors duration-200"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Seller Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Avatar/Logo */}
            {seller.avatarUrl ? (
              <img
                src={seller.avatarUrl}
                alt={businessName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl">
                {initials}
              </div>
            )}

            {/* Seller Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Store size={20} className="text-gray-400 dark:text-gray-500" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                  {businessName}
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                {seller.totalProducts || products.length} {seller.totalProducts === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-200">
            Products
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors duration-200">
              <Package size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                No products yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                This seller hasn't published any products yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

