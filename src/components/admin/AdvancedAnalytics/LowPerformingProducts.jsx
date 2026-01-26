import React from 'react'
import { TrendingDown, AlertTriangle, Package, DollarSign } from 'lucide-react'
import { lowPerformingProducts } from './mockData'

const LowPerformingProducts = ({ formatCurrency }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Low Performing Products
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Products with declining sales or low performance metrics
      </p>

      <div className="space-y-4">
        {lowPerformingProducts.map((product) => (
          <div
            key={product.id}
            className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h4>
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current Sales</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {product.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Previous Period</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {product.previousQuantity} units
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last Sale</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {product.daysSinceLastSale} days ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                    product.growth < -50
                      ? 'bg-red-600 text-white'
                      : product.growth < -30
                      ? 'bg-orange-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-bold">{Math.abs(product.growth).toFixed(1)}%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Decline</p>
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800/30">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Sales Trend</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      style={{ width: `${Math.abs(product.growth)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">
                    {product.trend === 'declining' ? 'Declining' : 'Stable'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Action Required
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Consider promotional campaigns, price adjustments, or product updates for these
              underperforming items.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LowPerformingProducts

