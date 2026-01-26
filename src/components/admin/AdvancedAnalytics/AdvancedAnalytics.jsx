import React, { useState } from 'react'
import { BarChart3, Loader2 } from 'lucide-react'
import TopSellingProducts from './TopSellingProducts'
import LowPerformingProducts from './LowPerformingProducts'
import CustomerBehavior from './CustomerBehavior'
import SalesForecast from './SalesForecast'
import ProfitRevenueReport from './ProfitRevenueReport'

const AdvancedAnalytics = ({ formatCurrency, isLoading = false }) => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'top-selling', label: 'Top Selling', icon: BarChart3 },
    { id: 'low-performing', label: 'Low Performing', icon: BarChart3 },
    { id: 'customer-behavior', label: 'Customer Behavior', icon: BarChart3 },
    { id: 'forecast', label: 'Sales Forecast', icon: BarChart3 },
    { id: 'profit-revenue', label: 'Profit vs Revenue', icon: BarChart3 },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Analytics
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Smart insights and predictive analytics for data-driven decisions
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-2">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Overview - Show all sections in a grid */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopSellingProducts formatCurrency={formatCurrency} />
              <LowPerformingProducts formatCurrency={formatCurrency} />
            </div>
            <CustomerBehavior formatCurrency={formatCurrency} />
            <SalesForecast formatCurrency={formatCurrency} />
            <ProfitRevenueReport formatCurrency={formatCurrency} />
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

