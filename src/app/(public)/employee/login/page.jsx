'use client'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { setCurrentUser } from '@/lib/features/employees/employeesSlice'

export default function EmployeeLogin() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    
    // Demo credentials
    const demoCredentials = {
        employee: {
            email: 'employee@company.com',
            password: 'employee123',
            user: {
                id: 'emp_1',
                name: 'John Doe',
                email: 'employee@company.com',
                role: 'employee',
                department: 'Engineering',
                position: 'Software Developer'
            }
        },
        admin: {
            email: 'admin@company.com',
            password: 'admin123',
            user: {
                id: 'admin_1',
                name: 'Admin User',
                email: 'admin@company.com',
                role: 'admin',
                department: 'Management',
                position: 'Administrator'
            }
        }
    }
    
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check credentials
        let authenticatedUser = null
        
        if (formData.email === demoCredentials.employee.email && 
            formData.password === demoCredentials.employee.password) {
            authenticatedUser = demoCredentials.employee.user
        } else if (formData.email === demoCredentials.admin.email && 
                   formData.password === demoCredentials.admin.password) {
            authenticatedUser = demoCredentials.admin.user
        }
        
        if (authenticatedUser) {
            // Store user session
            localStorage.setItem('employeeUser', JSON.stringify(authenticatedUser))
            dispatch(setCurrentUser(authenticatedUser))
            
            toast.success('Login successful!')
            
            // Redirect based on role
            if (authenticatedUser.role === 'admin') {
                navigate('/admin/dashboard')
            } else {
                navigate('/employee/dashboard')
            }
        } else {
            toast.error('Invalid credentials. Use employee@company.com / employee123 or admin@company.com / admin123')
        }
        
        setLoading(false)
    }
    
    const fillDemoCredentials = (role) => {
        const creds = demoCredentials[role]
        setFormData({
            email: creds.email,
            password: creds.password
        })
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-6 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 transition-colors duration-300">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                        <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Employee Portal
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Sign in to access your dashboard
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Demo Credentials */}
                    <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
                            Demo Credentials:
                        </p>
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('employee')}
                                className="w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm"
                            >
                                <span className="font-medium">Employee:</span> employee@company.com / employee123
                            </button>
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('admin')}
                                className="w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm"
                            >
                                <span className="font-medium">Admin:</span> admin@company.com / admin123
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                Remember me
                            </span>
                        </label>
                        <a
                            href="#"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Forgot password?
                        </a>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}

