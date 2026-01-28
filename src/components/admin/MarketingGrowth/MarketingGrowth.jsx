import React, { useState } from 'react'
import {
  TrendingUp,
  Ticket,
  Zap,
  Bell,
  Users,
  Loader2,
} from 'lucide-react'
import CouponManager from './CouponManager'
import FlashSales from './FlashSales'
import Notifications from './Notifications'
import ReferralSystem from './ReferralSystem'

const MarketingGrowth = ({ formatCurrency, isLoading = false }) => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: TrendingUp, color: 'from-orange-500 to-red-600' },
    { id: 'coupons', label: 'Coupons', icon: Ticket, color: 'from-yellow-500 to-amber-600' },
    { id: 'flash-sales', label: 'Flash Sales', icon: Zap, color: 'from-cyan-500 to-blue-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-purple-500 to-indigo-600' },
    { id: 'referrals', label: 'Referrals', icon: Users, color: 'from-green-500 to-emerald-600' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading marketing & growth data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-amber-900/20 rounded-2xl p-8 border border-orange-100 dark:border-orange-800/30 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              Marketing & Growth
            </h2>
          </div>
          <p className="text-base text-gray-700 dark:text-gray-300 ml-14">
            Campaign management, promotions, and growth tools
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl"></div>
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
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg shadow-orange-500/30 scale-105`
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
              <CouponManager formatCurrency={formatCurrency} />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <FlashSales formatCurrency={formatCurrency} />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <Notifications />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <ReferralSystem formatCurrency={formatCurrency} />
            </div>
          </div>
        )}

        {/* Individual Sections */}
        {activeSection === 'coupons' && <CouponManager formatCurrency={formatCurrency} />}
        {activeSection === 'flash-sales' && <FlashSales formatCurrency={formatCurrency} />}
        {activeSection === 'notifications' && <Notifications />}
        {activeSection === 'referrals' && <ReferralSystem formatCurrency={formatCurrency} />}
      </div>
    </div>
  )
}

export default MarketingGrowth

