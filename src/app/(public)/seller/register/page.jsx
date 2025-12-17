'use client'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight, Upload, Check, User, Building2, FileText, Tag, Eye, X } from 'lucide-react'
import Image from '@/components/Image'
import PhoneNumberInput from '@/components/PhoneNumberInput'

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Business Info', icon: Building2 },
  { id: 3, title: 'Documents', icon: FileText },
  { id: 4, title: 'Categories', icon: Tag },
  { id: 5, title: 'Review', icon: Eye }
]

const categories = [
  'Electronics', 'Clothing', 'Books', 'Cosmetics', 'Home & Kitchen',
  'Sports & Outdoors', 'Toys & Games', 'Beauty & Health', 'Food & Drink',
  'Hobbies & Crafts', 'Automotive', 'Health & Personal Care'
]

export default function SellerRegister() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(() => {
    // Restore current step from localStorage if available
    const savedStep = localStorage.getItem('sellerRegistrationStep')
    return savedStep ? parseInt(savedStep) : 1
  })
  const [formData, setFormData] = useState({
    // Basic Info
    fullName: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    
    // Business Info
    businessType: 'Individual',
    ntnTaxId: '',
    businessAddress: '',
    warehouseAddress: '',
    
    // Delivery Options
    deliveryOption: '',
    
    // Documents
    documents: {
      businessLicense: null,
      taxCertificate: null,
      bankStatement: null,
      idCard: null
    },
    
    // Categories
    selectedCategories: [],
    
    // Review
    agreeToTerms: false
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [phoneValidation, setPhoneValidation] = useState({ isValid: false, e164Format: '' })

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sellerRegistrationStep', currentStep.toString())
  }, [currentStep])

  // Clear saved step when component first mounts (for new registrations)
  useEffect(() => {
    // Only clear if there's no existing form data
    const existingData = localStorage.getItem('sellerProfile')
    if (!existingData) {
      // This is a new registration, start from step 1
      localStorage.removeItem('sellerRegistrationStep')
      setCurrentStep(1)
    }
  }, [])

  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
        if (!formData.phone || !formData.phone.trim()) newErrors.phone = 'Phone number is required'
        else if (!phoneValidation.isValid) {
          newErrors.phone = 'Please enter a valid phone number for the selected country'
        }
        if (!formData.password.trim()) newErrors.password = 'Password is required'
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
        break
        
      case 2:
        if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required'
        if (!formData.warehouseAddress.trim()) newErrors.warehouseAddress = 'Warehouse address is required'
        if (!formData.deliveryOption) newErrors.deliveryOption = 'Please select a delivery option'
        break
        
      case 3:
        if (!formData.documents.bankStatement) newErrors.bankStatement = 'Bank statement is required'
        if (!formData.documents.idCard) newErrors.idCard = 'ID card is required'
        break
        
      case 4:
        if (formData.selectedCategories.length === 0) newErrors.selectedCategories = 'Please select at least one category'
        break
        
      case 5:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePhoneValidation = (isValid, e164Format) => {
    setPhoneValidation({ isValid, e164Format })
    // Update form data with E.164 format if valid
    if (isValid && e164Format) {
      setFormData(prev => ({ ...prev, phone: e164Format }))
    }
  }

  const handleDocumentUpload = (docType, file) => {
    setFormData(prev => ({
      ...prev,
      documents: { ...prev.documents, [docType]: file }
    }))
  }

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }))
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) return
    
    setIsSubmitting(true)
    
    try {
      // Save to localStorage
      localStorage.setItem('sellerProfile', JSON.stringify(formData))
      
      // Clear the saved step since registration is complete
      localStorage.removeItem('sellerRegistrationStep')
      
      // Console log the data
      console.log('Seller Registration Data:', formData)
      
      // Show success toast
      toast.success('Registration completed! Please login with your credentials...')
      
      // Redirect to seller login after 2 seconds
      setTimeout(() => {
        navigate('/seller/login')
      }, 2000)
      
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                  errors.fullName ? 'border-red-500 dark:border-red-400' : ''
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-300">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500 dark:border-red-400' : ''
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-300">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Phone Number *</label>
              <PhoneNumberInput
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                onValidationChange={handlePhoneValidation}
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-300">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-500 dark:border-red-400' : ''
                }`}
                placeholder="Enter your password (min 6 characters)"
              />
              {errors.password && <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-300">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Business Name *</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                  errors.businessName ? 'border-red-500 dark:border-red-400' : ''
                }`}
                placeholder="Enter your business name"
              />
              {errors.businessName && <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-300">{errors.businessName}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Business Type</label>
              <select
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              >
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">NTN/Tax ID (Optional)</label>
              <input
                type="text"
                value={formData.ntnTaxId}
                onChange={(e) => handleInputChange('ntnTaxId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                placeholder="Enter your NTN/Tax ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Business Address *</label>
              <textarea
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors resize-none ${
                  errors.businessAddress ? 'border-red-500 dark:border-red-400' : ''
                }`}
                placeholder="Enter your business address"
              />
              {errors.businessAddress && <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-300">{errors.businessAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Warehouse Address *</label>
              <textarea
                value={formData.warehouseAddress}
                onChange={(e) => handleInputChange('warehouseAddress', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors resize-none ${
                  errors.warehouseAddress ? 'border-red-500 dark:border-red-400' : ''
                }`}
                placeholder="Enter your warehouse address"
              />
              {errors.warehouseAddress && <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-300">{errors.warehouseAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">Delivery Options *</label>
              <div className="space-y-3">
                <label className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.deliveryOption === 'self-delivery' 
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                }`}>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="self-delivery"
                    checked={formData.deliveryOption === 'self-delivery'}
                    onChange={(e) => handleInputChange('deliveryOption', e.target.value)}
                    className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Self-Delivery</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">
                      You handle all deliveries yourself. You are responsible for packaging, shipping, and delivery to customers.
                    </p>
                  </div>
                </label>

                <label className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.deliveryOption === 'platform-delivery' 
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                }`}>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="platform-delivery"
                    checked={formData.deliveryOption === 'platform-delivery'}
                    onChange={(e) => handleInputChange('deliveryOption', e.target.value)}
                    className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Platform-Delivery</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">
                      Zizla handles deliveries for you. Additional delivery fees will apply to your orders.
                    </p>
                    <div className="mt-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md transition-colors duration-300">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200 transition-colors duration-300">
                        <strong>Note:</strong> Additional delivery fees will be charged per order when using platform delivery.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              {errors.deliveryOption && <p className="text-red-500 dark:text-red-400 text-sm mt-2 transition-colors duration-300">{errors.deliveryOption}</p>}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">Upload your business documents (Preview only - no actual upload)</p>
            
            {[ 
              { key: 'businessLicense', label: 'Business License', description: 'Upload your business license document' },
              { key: 'taxCertificate', label: 'Tax Certificate', description: 'Upload your tax registration certificate' },
              { key: 'bankStatement', label: 'Bank Statement', description: 'Upload your recent bank statement' },
              { key: 'idCard', label: 'ID Card', description: 'Upload your national ID card' }
            ].map(({ key, label, description }) => (
              <div key={key} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                <label className="cursor-pointer">
                  <div className="text-center">
                    {formData.documents[key] ? (
                      <div className="space-y-2">
                        <Image
                          src={URL.createObjectURL(formData.documents[key])}
                          alt={label}
                          width={100}
                          height={100}
                          className="mx-auto rounded-lg object-cover"
                        />
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium transition-colors duration-300">{formData.documents[key].name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            handleDocumentUpload(key, null)
                          }}
                          className="text-red-500 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto transition-colors duration-300" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            {label}
                            {(key === 'bankStatement' || key === 'idCard') && (
                              <span className="text-red-500 dark:text-red-400"> *</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleDocumentUpload(key, e.target.files[0])}
                    className="hidden"
                  />
                </label>
                {errors[key] && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2 transition-colors duration-300">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">Select Product Categories *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">{category}</span>
                  </label>
                ))}
              </div>
              {errors.selectedCategories && <p className="text-red-500 dark:text-red-400 text-sm mt-2 transition-colors duration-300">{errors.selectedCategories}</p>}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-300">Registration Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Basic Information</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Name: {formData.fullName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Email: {formData.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Phone: {formData.phone || 'Not provided'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Business: {formData.businessName}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Business Information</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Type: {formData.businessType}</p>
                  {formData.ntnTaxId && <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">NTN/Tax ID: {formData.ntnTaxId}</p>}
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Address: {formData.businessAddress}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Warehouse: {formData.warehouseAddress}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Delivery: {formData.deliveryOption === 'self-delivery' ? 'Self-Delivery' : 'Platform-Delivery'}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Selected Categories</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{formData.selectedCategories.join(', ')}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Documents</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    {Object.values(formData.documents).filter(doc => doc).length} document(s) uploaded
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className={`w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 mt-1 transition-colors duration-300 ${
                    errors.agreeToTerms ? 'border-red-500 dark:border-red-400' : ''
                  }`}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-300">Terms and Conditions</button> and <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-300">Privacy Policy</button>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-300">{errors.agreeToTerms}</p>}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Become a Seller</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">Join Zizla and start selling your products</p>
        </div>

        {/* Progress Bar - Mobile */}
        <div className="lg:hidden mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Step {currentStep} of 5</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{Math.round((currentStep / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors duration-300">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Step Navigation - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 sticky top-8 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Registration Steps</h3>
              <nav className="space-y-2">
                {steps.map((step) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700' 
                          : isCompleted 
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isActive 
                          ? 'bg-blue-600 dark:bg-blue-500 text-white' 
                          : isCompleted 
                            ? 'bg-green-600 dark:bg-green-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                      </div>
                      <span className="font-medium">{step.title}</span>
                    </div>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 lg:p-8 transition-colors duration-300">
              {/* Step Title */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{steps[currentStep - 1].title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">
                  {currentStep === 1 && "Enter your basic information to get started"}
                  {currentStep === 2 && "Tell us about your business"}
                  {currentStep === 3 && "Upload your business documents"}
                  {currentStep === 4 && "Select the categories you want to sell"}
                  {currentStep === 5 && "Review your information before submitting"}
                </p>
              </div>

              {/* Step Content */}
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ChevronLeft size={20} />
                  <span>Previous</span>
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Check size={20} />
                        <span>Submit Registration</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 transition-colors duration-300"
          onClick={() => setShowTermsModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Terms and Conditions</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">1. Acceptance of Terms</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  By accessing and using Zizla's seller platform, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">2. Seller Account</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">To become a seller on Zizla, you must:</p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-300">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Be at least 18 years old or have parental consent</li>
                  <li>Have the legal right to sell the products you list</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">3. Product Listings</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">As a seller, you agree to:</p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-300">
                  <li>Provide accurate product descriptions and images</li>
                  <li>Maintain adequate inventory levels</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not list prohibited or restricted items</li>
                  <li>Set fair and competitive pricing</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">4. Fees and Payments</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  Zizla charges a commission fee on each successful sale. Payment terms, commission rates, 
                  and payout schedules are detailed in your seller agreement. All fees are non-refundable 
                  unless otherwise specified.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">5. Order Fulfillment</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">You are responsible for:</p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-300">
                  <li>Processing orders within the specified timeframe</li>
                  <li>Providing accurate shipping information</li>
                  <li>Handling customer service inquiries</li>
                  <li>Managing returns and refunds according to our policy</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">6. Prohibited Activities</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">You may not:</p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-300">
                  <li>Engage in fraudulent or deceptive practices</li>
                  <li>Manipulate reviews or ratings</li>
                  <li>Circumvent our fee structure</li>
                  <li>Violate intellectual property rights</li>
                  <li>Spam or harass other users</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">7. Intellectual Property</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  You retain ownership of your product listings and content. By listing on Zizla, you grant 
                  us a license to use your content for marketing and platform operations. You must not 
                  infringe on others' intellectual property rights.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">8. Account Suspension</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  We reserve the right to suspend or terminate your seller account for violations of these 
                  terms, poor performance, or other reasons at our discretion. You will be notified of any 
                  account actions and have the right to appeal.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">9. Limitation of Liability</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  Zizla is not liable for any indirect, incidental, or consequential damages arising from 
                  your use of our platform. Our total liability is limited to the amount of fees you have 
                  paid us in the past 12 months.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">10. Changes to Terms</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  We may modify these terms at any time. Continued use of our platform after changes 
                  constitutes acceptance of the new terms. We will notify you of significant changes 
                  via email or platform notification.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">11. Governing Law</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  These terms are governed by the laws of the jurisdiction where Zizla is incorporated. 
                  Any disputes will be resolved through binding arbitration.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">12. Contact Information</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                  For questions about these terms, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 transition-colors duration-300">
                  <p className="text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"><strong>Email:</strong> legal@zizla.com</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"><strong>Phone:</strong> +1-212-456-7890</p>
                  <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300"><strong>Address:</strong> 794 Francisco, 94102</p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8 transition-colors duration-300">
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    These Terms and Conditions are effective as of January 2025 and will remain in effect 
                    until modified or terminated.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors duration-300">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 transition-colors duration-300"
          onClick={() => setShowPrivacyModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">1. Introduction</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  Welcome to Zizla ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you visit our website or use our services. 
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
                  policy, please do not access the site.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">2. Information We Collect</h3>
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300">Personal Information</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-300">
                  <li>Register for an account</li>
                  <li>Make a purchase</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us for support</li>
                  <li>Participate in surveys or promotions</li>
                </ul>

                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300">Automatically Collected Information</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  We may automatically collect certain information about your device and usage patterns, 
                  including your IP address, browser type, operating system, pages visited, and time spent on our site.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">3. How We Use Your Information</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-300">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer support</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Prevent fraud and enhance security</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">4. Information Sharing and Disclosure</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-300">
                  <li>With your explicit consent</li>
                  <li>To trusted service providers who assist us in operating our website</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">5. Data Security</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                  over the internet or electronic storage is 100% secure.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">6. Cookies and Tracking Technologies</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  We use cookies and similar tracking technologies to enhance your browsing experience, 
                  analyze site traffic, and personalize content. You can control cookie settings through 
                  your browser preferences.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">7. Your Rights and Choices</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2 transition-colors duration-300">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">8. Third-Party Links</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  Our website may contain links to third-party websites. We are not responsible for the 
                  privacy practices or content of these external sites. We encourage you to review the 
                  privacy policies of any third-party sites you visit.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">9. Children's Privacy</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  Our services are not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13. If you are a parent or guardian and 
                  believe your child has provided us with personal information, please contact us.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">10. International Data Transfers</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your personal information in 
                  accordance with this Privacy Policy.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">11. Changes to This Privacy Policy</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                  Your continued use of our services after any modifications constitutes acceptance of the updated policy.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">12. Contact Us</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 transition-colors duration-300">
                  <p className="text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"><strong>Email:</strong> privacy@zizla.com</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"><strong>Phone:</strong> +1-212-456-7890</p>
                  <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300"><strong>Address:</strong> 794 Francisco, 94102</p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8 transition-colors duration-300">
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    This Privacy Policy is effective as of January 2025 and will remain in effect except with 
                    respect to any changes in its provisions in the future, which will be in effect immediately 
                    after being posted on this page.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors duration-300">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
