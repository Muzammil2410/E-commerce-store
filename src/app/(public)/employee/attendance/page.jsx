'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Clock, Calendar, CheckCircle2, XCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { clockIn, clockOut } from '@/lib/features/attendance/attendanceSlice'

export default function EmployeeAttendance() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.employees)
    const { records, currentSessions } = useSelector(state => state.attendance)
    
    const [isClockedIn, setIsClockedIn] = useState(false)
    const [clockInTime, setClockInTime] = useState(null)
    const [currentHours, setCurrentHours] = useState(0)
    
    useEffect(() => {
        const userData = localStorage.getItem('employeeUser')
        if (!userData) {
            navigate('/employee/login')
        }
    }, [navigate])
    
    useEffect(() => {
        if (!currentUser) return
        
        const session = currentSessions[currentUser.id]
        if (session) {
            setIsClockedIn(true)
            setClockInTime(session.clockIn)
            
            // Calculate current hours
            const updateHours = () => {
                const start = new Date(session.clockIn)
                const now = new Date()
                const hours = (now - start) / (1000 * 60 * 60)
                setCurrentHours(Math.round(hours * 100) / 100)
            }
            
            updateHours()
            const interval = setInterval(updateHours, 60000) // Update every minute
            
            return () => clearInterval(interval)
        } else {
            setIsClockedIn(false)
            setClockInTime(null)
            setCurrentHours(0)
        }
    }, [currentUser, currentSessions])
    
    const handleClockIn = () => {
        if (!currentUser) return
        
        dispatch(clockIn({ employeeId: currentUser.id }))
        toast.success('Clocked in successfully!')
    }
    
    const handleClockOut = () => {
        if (!currentUser) return
        
        dispatch(clockOut({ employeeId: currentUser.id }))
        toast.success('Clocked out successfully!')
    }
    
    if (!currentUser) return null
    
    const today = new Date().toISOString().split('T')[0]
    const todayRecord = records.find(
        record => record.employeeId === currentUser.id && record.date === today
    )
    
    const recentRecords = records
        .filter(record => record.employeeId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'present':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'late':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'absent':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            case 'half-day':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
                
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Attendance Management
                </h1>
                
                {/* Clock In/Out Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                            <Clock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {isClockedIn ? 'You are Clocked In' : 'Clock In'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {isClockedIn 
                                ? `Started at ${clockInTime ? format(new Date(clockInTime), 'h:mm a') : ''}`
                                : 'Click the button below to start your work day'
                            }
                        </p>
                        
                        {isClockedIn && (
                            <div className="mb-6">
                                <div className="inline-block bg-blue-50 dark:bg-blue-900/20 rounded-lg px-6 py-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hours Worked Today</p>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {currentHours.toFixed(2)} hrs
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex gap-4 justify-center">
                            {!isClockedIn ? (
                                <button
                                    onClick={handleClockIn}
                                    className="px-8 py-4 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2d5fcc'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#3977ED'
                                    }}
                                >
                                    <Clock className="w-5 h-5 inline mr-2" />
                                    Clock In
                                </button>
                            ) : (
                                <button
                                    onClick={handleClockOut}
                                    className="px-8 py-4 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2d5fcc'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#3977ED'
                                    }}
                                >
                                    <Clock className="w-5 h-5 inline mr-2" />
                                    Clock Out
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Today's Status */}
                {todayRecord && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Today's Attendance
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(todayRecord.status)}`}>
                                    {todayRecord.status}
                                </span>
                            </div>
                            {todayRecord.clockIn && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Clock In</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {format(new Date(todayRecord.clockIn), 'h:mm a')}
                                    </p>
                                </div>
                            )}
                            {todayRecord.clockOut && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Clock Out</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {format(new Date(todayRecord.clockOut), 'h:mm a')}
                                    </p>
                                </div>
                            )}
                            {todayRecord.hoursWorked > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hours Worked</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {todayRecord.hoursWorked} hrs
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Attendance History */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Attendance History
                    </h3>
                    {recentRecords.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                            No attendance records found
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Date
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Clock In
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Clock Out
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Hours
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentRecords.map(record => (
                                        <tr
                                            key={record.id}
                                            className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        >
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                                {format(new Date(record.date), 'MMM d, yyyy')}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                {record.clockIn 
                                                    ? format(new Date(record.clockIn), 'h:mm a')
                                                    : '-'
                                                }
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                {record.clockOut 
                                                    ? format(new Date(record.clockOut), 'h:mm a')
                                                    : '-'
                                                }
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                {record.hoursWorked > 0 ? `${record.hoursWorked} hrs` : '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

