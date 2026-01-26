import React, { useState, useEffect } from 'react'
import {
  Bell,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import { systemAlertsData } from './mockData'
import toast from 'react-hot-toast'

const SystemAlerts = () => {
  const [alerts, setAlerts] = useState(systemAlertsData)
  const [filter, setFilter] = useState('all') // all, critical, warning, info

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new alerts (in real app, this would come from WebSocket/API)
      if (Math.random() > 0.95) {
        const newAlert = {
          id: `alert-${Date.now()}`,
          type: ['info', 'warning'][Math.floor(Math.random() * 2)],
          title: 'System Update',
          message: 'New system update available',
          timestamp: new Date().toISOString(),
          read: false,
          action: 'system',
        }
        setAlerts((prev) => [newAlert, ...prev])
        toast.info('New system alert received')
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true
    return alert.type === filter
  })

  const getAlertIcon = (type) => {
    const icons = {
      critical: AlertCircle,
      warning: AlertTriangle,
      info: Info,
    }
    return icons[type] || Info
  }

  const getAlertColor = (type) => {
    const colors = {
      critical: {
        bg: 'bg-red-50 dark:bg-red-900/10',
        border: 'border-red-200 dark:border-red-800/30',
        text: 'text-red-800 dark:text-red-300',
        icon: 'text-red-600 dark:text-red-400',
      },
      warning: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/10',
        border: 'border-yellow-200 dark:border-yellow-800/30',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: 'text-yellow-600 dark:text-yellow-400',
      },
      info: {
        bg: 'bg-blue-50 dark:bg-blue-900/10',
        border: 'border-blue-200 dark:border-blue-800/30',
        text: 'text-blue-800 dark:text-blue-300',
        icon: 'text-blue-600 dark:text-blue-400',
      },
    }
    return colors[type] || colors.info
  }

  const handleMarkRead = (alertId) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert))
    )
  }

  const handleDismiss = (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
    toast.success('Alert dismissed')
  }

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })))
    toast.success('All alerts marked as read')
  }

  const unreadCount = alerts.filter((a) => !a.read).length
  const criticalCount = alerts.filter((a) => a.type === 'critical').length
  const warningCount = alerts.filter((a) => a.type === 'warning').length
  const infoCount = alerts.filter((a) => a.type === 'info').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Unread Alerts</p>
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{unreadCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-red-200 dark:border-red-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-yellow-200 dark:border-yellow-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{warningCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-blue-200 dark:border-blue-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Info</p>
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{infoCount}</p>
        </div>
      </div>

      {/* Actions & Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark All Read
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['all', 'critical', 'warning', 'info'].map((filterOption) => (
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
      </div>

      {/* Alerts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Real-Time System Alerts
          </h3>
        </div>

        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const colors = getAlertColor(alert.type)
            const Icon = getAlertIcon(alert.type)

            return (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${colors.bg} ${colors.border} ${
                  !alert.read ? 'ring-2 ring-opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${colors.text}`}>{alert.title}</h4>
                        {!alert.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className={`text-sm ${colors.text} mb-2`}>{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{alert.action}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.read && (
                      <button
                        onClick={() => handleMarkRead(alert.id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No alerts found</p>
          </div>
        )}
      </div>

      {/* Real-Time Indicator */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
            <div className="absolute inset-0 w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Real-Time Monitoring Active
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              System is monitoring for new alerts and updates
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemAlerts

