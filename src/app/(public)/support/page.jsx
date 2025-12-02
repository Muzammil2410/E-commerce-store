'use client'
import { useState, useRef } from 'react'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function Support() {
  const navigate = useNavigate()
  const { t } = useLanguageCurrency()
  const [query, setQuery] = useState('')
  const [attachedImages, setAttachedImages] = useState([])
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAttachedImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          file: file,
          preview: reader.result
        }])
      }
      reader.readAsDataURL(file)
    })
    
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (id) => {
    setAttachedImages(prev => prev.filter(img => img.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    if (query.trim() || attachedImages.length > 0) {
      // You can add your submission logic here
      console.log('Query submitted:', query)
      console.log('Attached images:', attachedImages)
    }
  }

  const handleWhatsAppClick = () => {
    // WhatsApp number - you can change this to your actual WhatsApp number
    const phoneNumber = '1234567890' // Replace with actual WhatsApp number
    const message = encodeURIComponent(query || 'Hello, I need support')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const WhatsAppIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="white"/>
    </svg>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('getSupport')}</h1>
              <p className="text-gray-600">We're here to help you</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('tellYourQuery')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('describeIssue')}
                  className="w-full px-4 py-3 pr-12 pb-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="6"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 right-3 flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
                  aria-label="Attach photo"
                >
                  <Plus size={20} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Display attached images */}
              {attachedImages.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {attachedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt="Attached"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-center gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {t('submit')}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center w-12 h-12 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
                  aria-label="Contact us on WhatsApp"
                >
                  <WhatsAppIcon />
                </button>
              </div>

              <p className="text-sm text-gray-500 text-center mt-4">
                {t('submitQuery')}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

