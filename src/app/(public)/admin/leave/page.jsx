'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Calendar, CheckCircle2, XCircle, Filter, User } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { approveLeaveRequest, rejectLeaveRequest } from '@/lib/features/leave/leaveSlice'

export default function AdminLeave() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.employees)
    const { requests, balances } = useSelector(state => state.leave)
    const { employees } = useSelector(state => state.employees)
    
    const [filter, setFilter] = useState('pending') // pending, approved, rejected
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [comment, setComment] = useState('')
    
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
    
    const filteredRequests = requests.filter(req => req.status === filter)
    
    const handleApprove = (requestId) => {
        if (!comment.trim() && filter === 'pending') {
            toast.error('Please add a comment')
            return
        }
        
        dispatch(approveLeaveRequest({
            id: requestId,
            reviewedBy: currentUser.id,
            comments: comment
        }))
        
        toast.success('Leave request approved!')
        setSelectedRequest(null)
        setComment('')
    }
    
    const handleReject = (requestId) => {
        if (!comment.trim()) {
            toast.error('Please provide a reason for rejection')
            return
        }
        
        dispatch(rejectLeaveRequest({
            id: requestId,
            reviewedBy: currentUser.id,
            comments: comment
        }))
        
        toast.success('Leave request rejected!')
        setSelectedRequest(null)
        setComment('')
    }
    
    const getStatusColor = (status) => {
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
    
    const getTypeColor = (type) => {
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
    
    const getEmployeeBalance = (employeeId) => {
        return balances[employeeId] || {
            total: 20,
            used: 0,
            remaining: 20
        }
    }
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-12 transition-colors duration-200">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 dark:text-white mb-2">
                        Leave Request Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Review and manage employee leave requests
                    </p>
                </div>
                
                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        {['pending', 'approved', 'rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-normal transition-colors ${
                                    filter === status
                                        ? 'text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:opacity-80'
                                }`}
                                style={filter === status ? { backgroundColor: '#3977ED' } : {}}
                                onMouseEnter={(e) => {
                                    if (filter !== status) {
                                        e.currentTarget.style.backgroundColor = 'transparent'
                                    } else {
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
                        <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                            {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
                        </div>
                    </div>
                </div>
                
                {/* Leave Requests */}
                <div className="space-y-4">
                    {filteredRequests.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                No {filter} leave requests
                            </p>
                        </div>
                    ) : (
                        filteredRequests.map(request => {
                            const balance = getEmployeeBalance(request.employeeId)
                            const employee = employees.find(emp => emp.id === request.employeeId)
                            
                            return (
                                <div
                                    key={request.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex items-center justify-between mb-6 gap-4">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="flex-shrink-0 h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                <User className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-normal text-gray-900 dark:text-white mb-1">
                                                    {request.employeeName}
                                                </h3>
                                                {employee && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {employee.department} • {employee.position}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`px-3 py-1.5 rounded-lg text-sm font-normal whitespace-nowrap ${getTypeColor(request.type)}`}>
                                                {request.type}
                                            </span>
                                            <span className={`px-3 py-1.5 rounded-lg text-sm font-normal whitespace-nowrap ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                <p className="text-xs font-normal text-gray-500 dark:text-gray-400 uppercase tracking-wide">Start Date</p>
                                            </div>
                                            <p className="font-normal text-gray-900 dark:text-white text-base">
                                                {format(new Date(request.startDate), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                <p className="text-xs font-normal text-gray-500 dark:text-gray-400 uppercase tracking-wide">End Date</p>
                                            </div>
                                            <p className="font-normal text-gray-900 dark:text-white text-base">
                                                {format(new Date(request.endDate), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                <p className="text-xs font-normal text-gray-500 dark:text-gray-400 uppercase tracking-wide">Days</p>
                                            </div>
                                            <p className="font-normal text-gray-900 dark:text-white text-base">
                                                {request.days} {request.days === 1 ? 'day' : 'days'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                <p className="text-xs font-normal text-gray-500 dark:text-gray-400 uppercase tracking-wide">Remaining Balance</p>
                                            </div>
                                            <p className="font-normal text-gray-900 dark:text-white text-base">
                                                {balance.remaining} {balance.remaining === 1 ? 'day' : 'days'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                        <p className="text-sm font-normal text-gray-700 dark:text-gray-300 mb-2">Reason</p>
                                        <p className="text-gray-900 dark:text-white leading-relaxed">
                                            {request.reason}
                                        </p>
                                    </div>
                                    
                                    {request.comments && (
                                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Admin Comments</p>
                                            <p className="text-gray-900 dark:text-white">
                                                {request.comments}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {request.status === 'pending' && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                                            <div className="mb-6">
                                                <label className="block text-sm font-normal text-gray-700 dark:text-gray-300 mb-3">
                                                    Add Comment
                                                </label>
                                                <textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                                    placeholder="Add your comments here..."
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleApprove(request.id)}
                                                    className="px-6 py-2 text-white rounded-lg font-normal transition-colors flex items-center gap-2"
                                                    style={{ backgroundColor: '#3977ED' }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#2d5fcc'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#3977ED'
                                                    }}
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request.id)}
                                                    className="px-6 py-2 text-white rounded-lg font-normal transition-colors flex items-center gap-2"
                                                    style={{ backgroundColor: '#3977ED' }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#2d5fcc'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#3977ED'
                                                    }}
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {request.reviewedAt && (
                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Reviewed on {format(new Date(request.reviewedAt), 'MMM d, yyyy h:mm a')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

