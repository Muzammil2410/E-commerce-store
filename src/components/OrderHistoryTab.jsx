'use client'
import { useState } from 'react'
import { ShoppingBag, Eye, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import Image from '@/components/Image'

export default function OrderHistoryTab({ orders }) {
  const [dateRange, setDateRange] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const deliveredOrders = orders.filter(order => order.status === 'DELIVERED')

  const filteredOrders = deliveredOrders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    if (!matchesStatus) return false

    if (dateRange === 'all') return true
    
    const orderDate = new Date(order.createdAt)
    const now = new Date()
    const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24))

    switch (dateRange) {
      case '7days':
        return daysDiff <= 7
      case '30days':
        return daysDiff <= 30
      case '90days':
        return daysDiff <= 90
      default:
        return true
    }
  })

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id.slice(-8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      {order.orderItems[0]?.product?.images?.[0] && (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={order.orderItems[0].product.images[0]}
                            alt={order.orderItems[0].product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.orderItems[0]?.product?.name || 'Product'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>
                        {order.updatedAt 
                          ? new Date(order.updatedAt).toLocaleDateString()
                          : new Date(order.createdAt).toLocaleDateString()
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'DELIVERED' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                      <Eye size={16} />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-4">
            {deliveredOrders.length === 0 
              ? "You haven't placed any orders yet."
              : "Try adjusting your filters."
            }
          </p>
          {deliveredOrders.length === 0 && (
            <Link
              to="/shop"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

