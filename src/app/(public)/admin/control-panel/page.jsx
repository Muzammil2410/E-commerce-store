'use client'
import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
  Instagram,
  ArrowUp,
  User,
  LogOut,
  Bell,
  Headphones
} from 'lucide-react'
import { orderDummyData, assets } from '@/assets/assets'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'
import { useTheme } from '@/contexts/ThemeContext'
import Image from '@/components/Image'
import toast from 'react-hot-toast'
import AdvancedAnalytics from '@/components/admin/AdvancedAnalytics/AdvancedAnalytics'
import SellerManagement from '@/components/admin/SellerManagement/SellerManagement'
import OrdersOperations from '@/components/admin/OrdersOperations/OrdersOperations'
import CustomerCRM from '@/components/admin/CustomerCRM/CustomerCRM'
import MarketingGrowth from '@/components/admin/MarketingGrowth/MarketingGrowth'
import AutomationSecurity from '@/components/admin/AutomationSecurity/AutomationSecurity'

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
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState(3) // 3, 6, or 12 months
  const [showDisapproveModal, setShowDisapproveModal] = useState(false)
  const [selectedSellerForAction, setSelectedSellerForAction] = useState(null)
  const [disapprovalReason, setDisapprovalReason] = useState('')
  const [supportMessages, setSupportMessages] = useState([])
  const [selectedSupport, setSelectedSupport] = useState(null)
  const [showSupportDetailModal, setShowSupportDetailModal] = useState(false)

  // Navigation items for e-commerce platform
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'buyers', label: 'Buyers', icon: Users },
    { id: 'customer-crm', label: 'Customer / CRM', icon: Users },
    { id: 'sellers', label: 'Sellers', icon: Store },
    { id: 'seller-management', label: 'Seller Management', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'orders-operations', label: 'Orders & Operations', icon: ShoppingBag },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'advanced-analytics', label: 'Advanced Analytics', icon: BarChart3 },
    { id: 'marketing-growth', label: 'Marketing & Growth', icon: TrendingUp },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'customer-support', label: 'Customer Support', icon: Headphones },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'automation-security', label: 'Automation & Security', icon: ShieldCheck },
  ]

  // Load data on mount
  useEffect(() => {
    // Check for control panel admin authentication
    const controlPanelAdmin = localStorage.getItem('controlPanelAdmin')
    if (!controlPanelAdmin) {
      toast.error('Please login to access the control panel')
      navigate('/admin/control-panel/login')
      return
    }

    loadUsers()
    loadOrders()
    loadSellers()
    loadSupportMessages()
  }, [navigate])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.relative')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

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

  const loadSupportMessages = () => {
    // Load support messages from localStorage
    const storedSupport = JSON.parse(localStorage.getItem('supportMessages') || '[]')
    setSupportMessages(storedSupport)
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

  const handleApproveSeller = (seller) => {
    // Update seller status to approved
    const updatedSellers = sellers.map(s => 
      s.email === seller.email ? { ...s, verificationStatus: 'approved', approvedAt: new Date().toISOString() } : s
    )
    setSellers(updatedSellers)
    localStorage.setItem('sellers', JSON.stringify(updatedSellers))
    toast.success(`${seller.businessName || seller.fullName} has been approved!`)
  }

  const handleDisapproveSeller = () => {
    if (!disapprovalReason.trim()) {
      toast.error('Please provide a reason for disapproval')
      return
    }

    // Update seller status to disapproved with reason
    const updatedSellers = sellers.map(s => 
      s.email === selectedSellerForAction.email 
        ? { 
            ...s, 
            verificationStatus: 'disapproved', 
            disapprovedAt: new Date().toISOString(),
            disapprovalReason: disapprovalReason.trim()
          } 
        : s
    )
    setSellers(updatedSellers)
    localStorage.setItem('sellers', JSON.stringify(updatedSellers))
    toast.success(`${selectedSellerForAction.businessName || selectedSellerForAction.fullName} has been disapproved`)
    
    // Close modal and reset
    setShowDisapproveModal(false)
    setSelectedSellerForAction(null)
    setDisapprovalReason('')
  }

  const openDisapproveModal = (seller) => {
    setSelectedSellerForAction(seller)
    setShowDisapproveModal(true)
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

    // Generate sample data for the chart based on timeframe
    const generateChartData = () => {
      const data = []
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentMonth = new Date().getMonth()
      
      for (let i = analyticsTimeframe - 1; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12
        const revenue = Math.floor(Math.random() * 50000) + 20000
        const orderCount = Math.floor(Math.random() * 200) + 50
        
        data.push({
          month: months[monthIndex],
          revenue: revenue,
          orders: orderCount
        })
      }
      return data
    }

    const chartData = generateChartData()
    const maxRevenue = Math.max(...chartData.map(d => d.revenue))

    // Download handlers
    const handleDownloadPDF = () => {
      toast.success(`Downloading ${analyticsTimeframe} months analytics as PDF...`)
      // In a real implementation, you would generate and download the PDF here
      console.log(`PDF download requested for ${analyticsTimeframe} months`)
    }

    const handleDownloadCSV = () => {
      toast.success(`Downloading ${analyticsTimeframe} months analytics as CSV...`)
      // Generate CSV data
      const csvContent = [
        ['Month', 'Revenue', 'Orders'],
        ...chartData.map(d => [d.month, d.revenue, d.orders])
      ].map(row => row.join(',')).join('\n')
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `analytics-${analyticsTimeframe}-months.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Platform performance metrics and insights</p>
          </div>
          
          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* PDF Download */}
            <div className="relative group">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[140px]">
                <button
                  onClick={() => { setAnalyticsTimeframe(3); handleDownloadPDF(); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors"
                >
                  Last 3 Months
                </button>
                <button
                  onClick={() => { setAnalyticsTimeframe(6); handleDownloadPDF(); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Last 6 Months
                </button>
                <button
                  onClick={() => { setAnalyticsTimeframe(12); handleDownloadPDF(); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg transition-colors"
                >
                  Last 12 Months
                </button>
              </div>
            </div>

            {/* CSV Download */}
            <div className="relative group">
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[140px]">
                <button
                  onClick={() => { setAnalyticsTimeframe(3); handleDownloadCSV(); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors"
                >
                  Last 3 Months
                </button>
                <button
                  onClick={() => { setAnalyticsTimeframe(6); handleDownloadCSV(); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Last 6 Months
                </button>
                <button
                  onClick={() => { setAnalyticsTimeframe(12); handleDownloadCSV(); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg transition-colors"
                >
                  Last 12 Months
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 12% from last period</p>
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

        {/* Timeframe Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setAnalyticsTimeframe(3)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              analyticsTimeframe === 3
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => setAnalyticsTimeframe(6)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              analyticsTimeframe === 6
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setAnalyticsTimeframe(12)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              analyticsTimeframe === 12
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            12 Months
          </button>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue & Orders Trend</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Last {analyticsTimeframe} months performance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Orders</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="relative h-80">
            <div className="absolute inset-0 flex items-end justify-between gap-2 px-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  {/* Revenue Bar */}
                  <div className="relative w-full flex flex-col items-center group">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer"
                      style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        <div className="font-semibold">{data.month}</div>
                        <div>Revenue: {formatCurrency(data.revenue)}</div>
                        <div>Orders: {data.orders}</div>
                      </div>
                    </div>
                  </div>
                  {/* Month Label */}
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Y-axis labels */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(maxRevenue / 2)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(maxRevenue)}</span>
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
    const approvedSellers = sellers.filter(s => s.verificationStatus === 'approved')
    const pendingSellers = sellers.filter(s => !s.verificationStatus || s.verificationStatus === 'pending')
    const disapprovedSellers = sellers.filter(s => s.verificationStatus === 'disapproved')

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Verification</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Review and verify seller documentation</p>
        </div>

        {/* Verification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sellers</p>
              <Store className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{sellers.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedSellers.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingSellers.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Disapproved</p>
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{disapprovedSellers.length}</p>
          </div>
        </div>

        {/* Pending Verification */}
        {pendingSellers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingSellers.map((seller, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{seller.businessName || seller.fullName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{seller.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleViewDetails(seller, 'seller')}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Review Documents
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveSeller(seller)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openDisapproveModal(seller)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Disapprove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Sellers */}
        {approvedSellers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Approved Sellers</h3>
            <div className="space-y-2">
              {approvedSellers.map((seller, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {seller.businessName || seller.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {seller.email} • Approved on {seller.approvedAt ? new Date(seller.approvedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDetails(seller, 'seller')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disapproved Sellers */}
        {disapprovedSellers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Disapproved Sellers</h3>
            <div className="space-y-2">
              {disapprovedSellers.map((seller, index) => (
                <div key={index} className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {seller.businessName || seller.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {seller.email} • Disapproved on {seller.disapprovedAt ? new Date(seller.disapprovedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(seller, 'seller')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                  {seller.disapprovalReason && (
                    <div className="mt-2 pl-8">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Reason for Disapproval:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded border border-red-200 dark:border-red-800">
                        {seller.disapprovalReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {sellers.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Store className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No sellers registered yet</p>
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
                onClick={() => setActiveTab('overview')}
                className="w-full px-4 py-2 text-left bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
              >
                Go to Overview Dashboard
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

  // Render Customer Support Tab
  const renderCustomerSupportTab = () => {
    const pendingSupport = supportMessages.filter(m => m.status === 'pending' || !m.status)
    const resolvedSupport = supportMessages.filter(m => m.status === 'resolved')

    const handleResolveSupport = (messageId) => {
      const updated = supportMessages.map(m => 
        m.id === messageId ? { ...m, status: 'resolved', resolvedAt: new Date().toISOString() } : m
      )
      setSupportMessages(updated)
      localStorage.setItem('supportMessages', JSON.stringify(updated))
      toast.success('Support request marked as resolved')
    }

    const handleViewSupport = (message) => {
      setSelectedSupport(message)
      setShowSupportDetailModal(true)
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Support</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage customer support requests</p>
          </div>
          <button
            onClick={() => loadSupportMessages()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
              <Headphones className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{supportMessages.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingSupport.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{resolvedSupport.length}</p>
          </div>
        </div>

        {/* Pending Support Messages */}
        {pendingSupport.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Support Requests</h3>
            <div className="space-y-3">
              {pendingSupport.map((message) => (
                <div key={message.id} className="border border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                        <Headphones className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {message.userName || message.email || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {message.email} • {new Date(message.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewSupport(message)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleResolveSupport(message.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                  {message.query && (
                    <div className="ml-13 mt-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {message.query}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolved Support Messages */}
        {resolvedSupport.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resolved Support Requests</h3>
            <div className="space-y-2">
              {resolvedSupport.map((message) => (
                <div key={message.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {message.userName || message.email || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Resolved on {message.resolvedAt ? new Date(message.resolvedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewSupport(message)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {supportMessages.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Headphones className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No support messages yet</p>
          </div>
        )}
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
        <div className="flex items-center justify-between pl-0 pr-6 py-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-600 dark:text-gray-300 ml-2"
            >
              {isSidebarOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="bg-transparent dark:bg-gray-800 rounded transition-colors duration-200 overflow-hidden flex items-center justify-start">
              <Image 
                src={isDarkMode ? assets.helloLogo : assets.zizla_logo} 
                alt="Zizla Logo" 
                width={350} 
                height={140} 
                className="h-16 md:h-20 lg:h-24 w-auto"
                style={{
                  backgroundColor: isDarkMode ? '#1f2937' : 'transparent',
                  display: 'block',
                  objectFit: 'contain',
                  width: 'auto',
                  maxWidth: 'none',
                  ...(isDarkMode ? {} : { filter: 'contrast(1.2) brightness(1.1)' })
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-6 relative">
            <button 
              onClick={() => {
                toast.success('Chat feature coming soon in Control Panel!')
              }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                toast.success('Notifications feature coming soon!')
              }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => {
                setActiveTab('settings')
              }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Profile Settings"
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="User Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@zizla.com</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setActiveTab('settings')
                      setShowUserMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>System Settings</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      localStorage.removeItem('controlPanelAdmin')
                      toast.success('Logged out successfully!')
                      setTimeout(() => navigate('/admin/control-panel/login'), 1000)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
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
              <button onClick={() => setActiveTab('overview')} className="hover:text-gray-900 dark:hover:text-gray-200">
                Admin Control Panel
              </button>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-medium">Control Panel</span>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && renderAnalyticsTab()}
          {activeTab === 'buyers' && renderUsersTab()}
          {activeTab === 'customer-crm' && <CustomerCRM formatCurrency={formatCurrency} />}
          {activeTab === 'sellers' && renderSellersTab()}
          {activeTab === 'seller-management' && <SellerManagement formatCurrency={formatCurrency} />}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'orders-operations' && <OrdersOperations formatCurrency={formatCurrency} />}
          {activeTab === 'revenue' && renderRevenueTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'advanced-analytics' && <AdvancedAnalytics formatCurrency={formatCurrency} />}
          {activeTab === 'marketing-growth' && <MarketingGrowth formatCurrency={formatCurrency} />}
          {activeTab === 'verification' && renderVerificationTab()}
          {activeTab === 'customer-support' && renderCustomerSupportTab()}
          {activeTab === 'settings' && renderSettingsTab()}
          {activeTab === 'automation-security' && <AutomationSecurity formatCurrency={formatCurrency} />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 dark:bg-blue-900 transition-colors duration-200 mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16 py-8 sm:py-10 border-b border-gray-700 dark:border-gray-700 text-white transition-colors duration-200">
            {/* Company Information - Left Side */}
            <div className="w-full lg:w-auto lg:max-w-[410px]">
              <Link to="/" className="text-4xl font-semibold text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                Zizla<span className="text-blue-500 dark:text-blue-400">.</span>
              </Link>
              <p className="mt-4 text-sm text-gray-300 dark:text-gray-300 leading-relaxed">
                Welcome to Zizla, your ultimate destination for the latest and smartest gadgets. From smartphones and smartwatches to essential accessories, we bring you the best in innovation — all in one place.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="group flex items-center justify-center w-10 h-10 bg-gray-800 dark:bg-gray-800 border border-gray-700 dark:border-gray-700 hover:border-transparent transition-all duration-300 rounded-full hover:bg-blue-600">
                  <Facebook className="w-5 h-5 stroke-white" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="group flex items-center justify-center w-10 h-10 bg-gray-800 dark:bg-gray-800 border border-gray-700 dark:border-gray-700 hover:border-transparent transition-all duration-300 rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600">
                  <Instagram className="w-5 h-5 stroke-white" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="group flex items-center justify-center w-10 h-10 bg-gray-800 dark:bg-gray-800 border border-gray-700 dark:border-gray-700 hover:border-transparent transition-all duration-300 rounded-full hover:bg-blue-400">
                  <Twitter className="w-5 h-5 stroke-white" />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="group flex items-center justify-center w-10 h-10 bg-gray-800 dark:bg-gray-800 border border-gray-700 dark:border-gray-700 hover:border-transparent transition-all duration-300 rounded-full hover:bg-blue-700">
                  <Linkedin className="w-5 h-5 stroke-white" />
                </a>
              </div>
            </div>
            
            {/* Link Sections - Right Side (3 columns with equal spacing) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-16 w-full lg:w-auto lg:flex-1">
              {/* Featured Products */}
              <div className="min-w-[150px]">
                <h3 className="font-semibold text-gray-300 dark:text-gray-300 mb-4 text-sm uppercase">Featured Products</h3>
                <ul className="space-y-2.5">
                  {orderDummyData.slice(0, 4).map((product, i) => (
                    <li key={i}>
                      <Link to={`/product/${product.id}`} className="text-sm text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white hover:underline transition">
                        {product.productName}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/shop" className="text-sm text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white hover:underline transition">
                      View All Products
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Website */}
              <div className="min-w-[150px]">
                <h3 className="font-semibold text-gray-300 dark:text-gray-300 mb-4 text-sm uppercase">Website</h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link to="/" className="text-sm text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white hover:underline transition">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="text-sm text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white hover:underline transition">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/support" className="text-sm text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white hover:underline transition">
                      Get Support
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="min-w-[150px]">
                <h3 className="font-semibold text-gray-300 dark:text-gray-300 mb-4 text-sm uppercase">Contact</h3>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 stroke-white" />
                    <span className="text-sm text-gray-300 dark:text-gray-300">+1-212-456-7890</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 stroke-white" />
                    <span className="text-sm text-gray-300 dark:text-gray-300">contact@example.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 stroke-white" />
                    <span className="text-sm text-gray-300 dark:text-gray-300">794 Francisco, 94102</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Payment Methods Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-t border-white/20 dark:border-gray-700">
            <p className="text-sm text-white dark:text-gray-300 mb-4 sm:mb-0 transition-colors duration-200">
              Copyright 2025 © Zizla All Right Reserved.
            </p>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Go to Top Button */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-700/50 border border-white/20 dark:border-gray-700 text-white dark:text-gray-300 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Go to top"
              >
                <ArrowUp size={18} />
                <span className="text-sm font-medium">Go to Top</span>
              </button>
              {/* VISA */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg px-4 py-2 flex items-center justify-center min-w-[60px]">
                <div className="text-white font-bold text-lg tracking-wider">VISA</div>
              </div>
              
              {/* Stripe */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg px-4 py-2 flex items-center justify-center min-w-[70px]">
                <div className="text-white font-semibold text-sm">Stripe</div>
              </div>
              
              {/* Mastercard */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg px-4 py-2 flex items-center justify-center min-w-[80px]">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full -ml-2"></div>
                  <span className="text-white font-bold text-xs ml-2">Mastercard</span>
                </div>
              </div>
              
              {/* American Express */}
              <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg px-4 py-2 flex items-center justify-center min-w-[90px]">
                <div className="text-white font-semibold text-xs">American Express</div>
              </div>
              
              {/* Discover */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg px-4 py-2 flex items-center justify-center min-w-[75px]">
                <div className="text-white font-bold text-sm">Discover</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {renderDetailModal()}

      {/* Support Detail Modal */}
      {showSupportDetailModal && selectedSupport && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[9998]"
            onClick={() => {
              setShowSupportDetailModal(false)
              setSelectedSupport(null)
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Support Request</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedSupport.userName || selectedSupport.email || 'Anonymous'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSupportDetailModal(false)
                    setSelectedSupport(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">{selectedSupport.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      selectedSupport.status === 'resolved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {selectedSupport.status === 'resolved' ? 'Resolved' : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Submitted</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {new Date(selectedSupport.createdAt || Date.now()).toLocaleString()}
                    </p>
                  </div>
                  {selectedSupport.resolvedAt && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {new Date(selectedSupport.resolvedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Query/Message */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</p>
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                      {selectedSupport.query || 'No message provided'}
                    </p>
                  </div>
                </div>

                {/* Attached Images */}
                {selectedSupport.images && selectedSupport.images.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Attached Images</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedSupport.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.preview || image}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedSupport.status !== 'resolved' && (
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end gap-3 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      const handleResolve = () => {
                        const updated = supportMessages.map(m => 
                          m.id === selectedSupport.id ? { ...m, status: 'resolved', resolvedAt: new Date().toISOString() } : m
                        )
                        setSupportMessages(updated)
                        localStorage.setItem('supportMessages', JSON.stringify(updated))
                        setShowSupportDetailModal(false)
                        setSelectedSupport(null)
                        toast.success('Support request marked as resolved')
                      }
                      handleResolve()
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Disapprove Modal */}
      {showDisapproveModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[9998]"
            onClick={() => {
              setShowDisapproveModal(false)
              setSelectedSellerForAction(null)
              setDisapprovalReason('')
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
              <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Disapprove Seller
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedSellerForAction?.businessName || selectedSellerForAction?.fullName}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Disapproval <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={disapprovalReason}
                    onChange={(e) => setDisapprovalReason(e.target.value)}
                    placeholder="Please provide a detailed reason for disapproving this seller..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows="5"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This reason will be visible to the seller and stored in their records.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Important Notice</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                        Disapproving this seller will prevent them from selling on the platform. Make sure to provide a clear and valid reason.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                <button
                  onClick={() => {
                    setShowDisapproveModal(false)
                    setSelectedSellerForAction(null)
                    setDisapprovalReason('')
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisapproveSeller}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Confirm Disapproval
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

