'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Clock, Calendar, Users, Filter, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminAttendance() {
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.employees)
    const { records } = useSelector(state => state.attendance)
    const { employees } = useSelector(state => state.employees)
    const { currentSessions } = useSelector(state => state.attendance)
    
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [filter, setFilter] = useState('all') // all, present, absent, late
    
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
    
    const dateRecords = records.filter(record => record.date === selectedDate)
    
    const filteredRecords = dateRecords.filter(record => {
        if (filter === 'all') return true
        return record.status === filter
    })
    
    const getEmployeeName = (employeeId) => {
        const employee = employees.find(emp => emp.id === employeeId)
        return employee ? employee.name : 'Unknown'
    }
    
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
    
    const stats = {
        total: employees.length,
        present: dateRecords.filter(r => r.status === 'present').length,
        late: dateRecords.filter(r => r.status === 'late').length,
        absent: employees.length - dateRecords.length,
        clockedIn: Object.keys(currentSessions).length
    }
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Attendance Monitoring
                </h1>
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Employees</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Present</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.present}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Late</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.late}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Absent</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.absent}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Clocked In</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.clockedIn}</p>
                    </div>
                </div>
                
                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            {['all', 'present', 'late', 'absent'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filter === status
                                            ? 'text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                    style={filter === status ? { backgroundColor: '#3977ED' } : {}}
                                    onMouseEnter={(e) => {
                                        if (filter === status) {
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
                        </div>
                    </div>
                </div>
                
                {/* Attendance Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Employee
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Clock In
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Clock Out
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Hours Worked
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {employees.map(employee => {
                                    const record = filteredRecords.find(r => r.employeeId === employee.id)
                                    const isClockedIn = !!currentSessions[employee.id]
                                    
                                    return (
                                        <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                            {employee.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {employee.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {employee.department}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {record?.clockIn 
                                                    ? format(new Date(record.clockIn), 'h:mm a')
                                                    : isClockedIn
                                                    ? <span className="text-blue-600 dark:text-blue-400">In Progress</span>
                                                    : '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {record?.clockOut 
                                                    ? format(new Date(record.clockOut), 'h:mm a')
                                                    : '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {record?.hoursWorked > 0 ? `${record.hoursWorked} hrs` : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {record ? (
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                                        {record.status}
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                        Absent
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

