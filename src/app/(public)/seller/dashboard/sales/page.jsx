'use client'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  TrendingDown,
  ArrowLeft,
  Calendar,
  Filter,
  Download,
  Eye,
  BarChart3,
  PieChart,
  Receipt
} from 'lucide-react'
import { orderDummyData } from '@/assets/assets'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function SalesDashboard() {
  const navigate = useNavigate()
  const { t, formatCurrency, translateProductName } = useLanguageCurrency()
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProductsSold: 0,
    totalProfit: 0,
    totalFees: 0,
    platformFees: 0,
    deliveryFees: 0,
    averageOrderValue: 0,
    topSellingProducts: [],
    recentOrders: [],
    monthlyRevenue: [],
    feeBreakdown: []
  })
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  // Fee configuration
  const PLATFORM_FEE_PERCENTAGE = 10
  const DELIVERY_FEE_FIXED = 2.50

  useEffect(() => {
    calculateSalesData()
  }, [timeRange])

  const calculateSalesData = () => {
    setLoading(true)
    
    // Get seller's delivery option
    const sellerProfile = JSON.parse(localStorage.getItem('sellerProfile') || '{}')
    const deliveryOption = sellerProfile.deliveryOption || 'self-delivery'
    
    // Start with empty orders array (no sales data initially)
    const orders = []

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const totalProductsSold = orders.reduce((sum, order) => 
      sum + order.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    )

    // Calculate fees
    const platformFees = orders.reduce((sum, order) => {
      return sum + (order.total * PLATFORM_FEE_PERCENTAGE / 100)
    }, 0)

    const deliveryFees = deliveryOption === 'platform-delivery' 
      ? orders.length * DELIVERY_FEE_FIXED 
      : 0

    const totalFees = platformFees + deliveryFees
    const totalProfit = totalRevenue - totalFees
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Get top selling products
    const productSales = {}
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const productId = item.productId
        if (productSales[productId]) {
          productSales[productId].quantity += item.quantity
          productSales[productId].revenue += item.price * item.quantity
        } else {
          productSales[productId] = {
            product: item.product,
            quantity: item.quantity,
            revenue: item.price * item.quantity
          }
        }
      })
    })

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    // Get recent orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)

    // Generate monthly revenue data (last 6 months)
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      const monthRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt)
          return orderDate.getMonth() === date.getMonth() && 
                 orderDate.getFullYear() === date.getFullYear()
        })
        .reduce((sum, order) => sum + order.total, 0)
      
      monthlyRevenue.push({
        month: monthName,
        revenue: monthRevenue
      })
    }

    // Fee breakdown
    const feeBreakdown = [
      {
        type: 'Platform Fees',
        amount: platformFees,
        percentage: totalRevenue > 0 ? (platformFees / totalRevenue * 100) : 0,
        description: `${PLATFORM_FEE_PERCENTAGE}% of total sales`
      },
      {
        type: 'Delivery Fees',
        amount: deliveryFees,
        percentage: totalRevenue > 0 ? (deliveryFees / totalRevenue * 100) : 0,
        description: deliveryOption === 'platform-delivery' 
          ? `$${DELIVERY_FEE_FIXED} per order` 
          : 'Self-delivery (no fees)'
      }
    ]

    setSalesData({
      totalRevenue,
      totalOrders,
      totalProductsSold,
      totalProfit,
      totalFees,
      platformFees,
      deliveryFees,
      averageOrderValue,
      topSellingProducts,
      recentOrders,
      monthlyRevenue,
      feeBreakdown
    })
    
    setLoading(false)
  }

  // formatCurrency is now from context

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
      case 'CANCELLED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 transition-colors duration-300"></div>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('loadingSalesData')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{t('salesDashboard')}</h1>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('trackSalesPerformance')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              >
                <option value="7d">{t('last7Days')}</option>
                <option value="30d">{t('last30Days')}</option>
                <option value="90d">{t('last90Days')}</option>
                <option value="all">{t('allTime')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
        {/* No Data Message */}
        {salesData.totalOrders === 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-7 md:mb-8 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 transition-colors duration-300">{t('welcomeToSalesDashboard')}</h3>
                <p className="text-blue-700 dark:text-blue-300 transition-colors duration-300">
                  {t('onceYouStartReceivingOrders')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-6 sm:mb-7 md:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('totalRevenue')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{formatCurrency(salesData.totalRevenue)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1 transition-colors duration-300">
                  <TrendingUp size={14} className="mr-1" />
                  {t('noDataAvailable')}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 transition-colors duration-300">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 transition-colors duration-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('totalOrders')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{salesData.totalOrders}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1 transition-colors duration-300">
                  <TrendingUp size={14} className="mr-1" />
                  {t('noDataAvailable')}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 transition-colors duration-300">
                <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('productsSold')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{salesData.totalProductsSold}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1 transition-colors duration-300">
                  <TrendingUp size={14} className="mr-1" />
                  {t('noDataAvailable')}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 transition-colors duration-300">
                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('netProfit')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{formatCurrency(salesData.totalProfit)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1 transition-colors duration-300">
                  <TrendingUp size={14} className="mr-1" />
                  {t('noDataAvailable')}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 transition-colors duration-300">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400 transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fee Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                <PieChart className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                {t('feeBreakdown')}
              </h3>
              
              <div className="space-y-4">
                {salesData.feeBreakdown.map((fee, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{fee.type}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{fee.description}</p>
                      </div>
                      <span className="text-lg font-bold text-red-600 dark:text-red-400 transition-colors duration-300">
                        -{formatCurrency(fee.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors duration-300">
                      <div 
                        className="bg-red-500 dark:bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(fee.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                      {fee.percentage.toFixed(1)}% {t('ofTotalRevenue')}
                    </p>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{t('totalFees')}</span>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400 transition-colors duration-300">
                      -{formatCurrency(salesData.totalFees)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Products & Recent Orders */}
          <div className="lg:col-span-2 space-y-8">
            {/* Top Selling Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600 dark:text-green-400 transition-colors duration-300" />
                {t('topSellingProducts')}
              </h3>
              
              {salesData.topSellingProducts.length > 0 ? (
                <div className="space-y-4">
                  {salesData.topSellingProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300">
                          <Package className="w-6 h-6 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{translateProductName(product.product.name)}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{product.product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{product.quantity} {t('sold')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
                  <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('noSalesDataAvailable')}</p>
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                <Receipt className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
                {t('recentOrders')}
              </h3>
              
              {salesData.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {salesData.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300">
                          <Receipt className="w-6 h-6 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('order')} #{order.id.slice(-8)}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                            {order.orderItems.length} {order.orderItems.length === 1 ? t('item') : t('items')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{formatCurrency(order.total)}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
                  <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('noOrdersFoundForPeriod')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('averageOrderValue')}</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">{formatCurrency(salesData.averageOrderValue)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">{t('perOrder')}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('platformFees')}</h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 transition-colors duration-300">-{formatCurrency(salesData.platformFees)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">{PLATFORM_FEE_PERCENTAGE}% {t('ofTotalSales')}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('deliveryFees')}</h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-300">-{formatCurrency(salesData.deliveryFees)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
              {salesData.deliveryFees > 0 ? `$${DELIVERY_FEE_FIXED} ${t('perOrder')}` : t('selfDeliveryNoFees')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
