'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from '@/components/Image'
import React, { useState, useEffect } from 'react'

const Hero = () => {

    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$'
    
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
        <div className='px-4 sm:px-6'>
            <div className='flex flex-col xl:flex-row gap-6 xl:gap-8 max-w-7xl mx-auto my-6 sm:my-10'>
                <div className='relative flex-1 flex flex-col rounded-2xl xl:rounded-3xl min-h-[300px] sm:min-h-[400px] xl:min-h-[500px] group shadow-sm overflow-hidden'>
                    <Image 
                        className='w-full h-full object-cover object-right sm:object-center absolute inset-0 transition-opacity duration-500' 
                        src={heroImages[currentImageIndex]} 
                        alt="Hero Banner"
                        width={0}
                        height={0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className='relative z-10 p-4 sm:p-8 xl:p-16 flex flex-col justify-center h-full'>
                        <div className='relative z-20 max-w-full sm:max-w-md lg:max-w-lg hidden sm:block'>
                            <div className='inline-flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-sm border border-gray-200 text-gray-700 pr-3 sm:pr-4 p-1.5 sm:p-1 rounded-full text-xs sm:text-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-800 transition-all duration-200 mb-4 sm:mb-4 shadow-sm'>
                                <span className='bg-blue-600 px-2.5 sm:px-3 py-1 rounded-full text-white text-xs font-semibold'>NEWS</span> 
                                <span className='hidden sm:inline'>Free Shipping on Orders Above $150!</span>
                                <span className='sm:hidden font-medium'>Free Shipping Above $150!</span>
                                <ChevronRightIcon className='group-hover:ml-2 transition-all' size={14} />
                            </div>
                            <h2 className='text-2xl sm:text-2xl md:text-3xl xl:text-4xl leading-[1.1] sm:leading-[1.2] mb-3 sm:mb-4 font-bold text-gray-900 drop-shadow-sm'>
                                <span className="text-blue-600 hover:text-blue-700 transition-colors duration-200">Ziz</span>la you'll love. Prices you'll trust.
                            </h2>
                            <div className='text-gray-800 text-base sm:text-sm font-semibold mb-3 sm:mb-4 drop-shadow-sm'>
                                <p className='text-gray-700'>Starts from</p>
                                <p className='text-3xl sm:text-3xl font-bold text-blue-600'>{currency}4.90</p>
                            </div>
                            <button className='bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base sm:text-sm font-semibold py-3.5 px-8 sm:py-3 sm:px-8 xl:py-5 xl:px-12 rounded-xl hover:from-blue-700 hover:to-blue-800 hover:scale-105 active:scale-95 transition-all duration-200 w-fit shadow-xl hover:shadow-2xl border border-blue-500/20'>LEARN MORE</button>
                        </div>
                    </div>
                    {/* Slider indicators */}
                    <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20'>
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentImageIndex 
                                        ? 'bg-blue-600 w-6' 
                                        : 'bg-white/70 hover:bg-white'
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col sm:flex-row xl:flex-col gap-4 sm:gap-5 w-full xl:max-w-sm text-sm text-gray-600'>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl xl:rounded-3xl p-4 sm:p-6 xl:p-8 group shadow-sm'>
                        <div className='flex-1'>
                            <p className='text-xl sm:text-2xl xl:text-3xl font-medium text-gray-800 mb-2 sm:mb-4'>Best products</p>
                            <p className='flex items-center gap-1 text-blue-600 font-medium text-sm'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={16} /> </p>
                        </div>
                        <div className='flex-shrink-0 ml-3'>
                            <Image className='w-20 h-20 sm:w-24 sm:h-24 xl:w-32 xl:h-32 object-contain' src={assets.hero_product_img1} alt="Best Products" />
                        </div>
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl xl:rounded-3xl p-4 sm:p-6 xl:p-8 group shadow-sm'>
                        <div className='flex-1'>
                            <p className='text-xl sm:text-2xl xl:text-3xl font-medium text-gray-800 mb-2 sm:mb-4'>20% discounts</p>
                            <p className='flex items-center gap-1 text-blue-600 font-medium text-sm'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={16} /> </p>
                        </div>
                        <div className='flex-shrink-0 ml-3'>
                            <Image className='w-20 h-20 sm:w-24 sm:h-24 xl:w-32 xl:h-32 object-contain' src={assets.hero_product_img2} alt="Discounts" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Hero