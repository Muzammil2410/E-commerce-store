import React from 'react'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'

const OurSpecs = () => {

    return (
        <div className='px-4 sm:px-6 my-16 sm:my-20 max-w-6xl mx-auto'>
            <Title visibleButton={false} title='Our Specifications' description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free." />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7 gap-y-6 sm:gap-y-8 lg:gap-y-10 mt-16 sm:mt-20 lg:mt-26'>
                {
                    ourSpecsData.map((spec, index) => {
                        return (
                            <div className='relative h-40 sm:h-44 px-4 sm:px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group' style={{ backgroundColor: spec.accent + 10, borderColor: spec.accent + 30 }} key={index}>
                                <h3 className='text-slate-800 font-medium text-sm sm:text-base'>{spec.title}</h3>
                                <p className='text-xs sm:text-sm text-slate-600 mt-2 sm:mt-3'>{spec.description}</p>
                                <div className='absolute -top-4 sm:-top-5 text-white size-8 sm:size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition' style={{ backgroundColor: spec.accent }}>
                                    <spec.icon size={16} className="sm:w-5 sm:h-5" />
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default OurSpecs