import React, { useState } from 'react'
import { Clock, CheckCircle2, Package, Truck, Home, Calendar } from 'lucide-react'
import { orderTimelineData } from './mockData'

const OrderTimeline = ({ formatCurrency }) => {
  const [expandedOrder, setExpandedOrder] = useState(null)

  const getStageIcon = (stage) => {
    const icons = {
      placed: Clock,
      packed: Package,
      shipped: Truck,
      delivered: Home,
    }
    return icons[stage] || Clock
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (completed, isActive) => {
    if (completed) return 'bg-green-500 dark:bg-green-600'
    if (isActive) return 'bg-blue-500 dark:bg-blue-600'
    return 'bg-gray-300 dark:bg-gray-600'
  }

  const getStatusTextColor = (completed, isActive) => {
    if (completed) return 'text-green-600 dark:text-green-400'
    if (isActive) return 'text-blue-600 dark:text-blue-400'
    return 'text-gray-400 dark:text-gray-500'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Timeline & Status Flow</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Track order progress through each stage with detailed timestamps
      </p>

      <div className="space-y-4">
        {orderTimelineData.map((order) => {
          const isExpanded = expandedOrder === order.id

          return (
            <div
              key={order.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{order.orderId}</h4>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Buyer: {order.buyer}</span>
                    <span>•</span>
                    <span>{order.items} items</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {isExpanded ? 'Hide Timeline' : 'View Timeline'}
                </button>
              </div>

              {/* Compact Timeline View */}
              {!isExpanded && (
                <div className="flex items-center gap-2">
                  {order.timeline.map((step, index) => {
                    const Icon = getStageIcon(step.stage)
                    const isActive = step.completed && index === order.currentStage
                    const isCompleted = step.completed

                    return (
                      <React.Fragment key={step.stage}>
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                              isCompleted,
                              isActive
                            )} transition-colors`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : (
                              <Icon className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium ${getStatusTextColor(isCompleted, isActive)}`}
                          >
                            {step.label}
                          </span>
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                          />
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              )}

              {/* Expanded Timeline View */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    {order.timeline.map((step, index) => {
                      const Icon = getStageIcon(step.stage)
                      const isActive = step.completed && index === order.currentStage
                      const isCompleted = step.completed
                      const isLast = index === order.timeline.length - 1

                      return (
                        <div key={step.stage} className="flex items-start gap-4">
                          {/* Timeline Line & Icon */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(
                                isCompleted,
                                isActive
                              )} transition-colors`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              ) : (
                                <Icon className="w-5 h-5 text-white" />
                              )}
                            </div>
                            {!isLast && (
                              <div
                                className={`w-0.5 flex-1 min-h-[60px] ${
                                  isCompleted
                                    ? 'bg-green-500 dark:bg-green-600'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              />
                            )}
                          </div>

                          {/* Timeline Content */}
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between mb-1">
                              <h5
                                className={`font-semibold ${getStatusTextColor(isCompleted, isActive)}`}
                              >
                                {step.label}
                              </h5>
                              {step.completed && step.timestamp && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatTimestamp(step.timestamp)}
                                </span>
                              )}
                            </div>
                            {!step.completed && step.expectedDate && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Expected: {formatTimestamp(step.expectedDate)}
                              </p>
                            )}
                            {step.completed && step.timestamp && (
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                Completed successfully
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {orderTimelineData.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No orders found</p>
        </div>
      )}
    </div>
  )
}

export default OrderTimeline

