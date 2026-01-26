import React, { useState, useMemo } from 'react'
import {
  Ticket,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  DollarSign,
  Percent,
} from 'lucide-react'
import { couponsData } from './mockData'
import toast from 'react-hot-toast'

const CouponManager = ({ formatCurrency }) => {
  const [filter, setFilter] = useState('all') // all, active, expired, disabled
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)

  const filteredCoupons = useMemo(() => {
    if (filter === 'all') return couponsData
    return couponsData.filter((coupon) => coupon.status === filter)
  }, [filter])

  const getStatusBadge = (status) => {
    const statusMap = {
      active: {
        label: 'Active',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
      },
      expired: {
        label: 'Expired',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle,
      },
      disabled: {
        label: 'Disabled',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        icon: XCircle,
      },
    }
    const statusInfo = statusMap[status] || statusMap.active
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

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date()
  }

  const handleCreate = () => {
    setEditingCoupon(null)
    setShowCreateModal(true)
  }

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon)
    setShowCreateModal(true)
  }

  const handleDelete = (couponId) => {
    // In real app, this would call an API
    toast.success('Coupon deleted successfully')
  }

  const handleToggleStatus = (couponId, currentStatus) => {
    // In real app, this would call an API
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active'
    toast.success(`Coupon status updated to ${newStatus}`)
  }

  const activeCount = couponsData.filter((c) => c.status === 'active').length
  const expiredCount = couponsData.filter((c) => c.status === 'expired').length
  const disabledCount = couponsData.filter((c) => c.status === 'disabled').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Coupons</p>
            <Ticket className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{couponsData.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-green-200 dark:border-green-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-red-200 dark:border-red-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Expired</p>
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{expiredCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Disabled</p>
            <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{disabledCount}</p>
        </div>
      </div>

      {/* Actions & Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Coupon
          </button>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['all', 'active', 'expired', 'disabled'].map((filterOption) => (
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

      {/* Coupons List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Ticket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Coupon & Discount Manager
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Coupon Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCoupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                        {coupon.code}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{coupon.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {coupon.discountType === 'percentage' ? (
                        <Percent className="w-4 h-4 text-gray-400" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : formatCurrency(coupon.discountValue)}
                      </span>
                    </div>
                    {coupon.minPurchase > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Min: {formatCurrency(coupon.minPurchase)}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {coupon.usedCount} / {coupon.usageLimit || '∞'}
                      </p>
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${
                              coupon.usageLimit
                                ? (coupon.usedCount / coupon.usageLimit) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                    {isExpired(coupon.expiryDate) && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">Expired</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(coupon.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(coupon.id, coupon.status)}
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
                      >
                        {coupon.status === 'active' ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No coupons found</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {editingCoupon
                ? 'Update coupon details below'
                : 'Fill in the details to create a new coupon'}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  defaultValue={editingCoupon?.code || ''}
                  placeholder="WELCOME20"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Discount Type
                </label>
                <select
                  defaultValue={editingCoupon?.discountType || 'percentage'}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Discount Value
                </label>
                <input
                  type="number"
                  defaultValue={editingCoupon?.discountValue || ''}
                  placeholder="20"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date
                </label>
                <input
                  type="datetime-local"
                  defaultValue={
                    editingCoupon
                      ? new Date(editingCoupon.expiryDate).toISOString().slice(0, 16)
                      : ''
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Usage Limit (leave empty for unlimited)
                </label>
                <input
                  type="number"
                  defaultValue={editingCoupon?.usageLimit || ''}
                  placeholder="1000"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingCoupon(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success(editingCoupon ? 'Coupon updated' : 'Coupon created')
                  setShowCreateModal(false)
                  setEditingCoupon(null)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingCoupon ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CouponManager

