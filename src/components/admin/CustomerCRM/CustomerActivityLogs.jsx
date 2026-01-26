import React, { useState } from 'react'
import {
  Clock,
  ShoppingBag,
  LogIn,
  Eye,
  MessageSquare,
  Calendar,
  Filter,
} from 'lucide-react'
import { customerData } from './mockData'
import { activityLogsData } from './mockData'

const CustomerActivityLogs = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const getActivityIcon = (type) => {
    const icons = {
      purchase: ShoppingBag,
      login: LogIn,
      browse: Eye,
      support: MessageSquare,
    }
    return icons[type] || Clock
  }

  const getActivityColor = (type) => {
    const colors = {
      purchase: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      login: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      browse: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      support: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }

  const getActivityLabel = (type) => {
    const labels = {
      purchase: 'Purchase',
      login: 'Login',
      browse: 'Browse',
      support: 'Support',
    }
    return labels[type] || type
  }

  const customerActivities = selectedCustomer
    ? activityLogsData.find((log) => log.customerId === selectedCustomer.id)?.activities || []
    : []

  // Flatten all activities for overview
  const allActivities = activityLogsData.flatMap((log) =>
    log.activities.map((activity) => ({
      ...activity,
      customerId: log.customerId,
      customerName: customerData.find((c) => c.id === log.customerId)?.name || 'Unknown',
    }))
  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return (
    <div className="space-y-6">
      {/* Customer Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Customer:
          </span>
        </div>
        <select
          value={selectedCustomer?.id || ''}
          onChange={(e) => {
            const customer = customerData.find((c) => c.id === e.target.value)
            setSelectedCustomer(customer || null)
          }}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Customers (Recent Activity)</option>
          {customerData.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.email})
            </option>
          ))}
        </select>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedCustomer ? `${selectedCustomer.name}'s Activity Log` : 'Recent Activity Logs'}
          </h3>
        </div>

        {selectedCustomer ? (
          <div className="space-y-4">
            {customerActivities.length > 0 ? (
              customerActivities.map((activity, index) => {
                const Icon = getActivityIcon(activity.type)
                const isLast = index === customerActivities.length - 1

                return (
                  <div key={activity.id} className="flex items-start gap-4">
                    {/* Timeline Line & Icon */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {!isLast && (
                        <div className="w-0.5 flex-1 min-h-[60px] bg-gray-300 dark:bg-gray-600" />
                      )}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getActivityColor(
                              activity.type
                            )}`}
                          >
                            {getActivityLabel(activity.type)}
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {activity.action}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {activity.details}
                      </p>
                      {activity.metadata && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.type === 'purchase' && (
                            <span>Order: {activity.metadata.orderId} • Amount: ${activity.metadata.amount}</span>
                          )}
                          {activity.type === 'login' && (
                            <span>
                              Device: {activity.metadata.device} • Location: {activity.metadata.location}
                            </span>
                          )}
                          {activity.type === 'browse' && (
                            <span>
                              Category: {activity.metadata.category} • Viewed {activity.metadata.productsViewed}{' '}
                              products
                            </span>
                          )}
                          {activity.type === 'support' && (
                            <span>Ticket: {activity.metadata.ticketId}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No activity logs found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {allActivities.slice(0, 20).map((activity) => {
              const Icon = getActivityIcon(activity.type)

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(
                      activity.type
                    )}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {activity.customerName}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getActivityColor(
                            activity.type
                          )}`}
                        >
                          {getActivityLabel(activity.type)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerActivityLogs

