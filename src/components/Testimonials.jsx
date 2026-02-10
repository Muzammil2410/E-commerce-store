'use client'
import React, { useState } from 'react'
import Image from '@/components/Image'
import { Star, X } from 'lucide-react'
import { dummyRatingsData } from '@/assets/assets'
import { useContext } from 'react'
import { LanguageCurrencyContext } from '@/contexts/LanguageCurrencyContext'

const Testimonials = () => {
    const context = useContext(LanguageCurrencyContext)
    const t = context?.t || ((key) => key)
    const translateProductName = context?.translateProductName || ((name) => name)
    const [showAllReviews, setShowAllReviews] = useState(false)
    // Get first 3 testimonials for display
    const testimonials = dummyRatingsData.slice(0, 3)
    // Get all reviews
    const allReviews = dummyRatingsData

    return (
        <div className='px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 mt-2 sm:mt-3 lg:mt-4 mb-6 sm:mb-8 lg:mb-10 max-w-[1920px] mx-auto'>
            <div className='text-center mb-6'>
                <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-200'>{t('whatOurCustomersSay')}</h2>
                <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-200'>{t('dontJustTakeOurWord')}</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'>
                {testimonials.map((testimonial, index) => (
                    <div key={index} className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-gray-900/50 hover:shadow-md dark:hover:shadow-gray-900/70 transition-shadow duration-300 min-h-[280px] sm:h-80 flex flex-col'>
                        {/* Star Rating */}
                        <div className='flex items-center mb-4'>
                            {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                    key={i}
                                    className={`size-3 sm:size-4 fill-current ${testimonial.rating > i ? "text-yellow-400 dark:text-yellow-500" : "text-gray-300 dark:text-gray-600"}`}
                                />
                            ))}
                            <span className='ml-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200'>({testimonial.rating})</span>
                        </div>

                        {/* Review Text */}
                        <p className='text-gray-700 dark:text-gray-300 mb-6 leading-relaxed flex-1 overflow-hidden transition-colors duration-200'>
                            "{testimonial.review}"
                        </p>

                        {/* Customer Info */}
                        <div className='flex items-center gap-3 mt-auto'>
                            <Image
                                src={testimonial.user.image}
                                alt={testimonial.user.name}
                                width={48}
                                height={48}
                                className='rounded-full'
                            />
                            <div>
                                <p className='font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200'>{testimonial.user.name}</p>
                                <p className='text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200'>{translateProductName(testimonial.product.name)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Reviews Button */}
            <div className='text-center mt-6'>
                <button
                    onClick={() => setShowAllReviews(true)}
                    className='text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md'
                    style={{ backgroundColor: '#3977ED' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                >
                    {t('viewAllReviews')}
                </button>
            </div>

            {/* All Reviews Modal */}
            {showAllReviews && (
                <>
                    <div
                        className='fixed inset-0 bg-black/50 dark:bg-black/70 z-50 transition-colors duration-300'
                        onClick={() => setShowAllReviews(false)}
                    />
                    <div className='fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto'>
                        <div
                            className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative transition-colors duration-300'
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700'>
                                <div>
                                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-200'>
                                        {t('whatOurCustomersSay')}
                                    </h2>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-200'>
                                        {allReviews.length} {t('reviews')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAllReviews(false)}
                                    className='text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* All Reviews Grid */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {allReviews.map((review, index) => (
                                    <div
                                        key={review.id || index}
                                        className='bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-5 shadow-sm dark:shadow-gray-900/50 hover:shadow-md dark:hover:shadow-gray-900/70 transition-shadow duration-300 flex flex-col'
                                    >
                                        {/* Star Rating */}
                                        <div className='flex items-center mb-3'>
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`size-4 fill-current ${review.rating > i ? "text-yellow-400 dark:text-yellow-500" : "text-gray-300 dark:text-gray-600"}`}
                                                />
                                            ))}
                                            <span className='ml-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200'>
                                                ({review.rating})
                                            </span>
                                        </div>

                                        {/* Review Text */}
                                        <p className='text-gray-700 dark:text-gray-300 mb-4 leading-relaxed flex-1 transition-colors duration-200'>
                                            "{review.review}"
                                        </p>

                                        {/* Customer Info */}
                                        <div className='flex items-center gap-3 mt-auto pt-4 border-t border-gray-200 dark:border-gray-600'>
                                            <Image
                                                src={review.user.image}
                                                alt={review.user.name}
                                                width={40}
                                                height={40}
                                                className='rounded-full'
                                            />
                                            <div>
                                                <p className='font-medium text-gray-800 dark:text-gray-200 text-sm transition-colors duration-200'>
                                                    {review.user.name}
                                                </p>
                                                <p className='text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200'>
                                                    {translateProductName(review.product?.name || 'Product')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Close Button */}
                            <div className='mt-6 text-center'>
                                <button
                                    onClick={() => setShowAllReviews(false)}
                                    className='bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200'
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Testimonials
