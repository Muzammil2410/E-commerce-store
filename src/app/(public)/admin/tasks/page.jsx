'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Plus, Calendar, User, Filter, Search } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { addTask, updateTask, deleteTask } from '@/lib/features/tasks/tasksSlice'

export default function AdminTasks() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.employees)
    const { tasks } = useSelector(state => state.tasks)
    const { employees } = useSelector(state => state.employees)
    
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState('all')
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        deadline: ''
    })
    
    useEffect(() => {
        const userData = localStorage.getItem('employeeUser')
        if (!userData) {
            navigate('/employee/login')
            return
        }
        const user = JSON.parse(userData)
        if (user.role !== 'admin') {
            navigate('/employee/dashboard')
        }
    }, [navigate])
    
    if (!currentUser || currentUser.role !== 'admin') return null
    
    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (!formData.title || !formData.assignedTo || !formData.deadline) {
            toast.error('Please fill in all required fields')
            return
        }
        
        dispatch(addTask({
            ...formData,
            assignedBy: currentUser.id
        }))
        
        toast.success('Task assigned successfully!')
        setShowForm(false)
        setFormData({
            title: '',
            description: '',
            assignedTo: '',
            priority: 'medium',
            deadline: ''
        })
    }
    
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true
        return task.status === filter
    })
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }
    }
    
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }
    }
    
    const getEmployeeName = (employeeId) => {
        const employee = employees.find(emp => emp.id === employeeId)
        return employee ? employee.name : 'Unknown'
    }
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Task Management
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        style={{ backgroundColor: '#3977ED' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2d5fcc'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3977ED'
                        }}
                    >
                        <Plus className="w-5 h-5" />
                        Assign Task
                    </button>
                </div>
                
                {/* Task Form */}
                {showForm && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Assign New Task
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Task Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Assign To *
                                    </label>
                                    <select
                                        value={formData.assignedTo}
                                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Deadline *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-white rounded-lg font-medium transition-colors"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2d5fcc'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#3977ED'
                                    }}
                                >
                                    Assign Task
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2 text-white rounded-lg font-medium transition-colors"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2d5fcc'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#3977ED'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-400" />
                        {['all', 'pending', 'in-progress', 'completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === status
                                        ? 'text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                                style={filter === status ? { backgroundColor: '#3977ED' } : {}}
                                onMouseEnter={(e) => {
                                    if (filter === status) {
                                        e.currentTarget.style.backgroundColor = '#2d5fcc'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (filter === status) {
                                        e.currentTarget.style.backgroundColor = '#3977ED'
                                    }
                                }}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Tasks List */}
                <div className="space-y-4">
                    {filteredTasks.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                No tasks found
                            </p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <div
                                key={task.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {task.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {task.description}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <User className="w-4 h-4" />
                                                <span>{getEmployeeName(task.assignedTo)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>Due: {format(new Date(task.deadline), 'MMM d, yyyy')}</span>
                                            </div>
                                        </div>
                                        
                                        {task.status !== 'completed' && (
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {task.progress}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full"
                                                        style={{ width: `${task.progress}%`, backgroundColor: '#3977ED' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

