import React, { useState, useMemo } from 'react'
import { AlertTriangle, Package, TrendingDown, Calendar, Filter } from 'lucide-react'
import { lowStockAlertsData } from './mockData'

const LowStockAlerts = () => {
  const [filter, setFilter] = useState('all') // all, critical, warning, low
  const [groupBy, setGroupBy] = useState('seller') // seller, product

  const filteredAlerts = useMemo(() => {
    if (filter === 'all') return lowStockAlertsData
    return lowStockAlertsData.filter((alert) => alert.status === filter)
  }, [filter])

  const groupedAlerts = useMemo(() => {
    if (groupBy === 'seller') {
      const grouped = {}
      filteredAlerts.forEach((alert) => {
        if (!grouped[alert.sellerId]) {
          grouped[alert.sellerId] = {
            sellerId: alert.sellerId,
            sellerName: alert.sellerName,
            alerts: [],
          }
        }
        grouped[alert.sellerId].alerts.push(alert)
      })
      return Object.values(grouped)
    } else {
      // Group by product
      return filteredAlerts
    }
  }, [filteredAlerts, groupBy])

  const getStatusBadge = (status) => {
    const statusMap = {
      critical: {
        label: 'Critical',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: AlertTriangle,
      },
      warning: {
        label: 'Warning',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: AlertTriangle,
      },
      low: {
        label: 'Low',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        icon: TrendingDown,
      },
    }
    const statusInfo = statusMap[status] || statusMap.low
    const Icon = statusInfo.icon

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        <Icon className="w-3 h-3" />
        {statusInfo.label}
      </span>
    )
  }

  const getStockPercentage = (current, threshold) => {
    return Math.min(100, (current / threshold) * 100)
  }

  const criticalCount = lowStockAlertsData.filter((a) => a.status === 'critical').length
  const warningCount = lowStockAlertsData.filter((a) => a.status === 'warning').length
  const lowCount = lowStockAlertsData.filter((a) => a.status === 'low').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</p>
            <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {lowStockAlertsData.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-red-200 dark:border-red-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-yellow-200 dark:border-yellow-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Warning</p>
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{warningCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-orange-200 dark:border-orange-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock</p>
            <TrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{lowCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['all', 'critical', 'warning', 'low'].map((filterOption) => (
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

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Group By:</span>
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['seller', 'product'].map((groupOption) => (
                <button
                  key={groupOption}
                  onClick={() => setGroupBy(groupOption)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    groupBy === groupOption
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {groupOption.charAt(0).toUpperCase() + groupOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Low Stock Alerts
          </h3>
        </div>

        {groupBy === 'seller' ? (
          <div className="space-y-4">
            {groupedAlerts.map((group) => (
              <div
                key={group.sellerId}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {group.sellerName}
                </h4>
                <div className="space-y-3">
                  {group.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${
                        alert.status === 'critical'
                          ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                          : alert.status === 'warning'
                          ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30'
                          : 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-semibold text-gray-900 dark:text-white">
                              {alert.productName}
                            </h5>
                            {getStatusBadge(alert.status)}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Product ID: {alert.productId}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Current Stock
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {alert.currentStock} units
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Threshold</p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {alert.threshold} units
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Last Restocked
                          </p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {new Date(alert.lastRestocked).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Days Since
                          </p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {alert.daysSinceRestock} days
                          </p>
                        </div>
                      </div>

                      {/* Stock Level Indicator */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Stock Level</span>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {getStockPercentage(alert.currentStock, alert.threshold).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              alert.status === 'critical'
                                ? 'bg-red-600'
                                : alert.status === 'warning'
                                ? 'bg-yellow-600'
                                : 'bg-orange-600'
                            }`}
                            style={{
                              width: `${getStockPercentage(alert.currentStock, alert.threshold)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.status === 'critical'
                    ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                    : alert.status === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30'
                    : 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        {alert.productName}
                      </h5>
                      {getStatusBadge(alert.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Seller: {alert.sellerName}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Stock: {alert.currentStock}/{alert.threshold}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {alert.daysSinceRestock} days ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No stock alerts found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LowStockAlerts

