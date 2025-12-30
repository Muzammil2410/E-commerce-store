'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from "@/lib/features/cart/cartSlice"
import { Package, Users, TrendingUp, DollarSign, Plus, Eye, LogOut, BarChart3, ChevronDown, X, UserPlus, Edit, Save, XCircle } from 'lucide-react'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'
import toast from 'react-hot-toast'

export default function SellerDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t, language, updateLanguage } = useLanguageCurrency()
  const [sellerData, setSellerData] = useState(null)
  const [products, setProducts] = useState([])
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isEditingBusinessInfo, setIsEditingBusinessInfo] = useState(false)
  const [editFormData, setEditFormData] = useState({})
  const languageModalRef = useRef(null)
  const languageDropdownRef = useRef(null)

  // Update local state when context changes
  useEffect(() => {
    setSelectedLanguage(language)
  }, [language])

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Korean',
    'Arabic',
    'Hindi',
    'Urdu'
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageModalRef.current && !languageModalRef.current.contains(event.target)) {
        if (!languageDropdownRef.current?.contains(event.target)) {
          setIsLanguageDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSaveLanguage = () => {
    updateLanguage(selectedLanguage)
    setShowLanguageModal(false)
    setIsLanguageDropdownOpen(false)
    toast.success(t('languageUpdated') || 'Language updated')
  }

  useEffect(() => {
    const data = localStorage.getItem('sellerProfile')
    if (data) {
      const parsedData = JSON.parse(data)
      setSellerData(parsedData)
      setEditFormData(parsedData)
      
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

  const handleEditBusinessInfo = () => {
    setIsEditingBusinessInfo(true)
    setEditFormData({ ...sellerData })
  }

  const handleCancelEdit = () => {
    setIsEditingBusinessInfo(false)
    setEditFormData({ ...sellerData })
  }

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveBusinessInfo = () => {
    // Validate required fields
    if (!editFormData.businessName || !editFormData.businessName.trim()) {
      toast.error('Business name is required')
      return
    }
    if (!editFormData.email || !editFormData.email.trim()) {
      toast.error('Email is required')
      return
    }
    if (!editFormData.phone || !editFormData.phone.trim()) {
      toast.error('Phone number is required')
      return
    }
    if (!editFormData.businessAddress || !editFormData.businessAddress.trim()) {
      toast.error('Business address is required')
      return
    }

    // Save to localStorage
    localStorage.setItem('sellerProfile', JSON.stringify(editFormData))
    setSellerData(editFormData)
    setIsEditingBusinessInfo(false)
    toast.success('Business information updated successfully')
  }

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 transition-colors duration-300"></div>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('loadingDashboard')}</p>
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
    { title: t('totalProducts'), value: products.length.toString(), icon: Package, color: 'bg-blue-500' },
    { title: t('totalOrders'), value: totalOrders.toString(), icon: Users, color: 'bg-green-500' },
    { title: t('totalRevenue'), value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-purple-500' },
    { title: t('netProfit'), value: `$${netProfit.toFixed(2)}`, icon: TrendingUp, color: 'bg-orange-500' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{t('sellerDashboard')}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('welcomeBack')}, {sellerData.fullName}!</p>
            </div>
            <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/seller/dashboard/products/add', { replace: false })}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              <span>{t('addProduct')}</span>
            </button>
            <button 
              onClick={() => navigate('/seller/dashboard/products', { replace: false })}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Eye size={20} />
              <span>{t('viewStore')}</span>
            </button>
            <button 
              onClick={() => navigate('/seller/dashboard/sales', { replace: false })}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <BarChart3 size={20} />
              <span>{t('salesDashboard')}</span>
            </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={20} />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{t('sellerDashboard')}</h1>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('welcomeBack')}, {sellerData.fullName}!</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Language/Currency Dropdown */}
              <button
                onClick={() => setShowLanguageModal(true)}
                className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200 font-medium text-base whitespace-nowrap"
              >
                <span>{language.substring(0, 2).toUpperCase()}</span>
                <ChevronDown size={16} />
              </button>

              <button 
                onClick={() => navigate('/seller/dashboard/products/add')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Plus size={20} />
                <span>{t('addProduct')}</span>
              </button>
              <button 
                onClick={() => navigate('/seller/dashboard/products')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Eye size={20} />
                <span>{t('viewStore')}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={20} />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 text-white mb-4 sm:mb-5 md:mb-6 lg:mb-8 transition-colors duration-300">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">{t('welcomeToSellerCenter')}</h2>
          <p className="text-sm sm:text-base text-blue-100 dark:text-blue-200 transition-colors duration-300">
            {t('accountCreatedSuccessfully')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{stat.value}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-300">{t('recentActivity')}</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full transition-colors duration-300"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('accountCreated')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{t('accountCreatedDesc')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full transition-colors duration-300"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('profileCompleted')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{t('profileCompletedDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-300">{t('quickActions')}</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/seller/dashboard/products/add', { replace: false })}
                className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('addNewProduct')}</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 transition-colors duration-300">→</span>
              </button>
              <button 
                onClick={() => navigate('/seller/dashboard/products', { replace: false })}
                className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-green-600 dark:text-green-400 transition-colors duration-300" />
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('manageProducts')}</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 transition-colors duration-300">→</span>
              </button>
              <button 
                onClick={() => navigate('/seller/dashboard/sales', { replace: false })}
                className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('salesDashboard')}</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 transition-colors duration-300">→</span>
              </button>
              <button 
                onClick={() => navigate('/seller/dashboard/orders', { replace: false })}
                className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('viewOrders')}</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 transition-colors duration-300">→</span>
              </button>
              <button 
                onClick={() => navigate('/seller/dashboard/delivery', { replace: false })}
                className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-orange-600 dark:text-orange-400 transition-colors duration-300" />
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('deliveryManagement')}</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 transition-colors duration-300">→</span>
              </button>
              <button 
                onClick={() => navigate('/seller/dashboard/employees', { replace: false })}
                className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400 transition-colors duration-300" />
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Employee Management System</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 transition-colors duration-300">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">{t('yourBusinessInformation')}</h3>
            {!isEditingBusinessInfo && (
              <button
                onClick={handleEditBusinessInfo}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            )}
          </div>

          {!isEditingBusinessInfo ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{t('businessDetails')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('name')}: {sellerData.businessName || t('notProvided')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('type')}: {sellerData.businessType}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('email')}: {sellerData.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('phone')}: {sellerData.phone}</p>
                {sellerData.businessAddress && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300 mt-2">
                    <span className="font-medium">Business Address:</span> {sellerData.businessAddress}
                  </p>
                )}
                {sellerData.warehouseAddress && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300 mt-2">
                    <span className="font-medium">Warehouse Address:</span> {sellerData.warehouseAddress}
                  </p>
                )}
                {sellerData.ntnTaxId && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300 mt-2">
                    <span className="font-medium">NTN/Tax ID:</span> {sellerData.ntnTaxId}
                  </p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{t('categories')}</h4>
                <div className="flex flex-wrap gap-2">
                  {sellerData.selectedCategories && sellerData.selectedCategories.length > 0 ? (
                    sellerData.selectedCategories.map((category, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full transition-colors duration-300">
                        {category}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No categories selected</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editFormData.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={editFormData.businessName || ''}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={editFormData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Type *</label>
                  <select
                    value={editFormData.businessType || 'Individual'}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NTN/Tax ID (Optional)</label>
                  <input
                    type="text"
                    value={editFormData.ntnTaxId || ''}
                    onChange={(e) => handleInputChange('ntnTaxId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Address *</label>
                <textarea
                  value={editFormData.businessAddress || ''}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Warehouse Address (Optional)</label>
                <textarea
                  value={editFormData.warehouseAddress || ''}
                  onChange={(e) => handleInputChange('warehouseAddress', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors resize-none"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <XCircle size={16} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveBusinessInfo}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Language and Currency Modal */}
      {showLanguageModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[9998] transition-colors duration-300"
            onClick={() => setShowLanguageModal(false)}
          />
          
          {/* Modal */}
          <div 
            ref={languageModalRef}
            className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-md w-full p-6 sm:p-8 relative transition-colors duration-300">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 pr-8 transition-colors duration-300">{t('setLanguage') || 'Set language'}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm transition-colors duration-300">
                {t('selectLanguagePreferred') || 'Select your preferred language. You can update the settings at any time.'}
              </p>

              {/* Language Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{t('language')}</label>
                <div className="relative" ref={languageDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                    }}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-left flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  >
                    <span className="text-gray-900 dark:text-white transition-colors duration-300">{selectedLanguage}</span>
                    <ChevronDown 
                      size={20} 
                      className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {isLanguageDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 z-50 max-h-60 overflow-y-auto transition-colors duration-300">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setSelectedLanguage(lang)
                            setIsLanguageDropdownOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            selectedLanguage === lang ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveLanguage}
                className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md dark:shadow-gray-900/50 hover:shadow-lg"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
