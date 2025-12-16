'use client'
import { useState } from 'react'
import { RotateCcw, Upload, X, CheckCircle, Clock, FileCheck, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from '@/components/Image'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function ReturnsRefundsTab({ orders }) {
  const { t } = useLanguageCurrency()
  const [showReturnModal, setShowReturnModal] = useState(null)
  const [returnReason, setReturnReason] = useState('')
  const [returnImage, setReturnImage] = useState(null)
  const [returnRequests, setReturnRequests] = useState(() => {
    const saved = localStorage.getItem('returnRequests')
    return saved ? JSON.parse(saved) : []
  })

  const eligibleOrders = orders.filter(order => order.status === 'DELIVERED')

  const returnReasons = [
    t('defectiveDamaged'),
    t('wrongItem'),
    t('notAsDescribed'),
    t('changedMind'),
    t('sizeColorIssue'),
    t('other')
  ]

  const handleRequestReturn = (order) => {
    if (!returnReason) {
      toast.error(t('pleaseSelectReturnReason'))
      return
    }

    const newRequest = {
      id: `return_${Date.now()}`,
      orderId: order.id,
      reason: returnReason,
      image: returnImage,
      status: 'Requested',
      createdAt: new Date().toISOString(),
      order: order
    }

    const updatedRequests = [...returnRequests, newRequest]
    setReturnRequests(updatedRequests)
    localStorage.setItem('returnRequests', JSON.stringify(updatedRequests))
    
    toast.success(t('returnRequestSubmitted'))
    setShowReturnModal(null)
    setReturnReason('')
    setReturnImage(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setReturnImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const getReturnStatusSteps = (request) => {
    const status = request.status
    return [
      { label: 'Requested', completed: true, active: status === 'Requested' },
      { label: 'In Review', completed: ['In Review', 'Approved', 'Completed'].includes(status), active: status === 'In Review' },
      { label: 'Approved', completed: ['Approved', 'Completed'].includes(status), active: status === 'Approved' },
      { label: 'Completed', completed: status === 'Completed', active: status === 'Completed' }
    ]
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-300">{t('returnsRefunds')}</h2>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 transition-colors duration-300">
        <p className="text-sm text-blue-800 dark:text-blue-300 transition-colors duration-300">
          <strong>{t('note')}:</strong> {t('refundProcessed')}
        </p>
      </div>

      {/* Eligible Orders */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('eligibleForReturn')}</h3>
        {eligibleOrders.length > 0 ? (
          <div className="space-y-4">
            {eligibleOrders.map((order) => {
              const hasReturnRequest = returnRequests.some(r => r.orderId === order.id)
              return (
                <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        {t('deliveredOn')} {new Date(order.updatedAt || order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{order.orderItems.length} {t('items')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    {order.orderItems[0]?.product?.images?.[0] && (
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden transition-colors duration-300">
                        <Image
                          src={order.orderItems[0].product.images[0]}
                          alt={order.orderItems[0].product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        {order.orderItems[0]?.product?.name || 'Product'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        {order.orderItems.map(item => item.product?.name).filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>

                  {!hasReturnRequest ? (
                    <button
                      onClick={() => setShowReturnModal(order)}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <RotateCcw size={16} />
                      <span>{t('requestReturn')}</span>
                    </button>
                  ) : (
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors duration-300">
                      {t('returnRequestAlreadySubmitted')}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
            <p>{t('noEligibleOrdersForReturn')}</p>
          </div>
        )}
      </div>

      {/* Return Requests */}
      {returnRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('returnRequests')}</h3>
          <div className="space-y-4">
            {returnRequests.map((request) => {
              const steps = getReturnStatusSteps(request)
              return (
                <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        {t('returnNumber')} #{request.id.slice(-6).toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        {t('orderNumber')} #{request.orderId.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      request.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      request.status === 'Approved' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                      request.status === 'In Review' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    } transition-colors duration-300`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300">
                      <strong>{t('reason')}:</strong> {request.reason}
                    </p>
                    {request.image && (
                      <div className="mt-2">
                        <img src={request.image} alt="Return" className="w-32 h-32 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors duration-300">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors duration-300">{t('returnStatus')}</h5>
                    <div className="space-y-3">
                      {steps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-green-500 dark:bg-green-600' : step.active ? 'bg-blue-500 dark:bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          } transition-colors duration-300`}>
                            {step.completed && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                            {step.active && !step.completed && (
                              <Clock className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className={`text-sm ${
                            step.active ? 'text-blue-600 dark:text-blue-400 font-medium' : 
                            step.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                          } transition-colors duration-300`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-colors duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-auto transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">{t('requestReturn')}</h3>
              <button
                onClick={() => {
                  setShowReturnModal(null)
                  setReturnReason('')
                  setReturnImage(null)
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  {t('returnReason')} *
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                >
                  <option value="">{t('selectReturnReason')}</option>
                  {returnReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  {t('productPhotoOptional')}
                </label>
                {returnImage ? (
                  <div className="relative">
                    <img src={returnImage} alt="Return" className="w-full h-48 object-cover rounded-lg" />
                    <button
                      onClick={() => setReturnImage(null)}
                      className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 transition-colors duration-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-white dark:bg-gray-700">
                      <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2 transition-colors duration-300" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('clickToUpload')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">PNG, JPG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleRequestReturn(showReturnModal)}
                  className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  {t('submitRequest')}
                </button>
                <button
                  onClick={() => {
                    setShowReturnModal(null)
                    setReturnReason('')
                    setReturnImage(null)
                  }}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('cancelButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

