'use client'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from "@/lib/features/cart/cartSlice"
import { Package, Users, TrendingUp, DollarSign, Plus, Eye, LogOut, BarChart3 } from 'lucide-react'

export default function SellerDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sellerData, setSellerData] = useState(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    const data = localStorage.getItem('sellerProfile')
    if (data) {
      setSellerData(JSON.parse(data))
      
      // Load existing products and remove any dummy products
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]')
      const filteredProducts = existingProducts.filter(product => product.id !== 'prod_demo_001')
      
      // Update localStorage if dummy product was removed
      if (filteredProducts.length !== existingProducts.length) {
        localStorage.setItem('products', JSON.stringify(filteredProducts))
      }
      
      setProducts(filteredProducts)
    } else {
      // Redirect to registration if no data found
      navigate('/seller/register')
    }
  }, [navigate])

  const handleLogout = () => {
    // Clear seller data from localStorage
    localStorage.removeItem('sellerProfile')
    localStorage.removeItem('products')
    localStorage.removeItem('draftProduct')
    
    // Clear cart when user logs out
    dispatch(clearCart())
    
    // Redirect to seller login page
    navigate('/seller/login')
  }

  if (!sellerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Calculate stats - start with zero values
  const totalOrders = 0 // No orders initially
  const totalRevenue = 0 // No revenue initially
  const totalProductsSold = 0 // No products sold initially
  const platformFees = 0 // No fees initially
  const deliveryFees = 0 // No delivery fees initially
  const netProfit = 0 // No profit initially

  const stats = [
    { title: 'Total Products', value: products.length.toString(), icon: Package, color: 'bg-blue-500' },
    { title: 'Total Orders', value: totalOrders.toString(), icon: Users, color: 'bg-green-500' },
    { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Net Profit', value: `$${netProfit.toFixed(2)}`, icon: TrendingUp, color: 'bg-orange-500' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {sellerData.fullName}!</p>
            </div>
            <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/seller/dashboard/products/add', { replace: false })}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
            <button 
              onClick={() => navigate('/seller/dashboard/products', { replace: false })}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye size={20} />
              <span>View Store</span>
            </button>
            <button 
              onClick={() => navigate('/seller/dashboard/sales', { replace: false })}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 size={20} />
              <span>Sales Dashboard</span>
            </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-600">Welcome back, {sellerData.fullName}!</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate('/seller/dashboard/products/add')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </button>
              <button 
                onClick={() => navigate('/seller/dashboard/products')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye size={20} />
                <span>View Store</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 sm:p-6 text-white mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Welcome to Zizla Seller Center!</h2>
          <p className="text-sm sm:text-base text-blue-100">
            Your seller account has been created successfully. You can now start adding products and managing your store.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Created</p>
                  <p className="text-xs text-gray-500">Your seller account has been successfully created</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Profile Completed</p>
                  <p className="text-xs text-gray-500">All registration steps have been completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/seller/dashboard/products/add', { replace: false })}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Add New Product</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button 
                onClick={() => navigate('/seller/dashboard/products', { replace: false })}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Manage Products</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button 
                onClick={() => navigate('/seller/dashboard/sales', { replace: false })}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Sales Dashboard</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button 
                onClick={() => navigate('/seller/dashboard/orders', { replace: false })}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">View Orders</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button 
                onClick={() => navigate('/seller/dashboard/delivery', { replace: false })}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-900">Delivery Management</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Your Business Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Business Details</h4>
              <p className="text-sm text-gray-600">Name: {sellerData.businessName || 'Not provided'}</p>
              <p className="text-sm text-gray-600">Type: {sellerData.businessType}</p>
              <p className="text-sm text-gray-600">Email: {sellerData.email}</p>
              <p className="text-sm text-gray-600">Phone: {sellerData.phone}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {sellerData.selectedCategories.map((category, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
