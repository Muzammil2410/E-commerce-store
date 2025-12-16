'use client'
import { useState } from 'react'
import { Truck, MapPin, Clock, User, Bell } from 'lucide-react'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function DeliveryTrackingTab({ orders }) {
  const { t } = useLanguageCurrency()
  const [notifyEnabled, setNotifyEnabled] = useState(true)
  
  // Get first active order for tracking demo
  const trackingOrder = orders.find(order => 
    order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
  ) || orders[0]

  if (!trackingOrder) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 transition-colors duration-300">
        <div className="text-center py-12">
          <Truck className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t('noActiveDeliveries')}</h3>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('noActiveDeliveriesDesc')}</p>
        </div>
      </div>
    )
  }

  // Mock driver location (slightly offset from destination)
  const driverLocation = {
    lat: 40.7128 + (Math.random() * 0.05 - 0.025),
    lng: -74.0060 + (Math.random() * 0.05 - 0.025)
  }

  const destination = {
    lat: 40.7580,
    lng: -73.9855
  }

  const getGoogleMapsUrl = () => {
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6U4UZu3x9lY&q=${driverLocation.lat},${driverLocation.lng}&zoom=13`
  }

  const getProgressSteps = () => {
    const status = trackingOrder.status
    return [
      { label: t('orderConfirmed'), completed: true, active: false },
      { label: t('packed'), completed: status !== 'PENDING', active: status === 'PENDING' },
      { label: t('shipped'), completed: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status), active: status === 'SHIPPED' },
      { label: t('outForDelivery'), completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(status), active: status === 'OUT_FOR_DELIVERY' },
      { label: t('delivered'), completed: status === 'DELIVERED', active: status === 'DELIVERED' }
    ]
  }

  const steps = getProgressSteps()
  const estimatedArrival = trackingOrder.expectedDeliveryDate 
    ? new Date(trackingOrder.expectedDeliveryDate).toLocaleString()
    : t('calculating')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-300">{t('deliveryTracking')}</h2>

      <div className="space-y-6">
        {/* Order Info */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
              {t('orderNumber')} #{trackingOrder.id.slice(-8).toUpperCase()}
            </h3>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              trackingOrder.status === 'DELIVERED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
              trackingOrder.status === 'OUT_FOR_DELIVERY' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
              'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
            } transition-colors duration-300`}>
              {trackingOrder.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
            {trackingOrder.orderItems.length} item(s) • ${trackingOrder.total.toFixed(2)}
          </p>
        </div>

        {/* Map */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-300">
          <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 transition-colors duration-300">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={getGoogleMapsUrl()}
              allowFullScreen
            />
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
              <MapPin className="w-4 h-4" />
              <span>{t('driverLocation')}</span>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('orderProgress')}</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500 dark:bg-green-600' : step.active ? 'bg-blue-500 dark:bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  } transition-colors duration-300`}>
                    {step.completed && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-12 ${
                      step.completed ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    } transition-colors duration-300`} />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className={`font-medium ${
                    step.active ? 'text-blue-600 dark:text-blue-400' : step.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                  } transition-colors duration-300`}>
                    {step.label}
                  </p>
                  {step.active && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">{t('inProgress')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Info & ETA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('driverDetails')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{t('vehicle')}: ABC-1234</p>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400 transition-colors duration-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('estimatedArrival')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{estimatedArrival}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notify Toggle */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-colors duration-300" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{t('deliveryNotifications')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{t('getNotifiedWhenOutForDelivery')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyEnabled}
                onChange={(e) => setNotifyEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 transition-colors"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

