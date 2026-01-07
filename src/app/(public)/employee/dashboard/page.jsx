'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, CheckCircle2, AlertCircle, TrendingUp, Bell } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function EmployeeDashboard() {
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.employees)
    const { tasks } = useSelector(state => state.tasks)
    const { records, currentSessions } = useSelector(state => state.attendance)
    const { requests } = useSelector(state => state.leave)
    
    const [todayAttendance, setTodayAttendance] = useState(null)
    const [isClockedIn, setIsClockedIn] = useState(false)
    
    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('employeeUser')
        if (!userData) {
            navigate('/employee/login')
            return
        }
        
        // Set current user from localStorage if not in Redux
        if (!currentUser) {
            try {
                const user = JSON.parse(userData)
                if (user.role !== 'employee' && user.role !== 'admin') {
                    navigate('/employee/login')
                }
            } catch (error) {
                navigate('/employee/login')
            }
        }
    }, [navigate, currentUser])
    
    useEffect(() => {
        if (!currentUser) return
        
        const today = new Date().toISOString().split('T')[0]
        const todayRecord = records.find(
            record => record.employeeId === currentUser.id && record.date === today
        )
        
        setTodayAttendance(todayRecord)
        setIsClockedIn(!!currentSessions[currentUser.id])
    }, [currentUser, records, currentSessions])
    
    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }
    
    const employeeTasks = tasks.filter(task => task.assignedTo === currentUser.id)
    const pendingTasks = employeeTasks.filter(task => task.status === 'pending')
    const inProgressTasks = employeeTasks.filter(task => task.status === 'in-progress')
    const completedTasks = employeeTasks.filter(task => task.status === 'completed')
    
    const pendingLeaveRequests = requests.filter(
        req => req.employeeId === currentUser.id && req.status === 'pending'
    )
    
    const recentAttendance = records
        .filter(record => record.employeeId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                        Welcome back, {currentUser.name}!
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
                        {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Tasks Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Tasks</p>
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
                                    {employeeTasks.length}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3 text-xs font-semibold">
                            <span className="text-yellow-600 dark:text-yellow-400">
                                {pendingTasks.length} Pending
                            </span>
                            <span className="text-blue-600 dark:text-blue-400">
                                {inProgressTasks.length} In Progress
                            </span>
                            <span className="text-green-600 dark:text-green-400">
                                {completedTasks.length} Done
                            </span>
                        </div>
                    </div>
                    
                    {/* Attendance Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Today's Status</p>
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
                                    {isClockedIn ? 'Clocked In' : todayAttendance?.status || 'Not Started'}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        {todayAttendance?.hoursWorked > 0 && (
                            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                {todayAttendance.hoursWorked} hours worked
                            </p>
                        )}
                    </div>
                    
                    {/* Leave Requests Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Leave Requests</p>
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
                                    {pendingLeaveRequests.length}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                            Pending approval
                        </p>
                    </div>
                    
                    {/* Performance Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Completion Rate</p>
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
                                    {employeeTasks.length > 0 
                                        ? Math.round((completedTasks.length / employeeTasks.length) * 100)
                                        : 0}%
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                            {completedTasks.length} of {employeeTasks.length} tasks
                        </p>
                    </div>
                </div>
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Tasks */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Today's Tasks
                            </h2>
                            <button
                                onClick={() => navigate('/employee/tasks')}
                                className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800"
                            >
                                View All
                            </button>
                        </div>
                        
                        {employeeTasks.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-base font-medium text-gray-600 dark:text-gray-400">No tasks assigned</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {employeeTasks.slice(0, 5).map(task => (
                                    <div
                                        key={task.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600"
                                        onClick={() => navigate(`/employee/tasks/${task.id}`)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                                    {task.title}
                                                </h3>
                                                <p className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                                                    {task.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                                                        task.status === 'completed' 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : task.status === 'in-progress'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                        {task.status}
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                        Due: {format(new Date(task.deadline), 'MMM d')}
                                                    </span>
                                                </div>
                                            </div>
                                            {task.status !== 'completed' && (
                                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${task.progress}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Quick Actions & Recent Attendance */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                                Quick Actions
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/employee/attendance')}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base border border-blue-700 dark:border-blue-600"
                                >
                                    <Clock className="w-5 h-5" />
                                    <span>Mark Attendance</span>
                                </button>
                                <button
                                    onClick={() => navigate('/employee/leave')}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base border border-purple-700 dark:border-purple-600"
                                >
                                    <Calendar className="w-5 h-5" />
                                    <span>Request Leave</span>
                                </button>
                                <button
                                    onClick={() => navigate('/employee/tasks')}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base border border-green-700 dark:border-green-600"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>View Tasks</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Recent Attendance */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                                Recent Attendance
                            </h2>
                            {recentAttendance.length === 0 ? (
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No attendance records</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentAttendance.map(record => (
                                        <div
                                            key={record.id}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <div>
                                                <p className="text-gray-900 dark:text-white font-semibold text-base">
                                                    {format(new Date(record.date), 'MMM d, yyyy')}
                                                </p>
                                                {record.clockIn && (
                                                    <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mt-0.5">
                                                        {format(new Date(record.clockIn), 'h:mm a')} -{' '}
                                                        {record.clockOut 
                                                            ? format(new Date(record.clockOut), 'h:mm a')
                                                            : 'In Progress'}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                                                record.status === 'present'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : record.status === 'late'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

