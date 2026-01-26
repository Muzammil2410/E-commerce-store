import React, { useState, useMemo } from 'react'
import {
  AlertTriangle,
  Clock,
  Truck,
  MapPin,
  Calendar,
  Filter,
  TrendingUp,
} from 'lucide-react'
import { delayedOrdersData } from './mockData'

const DelayedOrders = ({ formatCurrency }) => {
  const [filter, setFilter] = useState('all') // all, critical, warning

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return delayedOrdersData
    if (filter === 'critical') return delayedOrdersData.filter((o) => o.daysDelayed >= 3)
    if (filter === 'warning') return delayedOrdersData.filter((o) => o.daysDelayed < 3 && o.daysDelayed > 0)
    return delayedOrdersData
  }, [filter])

  const getDelaySeverity = (days) => {
    if (days >= 3) return { label: 'Critical', color: 'red' }
    if (days >= 1) return { label: 'Warning', color: 'yellow' }
    return { label: 'On Time', color: 'green' }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      },
      PROCESSING: {
        label: 'Processing',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      },
      SHIPPED: {
        label: 'Shipped',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      },
      DELIVERED: {
        label: 'Delivered',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      },
    }
    const statusInfo = statusMap[status] || statusMap.PENDING

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    )
  }

  const criticalCount = delayedOrdersData.filter((o) => o.daysDelayed >= 3).length
  const warningCount = delayedOrdersData.filter((o) => o.daysDelayed >= 1 && o.daysDelayed < 3).length
  const totalDelayed = delayedOrdersData.length

  return (
    <div className="space-y-6">
      {/* Summary Alert */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">
              {totalDelayed} Delayed Orders
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              {criticalCount} critical, {warningCount} warnings - Action required
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-red-200 dark:border-red-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Critical Delays</p>
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">3+ days delayed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-yellow-200 dark:border-yellow-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{warningCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">1-2 days delayed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Delayed</p>
            <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDelayed}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">All delayed orders</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['all', 'critical', 'warning'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filter === filterOption
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

      {/* Delayed Orders List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delayed Orders</h3>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const severity = getDelaySeverity(order.daysDelayed)
            const isCritical = severity.color === 'red'

            return (
              <div
                key={order.id}
                className={`border rounded-lg p-5 hover:shadow-md transition-shadow ${
                  isCritical
                    ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                    : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {order.orderId}
                      </h4>
                      {getStatusBadge(order.status)}
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          isCritical
                            ? 'bg-red-600 text-white'
                            : 'bg-yellow-600 text-white'
                        }`}
                      >
                        {order.daysDelayed} day{order.daysDelayed !== 1 ? 's' : ''} delayed
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Buyer: {order.buyer}</span>
                      <span>•</span>
                      <span>{order.items} items</span>
                      <span>•</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delay Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Expected Delivery</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700/50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Order Date</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location & Courier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current Location</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {order.currentLocation}
                      </p>
                    </div>
                  </div>
                  {order.courier && (
                    <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700/50 rounded-lg">
                      <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Courier</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {order.courier}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Delay Reason */}
                {order.delayReason && (
                  <div className="mt-4 p-3 bg-white dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Delay Reason:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.delayReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No delayed orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DelayedOrders

