'use client'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

// Social Login Icons
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
)

const FacebookIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
)

export default function LoginPage() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    // Demo credentials
    const demoCredentials = {
        email: 'demo@zizla.com',
        password: 'demo123'
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

        // Check demo credentials for regular users
        if (formData.email === demoCredentials.email && formData.password === demoCredentials.password) {
            toast.success('Login successful!')
            // Store user session (in real app, this would be handled by auth provider)
            localStorage.setItem('user', JSON.stringify({
                id: 'user_1',
                name: 'Demo User',
                email: 'demo@zizla.com',
                image: '/api/placeholder/40/40'
            }))
            navigate('/profile')
        } else {
            toast.error('Invalid credentials. Use demo@zizla.com / demo123')
        }

        setLoading(false)
    }

    const fillDemoCredentials = () => {
        setFormData(demoCredentials)
    }

    const handleSocialLogin = (provider) => {
        toast.success(`Continue with ${provider} - Feature coming soon!`)
        // In a real app, this would integrate with OAuth providers
        // For now, just show a toast message
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Back to Home */}
                <button 
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600">
                            Sign in to your Zizla account
                        </p>
                    </div>


                    {/* Demo Credentials Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
                        <p className="text-xs text-blue-600 mb-3">Use these credentials to login:</p>
                        <div className="text-xs text-blue-700 space-y-1">
                            <p><strong>Email:</strong> demo@zizla.com</p>
                            <p><strong>Password:</strong> demo123</p>
                        </div>
                        <button
                            type="button"
                            onClick={fillDemoCredentials}
                            className="mt-3 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                        >
                            Fill Demo Credentials
                        </button>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3 mb-6">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Google')}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 shadow-sm hover:shadow-md"
                        >
                            <GoogleIcon />
                            <span className="text-sm sm:text-base">Continue with Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Facebook')}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 shadow-sm hover:shadow-md"
                        >
                            <div className="text-blue-600">
                                <FacebookIcon />
                            </div>
                            <span className="text-sm sm:text-base">Continue with Facebook</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Email')}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 shadow-sm hover:shadow-md"
                        >
                            <Mail className="w-5 h-5 text-gray-600" />
                            <span className="text-sm sm:text-base">Continue with Email</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <button 
                                type="button"
                                onClick={() => navigate('/auth/forgot-password')}
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-700 text-base">
                            Don't have an account?{' '}
                            <button 
                                type="button"
                                onClick={() => navigate('/auth/register')}
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>

                    {/* Login as Seller Link */}
                    <div className="mt-4 text-center pb-2">
                        <p className="text-gray-700 text-base leading-relaxed">
                            Are you a seller?{' '}
                            <button 
                                type="button"
                                onClick={() => navigate('/seller')}
                                className="text-green-600 hover:text-green-800 font-medium transition-colors cursor-pointer"
                            >
                                Login as a seller
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
