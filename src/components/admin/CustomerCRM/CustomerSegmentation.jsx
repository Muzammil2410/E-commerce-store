import React, { useState, useMemo } from 'react'
import { Users, Star, Repeat, UserPlus, Filter, TrendingUp } from 'lucide-react'
import { customerData } from './mockData'

const CustomerSegmentation = ({ formatCurrency }) => {
  const [segmentFilter, setSegmentFilter] = useState('all') // all, new, repeat, vip

  const filteredCustomers = useMemo(() => {
    if (segmentFilter === 'all') return customerData
    return customerData.filter((customer) => customer.segment === segmentFilter)
  }, [segmentFilter])

  const getSegmentBadge = (segment) => {
    const segmentMap = {
      new: {
        label: 'New Customer',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: UserPlus,
      },
      repeat: {
        label: 'Repeat Buyer',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: Repeat,
      },
      vip: {
        label: 'VIP Customer',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        icon: Star,
      },
    }
    const segmentInfo = segmentMap[segment] || segmentMap.new
    const Icon = segmentInfo.icon

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${segmentInfo.color}`}
      >
        <Icon className="w-3 h-3" />
        {segmentInfo.label}
      </span>
    )
  }

  const getCLVTierBadge = (tier) => {
    const tierMap = {
      low: {
        label: 'Low Value',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      },
      medium: {
        label: 'Medium Value',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      },
      high: {
        label: 'High Value',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      },
    }
    const tierInfo = tierMap[tier] || tierMap.low

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${tierInfo.color}`}>
        {tierInfo.label}
      </span>
    )
  }

  const segmentCounts = useMemo(() => {
    return {
      all: customerData.length,
      new: customerData.filter((c) => c.segment === 'new').length,
      repeat: customerData.filter((c) => c.segment === 'repeat').length,
      vip: customerData.filter((c) => c.segment === 'vip').length,
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{segmentCounts.all}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-blue-200 dark:border-blue-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">New Customers</p>
            <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {segmentCounts.new}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-green-200 dark:border-green-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Repeat Buyers</p>
            <Repeat className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {segmentCounts.repeat}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-purple-200 dark:border-purple-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">VIP Customers</p>
            <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {segmentCounts.vip}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['all', 'new', 'repeat', 'vip'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setSegmentFilter(filterOption)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  segmentFilter === filterOption
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Customer Segmentation
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  CLV Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Total Spend
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Avg Order Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Last Purchase
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSegmentBadge(customer.segment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCLVTierBadge(customer.clvTier)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(customer.totalSpend)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(customer.averageOrderValue)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(customer.lastPurchase).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No customers found</p>
          </div>
        )}
      </div>

      {/* Segmentation Info */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Segmentation Criteria
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>
            • <strong>New:</strong> 1-2 orders or joined within last 30 days
          </li>
          <li>
            • <strong>Repeat:</strong> 3-9 orders with consistent purchases
          </li>
          <li>
            • <strong>VIP:</strong> 10+ orders or total spend over $3000
          </li>
        </ul>
      </div>
    </div>
  )
}

export default CustomerSegmentation

