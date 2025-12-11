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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Active Orders</h2>
      
      {activeOrders.length > 0 ? (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  order.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                } transition-colors duration-300`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{order.orderItems.length} item(s)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Total: ${order.total.toFixed(2)}</p>
                  </div>
                </div>
                {order.expectedDeliveryDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">Expected Delivery</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowRescheduleModal(order.id)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Reschedule Delivery
                </button>
                <button
                  onClick={() => setShowCancelModal(order.id)}
                  className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">No active orders</h3>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">You don't have any active orders at the moment.</p>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-colors duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">Reschedule Delivery</h3>
              <button
                onClick={() => {
                  setShowRescheduleModal(null)
                  setRescheduleDate('')
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Select New Delivery Date
              </label>
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleReschedule(showRescheduleModal)}
                className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowRescheduleModal(null)
                  setRescheduleDate('')
                }}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-colors duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">Cancel Order</h3>
              <button
                onClick={() => {
                  setShowCancelModal(null)
                  setCancelReason('')
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Reason for Cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                placeholder="Please provide a reason for cancellation..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleCancel(showCancelModal)}
                className="flex-1 bg-red-600 dark:bg-red-500 text-white py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
              >
                Confirm Cancellation
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(null)
                  setCancelReason('')
                }}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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

