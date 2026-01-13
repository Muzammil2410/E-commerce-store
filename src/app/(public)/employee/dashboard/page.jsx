'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, CheckCircle2, AlertCircle, TrendingUp, Bell, X, Upload, MessageSquare, FileText, Flag, ChevronLeft, ChevronRight, Zap, Package, MapPin, Phone, User, Camera, PenTool, CheckCircle } from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, startOfMonth, endOfMonth } from 'date-fns'
import toast from 'react-hot-toast'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
    const [selectedTask, setSelectedTask] = useState(null)
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [taskComment, setTaskComment] = useState('')
    const [taskFiles, setTaskFiles] = useState({})
    const [deliveries, setDeliveries] = useState([])
    const [selectedDelivery, setSelectedDelivery] = useState(null)
    const [showDeliveryModal, setShowDeliveryModal] = useState(false)
    const [showProofModal, setShowProofModal] = useState(false)
    const [deliverySignature, setDeliverySignature] = useState(null)
    const [deliveryPhoto, setDeliveryPhoto] = useState(null)
    const [deliveryNotes, setDeliveryNotes] = useState('')
    const signatureCanvasRef = useRef(null)
    
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
        
        // Load assigned deliveries
        loadDeliveries()
        
        // Generate notifications
        generateNotifications()
    }, [currentUser, records, currentSessions, tasks, requests])
    
    const loadDeliveries = () => {
        if (!currentUser) return
        
        // Load deliveries from localStorage or create sample data
        const storedDeliveries = localStorage.getItem(`deliveries_${currentUser.id}`)
        if (storedDeliveries) {
            setDeliveries(JSON.parse(storedDeliveries))
        } else {
            // Sample deliveries for demo
            const sampleDeliveries = [
                {
                    id: 'DEL-001',
                    orderId: 'ORD-12345',
                    employeeId: currentUser.id,
                    customerName: 'John Smith',
                    customerPhone: '+1 234-567-8900',
                    deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
                    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    deliveryTime: '10:00 AM - 12:00 PM',
                    status: 'pending',
                    specialInstructions: 'Please ring doorbell twice. Leave package at door if no answer.',
                    orderDetails: {
                        items: ['Product A x2', 'Product B x1'],
                        total: '$149.99'
                    },
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'DEL-002',
                    orderId: 'ORD-12346',
                    employeeId: currentUser.id,
                    customerName: 'Sarah Johnson',
                    customerPhone: '+1 234-567-8901',
                    deliveryAddress: '456 Oak Avenue, Suite 200, Los Angeles, CA 90001',
                    deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    deliveryTime: '2:00 PM - 4:00 PM',
                    status: 'pending',
                    specialInstructions: 'Fragile items. Handle with care.',
                    orderDetails: {
                        items: ['Product C x1', 'Product D x3'],
                        total: '$299.99'
                    },
                    createdAt: new Date().toISOString()
                }
            ]
            setDeliveries(sampleDeliveries)
            localStorage.setItem(`deliveries_${currentUser.id}`, JSON.stringify(sampleDeliveries))
        }
    }
    
    const handleDeliveryStatusUpdate = (deliveryId, newStatus) => {
        const updatedDeliveries = deliveries.map(del => 
            del.id === deliveryId ? { ...del, status: newStatus, updatedAt: new Date().toISOString() } : del
        )
        setDeliveries(updatedDeliveries)
        localStorage.setItem(`deliveries_${currentUser.id}`, JSON.stringify(updatedDeliveries))
        toast.success(`Delivery status updated to ${newStatus}`)
        
        // Sync with admin/client (in real app, this would be an API call)
        const allDeliveries = JSON.parse(localStorage.getItem('allDeliveries') || '[]')
        const updatedAllDeliveries = allDeliveries.map(del => 
            del.id === deliveryId ? { ...del, status: newStatus, updatedAt: new Date().toISOString() } : del
        )
        localStorage.setItem('allDeliveries', JSON.stringify(updatedAllDeliveries))
    }
    
    const handleProofOfDelivery = (deliveryId) => {
        if (!deliverySignature && !deliveryPhoto && !deliveryNotes.trim()) {
            toast.error('Please provide at least one proof of delivery (signature, photo, or notes)')
            return
        }
        
        const updatedDeliveries = deliveries.map(del => 
            del.id === deliveryId ? {
                ...del,
                status: 'delivered',
                proofOfDelivery: {
                    signature: deliverySignature,
                    photo: deliveryPhoto,
                    notes: deliveryNotes,
                    deliveredAt: new Date().toISOString(),
                    deliveredBy: currentUser.id
                },
                updatedAt: new Date().toISOString()
            } : del
        )
        setDeliveries(updatedDeliveries)
        localStorage.setItem(`deliveries_${currentUser.id}`, JSON.stringify(updatedDeliveries))
        
        // Sync with admin/client
        const allDeliveries = JSON.parse(localStorage.getItem('allDeliveries') || '[]')
        const updatedAllDeliveries = allDeliveries.map(del => 
            del.id === deliveryId ? {
                ...del,
                status: 'delivered',
                proofOfDelivery: {
                    signature: deliverySignature,
                    photo: deliveryPhoto,
                    notes: deliveryNotes,
                    deliveredAt: new Date().toISOString(),
                    deliveredBy: currentUser.id
                },
                updatedAt: new Date().toISOString()
            } : del
        )
        localStorage.setItem('allDeliveries', JSON.stringify(updatedAllDeliveries))
        
        toast.success('Proof of delivery submitted successfully!')
        setShowProofModal(false)
        setShowDeliveryModal(false)
        setDeliverySignature(null)
        setDeliveryPhoto(null)
        setDeliveryNotes('')
    }
    
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setDeliveryPhoto(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }
    
    useEffect(() => {
        if (!signatureCanvasRef.current || !showProofModal) return
        
        const canvas = signatureCanvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        
        let isDrawing = false
        let lastX = 0
        let lastY = 0
        
        const getCoordinates = (e) => {
            const rect = canvas.getBoundingClientRect()
            if (e.touches) {
                return {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                }
            }
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        }
        
        const startDraw = (e) => {
            e.preventDefault()
            isDrawing = true
            const coords = getCoordinates(e)
            lastX = coords.x
            lastY = coords.y
        }
        
        const draw = (e) => {
            if (!isDrawing) return
            e.preventDefault()
            const coords = getCoordinates(e)
            ctx.beginPath()
            ctx.moveTo(lastX, lastY)
            ctx.lineTo(coords.x, coords.y)
            ctx.stroke()
            lastX = coords.x
            lastY = coords.y
            setDeliverySignature(canvas.toDataURL())
        }
        
        const stopDraw = (e) => {
            if (isDrawing) {
                isDrawing = false
                setDeliverySignature(canvas.toDataURL())
            }
        }
        
        canvas.addEventListener('mousedown', startDraw)
        canvas.addEventListener('mousemove', draw)
        canvas.addEventListener('mouseup', stopDraw)
        canvas.addEventListener('mouseout', stopDraw)
        canvas.addEventListener('touchstart', startDraw)
        canvas.addEventListener('touchmove', draw)
        canvas.addEventListener('touchend', stopDraw)
        
        return () => {
            canvas.removeEventListener('mousedown', startDraw)
            canvas.removeEventListener('mousemove', draw)
            canvas.removeEventListener('mouseup', stopDraw)
            canvas.removeEventListener('mouseout', stopDraw)
            canvas.removeEventListener('touchstart', startDraw)
            canvas.removeEventListener('touchmove', draw)
            canvas.removeEventListener('touchend', stopDraw)
        }
    }, [showProofModal])
    
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
    
    // Calculate efficiency score (on-time vs delayed)
    const onTimeTasks = completedTasks.filter(task => {
        if (!task.completedAt) return false
        return new Date(task.completedAt) <= new Date(task.deadline)
    })
    const delayedTasks = completedTasks.filter(task => {
        if (!task.completedAt) return false
        return new Date(task.completedAt) > new Date(task.deadline)
    })
    const efficiencyScore = completedTasks.length > 0 
        ? Math.round((onTimeTasks.length / completedTasks.length) * 100)
        : 0
    
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
    
    // Calculate overtime hours
    const calculateOvertime = () => {
        const thisMonth = records.filter(r => {
            if (r.employeeId !== currentUser.id) return false
            const recordDate = new Date(r.date)
            return recordDate.getMonth() === calendarMonth.getMonth() &&
                   recordDate.getFullYear() === calendarMonth.getFullYear()
        })
        
        const totalHours = thisMonth.reduce((sum, r) => sum + (r.hoursWorked || 0), 0)
        const standardHours = thisMonth.length * 8 // Assuming 8 hours per day
        const overtime = Math.max(0, totalHours - standardHours)
        
        return { total: totalHours, standard: standardHours, overtime }
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
        // In a real app, this would dispatch an action to update the task
        toast.success(`Task status changed to ${newStatus}`)
        setShowTaskModal(false)
    }
    
    const handleFileUpload = (taskId, file) => {
        setTaskFiles(prev => ({
            ...prev,
            [taskId]: [...(prev[taskId] || []), file]
        }))
        toast.success('File uploaded successfully')
    }
    
    const handleAddComment = (taskId) => {
        if (!taskComment.trim()) return
        toast.success('Comment added')
        setTaskComment('')
        setShowTaskModal(false)
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
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                            Welcome back, {currentUser.name}!
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
                            {format(new Date(), 'EEEE, MMMM d, yyyy')}
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            {unreadNotifications > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadNotifications}
                                </span>
                            )}
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
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
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Tasks</p>
                                <p className="text-3xl font-normal text-gray-900 dark:text-white mt-2">
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
                                <p className={`${isClockedIn || todayAttendance?.status ? 'text-3xl font-extrabold' : 'text-xl font-normal'} text-gray-900 dark:text-white mt-2`}>
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
                    
                    {/* Efficiency Score Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Efficiency Score</p>
                                <p className="text-3xl font-normal text-gray-900 dark:text-white mt-2">
                                    {efficiencyScore}%
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                            {onTimeTasks.length} on-time, {delayedTasks.length} delayed
                        </p>
                    </div>
                    
                    {/* Overtime Hours Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Overtime Hours</p>
                                <p className="text-3xl font-normal text-gray-900 dark:text-white mt-2">
                                    {overtimeData.overtime.toFixed(1)}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
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
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPerformanceView('weekly')}
                                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                                        performanceView === 'weekly'
                                            ? 'text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                    style={performanceView === 'weekly' ? { backgroundColor: '#3977ED' } : {}}
                                    onMouseEnter={(e) => {
                                        if (performanceView === 'weekly') {
                                            e.target.style.backgroundColor = '#2d5fc7'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (performanceView === 'weekly') {
                                            e.target.style.backgroundColor = '#3977ED'
                                        }
                                    }}
                                >
                                    Weekly
                                </button>
                                <button
                                    onClick={() => setPerformanceView('monthly')}
                                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                                        performanceView === 'monthly'
                                            ? 'text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                    style={performanceView === 'monthly' ? { backgroundColor: '#3977ED' } : {}}
                                    onMouseEnter={(e) => {
                                        if (performanceView === 'monthly') {
                                            e.target.style.backgroundColor = '#2d5fc7'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (performanceView === 'monthly') {
                                            e.target.style.backgroundColor = '#3977ED'
                                        }
                                    }}
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
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
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
                                className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors border"
                                style={{ backgroundColor: '#3977ED', borderColor: '#3977ED' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
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
                                        onClick={() => {
                                            setSelectedTask(task)
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
                
                {/* Assigned Deliveries Section */}
                <div id="deliveries-section" className="mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Assigned Deliveries
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {deliveries.filter(d => d.status !== 'delivered').length} Active
                                </span>
                            </div>
                        </div>
                        
                        {deliveries.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-base font-medium text-gray-600 dark:text-gray-400">No deliveries assigned</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {deliveries.map(delivery => (
                                    <div
                                        key={delivery.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:shadow-md"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                                        {delivery.orderId}
                                                    </h3>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                                        delivery.status === 'delivered'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : delivery.status === 'out-for-delivery'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : delivery.status === 'failed'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                        {delivery.status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <User size={16} className="text-gray-400" />
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">{delivery.customerName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={16} className="text-gray-400" />
                                                        <span className="text-gray-600 dark:text-gray-400">{delivery.deliveryAddress}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} className="text-gray-400" />
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            {format(new Date(delivery.deliveryDate), 'MMM d, yyyy')} • {delivery.deliveryTime}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedDelivery(delivery)
                                                        setShowDeliveryModal(true)
                                                    }}
                                                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors border"
                                                    style={{ backgroundColor: '#3977ED', borderColor: '#3977ED' }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                                >
                                                    View Details
                                                </button>
                                                {delivery.status === 'pending' && (
                                                    <select
                                                        onChange={(e) => handleDeliveryStatusUpdate(delivery.id, e.target.value)}
                                                        className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                                        value={delivery.status}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="out-for-delivery">Out for Delivery</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="failed">Failed/Rescheduled</option>
                                                    </select>
                                                )}
                                                {delivery.status === 'out-for-delivery' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedDelivery(delivery)
                                                            setShowProofModal(true)
                                                        }}
                                                        className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors border"
                                                        style={{ backgroundColor: '#3977ED', borderColor: '#3977ED' }}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Quick Actions & Recent Attendance */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                            Quick Actions
                        </h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/employee/attendance')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base border"
                                style={{ backgroundColor: '#3977ED', borderColor: '#3977ED' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                            >
                                <Clock className="w-5 h-5" />
                                <span>Mark Attendance</span>
                            </button>
                            <button
                                onClick={() => navigate('/employee/leave')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base border"
                                style={{ backgroundColor: '#3977ED', borderColor: '#3977ED' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                            >
                                <Calendar className="w-5 h-5" />
                                <span>Request Leave</span>
                            </button>
                            <button
                                onClick={() => navigate('/employee/tasks')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base border"
                                style={{ backgroundColor: '#3977ED', borderColor: '#3977ED' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span>View Tasks</span>
                            </button>
                            <button
                                onClick={() => {
                                    const deliveriesSection = document.getElementById('deliveries-section')
                                    if (deliveriesSection) {
                                        deliveriesSection.scrollIntoView({ behavior: 'smooth' })
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base border"
                                style={{ backgroundColor: '#3977ED', borderColor: '#3977ED' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                            >
                                <Package className="w-5 h-5" />
                                <span>View Deliveries</span>
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
                                                    {record.clockIn && new Date(record.clockIn).getHours() >= 9 && (
                                                        <span className="ml-2 text-yellow-600 dark:text-yellow-400 text-xs">⚠ Late</span>
                                                    )}
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
            
            {/* Task Detail Modal */}
            {showTaskModal && selectedTask && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTask.title}</h3>
                                <button
                                    onClick={() => setShowTaskModal(false)}
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
                                            className="px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium"
                                            style={{ backgroundColor: '#3977ED' }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                        >
                                            Mark In Progress
                                        </button>
                                    )}
                                    {selectedTask.status !== 'completed' && (
                                        <button
                                            onClick={() => handleTaskStatusChange(selectedTask.id, 'completed')}
                                            className="px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium"
                                            style={{ backgroundColor: '#3977ED' }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                        >
                                            Mark Completed
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Files</h4>
                                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <Upload size={20} className="text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Choose file</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                handleFileUpload(selectedTask.id, e.target.files[0])
                                            }
                                        }}
                                    />
                                </label>
                                {taskFiles[selectedTask.id] && (
                                    <div className="mt-2 space-y-1">
                                        {taskFiles[selectedTask.id].map((file, idx) => (
                                            <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <FileText size={16} />
                                                {file.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Comments & Discussion</h4>
                                <div className="space-y-3">
                                    {selectedTask.comments && selectedTask.comments.length > 0 ? (
                                        selectedTask.comments.map((comment, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="text-sm text-gray-900 dark:text-white">{comment.text}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {comment.author} - {format(new Date(comment.timestamp), 'MMM d, h:mm a')}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet</p>
                                    )}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={taskComment}
                                            onChange={(e) => setTaskComment(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        <button
                                            onClick={() => handleAddComment(selectedTask.id)}
                                            className="px-4 py-2 text-white rounded-lg transition-colors"
                                            style={{ backgroundColor: '#3977ED' }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                        >
                                            <MessageSquare size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Delivery Details Modal */}
            {showDeliveryModal && selectedDelivery && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDelivery.orderId}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Delivery ID: {selectedDelivery.id}</p>
                                </div>
                                <button
                                    onClick={() => setShowDeliveryModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                                selectedDelivery.status === 'delivered'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : selectedDelivery.status === 'out-for-delivery'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                    : selectedDelivery.status === 'failed'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                                {selectedDelivery.status.replace('-', ' ')}
                            </span>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Customer Information */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <User size={18} />
                                    Customer Information
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name:</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{selectedDelivery.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{selectedDelivery.customerPhone}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Delivery Address */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <MapPin size={18} />
                                    Delivery Address
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDelivery.deliveryAddress}</p>
                            </div>
                            
                            {/* Delivery Date & Time */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Calendar size={18} />
                                    Delivery Schedule
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {format(new Date(selectedDelivery.deliveryDate), 'EEEE, MMMM d, yyyy')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time:</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{selectedDelivery.deliveryTime}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Order Details */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Package size={18} />
                                    Order Details
                                </h4>
                                <div className="space-y-2">
                                    {selectedDelivery.orderDetails.items.map((item, idx) => (
                                        <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                            • {item}
                                        </div>
                                    ))}
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Total: {selectedDelivery.orderDetails.total}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Special Instructions */}
                            {selectedDelivery.specialInstructions && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <AlertCircle size={18} />
                                        Special Instructions
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                                        {selectedDelivery.specialInstructions}
                                    </p>
                                </div>
                            )}
                            
                            {/* Status Update */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Update Status</h4>
                                <select
                                    onChange={(e) => {
                                        handleDeliveryStatusUpdate(selectedDelivery.id, e.target.value)
                                        if (e.target.value === 'out-for-delivery') {
                                            setShowDeliveryModal(false)
                                        }
                                    }}
                                    className="w-full px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    value={selectedDelivery.status}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="out-for-delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="failed">Failed/Rescheduled</option>
                                </select>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                {selectedDelivery.status === 'out-for-delivery' && (
                                    <button
                                        onClick={() => {
                                            setShowDeliveryModal(false)
                                            setShowProofModal(true)
                                        }}
                                        className="flex-1 px-4 py-2 text-white rounded-lg transition-colors text-sm font-semibold"
                                        style={{ backgroundColor: '#3977ED' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                    >
                                        Submit Proof of Delivery
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowDeliveryModal(false)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-semibold"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Proof of Delivery Modal */}
            {showProofModal && selectedDelivery && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Proof of Delivery</h3>
                                <button
                                    onClick={() => {
                                        setShowProofModal(false)
                                        setDeliverySignature(null)
                                        setDeliveryPhoto(null)
                                        setDeliveryNotes('')
                                    }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Order: {selectedDelivery.orderId}</p>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Customer Signature */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <PenTool size={18} />
                                    Customer Signature
                                </h4>
                                <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                                    <canvas
                                        ref={signatureCanvasRef}
                                        width={600}
                                        height={200}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded cursor-crosshair touch-none"
                                        style={{ maxWidth: '100%', height: '200px' }}
                                    />
                                    <button
                                        onClick={() => {
                                            setDeliverySignature(null)
                                            if (signatureCanvasRef.current) {
                                                const ctx = signatureCanvasRef.current.getContext('2d')
                                                ctx.clearRect(0, 0, signatureCanvasRef.current.width, signatureCanvasRef.current.height)
                                            }
                                        }}
                                        className="mt-3 text-sm text-red-600 dark:text-red-400 hover:underline"
                                    >
                                        Clear Signature
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Please have the customer sign above</p>
                            </div>
                            
                            {/* Photo Upload */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Camera size={18} />
                                    Delivery Photo
                                </h4>
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    {deliveryPhoto ? (
                                        <div className="relative w-full h-full">
                                            <img src={deliveryPhoto} alt="Delivery" className="w-full h-full object-cover rounded-lg" />
                                            <button
                                                onClick={() => setDeliveryPhoto(null)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Camera size={48} className="text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload photo</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoUpload}
                                    />
                                </label>
                            </div>
                            
                            {/* Notes/Comments */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <MessageSquare size={18} />
                                    Notes / Comments
                                </h4>
                                <textarea
                                    value={deliveryNotes}
                                    onChange={(e) => setDeliveryNotes(e.target.value)}
                                    placeholder="Add any notes or comments about the delivery..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors resize-none"
                                    rows={4}
                                />
                            </div>
                            
                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => handleProofOfDelivery(selectedDelivery.id)}
                                    className="flex-1 px-4 py-3 text-white rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                >
                                    <CheckCircle size={20} />
                                    Submit Proof of Delivery
                                </button>
                                <button
                                    onClick={() => {
                                        setShowProofModal(false)
                                        setDeliverySignature(null)
                                        setDeliveryPhoto(null)
                                        setDeliveryNotes('')
                                    }}
                                    className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
