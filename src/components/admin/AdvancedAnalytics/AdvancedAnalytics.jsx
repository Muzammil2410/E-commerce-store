import React, { useState } from 'react'
import { BarChart3, Loader2, TrendingUp } from 'lucide-react'
import TopSellingProducts from './TopSellingProducts'
import LowPerformingProducts from './LowPerformingProducts'
import CustomerBehavior from './CustomerBehavior'
import SalesForecast from './SalesForecast'
import ProfitRevenueReport from './ProfitRevenueReport'

const AdvancedAnalytics = ({ formatCurrency, isLoading = false }) => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-500 to-indigo-600' },
    { id: 'top-selling', label: 'Top Selling', icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
    { id: 'low-performing', label: 'Low Performing', icon: BarChart3, color: 'from-orange-500 to-red-600' },
    { id: 'customer-behavior', label: 'Customer Behavior', icon: BarChart3, color: 'from-purple-500 to-pink-600' },
    { id: 'forecast', label: 'Sales Forecast', icon: BarChart3, color: 'from-cyan-500 to-blue-600' },
    { id: 'profit-revenue', label: 'Profit vs Revenue', icon: BarChart3, color: 'from-teal-500 to-green-600' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading advanced analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/30 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Advanced Analytics
            </h2>
          </div>
          <p className="text-base text-gray-700 dark:text-gray-300 ml-14">
            Smart insights and predictive analytics for data-driven decisions
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg shadow-blue-500/30 scale-105`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>{section.label}</span>
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-white/20 blur-sm"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Overview - Show all sections in a grid */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <TopSellingProducts formatCurrency={formatCurrency} />
              </div>
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <LowPerformingProducts formatCurrency={formatCurrency} />
              </div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <CustomerBehavior formatCurrency={formatCurrency} />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <SalesForecast formatCurrency={formatCurrency} />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <ProfitRevenueReport formatCurrency={formatCurrency} />
            </div>
          </div>
        )}

        {/* Individual Sections */}
        {activeSection === 'top-selling' && (
          <TopSellingProducts formatCurrency={formatCurrency} />
        )}

        {activeSection === 'low-performing' && (
          <LowPerformingProducts formatCurrency={formatCurrency} />
        )}

        {activeSection === 'customer-behavior' && (
          <CustomerBehavior formatCurrency={formatCurrency} />
        )}

        {activeSection === 'forecast' && (
          <SalesForecast formatCurrency={formatCurrency} />
        )}

        {activeSection === 'profit-revenue' && (
          <ProfitRevenueReport formatCurrency={formatCurrency} />
        )}
      </div>
    </div>
  )
}

export default AdvancedAnalytics

