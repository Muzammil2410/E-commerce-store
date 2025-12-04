'use client'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  MessageCircle,
  Star,
  AlertCircle
} from 'lucide-react'
import { orderDummyData } from '@/assets/assets'
import SellerReviewModal from '@/components/SellerReviewModal'
import ChatModal from '@/components/ChatModal'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function SellerOrders() {
  const navigate = useNavigate()
  const { t, formatCurrency, translateProductName } = useLanguageCurrency()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [reviewModal, setReviewModal] = useState(null)
  const [chatModal, setChatModal] = useState(null)

  useEffect(() => {
    // Load orders from localStorage or dummy data
    const savedOrders = localStorage.getItem('sellerOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Use dummy data for demo
      setOrders(orderDummyData);
      localStorage.setItem('sellerOrders', JSON.stringify(orderDummyData));
    }
    setLoading(false)
  }, [])

  // Check if order is delayed (more than expected delivery date)
  const isOrderDelayed = (order) => {
    if (!order.expectedDeliveryDate) return false;
    const expectedDate = new Date(order.expectedDeliveryDate);
    const today = new Date();
    return today > expectedDate && order.status !== 'DELIVERED' && order.status !== 'CANCELLED';
  };

  // Check if seller has reviewed this buyer
  const hasReviewedBuyer = (orderId, buyerId) => {
    const reviews = JSON.parse(localStorage.getItem('sellerReviews') || '[]');
    return reviews.some(r => r.orderId === orderId && r.buyerId === buyerId);
  };

  // Get seller review for this buyer
  const getSellerReview = (orderId, buyerId) => {
    const reviews = JSON.parse(localStorage.getItem('sellerReviews') || '[]');
    return reviews.find(r => r.orderId === orderId && r.buyerId === buyerId);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // formatCurrency is now from context

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingOrders')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600">Manage your customer orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredOrders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {t('order')} #{order.id.slice(-8)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{order.user.name}</p>
                            <p className="text-sm text-gray-600">{order.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{t('deliveryAddress')}</p>
                            <p className="text-sm text-gray-600">
                              {order.address.street}, {order.address.city}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">{t('orderItems')} ({order.orderItems.length})</h4>
                        <div className="space-y-2">
                          {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{translateProductName(item.product.name)}</p>
                                  <p className="text-sm text-gray-600">{t('qty')}: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4" />
                          <span>{order.paymentMethod}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4" />
                          <span>{t('delivery')}</span>
                        </div>
                        {order.isCouponUsed && (
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {t('couponUsed')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Total & Actions */}
                    <div className="lg:w-64 flex flex-col items-end space-y-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="text-sm text-gray-600">{t('totalAmount')}</p>
                      </div>
                      
                      {/* Delay Warning */}
                      {isOrderDelayed(order) && (
                        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                          <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle size={16} />
                            <p className="text-xs font-medium">{t('orderDelayed')}</p>
                          </div>
                          <p className="text-xs text-red-600 mt-1">
                            {t('expected')}: {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col gap-2 w-full">
                        {/* Chat Button */}
                        <button 
                          onClick={() => setChatModal({
                            orderId: order.id,
                            buyerId: order.user?.id || order.userId,
                            buyerName: order.user?.name || 'Buyer',
                            buyerEmail: order.user?.email || '',
                            otherPartyName: order.user?.name || 'Buyer',
                            senderName: 'Seller'
                          })}
                          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label="Open chat with buyer"
                        >
                          <MessageCircle size={16} />
                          <span>{t('chatWithBuyer')}</span>
                        </button>

                        {/* Review Buyer Button */}
                        {order.status === 'DELIVERED' && (
                          <button 
                            onClick={() => {
                              const existingReview = getSellerReview(order.id, order.user?.id || order.userId);
                              setReviewModal({
                                orderId: order.id,
                                buyerId: order.user?.id || order.userId,
                                buyerName: order.user?.name || 'Buyer',
                                buyerEmail: order.user?.email || '',
                                ...(existingReview && { existingReview })
                              });
                            }}
                            className={`flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              hasReviewedBuyer(order.id, order.user?.id || order.userId)
                                ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100 focus:ring-green-500'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
                            }`}
                            aria-label={hasReviewedBuyer(order.id, order.user?.id || order.userId) ? 'View or edit review' : 'Review this buyer'}
                          >
                            <Star size={16} className={hasReviewedBuyer(order.id, order.user?.id || order.userId) ? 'fill-current' : ''} />
                            <span>{hasReviewedBuyer(order.id, order.user?.id || order.userId) ? t('viewReview') : t('reviewBuyer')}</span>
                          </button>
                        )}

                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                          <Eye size={16} />
                          <span>{t('viewDetails')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noOrdersFound')}</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? t('tryAdjustingSearchOrFilter')
                  : t('youHaventReceivedAnyOrdersYet')
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {reviewModal && (
        <SellerReviewModal 
          reviewModal={reviewModal} 
          setReviewModal={setReviewModal} 
        />
      )}
      {chatModal && (
        <ChatModal 
          chatModal={chatModal} 
          setChatModal={setChatModal}
          userType="seller"
        />
      )}
    </div>
  )
}
