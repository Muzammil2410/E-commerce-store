'use client'
import { useState } from 'react'
import { Truck, MapPin, Clock, User, Bell } from 'lucide-react'

export default function DeliveryTrackingTab({ orders }) {
  const [notifyEnabled, setNotifyEnabled] = useState(true)
  
  // Get first active order for tracking demo
  const trackingOrder = orders.find(order => 
    order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
  ) || orders[0]

  if (!trackingOrder) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active deliveries</h3>
          <p className="text-gray-600">You don't have any orders being delivered at the moment.</p>
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
      { label: 'Order Confirmed', completed: true, active: false },
      { label: 'Packed', completed: status !== 'PENDING', active: status === 'PENDING' },
      { label: 'Shipped', completed: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status), active: status === 'SHIPPED' },
      { label: 'Out for Delivery', completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(status), active: status === 'OUT_FOR_DELIVERY' },
      { label: 'Delivered', completed: status === 'DELIVERED', active: status === 'DELIVERED' }
    ]
  }

  const steps = getProgressSteps()
  const estimatedArrival = trackingOrder.expectedDeliveryDate 
    ? new Date(trackingOrder.expectedDeliveryDate).toLocaleString()
    : 'Calculating...'

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Tracking</h2>

      <div className="space-y-6">
        {/* Order Info */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">
              Order #{trackingOrder.id.slice(-8).toUpperCase()}
            </h3>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              trackingOrder.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
              trackingOrder.status === 'OUT_FOR_DELIVERY' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {trackingOrder.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {trackingOrder.orderItems.length} item(s) • ${trackingOrder.total.toFixed(2)}
          </p>
        </div>

        {/* Map */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="w-full h-64 bg-gray-100">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={getGoogleMapsUrl()}
              allowFullScreen
            />
          </div>
          <div className="p-4 bg-gray-50">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Driver location (mock coordinates)</span>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Progress</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500' : step.active ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {step.completed && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-12 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className={`font-medium ${
                    step.active ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  {step.active && (
                    <p className="text-sm text-gray-500 mt-1">In progress...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Info & ETA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Driver Details</p>
                <p className="text-sm text-gray-600">John Doe</p>
                <p className="text-xs text-gray-500">Vehicle: ABC-1234</p>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Estimated Arrival</p>
                <p className="text-sm text-gray-600">{estimatedArrival}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notify Toggle */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Delivery Notifications</p>
                <p className="text-xs text-gray-500">Get notified when your order is out for delivery</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyEnabled}
                onChange={(e) => setNotifyEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

