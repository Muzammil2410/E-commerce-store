'use client'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Search,
  Sparkles,
  Camera
} from 'lucide-react'
import Image from '@/components/Image'
import FeeBreakdown from '@/components/FeeBreakdown'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

const categories = ['Clothing', 'Electronics', 'Books', 'Cosmetics', 'Accessories']

export default function AddProduct() {
  const navigate = useNavigate()
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
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [sellerDeliveryOption, setSellerDeliveryOption] = useState('self-delivery')
  const [deepSearchEnabled, setDeepSearchEnabled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showImageSearch, setShowImageSearch] = useState(false)

  // SKU must be entered manually; no auto-generation

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
    const input = e.target
    const fileList = input.files
    if (!fileList || fileList.length === 0) return

    // Convert to array in a robust way for some mobile browsers
    const files = Array.prototype.slice.call(fileList)

    const newImages = files.map((file) => ({
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
    if (!formData.shortDescription || !formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required'
    if (!formData.description || !formData.description.trim()) newErrors.description = 'Product description is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveDraft = () => {
    // Set flag to prevent clearing draft data
    sessionStorage.setItem('savingDraft', 'true')
    
    // Get existing products
    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]')
    
    // Create draft product object
    const draftProduct = {
      id: `draft_${Date.now()}`,
      ...formData,
      status: 'draft',
      createdAt: new Date().toISOString()
    }
    
    // Add to products array
    const updatedProducts = [...existingProducts, draftProduct]
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    
    // Also save as draftProduct for editing
    localStorage.setItem('draftProduct', JSON.stringify(formData))
    
    toast.success(t('productSavedSuccessfully'))
    
    // Clear the flag and redirect to products page after 1 second
    setTimeout(() => {
      sessionStorage.removeItem('savingDraft')
      window.history.back()
    }, 1000)
  }

  const handlePublish = async () => {
    if (!validateForm()) {
      toast.error(t('pleaseFixErrorsBeforePublishing') || 'Please fix the errors before publishing')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Get existing products or create new array
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]')
      
      // Create product object
      const newProduct = {
        id: `prod_${Date.now()}`,
        ...formData,
        publishedAt: new Date().toISOString(),
        status: 'published'
      }
      
      // Add to products array
      const updatedProducts = [...existingProducts, newProduct]
      localStorage.setItem('products', JSON.stringify(updatedProducts))
      
      // Clear draft
      localStorage.removeItem('draftProduct')
      
      toast.success(t('productPublishedSuccessfully'))
      
      // Redirect to products page
      setTimeout(() => {
        window.history.back()
      }, 1000)
      
    } catch (error) {
      toast.error(t('failedToPublishProduct'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    // Clear any draft data when canceling
    localStorage.removeItem('draftProduct')
    window.history.back()
  }

  // Load draft on component mount (only if explicitly requested)
  useEffect(() => {
    // Check if we're coming from a "continue editing" action
    const shouldLoadDraft = sessionStorage.getItem('loadDraftProduct')
    if (shouldLoadDraft) {
      const draft = localStorage.getItem('draftProduct')
      if (draft) {
        setFormData(JSON.parse(draft))
      }
      // Clear the flag after loading
      sessionStorage.removeItem('loadDraftProduct')
    } else {
      // Clear any existing draft data when starting fresh
      localStorage.removeItem('draftProduct')
    }
  }, [])

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

  // Clear draft data when component unmounts (cleanup)
  useEffect(() => {
    return () => {
      // Only clear if we're not in the middle of saving a draft
      const isSavingDraft = sessionStorage.getItem('savingDraft')
      if (!isSavingDraft) {
        localStorage.removeItem('draftProduct')
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleCancel}
                className="flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{t('addNewProductTitle')}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('createNewProductForStore') || 'Create a new product for your store'}</p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{t('addNewProductTitle')}</h1>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('createNewProductForStore') || 'Create a new product for your store'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            {/* Basic Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center transition-colors duration-300">
                <Package className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                {t('basicDetails')}
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{t('productTitleRequired')}</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                      errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder={t('enterProductTitle')}
                  />
                  {errors.title && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{t('sku')}</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    placeholder={t('enterSku')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{t('categoryRequired')}</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                        errors.category ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">{t('selectCategory')}</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{t('brand')} ({t('optional') || 'Optional'})</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                      placeholder={t('enterBrand')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center transition-colors duration-300">
                <DollarSign className="w-5 h-5 mr-2 text-green-600 dark:text-green-400 transition-colors duration-300" />
                {t('pricingInventory')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{t('priceRequired')}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                      errors.price ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{t('salePriceOptional')}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange('salePrice', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{t('stockQuantityRequired')}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                      errors.stockQuantity ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="0"
                  />
                  {errors.stockQuantity && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.stockQuantity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">SKU/Barcode (Optional)</label>
                  <input
                    type="text"
                    value={formData.skuBarcode}
                    onChange={(e) => handleInputChange('skuBarcode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center transition-colors duration-300">
                <Truck className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400 transition-colors duration-300" />
                Shipping Details
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                      errors.weight ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="0.0"
                  />
                  {errors.weight && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.weight}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Dimensions (cm)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Length</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.dimensions.length}
                        onChange={(e) => handleInputChange('dimensions.length', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Width</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.dimensions.width}
                        onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Height</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.dimensions.height}
                        onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center transition-colors duration-300">
                <ImageIcon className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
                Media
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:shadow-sm transition-all h-11">
                    {/* AI Icon and Deep Search Toggle - Inside search bar on left */}
                    <div className="flex items-center gap-2 px-3 py-2 border-r border-gray-200 dark:border-gray-600 bg-transparent flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-colors duration-300" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium transition-colors duration-300">Deep Search Free</span>
                      <button
                        type="button"
                        onClick={() => setDeepSearchEnabled(!deepSearchEnabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 ${
                          deepSearchEnabled ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        role="switch"
                        aria-checked={deepSearchEnabled}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            deepSearchEnabled ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="flex items-center flex-1 min-w-0 h-full">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full h-full bg-transparent dark:bg-gray-700 outline-none placeholder-gray-400 dark:placeholder-gray-500 text-sm text-gray-900 dark:text-white px-3 min-w-0 transition-colors duration-300"
                      />
                    </div>

                    {/* Image Search Button */}
                    <button
                      type="button"
                      onClick={() => setShowImageSearch(!showImageSearch)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors border-r border-gray-200 dark:border-gray-600 h-full flex-shrink-0"
                    >
                      <Camera className="w-4 h-4" />
                      <span className="hidden sm:inline whitespace-nowrap">Image Search</span>
                    </button>

                    {/* Search Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (searchQuery.trim()) {
                          toast.success('Search functionality will be implemented')
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors h-full flex-shrink-0"
                    >
                      <Search className="w-4 h-4" />
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </div>

                  {/* Image Search Panel */}
                  {showImageSearch && (
                    <div className="mt-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/50 transition-colors duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">Find product inspiration with Image Search</h3>
                        <button
                          type="button"
                          onClick={() => setShowImageSearch(false)}
                          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-700">
                        <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3 transition-colors duration-300" />
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300">
                          Paste an image you copied with <span className="bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300 font-medium">Ctrl V</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">Drag and drop an image here or upload a file</p>
                        <button
                          type="button"
                          className="px-6 py-2.5 bg-orange-500 dark:bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Product Images * (Max 8)</label>
                  
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-700">
                    <label className="cursor-pointer">
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2 transition-colors duration-300" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Click to upload images</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">PNG, JPG, GIF up to 10MB each</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        onClick={(e) => { e.currentTarget.value = null }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {errors.images && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.images}</p>}
                  
                  {/* Image Previews */}
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">Uploaded Images ({formData.images.length}/8)</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                        {formData.images.map((image, index) => (
                          <div
                            key={image.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            className="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow bg-white dark:bg-gray-800"
                          >
                            <Image
                              src={image.preview}
                              alt={`Product ${index + 1}`}
                              width={150}
                              height={150}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 group-hover:bg-opacity-30 dark:group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="p-2 bg-red-500 dark:bg-red-600 text-white rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                                <div className="p-2 bg-gray-500 dark:bg-gray-600 text-white rounded-full cursor-move">
                                  <GripVertical size={16} />
                                </div>
                              </div>
                            </div>
                            <div className="absolute top-2 left-2 bg-black bg-opacity-50 dark:bg-opacity-70 text-white text-xs px-2 py-1 rounded">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Product Video URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center transition-colors duration-300">
                <FileText className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400 transition-colors duration-300" />
                Description
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Short Description <span className="text-red-500 dark:text-red-400">*</span></label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                      errors.shortDescription ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Brief one-liner for product cards"
                  />
                  {errors.shortDescription && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.shortDescription}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Product Description <span className="text-red-500 dark:text-red-400">*</span></label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={8}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors resize-none ${
                      errors.description ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Detailed product description..."
                  />
                  {errors.description && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Meta/SEO */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center transition-colors duration-300">
                <Search className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400 transition-colors duration-300" />
                Meta / SEO (Optional)
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    placeholder="SEO title for search engines"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Meta Description</label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors resize-none"
                    placeholder="SEO description for search engines"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Keywords</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>{t('cancel') || 'Cancel'}</span>
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Save size={20} />
                  <span>{t('saveAsDraft')}</span>
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('publishing') || 'Publishing...'}</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>{t('publishProduct')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Product Preview</h3>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-300">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center transition-colors duration-300">
                    {formData.images.length > 0 ? (
                      <Image
                        src={formData.images[0].preview}
                        alt="Product preview"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400 dark:text-gray-500 transition-colors duration-300">
                        <ImageIcon size={48} className="mx-auto mb-2" />
                        <p className="text-sm">No image uploaded</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                      {formData.title || 'Product Title'}
                    </h4>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-300">
                      {formData.shortDescription || 'Short description will appear here'}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {formData.salePrice && formData.salePrice > 0 ? (
                          <>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                              ${formData.salePrice}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through transition-colors duration-300">
                              ${formData.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                            ${formData.price || '0.00'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        {formData.category || 'Category'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600 dark:text-blue-400 font-medium transition-colors duration-300">Stock: {formData.stockQuantity || '0'}</span>
                      <span className="text-orange-600 dark:text-orange-400 font-medium transition-colors duration-300">Weight: {formData.weight || '0'}kg</span>
                    </div>
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
