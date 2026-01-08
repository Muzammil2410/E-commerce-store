'use client'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Store } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SellerLoginPage() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

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

        // Check seller credentials from localStorage
        const sellerProfile = localStorage.getItem('sellerProfile')
        
        if (sellerProfile) {
            try {
                const sellerData = JSON.parse(sellerProfile)
                
                if (formData.email === sellerData.email && formData.password === sellerData.password) {
                    toast.success('Seller login successful!')
                    // Store seller session
                    localStorage.setItem('sellerSession', JSON.stringify({
                        id: 'seller_1',
                        name: sellerData.fullName,
                        email: sellerData.email,
                        businessName: sellerData.businessName
                    }))
                    navigate('/seller/dashboard')
                } else {
                    toast.error('Invalid seller credentials. Please check your email and password.')
                }
            } catch (error) {
                console.error('Error parsing seller profile:', error)
                toast.error('Error loading seller profile. Please try registering again.')
            }
        } else {
            toast.error('No seller account found. Please register as a seller first.')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors duration-300">
            <div className="max-w-md w-full">
                {/* Back to Home */}
                <button 
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>

                {/* Login Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 transition-colors duration-300">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 transition-colors duration-300">
                            <Store className="w-8 h-8 text-green-600 dark:text-green-400 transition-colors duration-300" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                            Seller Login
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                            Sign in to your seller account
                        </p>
                    </div>

                    {/* Seller Login Info */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 transition-colors duration-300">
                        <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2 transition-colors duration-300">Seller Login</h3>
                        <p className="text-xs text-green-600 dark:text-green-400 mb-3 transition-colors duration-300">Use your seller registration credentials:</p>
                        <div className="text-xs text-green-700 dark:text-green-300 space-y-1 transition-colors duration-300">
                            <p><strong>Email:</strong> The email you used during seller registration</p>
                            <p><strong>Password:</strong> The password you set during registration</p>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 transition-colors duration-300">
                            Don't have a seller account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/seller/register')}
                                className="text-[#3977ED] dark:text-[#3977ED] font-medium hover:text-[#2d5fcc] dark:hover:text-[#2d5fcc] hover:underline transition-colors duration-300"
                            >
                                Register as Seller
                            </button>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-green-600 dark:text-green-400 bg-white dark:bg-gray-700 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-300" />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Remember me</span>
                            </label>
                            <button 
                                type="button"
                                onClick={() => navigate('/auth/forgot-password')}
                                className="text-sm text-[#3977ED] dark:text-[#3977ED] hover:text-[#2d5fcc] dark:hover:text-[#2d5fcc] transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg focus:ring-2 focus:ring-[#3977ED] dark:focus:ring-[#3977ED] focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-white"
                            style={{ backgroundColor: loading ? '#3977ED' : '#3977ED' }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = '#2d5fcc'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = '#3977ED'
                                }
                            }}
                        >
                            {loading ? 'Signing in as Seller...' : 'Sign In as Seller'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                            Don't have a seller account?{' '}
                            <button 
                                type="button"
                                onClick={() => navigate('/seller/register')}
                                className="text-[#3977ED] dark:text-[#3977ED] hover:text-[#2d5fcc] dark:hover:text-[#2d5fcc] font-medium transition-colors"
                            >
                                Register as Seller
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
