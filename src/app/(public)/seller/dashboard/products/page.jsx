'use client'
import { useState, useEffect } from 'react'
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
      published: { color: 'bg-green-100 text-green-800', text: t('published') },
      draft: { color: 'bg-yellow-100 text-yellow-800', text: t('draft') },
      pending: { color: 'bg-blue-100 text-blue-800', text: t('pending') }
    }
    
    const productStatus = status || 'draft' // Default to draft if no status
    const config = statusConfig[productStatus] || statusConfig.draft
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingProducts')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">{t('back')}</span>
              </button>
            </div>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900">{t('myProducts')}</h1>
              <p className="text-sm text-gray-600">{t('manageYourProductInventory')}</p>
            </div>
            <button
              onClick={() => navigate('/seller/dashboard/products/add')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('myProducts')}</h1>
                <p className="text-gray-600">{t('manageYourProductInventory')}</p>
              </div>
            </div>
        <button
          onClick={() => navigate('/seller/dashboard/products/add', { replace: false })}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>{t('addProduct')}</span>
        </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t('searchProducts')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].preview}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
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
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {product.salePrice && product.salePrice > 0 ? (
                        <>
                          <span className="text-lg font-bold text-green-600">
                            ${product.salePrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-blue-600 font-medium">
                      {t('stock')}: {product.stockQuantity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-500">{product.category}</span>
                    <span className="text-orange-600 font-medium">{product.weight}kg</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => navigate(`/seller/dashboard/products/view/${product.id}`, { replace: false })}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
                      >
                        <Edit size={16} />
                        <span>{t('continue') || 'Continue'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/seller/dashboard/products/edit/${product.id}`, { replace: false })}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Edit size={16} />
                        <span>{t('edit')}</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex items-center justify-center px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
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
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? t('noProductsFound') : t('noProductsYet') || 'No products yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? t('tryAdjustingSearch') || 'Try adjusting your search or filter criteria'
                : t('getStartedByAdding') || 'Get started by adding your first product'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/seller/dashboard/products/add')}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
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
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('totalProducts')}</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('published')}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {products.filter(p => (p.status || 'draft') === 'published').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('draft')}</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {products.filter(p => (p.status || 'draft') === 'draft').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('totalStock') || 'Total Stock'}</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {products.reduce((sum, p) => sum + (parseInt(p.stockQuantity) || 0), 0)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
