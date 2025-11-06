'use client'
import React from 'react'
import Image from '@/components/Image'
import { assets } from '@/assets/assets'

const PictureBoxes = () => {
    return (
        <div className='px-4 sm:px-6 my-16 sm:my-20 lg:my-30 max-w-6xl mx-auto'>
            <div className='flex flex-col md:flex-row gap-4 sm:gap-6 justify-between'>
                <div className="text-box banner-layer x50 md-x50 lg-x50 y50 md-y50 lg-y50 res-text flex-1">
                    <div className='bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 h-48 sm:h-56 lg:h-64 flex items-center justify-between relative overflow-hidden shadow-sm'>
                        <div className='text-left z-10 flex-1'>
                            <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2'>New Arrivals</h3>
                            <p className='text-gray-600 mb-4'>Discover the latest trends</p>
                            <button className='bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition'>
                                Shop Now
                            </button>
                        </div>
                        <div className='flex-shrink-0 ml-4'>
                            <Image src={assets.product_img1} alt='New Arrivals' width={140} height={140} className='w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg shadow-lg object-cover' />
                        </div>
                    </div>
                </div>
                
                <div className="text-box banner-layer x50 md-x50 lg-x50 y50 md-y50 lg-y50 res-text flex-1">
                    <div className='bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 h-48 sm:h-56 lg:h-64 flex items-center justify-between relative overflow-hidden shadow-sm'>
                        <div className='text-left z-10 flex-1'>
                            <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2'>Special Offers</h3>
                            <p className='text-gray-600 mb-4'>Limited time deals</p>
                            <button className='bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition'>
                                View Offers
                            </button>
                        </div>
                        <div className='flex-shrink-0 ml-4'>
                            <Image src={assets.product_img2} alt='Special Offers' width={140} height={140} className='w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg shadow-lg object-cover' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PictureBoxes
