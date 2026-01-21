'use client'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminControlPanelLogin() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Demo credentials info
  const demoCredentials = {
    email: 'admin@zizla.com',
    password: 'admin123'
  }

  useEffect(() => {
    // Check if already logged in
    const controlPanelAdmin = localStorage.getItem('controlPanelAdmin')
    if (controlPanelAdmin) {
      navigate('/admin/control-panel')
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate credentials
    if (formData.email === demoCredentials.email && formData.password === demoCredentials.password) {
      // Store admin session
      const adminData = {
        email: formData.email,
        name: 'Admin User',
        role: 'control_panel_admin',
        loginTime: new Date().toISOString()
      }
      
      localStorage.setItem('controlPanelAdmin', JSON.stringify(adminData))
      
      toast.success('Login successful! Welcome to Control Panel')
      
      setTimeout(() => {
        navigate('/admin/control-panel')
      }, 500)
    } else {
      toast.error('Invalid credentials! Please check email and password.')
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setFormData({
      email: demoCredentials.email,
      password: demoCredentials.password
    })
    
    setTimeout(() => {
      document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Control Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Secure Admin Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-200">
          {/* Demo Credentials */}
          <div className="mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Demo Credentials
              </p>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
                <p><span className="font-medium">Email:</span> {demoCredentials.email}</p>
                <p><span className="font-medium">Password:</span> {demoCredentials.password}</p>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Use Demo Credentials
              </button>
            </div>
          </div>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@zizla.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login to Control Panel</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 Zizla E-Commerce. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

