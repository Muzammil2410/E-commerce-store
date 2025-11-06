'use client'
import React, { useState } from 'react'
import Image from '@/components/Image'
import { assets } from '@/assets/assets'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ShopByCategory = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    
    const categories = [
        {
            name: "TECHNOLOGY",
            image: assets.tech_image,
            description: "Latest gadgets and electronics",
            href: "/shop?category=technology"
        },
        {
            name: "APPLIANCES", 
            image: assets.appliances_image,
            description: "Home and kitchen appliances",
            href: "/shop?category=appliances"
        },
        {
            name: "AUTOMOTIVE PARTS AND ACCESSORIES",
            image: assets.automotive_image,
            description: "Car parts and accessories",
            href: "/shop?category=automotive"
        },
        {
            name: "BABY",
            image: assets.baby_image,
            description: "Baby care and products",
            href: "/shop?category=baby"
        },
        {
            name: "BOOK",
            image: assets.book_image,
            description: "Books and educational materials",
            href: "/shop?category=books"
        },
        {
            name: "FASHION",
            image: assets.fashion_image,
            description: "Clothing and fashion accessories",
            href: "/shop?category=fashion"
        },
        {
            name: "BEAUTY",
            image: assets.beauty_image,
            description: "Beauty and skincare products",
            href: "/shop?category=beauty"
        },
        {
            name: "PERSONAL CARE",
            image: assets.personal_care_image,
            description: "Personal hygiene and care items",
            href: "/shop?category=personal-care"
        }
    ]

    const itemsPerSlide = 4
    const totalSlides = Math.ceil(categories.length / itemsPerSlide)

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    }

    return (
        <div className='px-4 sm:px-6 my-16 sm:my-20 max-w-7xl mx-auto'>
            <div className='text-center mb-12 sm:mb-16'>
                <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4'>SHOP BY CATEGORY</h2>
                <p className='text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4'>Discover our wide range of products organized by category for easy browsing</p>
            </div>
            
            {/* Slider Container */}
            <div className='relative'>
                {/* Navigation Arrows */}
                <button 
                    onClick={prevSlide}
                    className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg hover:bg-blue-50 hover:border-blue-200 hover:scale-110 transition-all duration-300 group'
                >
                    <ChevronLeft className='w-4 h-4 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600' />
                </button>
                
                <button 
                    onClick={nextSlide}
                    className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg hover:bg-blue-50 hover:border-blue-200 hover:scale-110 transition-all duration-300 group'
                >
                    <ChevronRight className='w-4 h-4 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600' />
                </button>

                {/* Slider Content */}
                <div className='overflow-hidden'>
                    <div 
                        className='flex transition-transform duration-500 ease-in-out'
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                            <div key={slideIndex} className='w-full flex-shrink-0'>
                                <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-4 lg:px-8'>
                                    {categories
                                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                                        .map((category, index) => (
                                        <div key={index} className='group cursor-pointer'>
                                            <div className='relative w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 mx-auto mb-3 sm:mb-4 lg:mb-6 rounded-full overflow-hidden bg-white border-2 sm:border-4 border-gray-100 shadow-lg group-hover:shadow-2xl group-hover:scale-105 group-hover:border-blue-200 transition-all duration-500'>
                                                {category.image ? (
                                                    <Image 
                                                        src={category.image} 
                                                        alt={category.name}
                                                        fill
                                                        className='object-cover group-hover:scale-110 transition-transform duration-500'
                                                    />
                                                ) : (
                                                    <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                                                        <span className='text-gray-500 text-sm'>No Image</span>
                                                    </div>
                                                )}
                                                <div className='absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300'></div>
                                            </div>
                                            
                                            <div className='text-center'>
                                                <h3 className='text-sm sm:text-base lg:text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300'>
                                                    {category.name}
                                                </h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slide Indicators */}
                <div className='flex justify-center mt-8 gap-2'>
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide 
                                    ? 'bg-blue-600 scale-125' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
            </div>
            
            {/* View All Categories Button */}
            <div className='text-center mt-8 sm:mt-12'>
                <button className='bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-md'>
                    View All Categories
                </button>
            </div>
        </div>
    )
}

export default ShopByCategory
