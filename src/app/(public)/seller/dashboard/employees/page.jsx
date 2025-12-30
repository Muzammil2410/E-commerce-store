'use client'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  UserPlus,
  Users,
  Edit,
  Trash2,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  X,
  Shield,
  Clock,
  DollarSign,
  Ban,
  CheckCircle,
  XCircle,
  Activity,
  LogIn,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

// Predefined roles with permissions
const ROLE_PERMISSIONS = {
  'Product Manager': ['Add / Edit products'],
  'Order Manager': ['View & update orders'],
  'Warehouse Staff': ['Mark orders packed'],
  'Accounts': ['View sales & payouts'],
  'Support Staff': ['View customer messages'],
  'Admin': ['Full access']
}

export default function EmployeeManagement() {
  const navigate = useNavigate()
  const { t } = useLanguageCurrency()
  const [activeTab, setActiveTab] = useState('list')
  const [employees, setEmployees] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showSalaryModal, setShowSalaryModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    loginAccess: true,
    permissions: [],
    status: 'active',
    lastLogin: null,
    salary: {
      fixedSalary: '',
      perOrderCommission: '',
      performanceBonus: ''
    }
  })

  useEffect(() => {
    // Load employees from localStorage
    const savedEmployees = localStorage.getItem('sellerEmployees')
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: value
        }
      }))
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: ROLE_PERMISSIONS[role] || []
    }))
  }

  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingEmployee) {
      // Update existing employee
      const updatedEmployees = employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...formData, updatedAt: new Date().toISOString() }
          : emp
      )
      setEmployees(updatedEmployees)
      localStorage.setItem('sellerEmployees', JSON.stringify(updatedEmployees))
      toast.success('Employee updated successfully')
      setEditingEmployee(null)
    } else {
      // Add new employee
      const newEmployee = {
        id: `emp_${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        attendance: [],
        activityLog: []
      }
      const updatedEmployees = [...employees, newEmployee]
      setEmployees(updatedEmployees)
      localStorage.setItem('sellerEmployees', JSON.stringify(updatedEmployees))
      toast.success('Employee added successfully')
    }
    
    setShowAddModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      loginAccess: true,
      permissions: [],
      status: 'active',
      lastLogin: null,
      salary: {
        fixedSalary: '',
        perOrderCommission: '',
        performanceBonus: ''
      }
    })
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      role: employee.role || '',
      loginAccess: employee.loginAccess !== false,
      permissions: employee.permissions || [],
      status: employee.status || 'active',
      lastLogin: employee.lastLogin || null,
      salary: employee.salary || {
        fixedSalary: '',
        perOrderCommission: '',
        performanceBonus: ''
      }
    })
    setShowAddModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const updatedEmployees = employees.filter(emp => emp.id !== id)
      setEmployees(updatedEmployees)
      localStorage.setItem('sellerEmployees', JSON.stringify(updatedEmployees))
      toast.success('Employee deleted successfully')
    }
  }

  const handleBlockToggle = (employee) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === employee.id 
        ? { 
            ...emp, 
            status: emp.status === 'blocked' ? 'active' : 'blocked',
            loginAccess: emp.status === 'blocked',
            updatedAt: new Date().toISOString()
          }
        : emp
    )
    setEmployees(updatedEmployees)
    localStorage.setItem('sellerEmployees', JSON.stringify(updatedEmployees))
    toast.success(employee.status === 'blocked' ? 'Employee unblocked successfully' : 'Employee blocked successfully')
  }

  const handleSaveSalary = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId)
    if (!employee) return

    const updatedEmployees = employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, salary: formData.salary, updatedAt: new Date().toISOString() }
        : emp
    )
    setEmployees(updatedEmployees)
    localStorage.setItem('sellerEmployees', JSON.stringify(updatedEmployees))
    toast.success('Salary information updated successfully')
    setShowSalaryModal(false)
    setSelectedEmployee(null)
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone?.includes(searchQuery) ||
      emp.role?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus
    const matchesRole = filterRole === 'all' || emp.role === filterRole
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      case 'blocked':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      case 'inactive':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tabs = [
    { id: 'list', label: 'Employee List', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'attendance', label: 'Attendance / Activity', icon: Clock },
    { id: 'salary', label: 'Salary / Commission', icon: DollarSign }
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Employee Management System</h1>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Manage your team members, roles, and permissions</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingEmployee(null)
                resetForm()
                setShowAddModal(true)
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Employee</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 mb-6 transition-colors duration-300">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Employee List Tab */}
        {activeTab === 'list' && (
          <>
            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 mb-6 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search employees by name, email, phone, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  >
                    <option value="all">All Roles</option>
                    {Object.keys(ROLE_PERMISSIONS).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Employees List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 transition-colors duration-300">
              {filteredEmployees.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No employees found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {employees.length === 0 
                      ? 'Get started by adding your first employee'
                      : 'Try adjusting your search or filter criteria'}
                  </p>
                  {employees.length === 0 && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                      <Plus size={20} />
                      <span>Add Employee</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email / Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Login</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {employee.loginAccess !== false ? (
                                    <span className="flex items-center text-green-600 dark:text-green-400">
                                      <CheckCircle size={12} className="mr-1" />
                                      Login Enabled
                                    </span>
                                  ) : (
                                    <span className="flex items-center text-red-600 dark:text-red-400">
                                      <XCircle size={12} className="mr-1" />
                                      Login Disabled
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              <div className="flex items-center space-x-1 mb-1">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>{employee.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{employee.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{employee.role || 'Not assigned'}</div>
                            {employee.permissions && employee.permissions.length > 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {employee.permissions.length} permission{employee.permissions.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                              {employee.status === 'blocked' ? 'Blocked' : employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{formatDate(employee.lastLogin)}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(employee)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleBlockToggle(employee)}
                                className={employee.status === 'blocked' 
                                  ? "text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors"
                                  : "text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                                }
                                title={employee.status === 'blocked' ? 'Unblock' : 'Block'}
                              >
                                {employee.status === 'blocked' ? <CheckCircle size={18} /> : <Ban size={18} />}
                              </button>
                              <button
                                onClick={() => handleDelete(employee.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Stats Summary */}
            {employees.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Employees</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{employees.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Active Employees</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {employees.filter(emp => emp.status === 'active').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Blocked Employees</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {employees.filter(emp => emp.status === 'blocked').length}
                      </p>
                    </div>
                    <Ban className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Roles & Permissions Tab */}
        {activeTab === 'roles' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Roles & Permissions
            </h2>
            <div className="space-y-4">
              {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
                <div key={role} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{role}</h3>
                      <div className="space-y-1">
                        {permissions.map((permission, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {permission}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {employees.filter(emp => emp.role === role).length} employee{employees.filter(emp => emp.role === role).length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance / Activity Log Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Attendance & Activity Log
              </h2>
              {employees.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No employees to track attendance</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{employee.role}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Last Login:</span>
                          <span className="text-gray-900 dark:text-white font-medium">{formatDate(employee.lastLogin)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Activity Log Entries:</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {employee.activityLog?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Attendance Records:</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {employee.attendance?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Salary / Commission Tab */}
        {activeTab === 'salary' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Salary & Commission Management
            </h2>
            {employees.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">No employees to manage salary</p>
              </div>
            ) : (
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{employee.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee)
                          setFormData(prev => ({
                            ...prev,
                            salary: employee.salary || {
                              fixedSalary: '',
                              perOrderCommission: '',
                              performanceBonus: ''
                            }
                          }))
                          setShowSalaryModal(true)
                        }}
                        className="px-3 py-1.5 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                      >
                        <Settings size={16} className="inline mr-1" />
                        Manage
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fixed Salary</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${employee.salary?.fixedSalary || '0.00'}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Per Order Commission</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${employee.salary?.perOrderCommission || '0.00'}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Performance Bonus</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${employee.salary?.performanceBonus || '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Employee Modal */}
      {showAddModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 transition-colors duration-300"
            onClick={() => {
              setShowAddModal(false)
              setEditingEmployee(null)
              resetForm()
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-2xl w-full p-6 relative my-8 transition-colors duration-300 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingEmployee(null)
                  resetForm()
                }}
                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pr-8">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    >
                      <option value="">Select Role</option>
                      {Object.keys(ROLE_PERMISSIONS).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <input
                    type="checkbox"
                    name="loginAccess"
                    id="loginAccess"
                    checked={formData.loginAccess}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="loginAccess" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Login Access
                  </label>
                </div>

                {formData.role && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions</label>
                    <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      {ROLE_PERMISSIONS[formData.role]?.map((permission, idx) => (
                        <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission)}
                            onChange={() => handlePermissionToggle(permission)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {editingEmployee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Login</label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {formatDate(editingEmployee.lastLogin)}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingEmployee(null)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    {editingEmployee ? 'Update' : 'Add'} Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Salary Management Modal */}
      {showSalaryModal && selectedEmployee && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 transition-colors duration-300"
            onClick={() => {
              setShowSalaryModal(false)
              setSelectedEmployee(null)
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-md w-full p-6 relative transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowSalaryModal(false)
                  setSelectedEmployee(null)
                }}
                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 pr-8">
                Salary & Commission - {selectedEmployee.name}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fixed Salary ($)</label>
                  <input
                    type="number"
                    name="salary.fixedSalary"
                    value={formData.salary.fixedSalary}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Per Order Commission ($)</label>
                  <input
                    type="number"
                    name="salary.perOrderCommission"
                    value={formData.salary.perOrderCommission}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Performance Bonus ($)</label>
                  <input
                    type="number"
                    name="salary.performanceBonus"
                    value={formData.salary.performanceBonus}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSalaryModal(false)
                      setSelectedEmployee(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSalary(selectedEmployee.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
