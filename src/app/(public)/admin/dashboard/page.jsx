'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Users, CheckCircle2, Clock, Calendar, TrendingUp, AlertCircle, User, FileText, Activity, MessageSquare, Bell, BookOpen, Send, X, Upload, Plus } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { loadConversations, createConversation, sendMessage, markAsRead, setActiveConversation } from '@/lib/features/chat/chatSlice'
import { loadAnnouncements, createAnnouncement, deleteAnnouncement } from '@/lib/features/announcements/announcementsSlice'
import { loadDocuments, uploadDocument, deleteDocument } from '@/lib/features/documents/documentsSlice'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state?.employees || {})
    const { tasks = [] } = useSelector(state => state?.tasks || { tasks: [] })
    const { records = [] } = useSelector(state => state?.attendance || { records: [] })
    const { requests = [] } = useSelector(state => state?.leave || { requests: [] })
    const { employees = [] } = useSelector(state => state?.employees || { employees: [] })
    const { conversations = [], messages = {}, activeConversation = null, unreadCounts = {} } = useSelector(state => state?.chat || { conversations: [], messages: {}, activeConversation: null, unreadCounts: {} })
    const { announcements = [] } = useSelector(state => state?.announcements || { announcements: [] })
    const { documents = [] } = useSelector(state => state?.documents || { documents: [] })
    
    const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false)
    const [showDocumentsModal, setShowDocumentsModal] = useState(false)
    const [showChatModal, setShowChatModal] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [chatMessage, setChatMessage] = useState('')
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'normal' })
    const [newDocument, setNewDocument] = useState({ title: '', description: '', category: 'Other', fileUrl: '#' })
    const [employeeSummaries, setEmployeeSummaries] = useState([])
    const [showSummariesModal, setShowSummariesModal] = useState(false)
    
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
        
        // Load communication data
        dispatch(loadConversations())
        dispatch(loadAnnouncements())
        dispatch(loadDocuments())
        
        // Load employee daily summaries
        loadEmployeeSummaries()
    }, [navigate, dispatch])
    
    const loadEmployeeSummaries = () => {
        const summaries = JSON.parse(localStorage.getItem('admin_workLogs') || '[]')
        // Sort by date (newest first)
        summaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setEmployeeSummaries(summaries)
    }
    
    // Reload conversations periodically when chat modal is open
    useEffect(() => {
        if (showChatModal && activeConversation) {
            const interval = setInterval(() => {
                dispatch(loadConversations())
            }, 2000) // Reload every 2 seconds
            
            return () => clearInterval(interval)
        }
    }, [showChatModal, activeConversation, dispatch])
    
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
                            <span className="text-yellow-600 dark:text-yellow-400">
                                {pendingTasks.length} Pending
                            </span>
                            <span className="text-blue-600 dark:text-blue-400">
                                {inProgressTasks.length} In Progress
                            </span>
                            <span className="text-green-600 dark:text-green-400">
                                {completedTasks.length} Completed
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
                
                {/* Communication Section */}
                <div className="mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Communication & Management
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <button
                                onClick={() => setShowAnnouncementsModal(true)}
                                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left border border-gray-200 dark:border-gray-600"
                            >
                                <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Announcements</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
                                </p>
                            </button>
                            
                            <button
                                onClick={() => setShowDocumentsModal(true)}
                                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left border border-gray-200 dark:border-gray-600"
                            >
                                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Documents</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {documents.length} document{documents.length !== 1 ? 's' : ''} available
                                </p>
                            </button>
                            
                            <button
                                onClick={() => {
                                    loadEmployeeSummaries()
                                    setShowSummariesModal(true)
                                }}
                                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left border border-gray-200 dark:border-gray-600"
                            >
                                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Daily Summaries</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {employeeSummaries.length} summary{employeeSummaries.length !== 1 ? 'ies' : ''}
                                </p>
                            </button>
                            
                            <button
                                onClick={() => setShowChatModal(true)}
                                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left border border-gray-200 dark:border-gray-600"
                            >
                                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Employee Chat</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                                </p>
                            </button>
                        </div>
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
                                                    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                case 'in-progress':
                                                    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                case 'pending':
                                                    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
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
            
            {/* Announcements Modal */}
            {showAnnouncementsModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Announcements</h3>
                            <button
                                onClick={() => {
                                    setShowAnnouncementsModal(false)
                                    setNewAnnouncement({ title: '', content: '', priority: 'normal' })
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Create New Announcement */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Plus size={18} />
                                    Create New Announcement
                                </h4>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={newAnnouncement.title}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                        placeholder="Announcement Title"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    <textarea
                                        value={newAnnouncement.content}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                        placeholder="Announcement Content"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                        rows={4}
                                    />
                                    <select
                                        value={newAnnouncement.priority}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="high">High Priority</option>
                                        <option value="low">Low Priority</option>
                                    </select>
                                    <button
                                        onClick={() => {
                                            if (newAnnouncement.title.trim() && newAnnouncement.content.trim()) {
                                                dispatch(createAnnouncement({
                                                    title: newAnnouncement.title,
                                                    content: newAnnouncement.content,
                                                    authorId: currentUser.id,
                                                    authorName: currentUser.name,
                                                    priority: newAnnouncement.priority
                                                }))
                                                setNewAnnouncement({ title: '', content: '', priority: 'normal' })
                                                toast.success('Announcement created')
                                            }
                                        }}
                                        className="w-full px-4 py-2 text-white rounded-lg transition-colors text-sm font-semibold"
                                        style={{ backgroundColor: '#3977ED' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                    >
                                        Create Announcement
                                    </button>
                                </div>
                            </div>
                            
                            {/* Existing Announcements */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Existing Announcements</h4>
                                <div className="space-y-3">
                                    {announcements.length === 0 ? (
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No announcements</p>
                                    ) : (
                                        announcements.map(announcement => (
                                            <div
                                                key={announcement.id}
                                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h5 className="font-bold text-gray-900 dark:text-white">{announcement.title}</h5>
                                                    <button
                                                        onClick={() => {
                                                            dispatch(deleteAnnouncement(announcement.id))
                                                            toast.success('Announcement deleted')
                                                        }}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{announcement.content}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                    <span>{announcement.priority}</span>
                                                    <span>{format(new Date(announcement.createdAt), 'MMM d, yyyy')}</span>
                                                    <span>{announcement.readBy.length} read</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Documents Modal */}
            {showDocumentsModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Documents</h3>
                            <button
                                onClick={() => {
                                    setShowDocumentsModal(false)
                                    setNewDocument({ title: '', description: '', category: 'Other', fileUrl: '#' })
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Upload New Document */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Upload size={18} />
                                    Upload New Document
                                </h4>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={newDocument.title}
                                        onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                                        placeholder="Document Title"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    <textarea
                                        value={newDocument.description}
                                        onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                                        placeholder="Description"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                        rows={3}
                                    />
                                    <select
                                        value={newDocument.category}
                                        onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="Policy">Policy</option>
                                        <option value="Handbook">Handbook</option>
                                        <option value="Guidelines">Guidelines</option>
                                        <option value="Forms">Forms</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <Upload size={18} className="text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Choose file</span>
                                        <input type="file" className="hidden" />
                                    </label>
                                    <button
                                        onClick={() => {
                                            if (newDocument.title.trim()) {
                                                dispatch(uploadDocument({
                                                    ...newDocument,
                                                    uploadedBy: currentUser.id,
                                                    fileType: 'pdf',
                                                    fileSize: '0 MB'
                                                }))
                                                setNewDocument({ title: '', description: '', category: 'Other', fileUrl: '#' })
                                                toast.success('Document uploaded')
                                            }
                                        }}
                                        className="w-full px-4 py-2 text-white rounded-lg transition-colors text-sm font-semibold"
                                        style={{ backgroundColor: '#3977ED' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                    >
                                        Upload Document
                                    </button>
                                </div>
                            </div>
                            
                            {/* Existing Documents */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Existing Documents</h4>
                                <div className="space-y-3">
                                    {documents.length === 0 ? (
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No documents</p>
                                    ) : (
                                        documents.map(doc => (
                                            <div
                                                key={doc.id}
                                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-start justify-between"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                        <h5 className="font-semibold text-gray-900 dark:text-white">{doc.title}</h5>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{doc.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                        <span>{doc.category}</span>
                                                        <span>{doc.fileType.toUpperCase()}</span>
                                                        <span>{doc.fileSize}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        dispatch(deleteDocument(doc.id))
                                                        toast.success('Document deleted')
                                                    }}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 ml-4"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Chat Modal */}
            {showChatModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full h-[600px] flex">
                        {/* Employee List */}
                        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white">Employees</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {employees.filter(emp => emp.role === 'employee').map(employee => {
                                    const convId = `conv_admin_${employee.id}`
                                    const unread = unreadCounts[convId] || 0
                                    return (
                                        <button
                                            key={employee.id}
                                            onClick={() => {
                                                dispatch(createConversation({
                                                    adminId: 'admin',
                                                    employeeId: employee.id,
                                                    employeeName: employee.name,
                                                    adminName: currentUser.name
                                                }))
                                                // Reload conversations to ensure sync
                                                setTimeout(() => {
                                                    dispatch(loadConversations())
                                                }, 100)
                                                dispatch(setActiveConversation(convId))
                                                dispatch(markAsRead({ conversationId: convId, userId: 'admin' }))
                                                setSelectedEmployee(employee)
                                            }}
                                            className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 ${
                                                activeConversation === convId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900 dark:text-white">{employee.name}</span>
                                                {unread > 0 && (
                                                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                        {unread}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                        
                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col">
                            {activeConversation && selectedEmployee ? (
                                <>
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{selectedEmployee.name}</h3>
                                        <button
                                            onClick={() => setShowChatModal(false)}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                        {messages[activeConversation] && messages[activeConversation].length > 0 ? (
                                            messages[activeConversation].map(msg => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-[70%] p-3 rounded-lg ${
                                                        msg.senderRole === 'admin'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                    }`}>
                                                        <p className="text-sm font-medium mb-1">{msg.senderName}</p>
                                                        <p className="text-sm">{msg.message}</p>
                                                        <p className="text-xs opacity-70 mt-1">
                                                            {format(new Date(msg.timestamp), 'h:mm a')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No messages yet. Start the conversation!</p>
                                        )}
                                    </div>
                                    
                                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                                        <input
                                            type="text"
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    dispatch(sendMessage({
                                                        conversationId: activeConversation,
                                                        senderId: 'admin',
                                                        senderName: currentUser.name,
                                                        senderRole: 'admin',
                                                        message: chatMessage
                                                    }))
                                                    setChatMessage('')
                                                    // Reload conversations to sync
                                                    setTimeout(() => {
                                                        dispatch(loadConversations())
                                                    }, 100)
                                                }
                                            }}
                                            placeholder="Type a message..."
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        <button
                                            onClick={() => {
                                                dispatch(sendMessage({
                                                    conversationId: activeConversation,
                                                    senderId: 'admin',
                                                    senderName: currentUser.name,
                                                    senderRole: 'admin',
                                                    message: chatMessage
                                                }))
                                                setChatMessage('')
                                                // Reload conversations to sync
                                                setTimeout(() => {
                                                    dispatch(loadConversations())
                                                }, 100)
                                            }}
                                            className="px-4 py-2 text-white rounded-lg transition-colors"
                                            style={{ backgroundColor: '#3977ED' }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <p className="text-gray-500 dark:text-gray-400">Select an employee to start chatting</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Employee Daily Summaries Modal */}
            {showSummariesModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Daily Summaries</h3>
                            <button
                                onClick={() => {
                                    setShowSummariesModal(false)
                                    loadEmployeeSummaries() // Reload on close
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {employeeSummaries.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">No daily summaries yet</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                        Employee summaries will appear here when they save their daily work summaries
                                    </p>
                                </div>
                            ) : (
                                employeeSummaries.map(summary => (
                                    <div
                                        key={summary.id}
                                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white">{summary.employeeName}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {format(new Date(summary.date), 'EEEE, MMMM d, yyyy')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="ml-13 mt-2">
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                        {summary.summary}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                                                {format(new Date(summary.createdAt), 'h:mm a')}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

