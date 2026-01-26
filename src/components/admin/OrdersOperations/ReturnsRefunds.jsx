import React, { useState, useMemo } from 'react'
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Filter,
  Check,
  X,
  AlertCircle,
} from 'lucide-react'
import { returnsRefundsData } from './mockData'
import toast from 'react-hot-toast'

const ReturnsRefunds = ({ formatCurrency }) => {
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [selectedReturn, setSelectedReturn] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const filteredReturns = useMemo(() => {
    if (filter === 'all') return returnsRefundsData
    return returnsRefundsData.filter((ret) => ret.status === filter)
  }, [filter])

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: Clock,
      },
      approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
      },
      rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle,
      },
    }
    const statusInfo = statusMap[status] || statusMap.pending
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

  const getRefundStatusBadge = (status) => {
    const statusMap = {
      not_initiated: {
        label: 'Not Initiated',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      },
      initiated: {
        label: 'Initiated',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      },
      completed: {
        label: 'Completed',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      },
    }
    const statusInfo = statusMap[status] || statusMap.not_initiated

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    )
  }

  const getReasonCategoryLabel = (category) => {
    const labels = {
      defective: 'Defective Product',
      wrong_size: 'Wrong Size',
      change_of_mind: 'Change of Mind',
      damaged: 'Damaged in Shipping',
      not_as_described: 'Not as Described',
    }
    return labels[category] || category
  }

  const handleApprove = (returnItem) => {
    // In real app, this would call an API
    toast.success(`Return request ${returnItem.id} has been approved`)
  }

  const handleReject = (returnItem) => {
    setSelectedReturn(returnItem)
    setShowRejectModal(true)
  }

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }
    // In real app, this would call an API
    toast.success(`Return request ${selectedReturn.id} has been rejected`)
    setShowRejectModal(false)
    setRejectionReason('')
    setSelectedReturn(null)
  }

  const pendingCount = returnsRefundsData.filter((r) => r.status === 'pending').length
  const approvedCount = returnsRefundsData.filter((r) => r.status === 'approved').length
  const rejectedCount = returnsRefundsData.filter((r) => r.status === 'rejected').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Returns</p>
            <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {returnsRefundsData.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-yellow-200 dark:border-yellow-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-green-200 dark:border-green-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{approvedCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-red-200 dark:border-red-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{rejectedCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['all', 'pending', 'approved', 'rejected'].map((filterOption) => (
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

      {/* Returns List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <RotateCcw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Returns & Refunds
          </h3>
        </div>

        <div className="space-y-4">
          {filteredReturns.map((returnItem) => (
            <div
              key={returnItem.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {returnItem.orderId}
                    </h4>
                    {getStatusBadge(returnItem.status)}
                    {getRefundStatusBadge(returnItem.refundStatus)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Buyer: {returnItem.buyer}</span>
                    <span>•</span>
                    <span>Requested: {new Date(returnItem.returnRequestDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {returnItem.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(returnItem)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(returnItem)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Items:
                </p>
                <div className="space-y-1">
                  {returnItem.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span>
                        {item.name} (Qty: {item.quantity})
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Total Refund Amount:
                  </span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(returnItem.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Reason Category: {getReasonCategoryLabel(returnItem.reasonCategory)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{returnItem.reason}</p>
              </div>

              {/* Status Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {returnItem.approvedDate && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Approved Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(returnItem.approvedDate).toLocaleString()}
                    </p>
                  </div>
                )}
                {returnItem.rejectedDate && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Rejected Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(returnItem.rejectedDate).toLocaleString()}
                    </p>
                  </div>
                )}
                {returnItem.refundInitiatedDate && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Refund Initiated</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(returnItem.refundInitiatedDate).toLocaleString()}
                    </p>
                  </div>
                )}
                {returnItem.refundCompletedDate && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Refund Completed</p>
                    <p className="font-medium text-green-600 dark:text-green-400">
                      {new Date(returnItem.refundCompletedDate).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Rejection Reason */}
              {returnItem.rejectionReason && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg">
                  <p className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1">
                    Rejection Reason:
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {returnItem.rejectionReason}
                  </p>
                </div>
              )}

              {/* Admin Notes */}
              {returnItem.adminNotes && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">
                    Admin Notes:
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">{returnItem.adminNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredReturns.length === 0 && (
          <div className="text-center py-12">
            <RotateCcw className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No returns found</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reject Return Request
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please provide a reason for rejecting return request {selectedReturn?.id}:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                  setSelectedReturn(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReturnsRefunds

