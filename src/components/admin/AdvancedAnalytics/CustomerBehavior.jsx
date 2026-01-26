import React from 'react'
import { Users, ShoppingCart, TrendingUp, TrendingDown, DollarSign, UserPlus } from 'lucide-react'
import { customerBehaviorData } from './mockData'

const CustomerBehavior = ({ formatCurrency }) => {
  const metrics = [
    {
      label: 'Repeat Buyers',
      value: customerBehaviorData.repeatBuyers.count,
      subtitle: `${customerBehaviorData.repeatBuyers.percentage}% of total customers`,
      icon: Users,
      color: 'blue',
      trend: customerBehaviorData.repeatBuyers.trend,
      change: customerBehaviorData.repeatBuyers.change,
      previous: customerBehaviorData.repeatBuyers.previousPeriod,
    },
    {
      label: 'Average Order Value',
      value: formatCurrency(customerBehaviorData.averageOrderValue.value),
      subtitle: 'Per transaction',
      icon: DollarSign,
      color: 'green',
      trend: customerBehaviorData.averageOrderValue.trend,
      change: customerBehaviorData.averageOrderValue.change,
      previous: formatCurrency(customerBehaviorData.averageOrderValue.previousPeriod),
    },
    {
      label: 'Cart Abandonment Rate',
      value: `${customerBehaviorData.cartAbandonmentRate.rate}%`,
      subtitle: 'Lower is better',
      icon: ShoppingCart,
      color: 'orange',
      trend: customerBehaviorData.cartAbandonmentRate.trend,
      change: customerBehaviorData.cartAbandonmentRate.change,
      previous: `${customerBehaviorData.cartAbandonmentRate.previousPeriod}%`,
    },
    {
      label: 'New Customers',
      value: customerBehaviorData.newCustomers.count,
      subtitle: `${customerBehaviorData.newCustomers.percentage}% of total`,
      icon: UserPlus,
      color: 'purple',
      trend: customerBehaviorData.newCustomers.trend,
      change: customerBehaviorData.newCustomers.change,
      previous: customerBehaviorData.newCustomers.previousPeriod,
    },
    {
      label: 'Customer Lifetime Value',
      value: formatCurrency(customerBehaviorData.customerLifetimeValue.value),
      subtitle: 'Average per customer',
      icon: TrendingUp,
      color: 'indigo',
      trend: customerBehaviorData.customerLifetimeValue.trend,
      change: customerBehaviorData.customerLifetimeValue.change,
      previous: formatCurrency(customerBehaviorData.customerLifetimeValue.previousPeriod),
    },
  ]

  const getColorClasses = (color, trend) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        icon: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        icon: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
      },
      orange: {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        icon: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        icon: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
      },
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        icon: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800',
      },
    }

    return colorMap[color] || colorMap.blue
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Customer Behavior Analytics
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Key metrics and insights about customer purchasing patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const colors = getColorClasses(metric.color, metric.trend)
          const Icon = metric.icon
          const isPositive = metric.trend === 'up'
          const isNegative = metric.trend === 'down'
          // For cart abandonment, decrease is good, so show as positive
          const isGoodChange = metric.label === 'Cart Abandonment Rate' ? isNegative : isPositive
          const displayChange = isGoodChange ? Math.abs(metric.change) : Math.abs(metric.change)

          return (
            <div
              key={index}
              className={`${colors.bg} ${colors.border} border rounded-lg p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                {isGoodChange && (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-semibold">+{displayChange.toFixed(1)}%</span>
                  </div>
                )}
                {!isGoodChange && (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-xs font-semibold">-{displayChange.toFixed(1)}%</span>
                  </div>
                )}
              </div>

              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {metric.label}
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{metric.subtitle}</p>

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Previous Period</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {metric.previous}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Insights Section */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Insights</h4>
        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <li>• Repeat buyer rate increased by {customerBehaviorData.repeatBuyers.change.toFixed(1)}%, indicating strong customer loyalty</li>
          <li>• Cart abandonment decreased by {Math.abs(customerBehaviorData.cartAbandonmentRate.change).toFixed(1)}%, showing improved checkout experience</li>
          <li>• Average order value grew by {customerBehaviorData.averageOrderValue.change.toFixed(1)}%, suggesting effective upselling strategies</li>
        </ul>
      </div>
    </div>
  )
}

export default CustomerBehavior

