import React, { useState } from 'react'
import {
  ShoppingBag,
  Clock,
  CheckSquare,
  RotateCcw,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import OrderTimeline from './OrderTimeline'
import BulkActions from './BulkActions'
import ReturnsRefunds from './ReturnsRefunds'
import DelayedOrders from './DelayedOrders'

const OrdersOperations = ({ formatCurrency, isLoading = false }) => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: ShoppingBag, color: 'from-violet-500 to-purple-600' },
    { id: 'timeline', label: 'Order Timeline', icon: Clock, color: 'from-blue-500 to-indigo-600' },
    { id: 'bulk-actions', label: 'Bulk Actions', icon: CheckSquare, color: 'from-green-500 to-emerald-600' },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw, color: 'from-orange-500 to-amber-600' },
    { id: 'delayed', label: 'Delayed Orders', icon: AlertTriangle, color: 'from-red-500 to-rose-600' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading orders & operations data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-violet-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-violet-100 dark:border-violet-800/30 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              Orders & Operations
            </h2>
          </div>
          <p className="text-base text-gray-700 dark:text-gray-300 ml-14">
            Comprehensive order management, tracking, and exception handling
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
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
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg shadow-violet-500/30 scale-105`
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
        {/* Overview - Show all sections */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <DelayedOrders formatCurrency={formatCurrency} />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <OrderTimeline formatCurrency={formatCurrency} />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <BulkActions formatCurrency={formatCurrency} />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <ReturnsRefunds formatCurrency={formatCurrency} />
            </div>
          </div>
        )}

        {/* Individual Sections */}
        {activeSection === 'timeline' && <OrderTimeline formatCurrency={formatCurrency} />}
        {activeSection === 'bulk-actions' && <BulkActions formatCurrency={formatCurrency} />}
        {activeSection === 'returns' && <ReturnsRefunds formatCurrency={formatCurrency} />}
        {activeSection === 'delayed' && <DelayedOrders formatCurrency={formatCurrency} />}
      </div>
    </div>
  )
}

export default OrdersOperations

