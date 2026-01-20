'use client'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  Wrench,
  TestTube2,
  Search,
  Eye,
  Package,
  Store,
  UserCheck,
  UserX,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Filter,
  Download,
  Menu,
  X as CloseIcon,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react'
import { orderDummyData, assets } from '@/assets/assets'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'
import { useTheme } from '@/contexts/ThemeContext'
import Image from '@/components/Image'
import toast from 'react-hot-toast'

export default function AdminControlPanel() {
  const navigate = useNavigate()
  const { formatCurrency } = useLanguageCurrency()
  const { isDarkMode } = useTheme()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [sellers, setSellers] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Navigation items for e-commerce platform
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'buyers', label: 'Buyers', icon: Users },
    { id: 'sellers', label: 'Sellers', icon: Store },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  // Load data on mount
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('employeeUser') || '{}')
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/employee/login')
      return
    }

    loadUsers()
    loadOrders()
    loadSellers()
  }, [navigate])

  const loadUsers = () => {
    // Load buyers from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    setUsers(storedUsers)
  }

  const loadOrders = () => {
    // Load orders from localStorage or use dummy data
    const storedOrders = JSON.parse(localStorage.getItem('orders') || 'null')
    setOrders(storedOrders || orderDummyData)
  }

  const loadSellers = () => {
    // Load sellers from localStorage
    const storedSellers = JSON.parse(localStorage.getItem('sellers') || '[]')
    const sellerProfile = JSON.parse(localStorage.getItem('sellerProfile') || 'null')
    
    const allSellers = [...storedSellers]
    if (sellerProfile && !allSellers.find(s => s.email === sellerProfile.email)) {
      allSellers.push(sellerProfile)
    }
    setSellers(allSellers)
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'DELIVERED': { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Delivered' },
      'PENDING': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Pending' },
      'CANCELLED': { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Cancelled' },
      'PROCESSING': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', label: 'Processing' },
      'SHIPPED': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', label: 'Shipped' },
    }
    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300', label: status }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    )
  }

  const handleViewDetails = (item, type) => {
    setSelectedItem({ ...item, type })
    setShowDetailModal(true)
  }

  // Render Users Tab (Contact Monitoring style)
  const renderUsersTab = () => {
    const filteredUsers = users.filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monitor and manage all buyers</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => loadUsers()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Contact Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">Customer</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {orders.filter(o => o.userId === user.id).length}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleViewDetails(user, 'user')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Render Projects Tab (Orders & Sellers)
  const renderProjectsTab = () => {
    const filteredOrders = orders.filter(order => {
      const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return (
      <div className="space-y-6">
        {/* Sellers Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sellers Management</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monitor all registered sellers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellers.map((seller, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{seller.businessName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{seller.businessType}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{seller.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{seller.phone || 'N/A'}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleViewDetails(seller, 'seller')}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
            {sellers.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Store className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No sellers registered yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Monitoring</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track all buyer-seller transactions</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900 dark:text-white">
                          #{order.id.substring(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.user?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.user?.email || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {order.orderItems?.length || 0} items
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleViewDetails(order, 'order')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render Analytics Tab
  const renderAnalyticsTab = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length
    const totalUsers = users.length
    const totalSellers = sellers.length

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Platform performance metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 12% from last month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{deliveredOrders} delivered, {pendingOrders} pending</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">Active customers</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sellers</p>
              <Store className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSellers}</p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">Registered sellers</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Order #{order.id.substring(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.user?.name || 'Unknown'} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render Sellers Tab
  const renderSellersTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sellers Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monitor all registered sellers and their performance</p>
          </div>
          <button
            onClick={() => loadSellers()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellers.map((seller, index) => {
            const sellerOrders = orders.filter(o => o.storeId === seller.id || o.sellerId === seller.id)
            const totalRevenue = sellerOrders.reduce((sum, o) => sum + o.total, 0)
            
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{seller.businessName || seller.fullName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{seller.businessType || 'Seller'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{seller.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{seller.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ShoppingBag className="w-4 h-4" />
                    <span>{sellerOrders.length} orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(totalRevenue)}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleViewDetails(seller, 'seller')}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )
          })}
          {sellers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Store className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No sellers registered yet</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render Orders Tab
  const renderOrdersTab = () => {
    const filteredOrders = orders.filter(order => {
      const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track all transactions between buyers and sellers</p>
          </div>
          <button
            onClick={() => loadOrders()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order) => {
                  const seller = sellers.find(s => s.id === order.storeId || s.id === order.sellerId)
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900 dark:text-white">
                          #{order.id.substring(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.user?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.user?.email || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {seller?.businessName || seller?.fullName || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {order.orderItems?.length || 0} items
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleViewDetails(order, 'order')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Render Revenue Tab
  const renderRevenueTab = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const deliveredRevenue = orders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + o.total, 0)
    const pendingRevenue = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').reduce((sum, o) => sum + o.total, 0)
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

    // Revenue by seller
    const revenueBySeller = sellers.map(seller => {
      const sellerOrders = orders.filter(o => o.storeId === seller.id || o.sellerId === seller.id)
      const revenue = sellerOrders.reduce((sum, o) => sum + o.total, 0)
      return {
        seller,
        revenue,
        orderCount: sellerOrders.length
      }
    }).sort((a, b) => b.revenue - a.revenue)

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Analytics</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Financial overview and seller performance</p>
        </div>

        {/* Revenue Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">All orders</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Delivered Revenue</p>
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(deliveredRevenue)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Completed orders</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Revenue</p>
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(pendingRevenue)}</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">In progress</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</p>
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(averageOrderValue)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Per order</p>
          </div>
        </div>

        {/* Top Sellers by Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Sellers by Revenue</h3>
          <div className="space-y-3">
            {revenueBySeller.slice(0, 10).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.seller.businessName || item.seller.fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.orderCount} orders
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(item.revenue)}</p>
                </div>
              </div>
            ))}
            {revenueBySeller.length === 0 && (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No revenue data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render Verification Tab
  const renderVerificationTab = () => {
    const verifiedSellers = sellers.filter(s => s.documents && Object.values(s.documents).some(doc => doc))
    const unverifiedSellers = sellers.filter(s => !s.documents || !Object.values(s.documents).some(doc => doc))

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Verification</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Review and verify seller documentation</p>
        </div>

        {/* Verification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sellers</p>
              <Store className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{sellers.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Verified</p>
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{verifiedSellers.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{unverifiedSellers.length}</p>
          </div>
        </div>

        {/* Pending Verification */}
        {unverifiedSellers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unverifiedSellers.map((seller, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{seller.businessName || seller.fullName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{seller.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDetails(seller, 'seller')}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Review Documents
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Sellers */}
        {verifiedSellers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Verified Sellers</h3>
            <div className="space-y-2">
              {verifiedSellers.map((seller, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {seller.businessName || seller.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{seller.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDetails(seller, 'seller')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render Settings Tab
  const renderSettingsTab = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your platform settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  defaultValue="E-Commerce Platform"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  defaultValue="support@ecommerce.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="w-full px-4 py-2 text-left bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
              >
                Go to Employee Dashboard
              </button>
              <button
                onClick={() => toast.success('Data refreshed')}
                className="w-full px-4 py-2 text-left bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
              >
                Refresh All Data
              </button>
              <button
                onClick={() => toast.success('Reports generated')}
                className="w-full px-4 py-2 text-left bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
              >
                Generate Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Detail Modal
  const renderDetailModal = () => {
    if (!showDetailModal || !selectedItem) return null

    return (
      <>
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[9998]"
          onClick={() => setShowDetailModal(false)}
        />
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedItem.type === 'user' ? 'User Details' : 
                 selectedItem.type === 'seller' ? 'Seller Details' : 'Order Details'}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedItem.type === 'user' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{selectedItem.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{selectedItem.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{selectedItem.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {orders.filter(o => o.userId === selectedItem.id).length}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {selectedItem.type === 'seller' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Business Name</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedItem.businessName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Business Type</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedItem.businessType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Email Address</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedItem.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Phone Number</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedItem.phone || 'N/A'}</p>
                    </div>
                    {selectedItem.ntnTaxId && (
                      <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">NTN/Tax ID</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedItem.ntnTaxId}</p>
                      </div>
                    )}
                    {selectedItem.businessAddress && (
                      <div className="col-span-2">
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Business Address</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedItem.businessAddress}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedItem.type === 'order' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                      <p className="text-base font-mono font-medium text-gray-900 dark:text-white">#{selectedItem.id.substring(0, 12)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{selectedItem.user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedItem.total)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{selectedItem.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {new Date(selectedItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Order Items</p>
                    <div className="space-y-2">
                      {selectedItem.orderItems?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            {item.product?.images?.[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product?.name || 'Product'}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(item.price)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {selectedItem.address && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Delivery Address</p>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <p className="text-sm text-gray-900 dark:text-white">{selectedItem.address.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedItem.address.street}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedItem.address.city}, {selectedItem.address.state} {selectedItem.address.zip}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Top Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-600 dark:text-gray-300"
            >
              {isSidebarOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="bg-transparent dark:bg-gray-900 px-2 py-1 rounded transition-colors duration-200 overflow-hidden flex items-center justify-center">
              <Image 
                src={isDarkMode ? assets.helloLogo : assets.zizla_logo} 
                alt="Zizla Logo" 
                width={350} 
                height={140} 
                className="h-12 md:h-14 lg:h-16 w-auto"
                style={{
                  backgroundColor: isDarkMode ? '#111827' : 'transparent',
                  display: 'block',
                  objectFit: 'contain',
                  width: 'auto',
                  maxWidth: 'none',
                  ...(isDarkMode ? {} : { filter: 'contrast(1.2) brightness(1.1)' })
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-40 overflow-y-auto`}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <button onClick={() => navigate('/admin/dashboard')} className="hover:text-gray-900 dark:hover:text-gray-200">
                Admin
              </button>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-medium">Control Panel</span>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && renderAnalyticsTab()}
          {activeTab === 'buyers' && renderUsersTab()}
          {activeTab === 'sellers' && renderSellersTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'revenue' && renderRevenueTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'verification' && renderVerificationTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="font-semibold text-lg mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Our Mission</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Join the Team</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>

            {/* For Users */}
            <div>
              <h3 className="font-semibold text-lg mb-4">For Users</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Manufacturers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Creators & Product Owners</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Use</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Settings</a></li>
              </ul>
            </div>

            {/* Language & Region */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Language & Region</h3>
              <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white mb-3 focus:ring-2 focus:ring-blue-500">
                <option>Germany</option>
                <option>United States</option>
                <option>United Kingdom</option>
              </select>
              <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                <option>English</option>
                <option>German</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>

          {/* Social & Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2025 Zizla E-Commerce. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {renderDetailModal()}
    </div>
  )
}

