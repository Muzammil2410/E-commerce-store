'use client'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  Upload, 
  X, 
  GripVertical, 
  Save, 
  Send, 
  ArrowLeft,
  Image as ImageIcon,
  Package,
  DollarSign,
  Truck,
  FileText,
  Search
} from 'lucide-react'
import Image from '@/components/Image'
import FeeBreakdown from '@/components/FeeBreakdown'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

const categories = ['Clothing', 'Electronics', 'Books', 'Cosmetics', 'Accessories']

export default function EditProduct() {
  const navigate = useNavigate()
  const params = useParams()
  const productId = params.id
  const { t } = useLanguageCurrency()
  
  const [formData, setFormData] = useState({
    // Basic Details
    title: '',
    sku: '',
    category: '',
    brand: '',
    
    // Pricing & Inventory
    price: '',
    salePrice: '',
    stockQuantity: '',
    skuBarcode: '',
    
    // Shipping Details
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    
    // Media
    images: [],
    videoUrl: '',
    
    // Description
    description: '',
    shortDescription: '',
    
    // Meta/SEO
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [sellerDeliveryOption, setSellerDeliveryOption] = useState('self-delivery')

  // Load seller's delivery option from registration data
  useEffect(() => {
    const sellerProfile = localStorage.getItem('sellerProfile')
    if (sellerProfile) {
      try {
        const profile = JSON.parse(sellerProfile)
        if (profile.deliveryOption) {
          setSellerDeliveryOption(profile.deliveryOption)
        }
      } catch (error) {
        console.error('Error parsing seller profile:', error)
      }
    }
  }, [])

  // Load existing product data
  useEffect(() => {
    const loadProduct = () => {
      try {
        const products = JSON.parse(localStorage.getItem('products') || '[]')
        const product = products.find(p => p.id === productId)
        
        if (product) {
          setFormData({
            title: product.title || '',
            sku: product.sku || '',
            category: product.category || '',
            brand: product.brand || '',
            price: product.price || '',
            salePrice: product.salePrice || '',
            stockQuantity: product.stockQuantity || '',
            skuBarcode: product.skuBarcode || '',
            weight: product.weight || '',
            dimensions: {
              length: product.dimensions?.length || '',
              width: product.dimensions?.width || '',
              height: product.dimensions?.height || ''
            },
            images: product.images || [],
            videoUrl: product.videoUrl || '',
            description: product.description || '',
            shortDescription: product.shortDescription || '',
            metaTitle: product.metaTitle || '',
            metaDescription: product.metaDescription || '',
            keywords: product.keywords || ''
          })
        } else {
          toast.error('Product not found')
          navigate('/seller/dashboard/products')
        }
      } catch (error) {
        toast.error('Error loading product')
        navigate('/seller/dashboard/products')
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId, navigate])

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }
      }
      return { ...prev, [field]: value }
    })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }))
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 8) // Max 8 images
    }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const reorderImages = (fromIndex, toIndex) => {
    setFormData(prev => {
      const newImages = [...prev.images]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)
      return { ...prev, images: newImages }
    })
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderImages(draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) newErrors.title = 'Product title is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
    if (!formData.stockQuantity || formData.stockQuantity < 0) newErrors.stockQuantity = 'Stock quantity is required'
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'Weight is required'
    if (formData.images.length === 0) newErrors.images = 'At least one image is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveDraft = () => {
    localStorage.setItem('draftProduct', JSON.stringify(formData))
      toast.success(t('productSavedSuccessfully'))
  }

  const handleUpdate = async () => {
    if (!validateForm()) {
      toast.error(t('pleaseFixErrorsBeforePublishing'))
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Get existing products
      const products = JSON.parse(localStorage.getItem('products') || '[]')
      
      // Find and update the product
      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            ...formData,
            updatedAt: new Date().toISOString()
          }
        }
        return product
      })
      
      // Save updated products
      localStorage.setItem('products', JSON.stringify(updatedProducts))
      
      toast.success(t('productUpdated'))
      
      // Redirect to products page
      setTimeout(() => {
        window.history.back()
      }, 1000)
      
    } catch (error) {
      toast.error(t('failedToUpdateProduct') || 'Failed to update product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    window.history.back()
  }

  const renderStepContent = () => {
    return (
      <div className="space-y-8">
        {/* Basic Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Basic Details
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter SKU"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand (Optional)</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter brand name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Pricing & Inventory
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price (Optional)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.salePrice}
                onChange={(e) => handleInputChange('salePrice', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.stockQuantity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU/Barcode (Optional)</label>
              <input
                type="text"
                value={formData.skuBarcode}
                onChange={(e) => handleInputChange('skuBarcode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter SKU or barcode"
              />
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="mt-6">
            <FeeBreakdown 
              sellingPrice={formData.price} 
              deliveryOption={sellerDeliveryOption}
            />
          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-orange-600" />
            Shipping Details
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.0"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (cm)</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Length</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.dimensions.length}
                    onChange={(e) => handleInputChange('dimensions.length', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Width</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.dimensions.width}
                    onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Height</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.dimensions.height}
                    onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
            Media
          </h2>
          
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Images * (Max 8)</label>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <label className="cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Click to upload more images</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
              
              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Images ({formData.images.length}/8)</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div
                        key={image.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <Image
                          src={image.preview}
                          alt={`Product ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X size={16} />
                            </button>
                            <div className="p-2 bg-gray-500 text-white rounded-full cursor-move">
                              <GripVertical size={16} />
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Video URL (Optional)</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-600" />
            Description
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Brief one-liner for product cards"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Detailed product description..."
              />
            </div>
          </div>
        </div>

        {/* Meta/SEO */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Search className="w-5 h-5 mr-2 text-teal-600" />
            Meta / SEO (Optional)
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="SEO title for search engines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="SEO description for search engines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Products</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('editProduct')}</h1>
                <p className="text-gray-600">{t('updateYourProductInformation') || 'Update your product information'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {renderStepContent()}
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Preview</h3>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {formData.images.length > 0 ? (
                      <Image
                        src={formData.images[0].preview}
                        alt="Product preview"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <ImageIcon size={48} className="mx-auto mb-2" />
                        <p className="text-sm">No image uploaded</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {formData.title || 'Product Title'}
                    </h4>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {formData.shortDescription || 'Short description will appear here'}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {formData.salePrice && formData.salePrice > 0 ? (
                          <>
                            <span className="text-lg font-bold text-green-600">
                              ${formData.salePrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${formData.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ${formData.price || '0.00'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formData.category || 'Category'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Stock: {formData.stockQuantity || '0'}</span>
                      <span>Weight: {formData.weight || '0'}kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleSaveDraft}
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Save size={20} />
              <span>{t('saveAsDraft')}</span>
            </button>
            <button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('updating') || 'Updating...'}</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>{t('updateProduct')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
