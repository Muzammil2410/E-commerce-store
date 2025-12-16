'use client'
import { useState } from 'react'
import { ShoppingBag, Eye, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import Image from '@/components/Image'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function OrderHistoryTab({ orders }) {
  const { t } = useLanguageCurrency()
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">{t('orderHistory')}</h2>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm transition-colors"
          >
            <option value="all">{t('allTime')}</option>
            <option value="7days">{t('last7Days')}</option>
            <option value="30days">{t('last30Days')}</option>
            <option value="90days">{t('last90Days')}</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm transition-colors"
          >
            <option value="all">{t('allStatus')}</option>
            <option value="DELIVERED">{t('delivered')}</option>
            <option value="CANCELLED">{t('cancelOrder')}</option>
          </select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">{t('orderId')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">{t('product')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">{t('deliveryDate')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">{t('status')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                      #{order.id.slice(-8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      {order.orderItems[0]?.product?.images?.[0] && (
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden transition-colors duration-300">
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
                        <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                          {order.orderItems[0]?.product?.name || 'Product'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          {order.orderItems.length} {t('items')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
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
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    } transition-colors duration-300`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1 transition-colors duration-300">
                      <Eye size={16} />
                      <span>{t('viewDetails')}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t('noOrdersFound')}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
            {deliveredOrders.length === 0 
              ? t('noOrdersPlacedYet')
              : t('tryAdjustingFilters')
            }
          </p>
          {deliveredOrders.length === 0 && (
            <Link
              to="/shop"
              className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-block"
            >
              {t('startShopping')}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

