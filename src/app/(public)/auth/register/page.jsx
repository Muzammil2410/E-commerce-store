'use client'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function RegisterPage() {
    const navigate = useNavigate()
    const { t } = useLanguageCurrency()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
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
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Simulate successful registration
        toast.success('Account created successfully!')
        
        // Store user session
        localStorage.setItem('user', JSON.stringify({
            id: 'user_' + Date.now(),
            name: formData.name,
            email: formData.email,
            image: '/api/placeholder/40/40'
        }))
        
        navigate('/profile')
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Back to Home */}
                <button 
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    {t('backToHome')}
                </button>

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('createAccount')}</h1>
                        <p className="text-gray-600">{t('joinZizla')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('fullName')}
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder={t('enterYourFullName')}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('emailAddress')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder={t('enterYourEmail')}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('password')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder={t('createAPassword')}
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

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('confirmPassword')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder={t('confirmYourPassword')}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <input type="checkbox" className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" required />
                            <label className="ml-2 text-sm text-gray-600">
                                {t('iAgreeTo')}{' '}
                                <button type="button" className="text-green-600 hover:text-green-800">
                                    {t('termsOfService')}
                                </button>{' '}
                                and{' '}
                                <button type="button" className="text-green-600 hover:text-green-800">
                                    {t('privacyPolicy')}
                                </button>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            {loading ? t('creatingAccount') : t('createAccountButton')}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {t('alreadyHaveAccount')}{' '}
                            <button 
                                type="button"
                                onClick={() => navigate('/auth/login')}
                                className="text-green-600 hover:text-green-800 font-medium transition-colors"
                            >
                                {t('signIn')}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
