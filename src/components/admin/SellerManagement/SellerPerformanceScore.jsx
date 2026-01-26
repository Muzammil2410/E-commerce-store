import React, { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, Star, Package, Clock, XCircle, Award } from 'lucide-react'
import { sellerPerformanceData } from './mockData'

const SellerPerformanceScore = () => {
  const [filter, setFilter] = useState('all') // all, top, average, low

  const filteredSellers = useMemo(() => {
    if (filter === 'all') return sellerPerformanceData
    return sellerPerformanceData.filter(seller => seller.category === filter)
  }, [filter])

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-600 text-white' }
    if (score >= 60) return { label: 'Good', color: 'bg-yellow-600 text-white' }
    return { label: 'Needs Improvement', color: 'bg-red-600 text-white' }
  }

  const calculateScore = (seller) => {
    // Score calculation based on:
    // - Delivery time (40%): Faster = better
    // - Customer rating (30%): Higher = better
    // - Order completion (20%): Higher completion rate = better
    // - Cancellation rate (10%): Lower = better

    const deliveryScore = Math.max(0, 100 - (seller.deliveryTime - 1) * 20) // 1 day = 100, 5 days = 0
    const ratingScore = (seller.customerRating / 5) * 100
    const completionScore = (seller.completedOrders / seller.totalOrders) * 100
    const cancellationScore = 100 - (seller.cancelledOrders / seller.totalOrders) * 100

    return Math.round(
      deliveryScore * 0.4 +
      ratingScore * 0.3 +
      completionScore * 0.2 +
      cancellationScore * 0.1
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Seller Performance Score
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Performance metrics based on delivery time, ratings, and order completion
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'top', label: 'Top Performers' },
            { key: 'average', label: 'Average' },
            { key: 'low', label: 'Low Performers' },
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {filteredSellers.map((seller) => {
          const calculatedScore = calculateScore(seller)
          const badge = getScoreBadge(calculatedScore)

          return (
            <div
              key={seller.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {seller.businessName}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{seller.email}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              {/* Score Display */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Performance Score
                  </span>
                  <span
                    className={`text-2xl font-bold ${getScoreColor(calculatedScore)}`}
                  >
                    {calculatedScore}/100
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getScoreBgColor(calculatedScore)} transition-all`}
                    style={{ width: `${calculatedScore}%` }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Avg Delivery</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {seller.deliveryTime} days
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Rating</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {seller.customerRating.toFixed(1)}/5.0
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Package className="w-4 h-4" />
                    <span>On-Time Rate</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {seller.onTimeDeliveryRate.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Cancellations</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {seller.cancelledOrders} ({((seller.cancelledOrders / seller.totalOrders) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Total Orders</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {seller.totalOrders}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredSellers.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No sellers found for this filter</p>
        </div>
      )}

      {/* Score Calculation Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Score Calculation
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Delivery Time (40%): Faster deliveries score higher</li>
          <li>• Customer Rating (30%): Based on 5-star rating system</li>
          <li>• Order Completion (20%): Higher completion rate = better score</li>
          <li>• Cancellation Rate (10%): Lower cancellations = better score</li>
        </ul>
      </div>
    </div>
  )
}

export default SellerPerformanceScore

