import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts'
import { DollarSign, TrendingUp } from 'lucide-react'
import { profitRevenueData } from './mockData'

const ProfitRevenueReport = ({ formatCurrency }) => {
  const totalRevenue = profitRevenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalProfit = profitRevenueData.reduce((sum, item) => sum + item.profit, 0)
  const averageMargin = (totalProfit / totalRevenue) * 100

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
            Revenue: {formatCurrency(data.revenue)}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mb-1">
            Profit: {formatCurrency(data.profit)}
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            Margin: {data.margin.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          Profit vs Revenue Report
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Monthly comparison of revenue and profit with margin analysis
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Total Revenue
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 12 months</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Total Profit
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalProfit)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 12 months</p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Average Margin
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {averageMargin.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Profit margin</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={profitRevenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: '#6b7280' }}
              iconType="rect"
            />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              fill="#3b82f6"
              name="Revenue"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="profit"
              fill="#10b981"
              name="Profit"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="margin"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 4 }}
              name="Margin %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Month
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Revenue
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Profit
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Margin
              </th>
            </tr>
          </thead>
          <tbody>
            {profitRevenueData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{item.month}</td>
                <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                  {formatCurrency(item.revenue)}
                </td>
                <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-semibold">
                  {formatCurrency(item.profit)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                    {item.margin.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProfitRevenueReport

