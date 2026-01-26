import React, { useState } from 'react'
import {
  Users,
  Gift,
  TrendingUp,
  DollarSign,
  Award,
  Settings,
  Eye,
  CheckCircle2,
} from 'lucide-react'
import { referralData } from './mockData'
import toast from 'react-hot-toast'

const ReferralSystem = ({ formatCurrency }) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const getStatusBadge = (status) => {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        <CheckCircle2 className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const handleViewDetails = (referrer) => {
    // In real app, this would open a detailed view
    toast.success(`Viewing details for ${referrer.customerName}`)
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Referrals</p>
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {referralData.overview.totalReferrals}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-blue-200 dark:border-blue-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Referrers</p>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {referralData.overview.activeReferrers}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-green-200 dark:border-green-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Rewards Paid</p>
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(referralData.overview.totalRewardsPaid)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-yellow-200 dark:border-yellow-800/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Rewards</p>
            <Gift className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {formatCurrency(referralData.overview.pendingRewards)}
          </p>
        </div>
      </div>

      {/* Settings & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Referral Settings
              </h3>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Referrer Reward
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(referralData.settings.referralReward)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Referred Reward
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(referralData.settings.referredReward)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Min Purchase
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(referralData.settings.minPurchaseForReward)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Reward Type</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                  {referralData.settings.rewardType}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Conversion Rate
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {referralData.overview.conversionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Referrers List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Referrers
              </h3>
            </div>

            <div className="space-y-4">
              {referralData.referrers.map((referrer) => (
                <div
                  key={referrer.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {referrer.customerName}
                        </h4>
                        {getStatusBadge(referrer.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>{referrer.customerEmail}</span>
                        <span>•</span>
                        <span className="font-mono text-blue-600 dark:text-blue-400">
                          Code: {referrer.referralCode}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(referrer)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Total Referrals
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {referrer.totalReferrals}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Successful
                      </p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {referrer.successfulReferrals}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Total Earned
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(referrer.totalEarned)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Pending
                      </p>
                      <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {formatCurrency(referrer.pendingEarnings)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Success Rate
                      </span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {((referrer.successfulReferrals / referrer.totalReferrals) * 100).toFixed(
                          1
                        )}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{
                          width: `${(referrer.successfulReferrals / referrer.totalReferrals) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Referral System Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Referrer Reward Amount
                </label>
                <input
                  type="number"
                  defaultValue={referralData.settings.referralReward}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Referred Customer Reward Amount
                </label>
                <input
                  type="number"
                  defaultValue={referralData.settings.referredReward}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Purchase for Reward
                </label>
                <input
                  type="number"
                  defaultValue={referralData.settings.minPurchaseForReward}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reward Type
                </label>
                <select
                  defaultValue={referralData.settings.rewardType}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="credit">Store Credit</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Settings updated')
                  setShowSettingsModal(false)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReferralSystem

