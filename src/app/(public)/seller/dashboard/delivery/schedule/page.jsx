'use client'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Package, Filter } from 'lucide-react'
import { orderDummyData } from '@/assets/assets'

export default function DeliverySchedule() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedZone, setSelectedZone] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    const savedOrders = localStorage.getItem('sellerOrders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    } else {
      setOrders(orderDummyData)
    }
  }, [])

  // Mock zones/areas
  const zones = ['Downtown', 'Uptown', 'East Side', 'West Side', 'Central']
  
  // Group orders by date and zone
  const getScheduledDeliveries = () => {
    const deliveries = []
    const today = new Date()
    
    // Generate mock scheduled deliveries for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      zones.forEach((zone, zoneIdx) => {
        const orderCount = Math.floor(Math.random() * 5) + 1
        const estimatedTime = `${9 + zoneIdx * 2}:00 - ${11 + zoneIdx * 2}:00`
        
        deliveries.push({
          id: `delivery_${dateStr}_${zone}`,
          date: dateStr,
          zone: zone,
          orderCount: orderCount,
          estimatedTime: estimatedTime,
          status: ['Packed', 'Shipped', 'Out for Delivery'][Math.floor(Math.random() * 3)],
          isRepeatZone: Math.random() > 0.5
        })
      })
    }
    
    return deliveries
  }

  const scheduledDeliveries = getScheduledDeliveries()

  const filteredDeliveries = scheduledDeliveries.filter(delivery => {
    const matchesDate = selectedDate === 'all' || delivery.date === selectedDate
    const matchesZone = selectedZone === 'all' || delivery.zone === selectedZone
    const matchesStatus = selectedStatus === 'all' || delivery.status === selectedStatus
    return matchesDate && matchesZone && matchesStatus
  })

  // Group by date
  const deliveriesByDate = filteredDeliveries.reduce((acc, delivery) => {
    if (!acc[delivery.date]) {
      acc[delivery.date] = []
    }
    acc[delivery.date].push(delivery)
    return acc
  }, {})

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    if (dateStr === today.toISOString().split('T')[0]) return 'Today'
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow'
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/seller/dashboard/delivery')}
                className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Delivery Schedule</h1>
                <p className="text-gray-600">View and manage scheduled deliveries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Zone/Area</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Zones</option>
                {zones.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="space-y-6">
          {Object.keys(deliveriesByDate).length > 0 ? (
            Object.keys(deliveriesByDate).sort().map(date => (
              <div key={date} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {getDateLabel(date)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deliveriesByDate[date].map(delivery => (
                    <div
                      key={delivery.id}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        delivery.isRepeatZone ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className={`w-5 h-5 ${
                            delivery.isRepeatZone ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                          <h4 className="font-semibold text-gray-900">{delivery.zone}</h4>
                        </div>
                        {delivery.isRepeatZone && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Repeat
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Package size={16} />
                          <span>{delivery.orderCount} {delivery.orderCount === 1 ? 'Order' : 'Orders'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>{delivery.estimatedTime}</span>
                        </div>
                        <div className="mt-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            delivery.status === 'Out for Delivery' ? 'bg-green-100 text-green-800' :
                            delivery.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {delivery.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries scheduled</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

