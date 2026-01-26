import React, { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'
import { salesForecastData } from './mockData'

const SalesForecast = ({ formatCurrency }) => {
  const [forecastPeriod, setForecastPeriod] = useState('30days')

  const data = salesForecastData[forecastPeriod] || []
  const formattedData = data.map((item) => ({
    ...item,
    dateFormatted: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            Sales Forecasting
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            AI-powered sales predictions with confidence intervals
          </p>
        </div>

        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { key: '30days', label: '30 Days' },
            { key: '60days', label: '60 Days' },
            { key: '90days', label: '90 Days' },
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setForecastPeriod(period.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                forecastPeriod === period.key
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="dateFormatted"
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: '#6b7280' }}
              iconType="line"
            />
            {/* Confidence Range */}
            <Area
              type="monotone"
              dataKey="upperBound"
              stroke="#10b981"
              strokeWidth={1}
              strokeDasharray="5 5"
              fill="url(#colorConfidence)"
              fillOpacity={0.1}
              name="Upper Bound"
            />
            <Area
              type="monotone"
              dataKey="lowerBound"
              stroke="#10b981"
              strokeWidth={1}
              strokeDasharray="5 5"
              fill="url(#colorConfidence)"
              fillOpacity={0.1}
              name="Lower Bound"
            />
            {/* Forecast Line */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Forecast"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Forecast Period
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {forecastPeriod === '30days'
              ? '30 Days'
              : forecastPeriod === '60days'
              ? '60 Days'
              : '90 Days'}
          </p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Projected Revenue
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(data[data.length - 1]?.forecast || 0)}
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Confidence Range
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {formatCurrency(data[data.length - 1]?.lowerBound || 0)} -{' '}
            {formatCurrency(data[data.length - 1]?.upperBound || 0)}
          </p>
        </div>
      </div>

      {/* Note */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Note:</strong> Forecasts are based on historical data patterns and machine learning
          models. Actual results may vary. The shaded area represents the confidence interval (80%
          confidence level).
        </p>
      </div>
    </div>
  )
}

export default SalesForecast

