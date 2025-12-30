'use client'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit, Package, DollarSign, Truck, FileText, Search, Eye, Calendar, Tag } from 'lucide-react'
import Image from '@/components/Image'

export default function ViewProduct() {
  const navigate = useNavigate()
  const params = useParams()
  const productId = params.id
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = JSON.parse(localStorage.getItem('products') || '[]')
        const foundProduct = products.find(p => p.id === productId)
        
        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          navigate('/seller/dashboard/products')
        }
      } catch (error) {
        console.error('Error loading product:', error)
        navigate('/seller/dashboard/products')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId, navigate])

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400', text: 'Published' },
      draft: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400', text: 'Draft' },
      pending: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400', text: 'Pending' }
    }
    
    const config = statusConfig[status] || statusConfig.draft
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${config.color}`}>
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-200" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">Product not found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-200">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/seller/dashboard/products')}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/seller/dashboard/products')}
                className="flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 mb-1">Product Details</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">View and manage your product information</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/seller/dashboard/products/edit/${product.id}`)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={20} />
                <span>Edit Product</span>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/seller/dashboard/products')}
                className="flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 mb-1">Product Details</h1>
                <p className="text-base text-gray-600 dark:text-gray-400 transition-colors duration-200">View and manage your product information</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/seller/dashboard/products/edit/${product.id}`)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={20} />
                <span>Edit Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            {/* Basic Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
              <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <Package className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">Basic Details</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 transition-colors duration-200">Product Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">Product Title</label>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">{product.title}</h4>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 transition-colors duration-200">Product Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">SKU (Stock Keeping Unit)</label>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.sku || 'Not specified'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">Category</label>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.category || 'Not specified'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">Brand</label>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.brand || 'Not specified'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">Product Status</label>
                      <div className="mt-1">
                        {getStatusBadge(product.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
              <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <DollarSign className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">Pricing & Inventory</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 transition-colors duration-200">Pricing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200">Regular Price</label>
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">${product.price || '0.00'}</p>
                    </div>

                    {product.salePrice && product.salePrice > 0 && (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-5 border border-green-200 dark:border-green-800">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200">Sale Price</label>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 transition-colors duration-200">${product.salePrice}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-through">${product.price}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 transition-colors duration-200">Inventory Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">Stock Quantity</label>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-200">{product.stockQuantity || '0'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">units available</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">SKU/Barcode</label>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.skuBarcode || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
              <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <Truck className="w-6 h-6 mr-3 text-orange-600 dark:text-orange-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">Shipping Details</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 transition-colors duration-200">Weight & Dimensions</h3>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-5 border border-orange-200 dark:border-orange-800 mb-4">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200">Product Weight</label>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-200">{product.weight || '0'} kg</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 transition-colors duration-200">Package Dimensions</h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-200">Dimensions (Length × Width × Height in cm)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">Length</label>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.dimensions?.length || '0'} cm</p>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">Width</label>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.dimensions?.width || '0'} cm</p>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">Height</label>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.dimensions?.height || '0'} cm</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
              <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <Eye className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">Media Gallery</h2>
              </div>
              
              <div className="space-y-6">
                {/* Product Images */}
                {product.images && product.images.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 transition-colors duration-200">Product Images</h3>
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Images: <span className="font-semibold text-gray-900 dark:text-gray-200">{product.images.length}</span></p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative group border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-lg">
                          <Image
                            src={image.preview}
                            alt={`Product image ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-40 object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded">
                            Image {index + 1}
                          </div>
                          {index === 0 && (
                            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No Images Available</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-500">No product images have been uploaded yet</p>
                  </div>
                )}

                {/* Video URL */}
                {product.videoUrl && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 transition-colors duration-200">Product Video</h3>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">Video URL</label>
                    <a 
                      href={product.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200 break-all"
                    >
                      {product.videoUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
              <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <FileText className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">Product Description</h2>
              </div>
              
              <div className="space-y-6">
                {product.shortDescription && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 transition-colors duration-200">Short Description</h3>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                      <p className="text-base leading-relaxed text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.shortDescription}</p>
                    </div>
                  </div>
                )}

                {product.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 transition-colors duration-200">Full Product Description</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                      <div className="prose prose-gray dark:prose-invert max-w-none text-gray-900 dark:text-gray-200 whitespace-pre-wrap leading-relaxed transition-colors duration-200">
                        {product.description}
                      </div>
                    </div>
                  </div>
                )}

                {!product.shortDescription && !product.description && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No Description Available</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Product description has not been added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Meta/SEO */}
            {(product.metaTitle || product.metaDescription || product.keywords) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
                <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <Search className="w-6 h-6 mr-3 text-teal-600 dark:text-teal-400" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">SEO & Meta Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 transition-colors duration-200">Search Engine Optimization</h3>
                    
                    {product.metaTitle && (
                      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 mb-4 border border-teal-200 dark:border-teal-800">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200">Meta Title</label>
                        <p className="text-base font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.metaTitle}</p>
                      </div>
                    )}

                    {product.metaDescription && (
                      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 mb-4 border border-teal-200 dark:border-teal-800">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200">Meta Description</label>
                        <p className="text-base leading-relaxed text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.metaDescription}</p>
                      </div>
                    )}

                    {product.keywords && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">Keywords</label>
                        <div className="flex flex-wrap gap-2">
                          {product.keywords.split(',').map((keyword, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full font-medium">
                              {keyword.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4 sm:space-y-6">
              {/* Product Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
                <div className="flex items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <Eye className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">Product Preview</h3>
                </div>
                
                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-200 hover:border-purple-400 dark:hover:border-purple-600">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center transition-colors duration-200">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].preview}
                        alt="Product preview"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400 dark:text-gray-500 transition-colors duration-200">
                        <Package size={48} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">No image available</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-5 bg-white dark:bg-gray-800">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200 line-clamp-2">
                      {product.title}
                    </h4>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 transition-colors duration-200">
                      {product.shortDescription || 'No short description available'}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-baseline space-x-2">
                        {product.salePrice && product.salePrice > 0 ? (
                          <>
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-200">
                              ${product.salePrice}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through transition-colors duration-200">
                              ${product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                            ${product.price || '0.00'}
                          </span>
                        )}
                      </div>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded transition-colors duration-200">
                        {product.category || 'Category'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Stock</p>
                        <p className="text-base font-bold text-blue-600 dark:text-blue-400 transition-colors duration-200">{product.stockQuantity || '0'}</p>
                      </div>
                      <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Weight</p>
                        <p className="text-base font-bold text-orange-600 dark:text-orange-400 transition-colors duration-200">{product.weight || '0'}kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
                <div className="flex items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <Tag className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">Product Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-200">Product ID</h4>
                    <p className="text-sm font-mono font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200 break-all">{product.id}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 transition-colors duration-200">Status</h4>
                    <div className="flex justify-start">
                      {getStatusBadge(product.status)}
                    </div>
                  </div>
                  
                  {product.publishedAt && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-200">Published Date</h4>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">
                          {new Date(product.publishedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-200">Category</h4>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.category || 'Not assigned'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
