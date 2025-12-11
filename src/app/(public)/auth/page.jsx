'use client'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Store, Sparkles } from 'lucide-react'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function AccountTypeSelection() {
    const navigate = useNavigate()
    const { t } = useLanguageCurrency()

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 relative overflow-hidden transition-colors duration-300">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 dark:opacity-10 animate-blob transition-colors duration-300"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000 transition-colors duration-300"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000 transition-colors duration-300"></div>
            </div>

            <div className="max-w-lg w-full relative z-10">
                {/* Back to Home */}
                <button 
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 sm:mb-8 transition-all duration-300 text-sm sm:text-base group"
                >
                    <ArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="group-hover:underline">{t('backToHome')}</span>
                </button>

                {/* Selection Card */}
                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-gray-900/50 p-8 sm:p-10 border border-white/20 dark:border-gray-700/50 transition-colors duration-300">
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-2xl mb-4 shadow-lg dark:shadow-gray-900/50 transition-colors duration-300">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-3 transition-colors duration-300">
                            Create an account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base transition-colors duration-300">
                            Choose your account type to get started
                        </p>
                    </div>

                    {/* Account Type Buttons */}
                    <div className="space-y-4">
                        {/* Buyer Button */}
                        <button
                            onClick={() => navigate('/auth/login')}
                            className="group w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] p-6"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <div className="relative flex items-center justify-center gap-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                                    <ShoppingBag size={28} className="group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-xl font-bold">Buyer</div>
                                    <div className="text-sm text-blue-100 font-normal">Shop and purchase products</div>
                                </div>
                                <div className="text-2xl opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</div>
                            </div>
                        </button>

                        {/* Seller Button */}
                        <button
                            onClick={() => navigate('/seller')}
                            className="group w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] p-6"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <div className="relative flex items-center justify-center gap-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                                    <Store size={28} className="group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-xl font-bold">Seller</div>
                                    <div className="text-sm text-emerald-100 font-normal">Sell and manage your store</div>
                                </div>
                                <div className="text-2xl opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</div>
                            </div>
                        </button>
                    </div>

                    {/* Footer Text */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            Already have an account?{' '}
                            <button 
                                onClick={() => navigate('/auth/login')}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline underline-offset-2 transition-colors"
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

