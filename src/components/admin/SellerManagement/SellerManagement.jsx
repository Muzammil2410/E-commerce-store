import React, { useState } from 'react'
import { Users, Award, Wallet, ShieldCheck, Package, Loader2 } from 'lucide-react'
import SellerPerformanceScore from './SellerPerformanceScore'
import SellerWallet from './SellerWallet'
import SellerVerification from './SellerVerification'
import LowStockAlerts from './LowStockAlerts'

const SellerManagement = ({ formatCurrency, isLoading = false }) => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'performance', label: 'Performance Score', icon: Award },
    { id: 'wallet', label: 'Wallet & Payouts', icon: Wallet },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'stock-alerts', label: 'Stock Alerts', icon: Package },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive seller monitoring, verification, and performance management
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
              <div className="lg:col-span-2">
                <SellerPerformanceScore />
              </div>
            </div>
            <SellerWallet formatCurrency={formatCurrency} />
            <SellerVerification />
            <LowStockAlerts />
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

