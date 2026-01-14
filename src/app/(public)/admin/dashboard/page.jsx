'use client'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Users, CheckCircle2, Clock, Calendar, TrendingUp, AlertCircle, User, FileText, Activity } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.employees)
    const { tasks } = useSelector(state => state.tasks)
    const { records } = useSelector(state => state.attendance)
    const { requests } = useSelector(state => state.leave)
    const { employees } = useSelector(state => state.employees)
    
    useEffect(() => {
        const userData = localStorage.getItem('employeeUser')
        if (!userData) {
            navigate('/employee/login')
            return
        }
        
        try {
            const user = JSON.parse(userData)
            if (user.role !== 'admin') {
                navigate('/employee/dashboard')
            }
        } catch (error) {
            navigate('/employee/login')
        }
    }, [navigate])
    
    if (!currentUser || currentUser.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }
    
    const today = new Date().toISOString().split('T')[0]
    const todayAttendance = records.filter(record => record.date === today)
    const presentToday = todayAttendance.filter(r => r.status === 'present' || r.status === 'late').length
    
    const pendingTasks = tasks.filter(task => task.status === 'pending')
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
    const completedTasks = tasks.filter(task => task.status === 'completed')
    
    const pendingLeaveRequests = requests.filter(req => req.status === 'pending')
    
    const totalEmployees = employees.length
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Employees Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {totalEmployees}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {presentToday} present today
                        </p>
                    </div>
                    
                    {/* Tasks Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {tasks.length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2 text-xs">
                            <span className="text-gray-600 dark:text-gray-400">
                                {pendingTasks.length} Pending
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                                {inProgressTasks.length} In Progress
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                                {completedTasks.length} Done
                            </span>
                        </div>
                    </div>
                    
                    {/* Attendance Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Today's Attendance</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {presentToday}/{totalEmployees}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {Math.round((presentToday / totalEmployees) * 100)}% present
                        </p>
                    </div>
                    
                    {/* Leave Requests Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Leaves</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {pendingLeaveRequests.length}
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Awaiting approval
                        </p>
                    </div>
                </div>
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pending Leave Requests */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Pending Leave Requests
                            </h2>
                            <button
                                onClick={() => navigate('/admin/leave')}
                                className="text-sm hover:underline transition-colors"
                                style={{ color: '#3977ED' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#2d5fcc'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#3977ED'
                                }}
                            >
                                View All
                            </button>
                        </div>
                        
                        {pendingLeaveRequests.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 dark:text-gray-400">No pending requests</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingLeaveRequests.slice(0, 5).map(request => (
                                    <div
                                        key={request.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                        onClick={() => navigate('/admin/leave')}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {request.employeeName}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {request.type} • {request.days} days
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                    {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded text-xs font-medium">
                                                Pending
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Quick Actions
                            </h2>
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate('/admin/tasks')}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-white rounded transition-colors"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2d5fcc'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#3977ED'
                                    }}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Manage Tasks
                                </button>
                                <button
                                    onClick={() => navigate('/admin/attendance')}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-white rounded transition-colors"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2d5fcc'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#3977ED'
                                    }}
                                >
                                    <Clock className="w-4 h-4" />
                                    Monitor Attendance
                                </button>
                                <button
                                    onClick={() => navigate('/admin/leave')}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-white rounded transition-colors"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2d5fcc'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#3977ED'
                                    }}
                                >
                                    <Calendar className="w-4 h-4" />
                                    Manage Leaves
                                </button>
                            </div>
                        </div>
                        
                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    Recent Activity
                                </h2>
                                <button
                                    onClick={() => navigate('/admin/tasks')}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                                >
                                    View All
                                </button>
                            </div>
                            {tasks.length === 0 ? (
                                <div className="text-center py-8">
                                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {tasks.slice(0, 5).map(task => {
                                        const assignedEmployee = employees.find(emp => emp.id === task.assignedTo)
                                        const getStatusColor = (status) => {
                                            switch(status) {
                                                case 'completed':
                                                    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                case 'in-progress':
                                                    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                default:
                                                    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                            }
                                        }
                                        return (
                                            <div 
                                                key={task.id} 
                                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer hover:shadow-sm"
                                                onClick={() => navigate('/admin/tasks')}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                                                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                                {task.title}
                                                            </p>
                                                            <span className={`text-xs font-medium px-2 py-1 rounded flex-shrink-0 ${getStatusColor(task.status)}`}>
                                                                {task.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-2">
                                                            {assignedEmployee && (
                                                                <div className="flex items-center gap-1">
                                                                    <User className="w-3 h-3" />
                                                                    <span>{assignedEmployee.name}</span>
                                                                </div>
                                                            )}
                                                            {task.deadline && (
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>{format(new Date(task.deadline), 'MMM d')}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {task.description && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                                                {task.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

