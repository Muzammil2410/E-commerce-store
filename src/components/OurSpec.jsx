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
        <div className='px-4 sm:px-6 mt-4 sm:mt-6 lg:mt-8 mb-16 sm:mb-20 max-w-6xl mx-auto'>
            <Title visibleButton={false} title={t('ourSpecifications')} description={t('weOfferTopTier')} />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7 gap-y-6 sm:gap-y-8 lg:gap-y-10 mt-16 sm:mt-20 lg:mt-26'>
                {
                    translatedSpecs.map((spec, index) => {
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