'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock, AlertCircle, Calendar, Filter } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { updateTaskProgress } from '@/lib/features/tasks/tasksSlice'

export default function EmployeeTasks() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.employees)
    const { tasks } = useSelector(state => state.tasks)
    
    const [filter, setFilter] = useState('all') // all, pending, in-progress, completed
    const [sortBy, setSortBy] = useState('deadline') // deadline, priority, status
    
    useEffect(() => {
        const userData = localStorage.getItem('employeeUser')
        if (!userData) {
            navigate('/employee/login')
        }
    }, [navigate])
    
    if (!currentUser) return null
    
    const employeeTasks = tasks.filter(task => task.assignedTo === currentUser.id)
    
    const filteredTasks = employeeTasks.filter(task => {
        if (filter === 'all') return true
        return task.status === filter
    })
    
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'deadline') {
            return new Date(a.deadline) - new Date(b.deadline)
        } else if (sortBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        return 0
    })
    
    const handleStatusChange = (taskId, newStatus) => {
        const task = employeeTasks.find(t => t.id === taskId)
        if (!task) return
        
        let progress = task.progress
        if (newStatus === 'in-progress' && task.status === 'pending') {
            progress = 10
        } else if (newStatus === 'completed') {
            progress = 100
        }
        
        dispatch(updateTaskProgress({
            id: taskId,
            progress,
            status: newStatus
        }))
        
        toast.success(`Task status updated to ${newStatus}`)
    }
    
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
    
    const isOverdue = (deadline) => {
        return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString()
    }
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/employee/dashboard')}
                        className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-flex items-center"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        My Tasks
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage and track your assigned tasks
                    </p>
                </div>
                
                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
                        </div>
                        {['all', 'pending', 'in-progress', 'completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                        
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="deadline">Deadline</option>
                                <option value="priority">Priority</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Tasks List */}
                {sortedTasks.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                        <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No tasks found
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedTasks.map(task => (
                            <div
                                key={task.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => navigate(`/employee/tasks/${task.id}`)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {task.title}
                                            </h3>
                                            {isOverdue(task.deadline) && task.status !== 'completed' && (
                                                <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-medium">
                                                    Overdue
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {task.description}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center gap-4 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                {task.priority} priority
                                            </span>
                                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>Due: {format(new Date(task.deadline), 'MMM d, yyyy')}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Progress Bar */}
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
                                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${task.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            {task.status === 'pending' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleStatusChange(task.id, 'in-progress')
                                                    }}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                                                >
                                                    Start Task
                                                </button>
                                            )}
                                            {task.status === 'in-progress' && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleStatusChange(task.id, 'completed')
                                                        }}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            navigate(`/employee/tasks/${task.id}`)
                                                        }}
                                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium transition-colors"
                                                    >
                                                        Update Progress
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

