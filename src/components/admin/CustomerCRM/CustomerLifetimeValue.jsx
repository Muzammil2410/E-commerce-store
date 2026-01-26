import React, { useState } from 'react'
import { DollarSign, TrendingUp, Package, Award, BarChart3 } from 'lucide-react'
import { customerData } from './mockData'

const CustomerLifetimeValue = ({ formatCurrency }) => {
  const [sortBy, setSortBy] = useState('clv') // clv, orders, spend

  const sortedCustomers = [...customerData].sort((a, b) => {
    if (sortBy === 'clv') return b.lifetimeValue - a.lifetimeValue
    if (sortBy === 'orders') return b.totalOrders - a.totalOrders
    return b.totalSpend - a.totalSpend
  })

  const getCLVTierBadge = (tier) => {
    const tierMap = {
      low: {
        label: 'Low Value',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        bgColor: 'bg-gray-200 dark:bg-gray-700',
      },
      medium: {
        label: 'Medium Value',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        bgColor: 'bg-yellow-200 dark:bg-yellow-700',
      },
      high: {
        label: 'High Value',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        bgColor: 'bg-green-200 dark:bg-green-700',
      },
    }
    return tierMap[tier] || tierMap.low
  }

  const totalCLV = customerData.reduce((sum, c) => sum + c.lifetimeValue, 0)
  const averageCLV = totalCLV / customerData.length
  const highValueCount = customerData.filter((c) => c.clvTier === 'high').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total CLV</p>
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalCLV)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Across all customers</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-blue-200 dark:border-blue-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Average CLV</p>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(averageCLV)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Per customer</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-purple-200 dark:border-purple-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">High Value Customers</p>
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {highValueCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">High CLV tier</p>
        </div>
      </div>

      {/* Sort Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By:</span>
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['clv', 'orders', 'spend'].map((sortOption) => (
              <button
                key={sortOption}
                onClick={() => setSortBy(sortOption)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  sortBy === sortOption
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {sortOption === 'clv'
                  ? 'Lifetime Value'
                  : sortOption === 'orders'
                  ? 'Total Orders'
                  : 'Total Spend'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customers CLV List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Customer Lifetime Value
          </h3>
        </div>

        <div className="space-y-4">
          {sortedCustomers.map((customer) => {
            const tierInfo = getCLVTierBadge(customer.clvTier)
            const maxCLV = Math.max(...customerData.map((c) => c.lifetimeValue))
            const clvPercentage = (customer.lifetimeValue / maxCLV) * 100

            return (
              <div
                key={customer.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {customer.name}
                      </h4>
                      {tierInfo && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${tierInfo.color}`}>
                          {tierInfo.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(customer.lifetimeValue)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Lifetime Value</p>
                  </div>
                </div>

                {/* CLV Progress Bar */}
                <div className="mb-4">
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${tierInfo.bgColor} transition-all`}
                      style={{ width: `${clvPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <Package className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Orders</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {customer.totalOrders}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <DollarSign className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Spend</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(customer.totalSpend)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Order Value</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(customer.averageOrderValue)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CustomerLifetimeValue

