'use client'
import React, { useState, useEffect } from 'react'
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
        return 'bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white shadow-lg'
      case 'PENDING':
        return 'bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 text-white shadow-lg'
      case 'CANCELLED':
        return 'bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 text-white shadow-lg'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white shadow-lg'
    }
  }

  // formatCurrency is now from context

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 transition-colors duration-300"></div>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('loadingOrders')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-11 h-11 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent transition-colors duration-300">
                  Orders Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base transition-colors duration-300">Track and manage all your customer orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-1 transition-colors duration-300">Total Orders</p>
                <p className="text-3xl font-bold">{filteredOrders.length}</p>
              </div>
              <div className="bg-white/20 dark:bg-white/10 rounded-xl p-3 backdrop-blur-sm transition-colors duration-300">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 dark:text-green-200 text-sm font-medium mb-1 transition-colors duration-300">Delivered</p>
                <p className="text-3xl font-bold">{filteredOrders.filter(o => o.status === 'DELIVERED').length}</p>
              </div>
              <div className="bg-white/20 dark:bg-white/10 rounded-xl p-3 backdrop-blur-sm transition-colors duration-300">
                <Truck className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 dark:text-amber-200 text-sm font-medium mb-1 transition-colors duration-300">Pending</p>
                <p className="text-3xl font-bold">{filteredOrders.filter(o => o.status === 'PENDING').length}</p>
              </div>
              <div className="bg-white/20 dark:bg-white/10 rounded-xl p-3 backdrop-blur-sm transition-colors duration-300">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={20} />
                <input
                  type="text"
                  placeholder="Search by order ID or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                />
              </div>
            </div>
            <div className="sm:w-56">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={18} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">All Status</option>
                  <option value="PENDING" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Pending</option>
                  <option value="DELIVERED" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Delivered</option>
                  <option value="CANCELLED" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl dark:hover:shadow-gray-900/70 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6 sm:p-8">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl p-2.5 shadow-lg transition-colors duration-300">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                            {t('order')} <span className="text-blue-600 dark:text-blue-400 transition-colors duration-300">#{order.id.slice(-8)}</span>
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1 transition-colors duration-300">
                            <Calendar size={14} />
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 text-sm font-semibold rounded-xl shadow-md transition-colors duration-300 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {isOrderDelayed(order) && (
                        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2 transition-colors duration-300">
                          <AlertCircle size={16} className="text-red-600 dark:text-red-400 transition-colors duration-300" />
                          <span className="text-xs font-medium text-red-700 dark:text-red-400 transition-colors duration-300">{t('delayed')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Customer & Items */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800 transition-colors duration-300">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500 dark:bg-blue-600 rounded-xl p-2.5 shadow-md transition-colors duration-300">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-300">Customer</p>
                              <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">{order.user.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{order.user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800 transition-colors duration-300">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-500 dark:bg-green-600 rounded-xl p-2.5 shadow-md transition-colors duration-300">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-300">Delivery</p>
                              <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">{order.address.city}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 truncate transition-colors duration-300">{order.address.street}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4 flex items-center gap-2 transition-colors duration-300">
                          <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-full transition-colors duration-300"></span>
                          {t('orderItems')} ({order.orderItems.length})
                        </h4>
                        <div className="space-y-3">
                          {order.orderItems.map((item, index) => (
                            <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-700 dark:to-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg p-3 shadow-md transition-colors duration-300">
                                    <Package className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">{translateProductName(item.product.name)}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-1 transition-colors duration-300">
                                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md text-xs font-semibold transition-colors duration-300">
                                        {t('qty')}: {item.quantity}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <p className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Total & Actions */}
                    <div className="lg:col-span-1">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl p-6 text-white shadow-2xl dark:shadow-gray-900/50 transition-colors duration-300">
                        <div className="text-center mb-6">
                          <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-2 uppercase tracking-wide transition-colors duration-300">{t('totalAmount')}</p>
                          <p className="text-4xl font-extrabold">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                        
                        {isOrderDelayed(order) && (
                          <div className="bg-red-500/20 dark:bg-red-900/30 backdrop-blur-sm border border-red-300/50 dark:border-red-800/50 rounded-xl p-3 mb-4 transition-colors duration-300">
                            <div className="flex items-center gap-2 text-red-100 dark:text-red-300 mb-1 transition-colors duration-300">
                              <AlertCircle size={16} />
                              <p className="text-xs font-bold">{t('orderDelayed')}</p>
                            </div>
                            <p className="text-xs text-red-100 dark:text-red-300 transition-colors duration-300">
                              {t('expected')}: {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        )}

                        <div className="space-y-3">
                          <button 
                            onClick={() => setChatModal({
                              orderId: order.id,
                              buyerId: order.user?.id || order.userId,
                              buyerName: order.user?.name || 'Buyer',
                              buyerEmail: order.user?.email || '',
                              otherPartyName: order.user?.name || 'Buyer',
                              senderName: 'Seller'
                            })}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300 font-semibold shadow-lg dark:shadow-gray-900/50 hover:shadow-xl transform hover:scale-105 active:scale-95"
                          >
                            <MessageCircle size={18} className="text-blue-600 dark:text-blue-400" />
                            <span>{t('chatWithBuyer')}</span>
                          </button>

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
                              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg dark:shadow-gray-900/50 hover:shadow-xl transform hover:scale-105 active:scale-95 ${
                                hasReviewedBuyer(order.id, order.user?.id || order.userId)
                                  ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700'
                                  : 'bg-white/20 dark:bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20'
                              }`}
                            >
                              <Star size={18} className={hasReviewedBuyer(order.id, order.user?.id || order.userId) ? 'fill-current' : ''} />
                              <span>{hasReviewedBuyer(order.id, order.user?.id || order.userId) ? t('viewReview') : t('reviewBuyer')}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 p-12 text-center transition-colors duration-300">
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                  <Package className="w-12 h-12 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">{t('noOrdersFound')}</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  {searchTerm || statusFilter !== 'all' 
                    ? t('tryAdjustingSearchOrFilter')
                    : t('youHaventReceivedAnyOrdersYet')
                  }
                </p>
              </div>
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
