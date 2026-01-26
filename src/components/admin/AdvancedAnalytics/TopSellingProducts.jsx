import React, { useState } from 'react'
import { TrendingUp, Package, DollarSign } from 'lucide-react'
import { topSellingProducts } from './mockData'

const TopSellingProducts = ({ formatCurrency }) => {
  const [timeframe, setTimeframe] = useState('monthly')
  const [sortBy, setSortBy] = useState('revenue') // 'revenue' or 'quantity'

  const products = topSellingProducts[timeframe] || []
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'revenue') {
      return b.revenue - a.revenue
    }
    return b.quantity - a.quantity
  })

  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            Top Selling Products
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Products ranked by {sortBy === 'revenue' ? 'revenue' : 'quantity sold'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Timeframe Selector */}
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['daily', 'weekly', 'monthly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeframe === tf
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSortBy('revenue')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'revenue'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setSortBy('quantity')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'quantity'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Quantity
            </button>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {sortedProducts.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Rank Badge */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0
                    ? 'bg-yellow-500 text-white'
                    : index === 1
                    ? 'bg-gray-400 text-white'
                    : index === 2
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                {index + 1}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {product.quantity} sold
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Contribution */}
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {product.contribution.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">of total</p>
              </div>
              {/* Progress Bar */}
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                  style={{ width: `${product.contribution}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Revenue ({timeframe})
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalRevenue)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TopSellingProducts

