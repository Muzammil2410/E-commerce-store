'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, AlertCircle, CheckCircle2, Clock, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { updateTaskProgress } from '@/lib/features/tasks/tasksSlice'

export default function TaskDetail() {
    const navigate = useNavigate()
    const { id } = useParams()
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.employees)
    const { tasks } = useSelector(state => state.tasks)
    
    const [progress, setProgress] = useState(0)
    
    useEffect(() => {
        const userData = localStorage.getItem('employeeUser')
        if (!userData) {
            navigate('/employee/login')
        }
    }, [navigate])
    
    const task = tasks.find(t => t.id === id)
    
    useEffect(() => {
        if (task) {
            setProgress(task.progress)
        }
    }, [task])
    
    if (!task) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Task not found</p>
                    <button
                        onClick={() => navigate('/employee/tasks')}
                        className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Back to Tasks
                    </button>
                </div>
            </div>
        )
    }
    
    const handleProgressUpdate = () => {
        let newStatus = task.status
        if (progress === 100) {
            newStatus = 'completed'
        } else if (progress > 0 && task.status === 'pending') {
            newStatus = 'in-progress'
        }
        
        dispatch(updateTaskProgress({
            id: task.id,
            progress,
            status: newStatus
        }))
        
        toast.success('Task progress updated!')
        navigate('/employee/tasks')
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
    
    const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed'
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/employee/tasks')}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Tasks
                </button>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-start justify-between mb-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                {task.title}
                            </h1>
                            {isOverdue && (
                                <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-medium">
                                    Overdue
                                </span>
                            )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                                {task.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority} priority
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {format(new Date(task.deadline), 'MMMM d, yyyy')}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Description
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {task.description}
                        </p>
                    </div>
                    
                    {/* Progress Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Progress
                            </h2>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                {progress}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                            <div
                                className="bg-blue-600 h-3 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={(e) => setProgress(parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>
                    
                    {/* Task Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Created</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {format(new Date(task.createdAt), 'MMM d, yyyy')}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {format(new Date(task.updatedAt), 'MMM d, yyyy')}
                            </p>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleProgressUpdate}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                            Update Progress
                        </button>
                        {task.status !== 'completed' && progress === 100 && (
                            <button
                                onClick={() => {
                                    dispatch(updateTaskProgress({
                                        id: task.id,
                                        progress: 100,
                                        status: 'completed'
                                    }))
                                    toast.success('Task marked as completed!')
                                    navigate('/employee/tasks')
                                }}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                            >
                                Mark as Complete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

