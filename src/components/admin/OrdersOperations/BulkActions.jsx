import React, { useState, useMemo } from 'react'
import {
  CheckSquare,
  Square,
  Download,
  Truck,
  XCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { orderTimelineData } from './mockData'
import { courierOptions } from './mockData'
import toast from 'react-hot-toast'

const BulkActions = ({ formatCurrency }) => {
  const [selectedOrders, setSelectedOrders] = useState([])
  const [showCourierModal, setShowCourierModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedCourier, setSelectedCourier] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Use orderTimelineData as sample orders
  const orders = orderTimelineData

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((o) => o.id))
    }
  }

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    )
  }

  const handleExport = (format) => {
    if (selectedOrders.length === 0) {
      toast.error('Please select at least one order to export')
      return
    }

    setIsProcessing(true)

    // Simulate export
    setTimeout(() => {
      const selectedData = orders.filter((o) => selectedOrders.includes(o.id))
      const csvContent = [
        ['Order ID', 'Buyer', 'Status', 'Total', 'Items', 'Order Date'],
        ...selectedData.map((order) => [
          order.orderId,
          order.buyer,
          order.status,
          order.total,
          order.items,
          order.timeline[0]?.timestamp || 'N/A',
        ]),
      ]
        .map((row) => row.join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `orders-export-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(`Exported ${selectedOrders.length} orders as ${format.toUpperCase()}`)
      setIsProcessing(false)
    }, 1000)
  }

  const handleAssignCourier = () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select at least one order')
      return
    }
    setShowCourierModal(true)
  }

  const confirmAssignCourier = () => {
    if (!selectedCourier) {
      toast.error('Please select a courier')
      return
    }

    setIsProcessing(true)
    setTimeout(() => {
      const courier = courierOptions.find((c) => c.id === selectedCourier)
      toast.success(
        `Assigned ${courier.name} to ${selectedOrders.length} order(s)`
      )
      setShowCourierModal(false)
      setSelectedCourier('')
      setSelectedOrders([])
      setIsProcessing(false)
    }, 1500)
  }

  const handleCancelOrders = () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select at least one order')
      return
    }
    setShowCancelModal(true)
  }

  const confirmCancelOrders = () => {
    setIsProcessing(true)
    setTimeout(() => {
      toast.success(`Cancelled ${selectedOrders.length} order(s)`)
      setShowCancelModal(false)
      setSelectedOrders([])
      setIsProcessing(false)
    }, 1500)
  }

  const canPerformActions = selectedOrders.length > 0 && !isProcessing

  return (
    <div className="space-y-6">
      {/* Bulk Actions Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {selectedOrders.length === orders.length ? (
                <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              <span>Select All ({selectedOrders.length}/{orders.length})</span>
            </button>
            {selectedOrders.length > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedOrders.length} order(s) selected
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExport('csv')}
              disabled={!canPerformActions}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('xlsx')}
              disabled={!canPerformActions}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
            <button
              onClick={handleAssignCourier}
              disabled={!canPerformActions}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Truck className="w-4 h-4" />
              Assign Courier
            </button>
            <button
              onClick={handleCancelOrders}
              disabled={!canPerformActions}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Cancel Orders
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table with Checkboxes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <Square className="w-4 h-4 text-gray-400" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Order Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => {
                const isSelected = selectedOrders.includes(order.id)
                const firstStep = order.timeline[0]

                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                      isSelected ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <button onClick={() => handleSelectOrder(order.id)}>
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {order.orderId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">{order.buyer}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">{order.items}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {firstStep?.timestamp
                          ? new Date(firstStep.timestamp).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Courier Modal */}
      {showCourierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Assign Courier
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select a courier for {selectedOrders.length} selected order(s):
            </p>
            <select
              value={selectedCourier}
              onChange={(e) => setSelectedCourier(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            >
              <option value="">Select courier...</option>
              {courierOptions.map((courier) => (
                <option key={courier.id} value={courier.id}>
                  {courier.name} ({courier.estimatedDays} days)
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCourierModal(false)
                  setSelectedCourier('')
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssignCourier}
                disabled={!selectedCourier || isProcessing}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isProcessing ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Orders Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cancel Orders
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to cancel {selectedOrders.length} selected order(s)? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                No, Keep Orders
              </button>
              <button
                onClick={confirmCancelOrders}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isProcessing ? 'Cancelling...' : 'Yes, Cancel Orders'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BulkActions

