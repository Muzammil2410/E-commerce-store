'use client'
import React from 'react'
import Image from '@/components/Image'
import { assets } from '@/assets/assets'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'
import { Link } from 'react-router-dom'

const PictureBoxes = () => {
    const { t } = useLanguageCurrency()
    
    return (
        <div className='px-4 sm:px-6 mt-16 sm:mt-20 lg:mt-30 mb-2 sm:mb-3 lg:mb-4 max-w-6xl mx-auto'>
            <div className='flex flex-col md:flex-row gap-4 sm:gap-6 justify-between'>
                <div className="text-box banner-layer x50 md-x50 lg-x50 y50 md-y50 lg-y50 res-text flex-1">
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 h-48 sm:h-56 lg:h-64 flex items-center justify-between relative overflow-hidden shadow-sm dark:shadow-gray-900/50 transition-colors duration-200'>
                        <div className='text-left z-10 flex-1'>
                            <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-200'>{t('newArrivals')}</h3>
                            <p className='text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-200'>{t('discoverLatestTrends')}</p>
                            <Link 
                                to="/shop" 
                                className='inline-block text-white px-6 py-2 rounded-full transition-colors duration-200'
                                style={{ backgroundColor: '#3977ED' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                            >
                                {t('shopNow')}
                            </Link>
                        </div>
                        <div className='flex-shrink-0 ml-4'>
                            <Image src={assets.product_img1} alt={t('newArrivals')} width={140} height={140} className='w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg shadow-lg object-cover' />
                        </div>
                    </div>
                </div>
                
                <div className="text-box banner-layer x50 md-x50 lg-x50 y50 md-y50 lg-y50 res-text flex-1">
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 h-48 sm:h-56 lg:h-64 flex items-center justify-between relative overflow-hidden shadow-sm dark:shadow-gray-900/50 transition-colors duration-200'>
                        <div className='text-left z-10 flex-1'>
                            <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-200'>{t('specialOffers')}</h3>
                            <p className='text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-200'>{t('limitedTimeDeals')}</p>
                            <Link 
                                to="/shop" 
                                className='inline-block text-white px-6 py-2 rounded-full transition-colors duration-200'
                                style={{ backgroundColor: '#3977ED' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                            >
                                {t('viewOffers')}
                            </Link>
                        </div>
                        <div className='flex-shrink-0 ml-4'>
                            <Image src={assets.product_img2} alt={t('specialOffers')} width={140} height={140} className='w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg shadow-lg object-cover' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PictureBoxes
