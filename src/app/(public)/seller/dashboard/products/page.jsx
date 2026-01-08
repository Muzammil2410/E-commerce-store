'use client'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, Package, Search, Filter, ArrowLeft } from 'lucide-react'
import Image from '@/components/Image'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function SellerProducts() {
  const navigate = useNavigate()
  const { t } = useLanguageCurrency()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load products from localStorage
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]')
    setProducts(savedProducts)
    setLoading(false)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const productStatus = product.status || 'draft' // Default to draft if no status
    const matchesStatus = filterStatus === 'all' || productStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDeleteProduct = (productId) => {
    if (confirm(t('areYouSureDelete'))) {
      const updatedProducts = products.filter(p => p.id !== productId)
      setProducts(updatedProducts)
      localStorage.setItem('products', JSON.stringify(updatedProducts))
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300', text: t('published') },
      draft: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300', text: t('draft') },
      pending: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300', text: t('pending') }
    }
    
    const productStatus = status || 'draft' // Default to draft if no status
    const config = statusConfig[productStatus] || statusConfig.draft
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${config.color}`}>
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 transition-colors duration-300"></div>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('loadingProducts')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">{t('back')}</span>
              </button>
            </div>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{t('myProducts')}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('manageYourProductInventory')}</p>
            </div>
            <button
              onClick={() => navigate('/seller/dashboard/products/add')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#3977ED' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2d5fcc'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3977ED'
              }}
            >
              <Plus size={20} />
              <span>{t('addProduct')}</span>
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{t('myProducts')}</h1>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('manageYourProductInventory')}</p>
              </div>
            </div>
        <button
          onClick={() => navigate('/seller/dashboard/products/add', { replace: false })}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#3977ED' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2d5fcc'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3977ED'
          }}
        >
          <Plus size={20} />
          <span>{t('addProduct')}</span>
        </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={20} />
                <input
                  type="text"
                  placeholder={t('searchProducts')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              >
                <option value="all">{t('all')} {t('status')}</option>
                <option value="published">{t('published')}</option>
                <option value="draft">{t('draft')}</option>
                <option value="pending">{t('pending')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/70 transition-shadow">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative transition-colors duration-300">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].preview}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors duration-300">
                      <Package size={48} />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(product.status)}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 transition-colors duration-300">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {product.salePrice && product.salePrice > 0 ? (
                        <>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                            ${product.salePrice}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through transition-colors duration-300">
                            ${product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors duration-300">
                      {t('stock')}: {product.stockQuantity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">{product.category}</span>
                    <span className="text-orange-600 dark:text-orange-400 font-medium transition-colors duration-300">{product.weight}kg</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => navigate(`/seller/dashboard/products/view/${product.id}`, { replace: false })}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Eye size={16} />
                      <span>{t('view')}</span>
                    </button>
                    {(product.status || 'draft') === 'draft' ? (
                      <button
                        onClick={() => {
                          // Set flag to load draft data
                          sessionStorage.setItem('loadDraftProduct', 'true')
                          navigate('/seller/dashboard/products/add', { replace: false })
                        }}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                      >
                        <Edit size={16} />
                        <span>{t('continue') || 'Continue'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/seller/dashboard/products/edit/${product.id}`, { replace: false })}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <Edit size={16} />
                        <span>{t('edit')}</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex items-center justify-center px-3 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
              {searchTerm || filterStatus !== 'all' ? t('noProductsFound') : t('noProductsYet') || 'No products yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
              {searchTerm || filterStatus !== 'all' 
                ? t('tryAdjustingSearch') || 'Try adjusting your search or filter criteria'
                : t('getStartedByAdding') || 'Get started by adding your first product'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/seller/dashboard/products/add')}
                className="flex items-center space-x-2 px-6 py-3 text-white rounded-lg transition-colors mx-auto"
                style={{ backgroundColor: '#3977ED' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2d5fcc'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3977ED'
                }}
              >
                <Plus size={20} />
                <span>{t('addYourFirstProduct')}</span>
              </button>
            )}
          </div>
        )}

        {/* Stats */}
        {products.length > 0 && (
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('totalProducts')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('published')}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                    {products.filter(p => (p.status || 'draft') === 'published').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                  <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full transition-colors duration-300"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('draft')}</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 transition-colors duration-300">
                    {products.filter(p => (p.status || 'draft') === 'draft').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                  <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-400 rounded-full transition-colors duration-300"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('totalStock') || 'Total Stock'}</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">
                    {products.reduce((sum, p) => sum + (parseInt(p.stockQuantity) || 0), 0)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                  <div className="w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full transition-colors duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
