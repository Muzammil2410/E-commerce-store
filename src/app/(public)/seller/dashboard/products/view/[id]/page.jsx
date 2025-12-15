'use client'
import { useState, useEffect } from 'react'
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
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">Product Details</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">View your product information</p>
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">Product Details</h1>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">View your product information</p>
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center transition-colors duration-200">
                <Package className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Basic Details
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Product Title</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">{product.title}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">SKU</label>
                    <p className="text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.sku || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Category</label>
                    <p className="text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.category || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Brand</label>
                    <p className="text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.brand || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(product.status)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center transition-colors duration-200">
                <DollarSign className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                Pricing & Inventory
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Price</label>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">${product.price || '0.00'}</p>
                </div>

                {product.salePrice && product.salePrice > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Sale Price</label>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-200">${product.salePrice}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Stock Quantity</label>
                  <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 transition-colors duration-200">{product.stockQuantity || '0'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">SKU/Barcode</label>
                  <p className="text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.skuBarcode || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center transition-colors duration-200">
                <Truck className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                Shipping Details
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Weight</label>
                  <p className="text-xl font-semibold text-orange-600 dark:text-orange-400 transition-colors duration-200">{product.weight || '0'} kg</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Dimensions (cm)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">Length</label>
                      <p className="text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.dimensions?.length || '0'}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">Width</label>
                      <p className="text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.dimensions?.width || '0'}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">Height</label>
                      <p className="text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.dimensions?.height || '0'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center transition-colors duration-200">
                <Eye className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                Media
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Product Images */}
                {product.images && product.images.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-200">Product Images ({product.images.length})</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-200">
                          <Image
                            src={image.preview}
                            alt={`Product ${index + 1}`}
                            width={150}
                            height={150}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    <Package className="w-12 h-12 mx-auto mb-2" />
                    <p>No images uploaded</p>
                  </div>
                )}

                {/* Video URL */}
                {product.videoUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Product Video</label>
                    <a 
                      href={product.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200"
                    >
                      {product.videoUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center transition-colors duration-200">
                <FileText className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Description
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                {product.shortDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Short Description</label>
                    <p className="text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.shortDescription}</p>
                  </div>
                )}

                {product.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Product Description</label>
                    <div className="text-gray-900 dark:text-gray-200 whitespace-pre-wrap transition-colors duration-200">{product.description}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Meta/SEO */}
            {(product.metaTitle || product.metaDescription || product.keywords) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center transition-colors duration-200">
                  <Search className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Meta / SEO
                </h2>
                
                <div className="space-y-4 sm:space-y-6">
                  {product.metaTitle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Meta Title</label>
                      <p className="text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.metaTitle}</p>
                    </div>
                  )}

                  {product.metaDescription && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Meta Description</label>
                      <p className="text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.metaDescription}</p>
                    </div>
                  )}

                  {product.keywords && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Keywords</label>
                      <p className="text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.keywords}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4 sm:space-y-6">
              {/* Product Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">Product Preview</h3>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-200">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center transition-colors duration-200">
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
                        <p className="text-sm">No image</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">
                      {product.title}
                    </h4>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-200">
                      {product.shortDescription || 'No short description'}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {product.salePrice && product.salePrice > 0 ? (
                          <>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400 transition-colors duration-200">
                              ${product.salePrice}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through transition-colors duration-200">
                              ${product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                            ${product.price || '0.00'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                        {product.category || 'Category'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600 dark:text-blue-400 font-medium transition-colors duration-200">Stock: {product.stockQuantity || '0'}</span>
                      <span className="text-orange-600 dark:text-orange-400 font-medium transition-colors duration-200">Weight: {product.weight || '0'}kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">Product Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Product ID</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.id}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Status</span>
                    {getStatusBadge(product.status)}
                  </div>
                  
                  {product.publishedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Published</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">
                        {new Date(product.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Category</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">{product.category || 'N/A'}</span>
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
