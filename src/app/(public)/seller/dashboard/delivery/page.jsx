'use client'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  Truck,
  MapPin,
  Package,
  Camera,
  Calendar,
  Upload,
  CheckCircle,
  Clock,
  X,
  QrCode,
  Scan
} from 'lucide-react'
import { orderDummyData } from '@/assets/assets'
import toast from 'react-hot-toast'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function DeliveryManagement() {
  const navigate = useNavigate()
  const { t } = useLanguageCurrency()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showRouteModal, setShowRouteModal] = useState(false)
  const [uploadedImages, setUploadedImages] = useState({})
  const [scannedParcels, setScannedParcels] = useState([])

  // Mock warehouse location
  const warehouseLocation = { lat: 40.7128, lng: -74.0060 } // New York

  useEffect(() => {
    // Load orders
    const savedOrders = localStorage.getItem('sellerOrders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    } else {
      setOrders(orderDummyData)
    }

    // Load uploaded images
    const savedImages = localStorage.getItem('deliveryProofImages')
    if (savedImages) {
      setUploadedImages(JSON.parse(savedImages))
    }

    // Load scanned parcels
    const savedScans = localStorage.getItem('scannedParcels')
    if (savedScans) {
      setScannedParcels(JSON.parse(savedScans))
    }
  }, [])

  const getDeliveryStatus = (order) => {
    if (order.status === 'DELIVERED') return 'Delivered'
    if (order.status === 'PENDING') return 'Packed'
    return 'Shipped'
  }

  const getDeliverySteps = (order) => {
    const status = order.status
    return [
      { label: 'Packed', completed: true, active: status === 'PENDING' },
      { label: 'Shipped', completed: status !== 'PENDING', active: status === 'SHIPPED' },
      { label: 'Out for Delivery', completed: status === 'OUT_FOR_DELIVERY' || status === 'DELIVERED', active: status === 'OUT_FOR_DELIVERY' },
      { label: 'Delivered', completed: status === 'DELIVERED', active: status === 'DELIVERED' }
    ]
  }

  const calculateDistance = (address) => {
    // Mock distance calculation
    return (Math.random() * 20 + 5).toFixed(1) + ' km'
  }

  const handleViewRoute = (order) => {
    setSelectedOrder(order)
    setShowRouteModal(true)
  }

  const handleImageUpload = (orderId, file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const newImages = {
        ...uploadedImages,
        [orderId]: {
          image: reader.result,
          timestamp: new Date().toISOString(),
          status: 'Uploaded'
        }
      }
      setUploadedImages(newImages)
      localStorage.setItem('deliveryProofImages', JSON.stringify(newImages))
      toast.success(t('proofOfDeliveryUploadedSuccessfully'))
    }
    reader.readAsDataURL(file)
  }

  const handleScanParcel = () => {
    // Mock scan
    const mockScan = {
      id: `scan_${Date.now()}`,
      orderId: `ORD${Math.floor(Math.random() * 10000)}`,
      status: ['Packed', 'Shipped', 'Out for Delivery', 'Delivered'][Math.floor(Math.random() * 4)],
      timestamp: new Date().toISOString()
    }
    const newScans = [mockScan, ...scannedParcels]
    setScannedParcels(newScans)
    localStorage.setItem('scannedParcels', JSON.stringify(newScans))
    toast.success(t('parcelScannedSuccessfully'))
  }

  const getGoogleMapsUrl = (order) => {
    // Mock destination address - in real app, use order.address
    const destLat = warehouseLocation.lat + (Math.random() * 0.1 - 0.05)
    const destLng = warehouseLocation.lng + (Math.random() * 0.1 - 0.05)
    return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6U4UZu3x9lY&origin=${warehouseLocation.lat},${warehouseLocation.lng}&destination=${destLat},${destLng}`
  }

  const tabs = [
    { id: 'orders', label: t('deliveryOrders'), icon: Truck },
    { id: 'proof', label: t('proofOfDelivery'), icon: Camera },
    { id: 'scanner', label: t('parcelScanner'), icon: QrCode },
    { id: 'schedule', label: t('deliverySchedule'), icon: Calendar }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{t('deliveryManagement')}</h1>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('manageDeliveriesAndTrackOrders')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 mb-4 sm:mb-5 md:mb-6 transition-colors duration-300">
          <div className="border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <nav className="flex overflow-x-auto -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'schedule') {
                        navigate('/seller/dashboard/delivery/schedule')
                      } else {
                        setActiveTab(tab.id)
                      }
                    }}
                    className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Delivery Orders Tab */}
        {activeTab === 'orders' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                  <tr>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">{t('orderId')}</th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300 hidden sm:table-cell">{t('customerName')}</th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300 hidden md:table-cell">{t('deliveryAddress')}</th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300 hidden lg:table-cell">{t('distance')}</th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">{t('status')}</th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">#{order.id.slice(-8)}</div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white transition-colors duration-300">{order.user?.name || 'Customer'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{order.user?.email || ''}</div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4">
                        <div className="text-sm text-gray-900 dark:text-white transition-colors duration-300">
                          {order.address?.street || 'N/A'}, {order.address?.city || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          {order.address?.state || ''} {order.address?.zip || ''}
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white transition-colors duration-300">{calculateDistance(order.address)}</div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                        <div className="mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
                            getDeliveryStatus(order) === 'Delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                            getDeliveryStatus(order) === 'Packed' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          }`}>
                            {getDeliveryStatus(order)}
                          </span>
                        </div>
                        {/* Progress Steps */}
                        <div className="flex items-center space-x-1">
                          {getDeliverySteps(order).map((step, idx) => (
                            <div key={idx} className="flex items-center">
                              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                step.completed ? 'bg-green-500 dark:bg-green-400' : step.active ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'
                              }`} />
                              {idx < getDeliverySteps(order).length - 1 && (
                                <div className={`w-4 h-0.5 transition-colors duration-300 ${
                                  step.completed ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-600'
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewRoute(order)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 flex items-center space-x-1 transition-colors duration-300"
                        >
                          <MapPin size={16} />
                          <span>{t('viewRoute')}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Proof of Delivery Tab */}
        {activeTab === 'proof' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('uploadProofOfDelivery')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((order) => {
                  const proof = uploadedImages[order.id]
                  return (
                    <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('order')} #{order.id.slice(-8)}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{order.user?.name || t('customer') || 'Customer'}</p>
                        </div>
                        {proof && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full flex items-center space-x-1 transition-colors duration-300">
                            <CheckCircle size={12} />
                            <span>{t('uploaded')}</span>
                          </span>
                        )}
                      </div>
                      
                      {proof ? (
                        <div className="space-y-3">
                          <img src={proof.image} alt="Proof" className="w-full h-48 object-cover rounded-lg" />
                          <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                            <p>{t('uploaded')}: {new Date(proof.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                          <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2 transition-colors duration-300" />
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">{t('noProofUploaded')}</p>
                          <label className="inline-block">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(order.id, e.target.files[0])}
                              className="hidden"
                            />
                            <span className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 cursor-pointer text-sm transition-colors">
                              {t('uploadPhoto')}
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Delivery List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('deliveryStatus')}</h3>
              <div className="space-y-3">
                {orders.map((order) => {
                  const proof = uploadedImages[order.id]
                  return (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors duration-300">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('order')} #{order.id.slice(-8)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{order.user?.name || t('customer') || 'Customer'}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {proof ? (
                          <>
                            <span className="px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full flex items-center space-x-1 transition-colors duration-300">
                              <CheckCircle size={14} />
                              <span>{t('uploaded')}</span>
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                              {new Date(proof.timestamp).toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="px-3 py-1 text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full flex items-center space-x-1 transition-colors duration-300">
                            <Clock size={14} />
                            <span>{t('pending')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Parcel Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('scanParcel')}</h3>
              <div className="bg-gray-900 dark:bg-black rounded-lg p-8 mb-4 relative overflow-hidden transition-colors duration-300">
                <div className="aspect-video bg-gray-800 dark:bg-gray-900 rounded-lg flex items-center justify-center border-4 border-blue-500 dark:border-blue-400 transition-colors duration-300">
                  <div className="text-center">
                    <Scan className="w-16 h-16 text-blue-500 dark:text-blue-400 mx-auto mb-4 animate-pulse transition-colors duration-300" />
                    <p className="text-white dark:text-gray-200 text-lg font-medium transition-colors duration-300">{t('cameraFrame')}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 transition-colors duration-300">{t('positionBarcodeWithinFrame')}</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <div className="w-8 h-8 border-2 border-white dark:border-gray-300 rounded transition-colors duration-300"></div>
                  <div className="w-8 h-8 border-2 border-white dark:border-gray-300 rounded transition-colors duration-300"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                  <div className="w-8 h-8 border-2 border-white dark:border-gray-300 rounded transition-colors duration-300"></div>
                  <div className="w-8 h-8 border-2 border-white dark:border-gray-300 rounded transition-colors duration-300"></div>
                </div>
              </div>
              <button
                onClick={handleScanParcel}
                className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <QrCode size={20} />
                <span>{t('scanParcel')}</span>
              </button>
            </div>

            {/* Recent Scans */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-5 md:p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('recentScans')}</h3>
              {scannedParcels.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">{t('orderId')}</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">{t('status')}</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">{t('timestamp')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
                      {scannedParcels.map((scan) => (
                        <tr key={scan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{scan.orderId}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
                              scan.status === 'Delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                              scan.status === 'Packed' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                              'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            }`}>
                              {scan.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                            {new Date(scan.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <p>{t('noScansYet')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Route Modal */}
      {showRouteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-colors duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto transition-colors duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                {t('routeTo')} {selectedOrder.user?.name || t('customer') || 'Customer'}
              </h3>
              <button
                onClick={() => setShowRouteModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300">
                  <strong>{t('from')}:</strong> {t('warehouse')} (New York)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  <strong>{t('to')}:</strong> {selectedOrder.address?.street || 'N/A'}, {selectedOrder.address?.city || 'N/A'}
                </p>
              </div>
              <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={getGoogleMapsUrl(selectedOrder)}
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

