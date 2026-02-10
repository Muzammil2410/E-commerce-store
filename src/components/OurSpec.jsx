'use client'
import React from 'react'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'
import { useContext } from 'react'
import { LanguageCurrencyContext } from '@/contexts/LanguageCurrencyContext'

const OurSpecs = () => {
    const context = useContext(LanguageCurrencyContext)
    const t = context?.t || ((key) => key)

    // Map specs data with translations
    const translatedSpecs = [
        {
            title: t('specFreeShipping'),
            description: t('freeShippingDescription'),
            icon: ourSpecsData[0].icon,
            accent: ourSpecsData[0].accent
        },
        {
            title: t('sevenDaysEasyReturn'),
            description: t('sevenDaysEasyReturnDescription'),
            icon: ourSpecsData[1].icon,
            accent: ourSpecsData[1].accent
        },
        {
            title: t('customerSupport247'),
            description: t('customerSupport247Description'),
            icon: ourSpecsData[2].icon,
            accent: ourSpecsData[2].accent
        }
    ]

    return (
        <div className='px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 mt-2 sm:mt-3 lg:mt-4 mb-6 sm:mb-8 max-w-[1920px] mx-auto'>
            <Title visibleButton={false} title={t('ourSpecifications')} description={t('weOfferTopTier')} />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 gap-y-4 sm:gap-y-5 lg:gap-y-6 mt-6 sm:mt-8 lg:mt-10'>
                {
                    translatedSpecs.map((spec, index) => {
                        return (
                            <div className='relative h-32 sm:h-40 md:h-44 px-3 sm:px-4 md:px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200' style={{ backgroundColor: spec.accent + 10, borderColor: spec.accent + 30 }} key={index}>
                                <h3 className='text-slate-800 dark:text-white font-medium text-sm sm:text-base transition-colors duration-200'>{spec.title}</h3>
                                <p className='text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-2 sm:mt-3 transition-colors duration-200'>{spec.description}</p>
                                <div className='absolute -top-4 sm:-top-5 text-white size-7 sm:size-8 md:size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition' style={{ backgroundColor: spec.accent }}>
                                    <spec.icon size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
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