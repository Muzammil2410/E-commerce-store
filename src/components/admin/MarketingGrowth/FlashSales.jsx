import React, { useState, useEffect } from 'react'
import { Zap, Plus, Edit, Trash2, Clock, CheckCircle2, XCircle, Calendar } from 'lucide-react'
import { flashSalesData } from './mockData'
import toast from 'react-hot-toast'

const FlashSales = ({ formatCurrency }) => {
  const [flashSales, setFlashSales] = useState(flashSalesData)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Update status based on current time
  useEffect(() => {
    const interval = setInterval(() => {
      setFlashSales((prev) =>
        prev.map((sale) => {
          const now = new Date()
          const start = new Date(sale.startTime)
          const end = new Date(sale.endTime)

          if (now < start) return { ...sale, status: 'upcoming' }
          if (now >= start && now <= end) return { ...sale, status: 'live' }
          return { ...sale, status: 'ended' }
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status) => {
    const statusMap = {
      upcoming: {
        label: 'Upcoming',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: Clock,
      },
      live: {
        label: 'LIVE',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 animate-pulse',
        icon: Zap,
      },
      ended: {
        label: 'Ended',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        icon: XCircle,
      },
    }
    const statusInfo = statusMap[status] || statusMap.upcoming
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

  const getTimeRemaining = (startTime, endTime) => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (now < start) {
      const diff = start - now
      return { type: 'starts', time: diff }
    }
    if (now >= start && now <= end) {
      const diff = end - now
      return { type: 'ends', time: diff }
    }
    return { type: 'ended', time: 0 }
  }

  const formatTime = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
    return `${minutes}m ${seconds}s`
  }

  const handleDelete = (saleId) => {
    // In real app, this would call an API
    toast.success('Flash sale deleted')
  }

  const liveCount = flashSales.filter((s) => s.status === 'live').length
  const upcomingCount = flashSales.filter((s) => s.status === 'upcoming').length
  const endedCount = flashSales.filter((s) => s.status === 'ended').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Sales</p>
            <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{flashSales.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-green-200 dark:border-green-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Live Now</p>
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{liveCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-blue-200 dark:border-blue-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{upcomingCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Ended</p>
            <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{endedCount}</p>
        </div>
      </div>

      {/* Create Button */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Flash Sale
        </button>
      </div>

      {/* Flash Sales List */}
      <div className="space-y-4">
        {flashSales.map((sale) => {
          const timeInfo = getTimeRemaining(sale.startTime, sale.endTime)
          const isLive = sale.status === 'live'

          return (
            <div
              key={sale.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow border p-6 ${
                isLive
                  ? 'border-green-500 dark:border-green-500 ring-2 ring-green-500/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {sale.title}
                    </h3>
                    {getStatusBadge(sale.status)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{sale.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sale.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Countdown Timer */}
              {sale.status !== 'ended' && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {timeInfo.type === 'starts' ? 'Starts in:' : 'Ends in:'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatTime(timeInfo.time)}
                  </p>
                </div>
              )}

              {/* Discount Info */}
              <div className="mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Discount</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {sale.discountType === 'percentage'
                        ? `${sale.discountValue}% OFF`
                        : formatCurrency(sale.discountValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time Period</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(sale.startTime).toLocaleString()} -{' '}
                      {new Date(sale.endTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Products ({sale.products.length}):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {sale.products.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(product.salePrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create Flash Sale
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Fill in the details to create a new flash sale
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Electronics Flash Sale"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Up to 50% off on all electronics"
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Discount Value
                </label>
                <input
                  type="number"
                  placeholder="50"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Flash sale created')
                  setShowCreateModal(false)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlashSales

