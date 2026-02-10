'use client'
import React from 'react'
import Image from '@/components/Image'
import { assets } from '@/assets/assets'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'
import { Link } from 'react-router-dom'

const PictureBoxes = () => {
    const { t } = useLanguageCurrency()

    return (
        <div className='px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 mt-6 sm:mt-8 lg:mt-10 mb-1 sm:mb-2 lg:mb-2 max-w-[1920px] mx-auto'>
            <div className='flex flex-col md:flex-row gap-3 sm:gap-4 justify-between'>
                <div className="text-box banner-layer x50 md-x50 lg-x50 y50 md-y50 lg-y50 res-text flex-1">
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 h-44 sm:h-52 lg:h-60 flex items-center justify-between relative overflow-hidden shadow-sm dark:shadow-gray-900/50 transition-colors duration-200'>
                        <div className='text-left z-10 flex-1'>
                            <h3 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-200'>{t('newArrivals')}</h3>
                            <p className='text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-200'>{t('discoverLatestTrends')}</p>
                            <Link
                                to="/shop"
                                className='inline-block text-white px-4 py-2 sm:px-6 rounded-full transition-colors duration-200'
                                style={{ backgroundColor: '#3977ED' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                            >
                                {t('shopNow')}
                            </Link>
                        </div>
                        <div className='flex-shrink-0 ml-4'>
                            <Image src={assets.product_img1} alt={t('newArrivals')} width={140} height={140} className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-lg shadow-lg object-cover' />
                        </div>
                    </div>
                </div>

                <div className="text-box banner-layer x50 md-x50 lg-x50 y50 md-y50 lg-y50 res-text flex-1">
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 h-44 sm:h-52 lg:h-60 flex items-center justify-between relative overflow-hidden shadow-sm dark:shadow-gray-900/50 transition-colors duration-200'>
                        <div className='text-left z-10 flex-1'>
                            <h3 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-200'>{t('specialOffers')}</h3>
                            <p className='text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-200'>{t('limitedTimeDeals')}</p>
                            <Link
                                to="/shop"
                                className='inline-block text-white px-4 py-2 sm:px-6 rounded-full transition-colors duration-200'
                                style={{ backgroundColor: '#3977ED' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                            >
                                {t('viewOffers')}
                            </Link>
                        </div>
                        <div className='flex-shrink-0 ml-4'>
                            <Image src={assets.product_img2} alt={t('specialOffers')} width={140} height={140} className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-lg shadow-lg object-cover' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PictureBoxes
