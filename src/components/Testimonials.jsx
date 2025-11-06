'use client'
import React from 'react'
import Image from '@/components/Image'
import { Star } from 'lucide-react'
import { dummyRatingsData } from '@/assets/assets'

const Testimonials = () => {
    // Get first 3 testimonials for display
    const testimonials = dummyRatingsData.slice(0, 3)

    return (
        <div className='px-4 sm:px-6 my-16 sm:my-20 lg:my-30 max-w-6xl mx-auto'>
            <div className='text-center mb-12'>
                <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4'>What Our Customers Say</h2>
                <p className='text-gray-600 max-w-2xl mx-auto'>Don't just take our word for it. Here's what our satisfied customers have to say about their shopping experience with Zizla.</p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
                {testimonials.map((testimonial, index) => (
                    <div key={index} className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 h-80 flex flex-col'>
                        {/* Star Rating */}
                        <div className='flex items-center mb-4'>
                            {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                    key={i}
                                    className={`size-4 fill-current ${testimonial.rating > i ? "text-yellow-400" : "text-gray-300"}`}
                                />
                            ))}
                            <span className='ml-2 text-sm text-gray-600'>({testimonial.rating})</span>
                        </div>
                        
                        {/* Review Text */}
                        <p className='text-gray-700 mb-6 leading-relaxed flex-1 overflow-hidden'>
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
                                <p className='font-medium text-gray-800'>{testimonial.user.name}</p>
                                <p className='text-sm text-gray-500'>{testimonial.product.name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* View All Reviews Button */}
            <div className='text-center mt-12'>
                <button className='bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md'>
                    View All Reviews
                </button>
            </div>
        </div>
    )
}

export default Testimonials
