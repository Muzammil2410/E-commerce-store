'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { format, differenceInDays, parseISO } from 'date-fns'
import toast from 'react-hot-toast'
import { submitLeaveRequest } from '@/lib/features/leave/leaveSlice'

export default function EmployeeLeave() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.employees)
    const { requests, balances } = useSelector(state => state.leave)
    
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        type: 'vacation',
        startDate: '',
        endDate: '',
        reason: ''
    })
    const [errors, setErrors] = useState({})
    
    useEffect(() => {
        const userData = localStorage.getItem('employeeUser')
        if (!userData) {
            navigate('/employee/login')
        }
    }, [navigate])
    
    if (!currentUser) return null
    
    const employeeRequests = requests.filter(req => req.employeeId === currentUser.id)
    
    // Calculate accurate counts from approved leave requests
    const approvedRequests = employeeRequests.filter(req => req.status === 'approved')
    const sickUsed = approvedRequests
        .filter(req => req.type === 'sick')
        .reduce((sum, req) => sum + (req.days || 0), 0)
    const vacationUsed = approvedRequests
        .filter(req => req.type === 'vacation')
        .reduce((sum, req) => sum + (req.days || 0), 0)
    const personalUsed = approvedRequests
        .filter(req => req.type === 'personal')
        .reduce((sum, req) => sum + (req.days || 0), 0)
    const totalUsed = approvedRequests.reduce((sum, req) => sum + (req.days || 0), 0)
    
    // Get base balance from Redux or use defaults
    const baseBalance = balances[currentUser.id] || {
        total: 20,
        sick: { total: 10 },
        vacation: { total: 15 },
        personal: { total: 5 }
    }
    
    // Calculate accurate remaining balances
    const employeeBalance = {
        total: baseBalance.total,
        used: totalUsed,
        remaining: baseBalance.total - totalUsed,
        sick: {
            total: baseBalance.sick?.total || 10,
            used: sickUsed,
            remaining: (baseBalance.sick?.total || 10) - sickUsed
        },
        vacation: {
            total: baseBalance.vacation?.total || 15,
            used: vacationUsed,
            remaining: (baseBalance.vacation?.total || 15) - vacationUsed
        },
        personal: {
            total: baseBalance.personal?.total || 5,
            used: personalUsed,
            remaining: (baseBalance.personal?.total || 5) - personalUsed
        }
    }
    
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' })
        }
    }
    
    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required'
        }
        if (!formData.endDate) {
            newErrors.endDate = 'End date is required'
        }
        if (formData.startDate && formData.endDate) {
            const start = parseISO(formData.startDate)
            const end = parseISO(formData.endDate)
            if (end < start) {
                newErrors.endDate = 'End date must be after start date'
            }
            const days = differenceInDays(end, start) + 1
            const typeBalance = employeeBalance[formData.type]?.remaining || 0
            if (days > typeBalance) {
                newErrors.endDate = `You only have ${typeBalance} days remaining for ${formData.type} leave`
            }
        }
        if (!formData.reason.trim()) {
            newErrors.reason = 'Reason is required'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form')
            return
        }
        
        const days = differenceInDays(parseISO(formData.endDate), parseISO(formData.startDate)) + 1
        
        dispatch(submitLeaveRequest({
            employeeId: currentUser.id,
            employeeName: currentUser.name,
            type: formData.type,
            startDate: formData.startDate,
            endDate: formData.endDate,
            reason: formData.reason
        }))
        
        toast.success('Leave request submitted successfully!')
        setShowForm(false)
        setFormData({
            type: 'vacation',
            startDate: '',
            endDate: '',
            reason: ''
        })
    }
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            case 'rejected':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            case 'pending':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }
    }
    
    const getTypeColor = (type) => {
        switch (type) {
            case 'sick':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            case 'vacation':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            case 'personal':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            case 'emergency':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }
    }
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/employee/dashboard')}
                    className="inline-flex items-center gap-2 hover:underline mb-6 transition-colors"
                    style={{ color: '#3977ED' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#2d5fcc'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#3977ED'
                    }}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>
                
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Leave Management
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 text-white rounded-lg font-medium transition-colors"
                        style={{ backgroundColor: '#3977ED' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2d5fcc'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3977ED'
                        }}
                    >
                        {showForm ? 'Cancel' : '+ Request Leave'}
                    </button>
                </div>
                
                {/* Leave Balance */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Leave Balance
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {employeeBalance.remaining}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {employeeBalance.used} used
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sick</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {employeeBalance.sick?.remaining || 0}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vacation</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {employeeBalance.vacation?.remaining || 0}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Personal</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {employeeBalance.personal?.remaining || 0}
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Leave Request Form */}
                {showForm && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Submit Leave Request
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Leave Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="vacation">Vacation</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="personal">Personal</option>
                                    <option value="emergency">Emergency</option>
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`w-full px-4 py-2 border ${
                                            errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.startDate && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.startDate}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                                        className={`w-full px-4 py-2 border ${
                                            errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.endDate && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.endDate}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {formData.startDate && formData.endDate && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Total days: {differenceInDays(parseISO(formData.endDate), parseISO(formData.startDate)) + 1}
                                    </p>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Reason
                                </label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`w-full px-4 py-2 border ${
                                        errors.reason ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Please provide a reason for your leave request"
                                />
                                {errors.reason && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.reason}
                                    </p>
                                )}
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
                                    Submit Request
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
                
                {/* Leave Requests History */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        My Leave Requests
                    </h2>
                    {employeeRequests.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                            No leave requests found
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {employeeRequests
                                .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                                .map(request => (
                                    <div
                                        key={request.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(request.type)}`}>
                                                    {request.type}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {format(new Date(request.submittedAt), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Start Date</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {format(new Date(request.startDate), 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">End Date</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {format(new Date(request.endDate), 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Days</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {request.days} days
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reason</p>
                                            <p className="text-gray-900 dark:text-white">
                                                {request.reason}
                                            </p>
                                        </div>
                                        {request.comments && (
                                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Admin Comments</p>
                                                <p className="text-gray-900 dark:text-white">
                                                    {request.comments}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

