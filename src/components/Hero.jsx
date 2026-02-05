'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from '@/components/Image'
import React, { useState, useEffect } from 'react'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'
import { Link } from 'react-router-dom'

const Hero = () => {
    const { t, formatCurrency, getCurrencySymbol } = useLanguageCurrency()
    
    // Slider state
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const heroImages = [assets.slide_1, assets.slider_2]

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
            )
        }, 4000) // Change image every 4 seconds

        return () => clearInterval(interval)
    }, [heroImages.length])

    return (
        <div className='px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 w-full overflow-hidden'>
            <div className='flex flex-col xl:flex-row gap-3 sm:gap-4 xl:gap-5 max-w-[1920px] mx-auto my-2 sm:my-3 md:my-4'>
                <div className='relative flex-1 flex flex-col rounded-xl sm:rounded-2xl xl:rounded-3xl min-h-[280px] sm:min-h-[350px] md:min-h-[400px] xl:min-h-[500px] group shadow-sm overflow-hidden'>
                    <Image 
                        className='w-full h-full object-cover object-right sm:object-center absolute inset-0 transition-opacity duration-500' 
                        src={heroImages[currentImageIndex]} 
                        alt="Hero Banner"
                        width={0}
                        height={0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className='relative z-10 p-4 sm:p-8 xl:p-16 flex flex-col justify-center h-full'>
                        <div className='relative z-20 max-w-full sm:max-w-md lg:max-w-lg'>
                            <div className='hidden sm:inline-flex items-center gap-2 sm:gap-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 pr-3 sm:pr-4 p-1.5 sm:p-1 rounded-full text-xs sm:text-sm hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-200 dark:hover:border-gray-600 hover:text-blue-800 dark:hover:text-blue-400 transition-all duration-200 mb-3 sm:mb-4 shadow-sm dark:shadow-gray-900/50'>
                                <span className='px-2.5 sm:px-3 py-1 rounded-full text-white text-xs font-semibold whitespace-nowrap transition-colors duration-300' style={{ backgroundColor: '#3977ED' }}>{t('news')}</span> 
                                <span className='hidden sm:inline'>{t('freeShipping')}</span>
                                <ChevronRightIcon className='group-hover:ml-2 transition-all flex-shrink-0' size={14} />
                            </div>
                            <h2 className='hidden sm:block text-xl sm:text-2xl md:text-3xl xl:text-4xl leading-tight sm:leading-[1.2] mb-3 sm:mb-4 font-bold text-gray-900 dark:text-gray-100 drop-shadow-lg dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-colors duration-300'>
                                <span className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 transition-colors duration-200">Ziz</span>la you'll love. Prices<br />you'll trust.
                            </h2>
                            <div className='hidden sm:block text-gray-800 dark:text-gray-100 text-sm sm:text-base font-semibold mb-3 sm:mb-4 drop-shadow-lg dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-colors duration-300'>
                                <p className='text-gray-700 dark:text-gray-200 text-xs sm:text-sm transition-colors duration-300'>{t('startsFrom')}</p>
                                <p className='text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300 transition-colors duration-300'>{formatCurrency(4.90)}</p>
                            </div>
                            <button 
                                className='hidden sm:block text-white text-xs sm:text-sm font-semibold py-2.5 px-6 sm:py-3 sm:px-8 xl:py-5 xl:px-12 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 w-fit shadow-xl dark:shadow-gray-900/50 hover:shadow-2xl touch-manipulation'
                                style={{ backgroundColor: '#3977ED' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                            >{t('learnMore')}</button>
                        </div>
                    </div>
                    {/* Slider indicators */}
                    <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20'>
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentImageIndex 
                                        ? 'w-6' 
                                        : 'bg-white/70 dark:bg-gray-600/70 hover:bg-white dark:hover:bg-gray-500'
                                }`}
                                style={index === currentImageIndex ? { backgroundColor: '#3977ED' } : {}}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col sm:flex-row xl:flex-col gap-4 sm:gap-5 w-full xl:max-w-sm text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300'>
                    <Link to="/shop" className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border border-blue-200 dark:border-blue-800 rounded-2xl xl:rounded-3xl p-4 sm:p-6 xl:p-8 group shadow-sm dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-900/70 cursor-pointer'>
                        <div className='flex-1'>
                            <p className='text-xl sm:text-2xl xl:text-3xl font-medium text-gray-800 dark:text-white mb-2 sm:mb-4 transition-colors duration-300'>{t('bestProducts')}</p>
                            <p className='flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium text-sm transition-colors duration-300'>{t('viewMore')} <ArrowRightIcon className='group-hover:ml-2 transition-all' size={16} /> </p>
                        </div>
                        <div className='flex-shrink-0 ml-3'>
                            <Image className='w-20 h-20 sm:w-24 sm:h-24 xl:w-32 xl:h-32 object-contain' src={assets.hero_product_img1} alt="Best Products" />
                        </div>
                    </Link>
                    <Link to="/discounts" className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border border-green-200 dark:border-green-800 rounded-2xl xl:rounded-3xl p-4 sm:p-6 xl:p-8 group shadow-sm dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-900/70 cursor-pointer'>
                        <div className='flex-1'>
                            <p className='text-xl sm:text-2xl xl:text-3xl font-medium text-gray-800 dark:text-white mb-2 sm:mb-4 transition-colors duration-300'>{t('discounts')}</p>
                            <p className='flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium text-sm transition-colors duration-300'>{t('viewMore')} <ArrowRightIcon className='group-hover:ml-2 transition-all' size={16} /> </p>
                        </div>
                        <div className='flex-shrink-0 ml-3'>
                            <Image className='w-20 h-20 sm:w-24 sm:h-24 xl:w-32 xl:h-32 object-contain' src={assets.hero_product_img2} alt="Discounts" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>

    )
}

export default Hero