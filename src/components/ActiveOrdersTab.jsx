'use client'
import { useState } from 'react'
import { Package, Calendar, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ActiveOrdersTab({ orders, setOrders }) {
  const [showRescheduleModal, setShowRescheduleModal] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  const activeOrders = orders.filter(order => 
    order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
  )

  const handleReschedule = (orderId) => {
    if (!rescheduleDate) {
      toast.error('Please select a date')
      return
    }
    // Update order with new date
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, expectedDeliveryDate: rescheduleDate }
        : order
    )
    setOrders(updatedOrders)
    toast.success('Delivery rescheduled successfully')
    setShowRescheduleModal(null)
    setRescheduleDate('')
  }

  const handleCancel = (orderId) => {
    if (!cancelReason) {
      toast.error('Please provide a cancellation reason')
      return
    }
    // Update order status
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'CANCELLED', cancelReason }
        : order
    )
    setOrders(updatedOrders)
    toast.success('Order cancelled successfully')
    setShowCancelModal(null)
    setCancelReason('')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Orders</h2>
      
      {activeOrders.length > 0 ? (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.orderItems.length} item(s)</p>
                    <p className="text-sm text-gray-600">Total: ${order.total.toFixed(2)}</p>
                  </div>
                </div>
                {order.expectedDeliveryDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Expected Delivery</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowRescheduleModal(order.id)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Reschedule Delivery
                </button>
                <button
                  onClick={() => setShowCancelModal(order.id)}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active orders</h3>
          <p className="text-gray-600">You don't have any active orders at the moment.</p>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reschedule Delivery</h3>
              <button
                onClick={() => {
                  setShowRescheduleModal(null)
                  setRescheduleDate('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Delivery Date
              </label>
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleReschedule(showRescheduleModal)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowRescheduleModal(null)
                  setRescheduleDate('')
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
              <button
                onClick={() => {
                  setShowCancelModal(null)
                  setCancelReason('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                placeholder="Please provide a reason for cancellation..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleCancel(showCancelModal)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Cancellation
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(null)
                  setCancelReason('')
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

