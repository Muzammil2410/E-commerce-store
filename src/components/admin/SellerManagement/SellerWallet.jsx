import React, { useState } from 'react'
import { Wallet, DollarSign, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { sellerWalletData } from './mockData'

const SellerWallet = ({ formatCurrency }) => {
  const [selectedSeller, setSelectedSeller] = useState(null)

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: Clock,
      },
      approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
      },
      rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle,
      },
    }
    const statusInfo = statusMap[status] || statusMap.pending
    const Icon = statusInfo.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        <Icon className="w-3 h-3" />
        {statusInfo.label}
      </span>
    )
  }

  const totalPendingPayouts = sellerWalletData.reduce(
    (sum, seller) => sum + seller.wallet.pendingPayouts,
    0
  )
  const totalCompletedPayouts = sellerWalletData.reduce(
    (sum, seller) => sum + seller.wallet.completedPayouts,
    0
  )
  const totalEarnings = sellerWalletData.reduce(
    (sum, seller) => sum + seller.wallet.totalEarnings,
    0
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalEarnings)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Across all sellers</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payouts</p>
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalPendingPayouts)}
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">Awaiting approval</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed Payouts</p>
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalCompletedPayouts)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Successfully processed</p>
        </div>
      </div>

      {/* Seller Wallet Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Seller Wallet Overview
          </h3>
        </div>

        <div className="space-y-4">
          {sellerWalletData.map((seller) => (
            <div
              key={seller.sellerId}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {seller.businessName}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">ID: {seller.sellerId}</p>
                </div>
                <button
                  onClick={() =>
                    setSelectedSeller(selectedSeller === seller.sellerId ? null : seller.sellerId)
                  }
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {selectedSeller === seller.sellerId ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Earnings</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(seller.wallet.totalEarnings)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Available Balance</p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(seller.wallet.availableBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pending Payouts</p>
                  <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                    {formatCurrency(seller.wallet.pendingPayouts)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Completed</p>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(seller.wallet.completedPayouts)}
                  </p>
                </div>
              </div>

              {/* Withdraw Requests */}
              {selectedSeller === seller.sellerId && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Withdraw Requests
                  </h5>
                  {seller.withdrawRequests.length > 0 ? (
                    <div className="space-y-2">
                      {seller.withdrawRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(request.amount)}
                              </span>
                              {getStatusBadge(request.status)}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
                              {request.processedDate && (
                                <span>
                                  Processed: {new Date(request.processedDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {request.reason && (
                              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Reason: {request.reason}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                      No withdraw requests
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Admin View Only
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              This is a read-only view of seller wallets and payout requests. Actual transactions
              are processed through the payment gateway integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerWallet

