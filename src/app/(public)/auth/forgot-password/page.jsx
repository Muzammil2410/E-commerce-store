'use client'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Simulate successful email send
        toast.success('Password reset link sent to your email!')
        setEmailSent(true)
        setLoading(false)
    }

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors duration-300">
                <div className="max-w-md w-full">
                    {/* Back to Home */}
                    <button 
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </button>

                    {/* Success Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 text-center transition-colors duration-300">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Check Your Email</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
                            We've sent a password reset link to <strong className="text-gray-900 dark:text-white">{email}</strong>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 transition-colors duration-300">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => setEmailSent(false)}
                                className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-medium"
                            >
                                Try Another Email
                            </button>
                            <button
                                onClick={() => navigate('/auth/login')}
                                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors duration-300">
            <div className="max-w-md w-full">
                {/* Back to Home */}
                <button 
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>

                {/* Forgot Password Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 transition-colors duration-300">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Forgot Password?</h1>
                        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                            No worries! Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                            Remember your password?{' '}
                            <button 
                                type="button"
                                onClick={() => navigate('/auth/login')}
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
