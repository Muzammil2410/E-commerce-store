'use client'
import { useState, useEffect } from 'react'
import { Calculator, DollarSign, Truck, Percent } from 'lucide-react'

const FeeBreakdown = ({ sellingPrice, deliveryOption = 'self-delivery' }) => {
  const [fees, setFees] = useState({
    platformFee: 0,
    deliveryFee: 0,
    totalFees: 0,
    netEarnings: 0
  })

  // Fee configuration
  const PLATFORM_FEE_PERCENTAGE = 10 // 10% platform fee
  const DELIVERY_FEE_FIXED = 2.50 // $2.50 fixed delivery fee for platform delivery

  useEffect(() => {
    if (sellingPrice && sellingPrice > 0) {
      const price = parseFloat(sellingPrice)
      
      // Calculate platform fee (percentage-based)
      const platformFee = (price * PLATFORM_FEE_PERCENTAGE) / 100
      
      // Calculate delivery fee (only if platform delivery is chosen)
      const deliveryFee = deliveryOption === 'platform-delivery' ? DELIVERY_FEE_FIXED : 0
      
      // Calculate total fees
      const totalFees = platformFee + deliveryFee
      
      // Calculate net earnings
      const netEarnings = price - totalFees
      
      setFees({
        platformFee: platformFee.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        totalFees: totalFees.toFixed(2),
        netEarnings: netEarnings.toFixed(2)
      })
    } else {
      setFees({
        platformFee: '0.00',
        deliveryFee: '0.00',
        totalFees: '0.00',
        netEarnings: '0.00'
      })
    }
  }, [sellingPrice, deliveryOption])

  if (!sellingPrice || sellingPrice <= 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">
          <Calculator className="w-4 h-4" />
          <span className="text-sm font-medium">Fee Breakdown</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Enter a selling price to see fee breakdown</p>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400 mb-4 transition-colors duration-200">
        <Calculator className="w-5 h-5" />
        <span className="font-semibold">Fee Breakdown</span>
      </div>
      
      <div className="space-y-3">
        {/* Selling Price */}
        <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-colors duration-200" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Selling Price</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">${parseFloat(sellingPrice).toFixed(2)}</span>
        </div>

        {/* Platform Fee */}
        <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center space-x-2">
            <Percent className="w-4 h-4 text-orange-600 dark:text-orange-500 transition-colors duration-200" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Platform Fee ({PLATFORM_FEE_PERCENTAGE}%)</span>
          </div>
          <span className="font-medium text-orange-600 dark:text-orange-500 transition-colors duration-200">-${fees.platformFee}</span>
        </div>

        {/* Delivery Fee */}
        {deliveryOption === 'platform-delivery' && (
          <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-purple-600 dark:text-purple-500 transition-colors duration-200" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Delivery Fee</span>
            </div>
            <span className="font-medium text-purple-600 dark:text-purple-500 transition-colors duration-200">-${fees.deliveryFee}</span>
          </div>
        )}

        {/* Total Fees */}
        <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-gray-700 transition-colors duration-200">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Total Fees</span>
          <span className="font-semibold text-red-600 dark:text-red-500 transition-colors duration-200">-${fees.totalFees}</span>
        </div>

        {/* Net Earnings */}
        <div className="flex justify-between items-center py-2 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 transition-colors duration-200">
          <span className="text-sm font-semibold text-green-800 dark:text-green-300 transition-colors duration-200">Your Net Earnings</span>
          <span className="text-lg font-bold text-green-700 dark:text-green-400 transition-colors duration-200">${fees.netEarnings}</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg transition-colors duration-200">
        <div className="text-xs text-blue-800 dark:text-blue-300 transition-colors duration-200">
          <p className="font-medium mb-1">Fee Information:</p>
          <ul className="space-y-1 text-xs">
            <li>• Platform fee: {PLATFORM_FEE_PERCENTAGE}% of selling price</li>
            {deliveryOption === 'platform-delivery' && (
              <li>• Delivery fee: ${DELIVERY_FEE_FIXED} per order (platform delivery)</li>
            )}
            {deliveryOption === 'self-delivery' && (
              <li>• No delivery fee (self-delivery)</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FeeBreakdown
