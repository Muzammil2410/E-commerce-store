'use client'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Store, UserPlus, LogIn } from 'lucide-react'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function SellerChoicePage() {
    const navigate = useNavigate()
    const { t } = useLanguageCurrency()

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors duration-300">
            <div className="max-w-2xl w-full">
                {/* Back to Home */}
                <button 
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    {t('backToHome')}
                </button>

                {/* Main Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 transition-colors duration-300">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 transition-colors duration-300">
                            <Store className="w-10 h-10 text-green-600 dark:text-green-400 transition-colors duration-300" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                            {t('becomeASeller')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                            {t('joinZizlaAndStartSelling')}
                        </p>
                    </div>

                    {/* Choice Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Already have account - Login */}
                        <div 
                            onClick={() => navigate('/seller/login')}
                            className="group cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300"
                        >
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                                    <LogIn className="w-8 h-8 text-green-600 dark:text-green-400 transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                    {t('alreadyHaveAccount')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                                    {t('signInToExistingSeller')}
                                </p>
                                <button className="w-full bg-green-600 dark:bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                                    {t('signIn')}
                                </button>
                            </div>
                        </div>

                        {/* New seller - Register */}
                        <div 
                            onClick={() => navigate('/seller/register')}
                            className="group cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300"
                        >
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                                    <UserPlus className="w-8 h-8 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                    {t('newToSelling')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                                    {t('createSellerAccount')}
                                </p>
                                <button className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                    {t('getStarted')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <div className="text-center">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-300">{t('whyChooseZizla')}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h5 className="font-semibold text-gray-800 dark:text-white mb-1 transition-colors duration-300">{t('quickSetup')}</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('getStartedInMinutes')}</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                                        <svg className="w-6 h-6 text-green-600 dark:text-green-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <h5 className="font-semibold text-gray-800 dark:text-white mb-1 transition-colors duration-300">{t('lowFees')}</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('competitiveCommissionRates')}</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                                        </svg>
                                    </div>
                                    <h5 className="font-semibold text-gray-800 dark:text-white mb-1 transition-colors duration-300">{t('support247')}</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('roundTheClockAssistance')}</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                                        <svg className="w-6 h-6 text-orange-600 dark:text-orange-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h5 className="font-semibold text-gray-800 dark:text-white mb-1 transition-colors duration-300">{t('analytics')}</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{t('detailedInsights')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
