'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, CheckCircle2, AlertCircle, TrendingUp, Bell, X, Upload, MessageSquare, FileText, Flag, ChevronLeft, ChevronRight, Zap, Download, Trash2 } from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, startOfMonth, endOfMonth } from 'date-fns'
import toast from 'react-hot-toast'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { addTaskFile, addTaskComment, removeTaskFile, updateTask } from '@/lib/features/tasks/tasksSlice'

export default function EmployeeDashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.employees)
    const { tasks } = useSelector(state => state.tasks)
    const { records, currentSessions } = useSelector(state => state.attendance)
    const { requests } = useSelector(state => state.leave)
    
    const [todayAttendance, setTodayAttendance] = useState(null)
    const [isClockedIn, setIsClockedIn] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [performanceView, setPerformanceView] = useState('weekly') // 'weekly' or 'monthly'
    const [calendarMonth, setCalendarMonth] = useState(new Date())
    const [selectedTaskId, setSelectedTaskId] = useState(null)
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [taskComment, setTaskComment] = useState('')
    const [attendanceHistoryView, setAttendanceHistoryView] = useState('recent') // 'recent' or 'all'
    const [showOvertimeDetails, setShowOvertimeDetails] = useState(false)
    
    // Get selected task from Redux state to ensure it's always up-to-date
    const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null
    
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
        
        // Generate notifications
        generateNotifications()
    }, [currentUser, records, currentSessions, tasks, requests])
    
    const generateNotifications = () => {
        const newNotifications = []
        
        // New tasks assigned
        const recentTasks = tasks.filter(task => 
            task.assignedTo === currentUser.id && 
            new Date(task.createdAt || new Date()) > subDays(new Date(), 1)
        )
        recentTasks.forEach(task => {
            newNotifications.push({
                id: `task-${task.id}`,
                type: 'task',
                title: 'New Task Assigned',
                message: `You have been assigned: ${task.title}`,
                time: new Date(),
                read: false,
                icon: '🔔'
            })
        })
        
        // Leave request updates
        const leaveUpdates = requests.filter(req => 
            req.employeeId === currentUser.id && 
            req.status !== 'pending' &&
            new Date(req.updatedAt || new Date()) > subDays(new Date(), 1)
        )
        leaveUpdates.forEach(req => {
            newNotifications.push({
                id: `leave-${req.id}`,
                type: 'leave',
                title: `Leave Request ${req.status === 'approved' ? 'Approved' : 'Rejected'}`,
                message: `Your leave request for ${format(new Date(req.startDate), 'MMM d')} has been ${req.status}`,
                time: new Date(),
                read: false,
                icon: req.status === 'approved' ? '✅' : '❌'
            })
        })
        
        // Deadline reminders
        const upcomingDeadlines = tasks.filter(task => 
            task.assignedTo === currentUser.id &&
            task.status !== 'completed' &&
            new Date(task.deadline) <= new Date(Date.now() + 24 * 60 * 60 * 1000) &&
            new Date(task.deadline) > new Date()
        )
        upcomingDeadlines.forEach(task => {
            newNotifications.push({
                id: `deadline-${task.id}`,
                type: 'deadline',
                title: 'Deadline Reminder',
                message: `${task.title} is due ${format(new Date(task.deadline), 'MMM d, h:mm a')}`,
                time: new Date(),
                read: false,
                icon: '⏰'
            })
        })
        
        setNotifications(newNotifications)
    }
    
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
    
    // Calculate comprehensive efficiency score
    const calculateEfficiencyScore = () => {
        if (completedTasks.length === 0) return 0
        
        let score = 0
        let totalWeight = 0
        
        // Factor 1: On-time completion (40% weight)
        const onTimeTasks = completedTasks.filter(task => {
            if (!task.completedAt) return false
            return new Date(task.completedAt) <= new Date(task.deadline)
        })
        const onTimeRate = onTimeTasks.length / completedTasks.length
        score += onTimeRate * 40
        totalWeight += 40
        
        // Factor 2: Task completion rate (30% weight)
        const completionRate = completedTasks.length / employeeTasks.length
        score += completionRate * 30
        totalWeight += 30
        
        // Factor 3: Average progress on active tasks (20% weight)
        const activeTasks = employeeTasks.filter(t => t.status !== 'completed')
        if (activeTasks.length > 0) {
            const avgProgress = activeTasks.reduce((sum, t) => sum + (t.progress || 0), 0) / activeTasks.length
            score += (avgProgress / 100) * 20
            totalWeight += 20
        } else {
            totalWeight += 20
        }
        
        // Factor 4: Priority handling (10% weight) - high priority tasks completed first
        const highPriorityCompleted = completedTasks.filter(t => t.priority === 'high').length
        const highPriorityTotal = employeeTasks.filter(t => t.priority === 'high').length
        if (highPriorityTotal > 0) {
            const priorityRate = highPriorityCompleted / highPriorityTotal
            score += priorityRate * 10
        }
        totalWeight += 10
        
        return Math.round(score)
    }
    
    const efficiencyScore = calculateEfficiencyScore()
    const onTimeTasks = completedTasks.filter(task => {
        if (!task.completedAt) return false
        return new Date(task.completedAt) <= new Date(task.deadline)
    })
    const delayedTasks = completedTasks.filter(task => {
        if (!task.completedAt) return false
        return new Date(task.completedAt) > new Date(task.deadline)
    })
    
    // Performance data for charts
    const getPerformanceData = () => {
        const days = performanceView === 'weekly' ? 7 : 30
        const data = []
        
        for (let i = days - 1; i >= 0; i--) {
            const date = subDays(new Date(), i)
            const dateStr = format(date, 'MMM d')
            const tasksOnDate = employeeTasks.filter(task => {
                const taskDate = new Date(task.createdAt || task.deadline)
                return isSameDay(taskDate, date)
            })
            const completedOnDate = completedTasks.filter(task => {
                if (!task.completedAt) return false
                return isSameDay(new Date(task.completedAt), date)
            })
            
            data.push({
                date: dateStr,
                tasks: tasksOnDate.length,
                completed: completedOnDate.length,
                efficiency: completedOnDate.length > 0 ? Math.round((completedOnDate.filter(t => 
                    new Date(t.completedAt) <= new Date(t.deadline)
                ).length / completedOnDate.length) * 100) : 0
            })
        }
        
        return data
    }
    
    // Task completion trend
    const getTaskTrendData = () => {
        const weeks = []
        for (let i = 3; i >= 0; i--) {
            const weekStart = startOfWeek(subDays(new Date(), i * 7))
            const weekEnd = endOfWeek(subDays(new Date(), i * 7))
            const weekTasks = employeeTasks.filter(task => {
                const taskDate = new Date(task.createdAt || task.deadline)
                return taskDate >= weekStart && taskDate <= weekEnd
            })
            const weekCompleted = completedTasks.filter(task => {
                if (!task.completedAt) return false
                const completedDate = new Date(task.completedAt)
                return completedDate >= weekStart && completedDate <= weekEnd
            })
            
            weeks.push({
                week: `Week ${4 - i}`,
                assigned: weekTasks.length,
                completed: weekCompleted.length
            })
        }
        return weeks
    }
    
    // Attendance calendar data
    const getCalendarDays = () => {
        const monthStart = startOfMonth(calendarMonth)
        const monthEnd = endOfMonth(calendarMonth)
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
        
        return days.map(day => {
            const dayStr = day.toISOString().split('T')[0]
            const attendance = records.find(r => 
                r.employeeId === currentUser.id && r.date === dayStr
            )
            
            return {
                date: day,
                dayStr,
                attendance,
                isToday: isToday(day)
            }
        })
    }
    
    // Calculate comprehensive overtime hours
    const calculateOvertime = () => {
        const thisMonth = records.filter(r => {
            if (r.employeeId !== currentUser.id) return false
            const recordDate = new Date(r.date)
            return recordDate.getMonth() === calendarMonth.getMonth() &&
                   recordDate.getFullYear() === calendarMonth.getFullYear()
        })
        
        const totalHours = thisMonth.reduce((sum, r) => sum + (r.hoursWorked || 0), 0)
        const workingDays = thisMonth.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'half-day').length
        const standardHours = workingDays * 8 // Assuming 8 hours per day
        const overtime = Math.max(0, totalHours - standardHours)
        
        // Calculate daily breakdown
        const dailyBreakdown = thisMonth
            .filter(r => r.hoursWorked > 0)
            .map(r => {
                const dayOvertime = Math.max(0, (r.hoursWorked || 0) - 8)
                return {
                    date: r.date,
                    clockIn: r.clockIn,
                    clockOut: r.clockOut,
                    hoursWorked: r.hoursWorked,
                    standardHours: 8,
                    overtime: dayOvertime,
                    status: r.status
                }
            })
            .filter(d => d.overtime > 0)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        
        return { 
            total: totalHours, 
            standard: standardHours, 
            overtime,
            workingDays,
            dailyBreakdown
        }
    }
    
    const overtimeData = calculateOvertime()
    
    const pendingLeaveRequests = requests.filter(
        req => req.employeeId === currentUser.id && req.status === 'pending'
    )
    
    const recentAttendance = records
        .filter(record => record.employeeId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    
    const unreadNotifications = notifications.filter(n => !n.read).length
    
    const handleTaskStatusChange = (taskId, newStatus) => {
        dispatch(updateTask({
            id: taskId,
            updates: {
                status: newStatus,
                ...(newStatus === 'completed' && { completedAt: new Date().toISOString() })
            }
        }))
        toast.success(`Task status changed to ${newStatus}`)
    }
    
    const handleFileUpload = (taskId, file) => {
        if (!file) return
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB')
            return
        }
        
        dispatch(addTaskFile({
            taskId,
            file
        }))
        toast.success('File uploaded successfully')
    }
    
    const handleAddComment = (taskId) => {
        if (!taskComment.trim()) return
        
        dispatch(addTaskComment({
            taskId,
            comment: taskComment,
            authorId: currentUser?.id || 'unknown',
            authorName: currentUser?.name || 'Employee'
        }))
        toast.success('Comment added')
        setTaskComment('')
    }
    
    const handleRemoveFile = (taskId, fileId) => {
        dispatch(removeTaskFile({ taskId, fileId }))
        toast.success('File removed')
    }
    
    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
        }
    }
    
    const performanceData = getPerformanceData()
    const trendData = getTaskTrendData()
    const calendarDays = getCalendarDays()
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                {/* Header with Notifications */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            Welcome back, {currentUser.name}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(), 'EEEE, MMMM d, yyyy')}
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            {unreadNotifications > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadNotifications}
                                </span>
                            )}
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto shadow-lg">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                                    <button
                                        onClick={() => setShowNotifications(false)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {notifications.length === 0 ? (
                                        <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">No notifications</p>
                                    ) : (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                                onClick={() => {
                                                    setNotifications(prev => prev.map(n => 
                                                        n.id === notif.id ? { ...n, read: true } : n
                                                    ))
                                                }}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl">{notif.icon}</span>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{notif.title}</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                            {format(notif.time, 'MMM d, h:mm a')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Tasks Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {employeeTasks.length}
                                </p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="mt-3 flex gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <span>{pendingTasks.length} Pending</span>
                            <span>{inProgressTasks.length} In Progress</span>
                            <span>{completedTasks.length} Done</span>
                        </div>
                    </div>
                    
                    {/* Attendance Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Today's Status</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {isClockedIn ? 'Clocked In' : todayAttendance?.status || 'Not Started'}
                                </p>
                            </div>
                            <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        {todayAttendance?.hoursWorked > 0 && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {todayAttendance.hoursWorked} hours worked
                            </p>
                        )}
                    </div>
                    
                    {/* Efficiency Score Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency Score</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {efficiencyScore}%
                                </p>
                            </div>
                            <Zap className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {onTimeTasks.length} on-time, {delayedTasks.length} delayed
                        </p>
                    </div>
                    
                    {/* Overtime Hours Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Overtime Hours</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {overtimeData.overtime.toFixed(1)}
                                </p>
                            </div>
                            <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            This month
                        </p>
                    </div>
                </div>
                
                {/* Performance & Progress Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Weekly/Monthly Performance Graph */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Performance Graph
                            </h2>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setPerformanceView('weekly')}
                                    className={`px-3 py-1 text-sm rounded ${
                                        performanceView === 'weekly'
                                            ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                                >
                                    Weekly
                                </button>
                                <button
                                    onClick={() => setPerformanceView('monthly')}
                                    className={`px-3 py-1 text-sm rounded ${
                                        performanceView === 'monthly'
                                            ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                                >
                                    Monthly
                                </button>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Area type="monotone" dataKey="tasks" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    
                    {/* Task Completion Trend */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Task Completion Trend
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="week" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Bar dataKey="assigned" fill="#3b82f6" name="Assigned" />
                                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* Attendance Calendar & Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Attendance Calendar View */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Attendance Calendar
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                    <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                                </button>
                                <button
                                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                    <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                            {format(calendarMonth, 'MMMM yyyy')}
                        </p>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 p-1">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map(({ date, dayStr, attendance, isToday }) => (
                                <div
                                    key={dayStr}
                                    className={`aspect-square flex flex-col items-center justify-center text-xs rounded ${
                                        isToday
                                            ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                                            : attendance
                                            ? attendance.status === 'present'
                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                : attendance.status === 'late'
                                                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                                : 'bg-red-100 dark:bg-red-900/30'
                                            : 'bg-gray-50 dark:bg-gray-700/50'
                                    }`}
                                    title={attendance ? `${format(date, 'MMM d')}: ${attendance.status}` : format(date, 'MMM d')}
                                >
                                    <span className={`font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {format(date, 'd')}
                                    </span>
                                    {attendance && (
                                        <span className="text-[8px] mt-0.5">
                                            {attendance.status === 'present' ? '✓' : attendance.status === 'late' ? '⚠' : '✗'}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Present</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900/30 rounded"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Late</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 rounded"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Absent</span>
                                </div>
                            </div>
                            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <p className="text-xs font-semibold text-purple-800 dark:text-purple-300 mb-1">Overtime Summary</p>
                                <p className="text-sm font-bold text-purple-900 dark:text-purple-200">
                                    {overtimeData.overtime.toFixed(1)} hours this month
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Today's Tasks with Enhanced Features */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Today's Tasks
                            </h2>
                            <button
                                onClick={() => navigate('/employee/tasks')}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            >
                                View All →
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
                                        onClick={() => {
                                            setSelectedTaskId(task.id)
                                            setShowTaskModal(true)
                                        }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                                        {task.title}
                                                    </h3>
                                                    {task.priority && (
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                                                            <Flag size={10} className="inline mr-1" />
                                                            {task.priority}
                                                        </span>
                                                    )}
                                                </div>
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
                                                    {task.files && task.files.length > 0 && (
                                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                                            <FileText size={12} />
                                                            {task.files.length} file{task.files.length > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                    {task.comments && task.comments.length > 0 && (
                                                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                                            <MessageSquare size={12} />
                                                            {task.comments.length}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {task.status !== 'completed' && (
                                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${task.progress || 0}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Overtime Section */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Overtime Details
                        </h2>
                        <button
                            onClick={() => setShowOvertimeDetails(!showOvertimeDetails)}
                            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                            {showOvertimeDetails ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Overtime</p>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                {overtimeData.overtime.toFixed(1)} hours
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {format(calendarMonth, 'MMMM yyyy')}
                            </p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Hours</p>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                {overtimeData.total.toFixed(1)} hours
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {overtimeData.workingDays} working days
                            </p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Standard Hours</p>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                {overtimeData.standard.toFixed(1)} hours
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Expected for {overtimeData.workingDays} days
                            </p>
                        </div>
                    </div>
                    
                    {showOvertimeDetails && overtimeData.dailyBreakdown.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Daily Overtime Breakdown</h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {overtimeData.dailyBreakdown.map((day, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {format(new Date(day.date), 'EEEE, MMM d, yyyy')}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1">
                                                {day.clockIn && (
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        In: {format(new Date(day.clockIn), 'h:mm a')}
                                                    </span>
                                                )}
                                                {day.clockOut && (
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        Out: {format(new Date(day.clockOut), 'h:mm a')}
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    Total: {day.hoursWorked.toFixed(2)}h
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                                +{day.overtime.toFixed(2)}h
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">overtime</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {showOvertimeDetails && overtimeData.dailyBreakdown.length === 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center py-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">No overtime recorded for this month</p>
                        </div>
                    )}
                </div>
                
                {/* Quick Actions & Attendance History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Quick Actions
                        </h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => navigate('/employee/attendance')}
                                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                <Clock className="w-4 h-4" />
                                <span>Mark Attendance</span>
                            </button>
                            <button
                                onClick={() => navigate('/employee/leave')}
                                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Request Leave</span>
                            </button>
                            <button
                                onClick={() => navigate('/employee/tasks')}
                                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>View Tasks</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Attendance History */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Attendance History
                            </h2>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setAttendanceHistoryView('recent')}
                                    className={`px-3 py-1 text-sm rounded ${
                                        attendanceHistoryView === 'recent'
                                            ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                                >
                                    Recent
                                </button>
                                <button
                                    onClick={() => setAttendanceHistoryView('all')}
                                    className={`px-3 py-1 text-sm rounded ${
                                        attendanceHistoryView === 'all'
                                            ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                                >
                                    All
                                </button>
                            </div>
                        </div>
                        
                        {(() => {
                            const allAttendance = records
                                .filter(record => record.employeeId === currentUser.id)
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                            
                            const displayAttendance = attendanceHistoryView === 'recent' 
                                ? allAttendance.slice(0, 10)
                                : allAttendance
                            
                            if (displayAttendance.length === 0) {
                                return (
                                    <div className="text-center py-8">
                                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No attendance records</p>
                                    </div>
                                )
                            }
                            
                            return (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {displayAttendance.map(record => {
                                        const clockInTime = record.clockIn ? new Date(record.clockIn) : null
                                        const clockOutTime = record.clockOut ? new Date(record.clockOut) : null
                                        const isLate = clockInTime && clockInTime.getHours() >= 9 && clockInTime.getMinutes() > 0
                                        
                                        return (
                                            <div
                                                key={record.id}
                                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                                                {format(new Date(record.date), 'EEEE, MMMM d, yyyy')}
                                                            </p>
                                                            <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                                                                record.status === 'present'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                                    : record.status === 'late'
                                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                                    : record.status === 'absent'
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                                            }`}>
                                                                {record.status}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 gap-4 mt-3">
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Clock In</p>
                                                                {clockInTime ? (
                                                                    <div>
                                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                                            {format(clockInTime, 'h:mm a')}
                                                                        </p>
                                                                        {isLate && (
                                                                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">⚠ Late arrival</p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-gray-400 dark:text-gray-500">Not recorded</p>
                                                                )}
                                                            </div>
                                                            
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Clock Out</p>
                                                                {clockOutTime ? (
                                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                                        {format(clockOutTime, 'h:mm a')}
                                                                    </p>
                                                                ) : record.clockIn ? (
                                                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">In Progress</p>
                                                                ) : (
                                                                    <p className="text-sm text-gray-400 dark:text-gray-500">Not recorded</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {record.hoursWorked > 0 && (
                                                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Hours Worked</span>
                                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                                        {record.hoursWorked.toFixed(2)} hours
                                                                    </span>
                                                                </div>
                                                                {record.hoursWorked > 8 && (
                                                                    <div className="flex items-center justify-between mt-1">
                                                                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Overtime</span>
                                                                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                                                            +{(record.hoursWorked - 8).toFixed(2)} hours
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        
                                                        {record.notes && (
                                                            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs text-gray-600 dark:text-gray-400">
                                                                <strong>Note:</strong> {record.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })()}
                    </div>
                </div>
            </div>
            
            {/* Task Detail Modal */}
            {showTaskModal && selectedTask && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTask.title}</h3>
                                <button
                                    onClick={() => {
                                        setShowTaskModal(false)
                                        setSelectedTaskId(null)
                                        setTaskComment('')
                                    }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedTask.priority && (
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded ${getPriorityColor(selectedTask.priority)}`}>
                                        <Flag size={10} className="inline mr-1" />
                                        {selectedTask.priority}
                                    </span>
                                )}
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                                    selectedTask.status === 'completed' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : selectedTask.status === 'in-progress'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                    {selectedTask.status}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                                <p className="text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Change Status</h4>
                                <div className="flex gap-2">
                                    {selectedTask.status !== 'in-progress' && (
                                        <button
                                            onClick={() => handleTaskStatusChange(selectedTask.id, 'in-progress')}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                                        >
                                            Mark In Progress
                                        </button>
                                    )}
                                    {selectedTask.status !== 'completed' && (
                                        <button
                                            onClick={() => handleTaskStatusChange(selectedTask.id, 'completed')}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                                        >
                                            Mark Completed
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Files</h4>
                                <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <Upload size={18} className="text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Upload file</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                Array.from(e.target.files).forEach(file => {
                                                    handleFileUpload(selectedTask.id, file)
                                                })
                                            }
                                        }}
                                    />
                                </label>
                                {selectedTask.files && selectedTask.files.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {selectedTask.files.map((file) => (
                                            <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <FileText size={16} className="text-gray-600 dark:text-gray-400" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {(file.size / 1024).toFixed(2)} KB • {format(new Date(file.uploadedAt), 'MMM d, h:mm a')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {file.url && (
                                                        <a
                                                            href={file.url}
                                                            download={file.name}
                                                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                                            title="Download"
                                                        >
                                                            <Download size={16} />
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => handleRemoveFile(selectedTask.id, file.id)}
                                                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Comments & Discussion</h4>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {selectedTask.comments && selectedTask.comments.length > 0 ? (
                                        selectedTask.comments
                                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                            .map((comment) => (
                                                <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{comment.author}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {format(new Date(comment.timestamp), 'MMM d, h:mm a')}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                                                </div>
                                            ))
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No comments yet. Start the discussion!</p>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <input
                                        type="text"
                                        value={taskComment}
                                        onChange={(e) => setTaskComment(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && taskComment.trim()) {
                                                handleAddComment(selectedTask.id)
                                            }
                                        }}
                                        placeholder="Add a comment..."
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => handleAddComment(selectedTask.id)}
                                        disabled={!taskComment.trim()}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <MessageSquare size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
