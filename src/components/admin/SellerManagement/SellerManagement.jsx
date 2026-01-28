import React, { useState } from 'react'
import { Users, Award, Wallet, ShieldCheck, Package, Loader2, Store } from 'lucide-react'
import SellerPerformanceScore from './SellerPerformanceScore'
import SellerWallet from './SellerWallet'
import SellerVerification from './SellerVerification'
import LowStockAlerts from './LowStockAlerts'

const SellerManagement = ({ formatCurrency, isLoading = false }) => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: Users, color: 'from-emerald-500 to-teal-600' },
    { id: 'performance', label: 'Performance Score', icon: Award, color: 'from-amber-500 to-orange-600' },
    { id: 'wallet', label: 'Wallet & Payouts', icon: Wallet, color: 'from-green-500 to-emerald-600' },
    { id: 'verification', label: 'Verification', icon: ShieldCheck, color: 'from-blue-500 to-cyan-600' },
    { id: 'stock-alerts', label: 'Stock Alerts', icon: Package, color: 'from-red-500 to-pink-600' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading seller management data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-emerald-100 dark:border-emerald-800/30 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Seller Management
            </h2>
          </div>
          <p className="text-base text-gray-700 dark:text-gray-300 ml-14">
            Comprehensive seller monitoring, verification, and performance management
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
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
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg shadow-emerald-500/30 scale-105`
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
              <div className="lg:col-span-2 transform transition-all duration-300 hover:scale-[1.01]">
                <SellerPerformanceScore />
              </div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <SellerWallet formatCurrency={formatCurrency} />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <SellerVerification />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <LowStockAlerts />
            </div>
          </div>
        )}

        {/* Individual Sections */}
        {activeSection === 'performance' && <SellerPerformanceScore />}
        {activeSection === 'wallet' && <SellerWallet formatCurrency={formatCurrency} />}
        {activeSection === 'verification' && <SellerVerification />}
        {activeSection === 'stock-alerts' && <LowStockAlerts />}
      </div>
    </div>
  )
}

export default SellerManagement

