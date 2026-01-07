'use client'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [passwordChanged, setPasswordChanged] = useState(false)
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
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

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match')
            setLoading(false)
            return
        }

        if (formData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters')
            setLoading(false)
            return
        }

        if (formData.oldPassword === formData.newPassword) {
            toast.error('New password must be different from old password')
            setLoading(false)
            return
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Simulate successful password change
        toast.success('Password changed successfully!')
        setPasswordChanged(true)
        setLoading(false)
    }

    if (passwordChanged) {
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
                        
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Password Changed!</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
                            Your password has been successfully changed. You can now login with your new password.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/auth/login')}
                                className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-medium"
                            >
                                Go to Login
                            </button>
                            <button
                                onClick={() => {
                                    setPasswordChanged(false)
                                    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                                }}
                                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                Change Another Password
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

                {/* Change Password Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 transition-colors duration-300">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Change Password</h1>
                        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                            Enter your old password and choose a new password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Old Password Field */}
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                Old Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                                <input
                                    type={showOldPassword ? 'text' : 'password'}
                                    id="oldPassword"
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="Enter your old password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password Field */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="Enter your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="Confirm your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            {loading ? 'Changing Password...' : 'Change Password'}
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
