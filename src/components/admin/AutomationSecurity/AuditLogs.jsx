import React, { useState, useMemo } from 'react'
import {
  FileText,
  Filter,
  Calendar,
  User,
  Search,
  Eye,
  Download,
  Clock,
  X,
} from 'lucide-react'
import { auditLogsData } from './mockData'

const AuditLogs = () => {
  const [filter, setFilter] = useState('all') // all, order_update, seller_verification, refund_approval, settings_change
  const [userFilter, setUserFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all') // all, today, week, month
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLog, setSelectedLog] = useState(null)

  const actionTypes = [
    { key: 'all', label: 'All Actions' },
    { key: 'order_update', label: 'Order Updates' },
    { key: 'seller_verification', label: 'Seller Verification' },
    { key: 'refund_approval', label: 'Refund Approvals' },
    { key: 'settings_change', label: 'Settings Changes' },
    { key: 'support_update', label: 'Support Updates' },
    { key: 'coupon_create', label: 'Coupon Creation' },
    { key: 'order_cancel', label: 'Order Cancellation' },
    { key: 'role_change', label: 'Role Changes' },
  ]

  const filteredLogs = useMemo(() => {
    let logs = auditLogsData

    // Filter by action type
    if (filter !== 'all') {
      logs = logs.filter((log) => log.actionType === filter)
    }

    // Filter by user
    if (userFilter !== 'all') {
      logs = logs.filter((log) => log.userId === userFilter)
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date()
      logs = logs.filter((log) => {
        const logDate = new Date(log.timestamp)
        switch (dateFilter) {
          case 'today':
            return logDate.toDateString() === now.toDateString()
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return logDate >= weekAgo
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return logDate >= monthAgo
          default:
            return true
        }
      })
    }

    // Filter by search term
    if (searchTerm) {
      logs = logs.filter(
        (log) =>
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.entityId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return logs
  }, [filter, userFilter, dateFilter, searchTerm])

  const uniqueUsers = useMemo(() => {
    const users = new Map()
    auditLogsData.forEach((log) => {
      if (!users.has(log.userId)) {
        users.set(log.userId, { id: log.userId, name: log.userName, email: log.userEmail })
      }
    })
    return Array.from(users.values())
  }, [])

  const getActionTypeBadge = (actionType) => {
    const typeMap = {
      order_update: { label: 'Order Update', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      seller_verification: { label: 'Verification', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      refund_approval: { label: 'Refund', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
      settings_change: { label: 'Settings', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      support_update: { label: 'Support', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
      coupon_create: { label: 'Coupon', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
      order_cancel: { label: 'Cancellation', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
      role_change: { label: 'Role Change', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' },
    }
    const typeInfo = typeMap[actionType] || { label: actionType, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' }

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}>
        {typeInfo.label}
      </span>
    )
  }

  const handleExport = () => {
    // In real app, this would generate and download CSV
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'Changes', 'IP Address'],
      ...filteredLogs.map((log) => [
        new Date(log.timestamp).toLocaleString(),
        log.userName,
        log.action,
        log.entityType,
        log.entityId,
        JSON.stringify(log.changes),
        log.ipAddress,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audit Logs</h3>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Complete activity tracking of all system changes. All actions are logged and cannot be
          modified.
        </p>

        {/* Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs by action, user, or entity ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Action Type
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                {actionTypes.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                User
              </label>
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Changes
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider min-w-[80px]">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.userName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{log.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {log.action}
                      </p>
                      {getActionTypeBadge(log.actionType)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {log.entityType}
                      </p>
                      <p className="text-sm font-mono text-gray-900 dark:text-white">
                        {log.entityId}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {log.changes.field && (
                        <div>
                          <span className="font-medium">{log.changes.field}:</span>{' '}
                          <span className="line-through text-red-600 dark:text-red-400">
                            {log.changes.oldValue || 'null'}
                          </span>{' '}
                          →{' '}
                          <span className="text-green-600 dark:text-green-400">
                            {log.changes.newValue || 'null'}
                          </span>
                        </div>
                      )}
                      {log.changes.amount && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Amount: ${log.changes.amount}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                      {log.ipAddress}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap min-w-[80px]">
                    <div className="flex justify-end items-center">
                      <button
                        onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No audit logs found</p>
          </div>
        )}

        {/* Log Detail Modal */}
        {selectedLog && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={() => setSelectedLog(null)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Audit Log Details
                  </h3>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Action</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedLog.action}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">User</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedLog.userName} ({selectedLog.userEmail})
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Entity</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedLog.entityType}: {selectedLog.entityId}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Timestamp</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(selectedLog.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">IP Address</p>
                      <p className="text-sm font-mono text-gray-900 dark:text-white">
                        {selectedLog.ipAddress}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">User Agent</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{selectedLog.userAgent}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AuditLogs

