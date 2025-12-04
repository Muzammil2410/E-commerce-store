'use client'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import React, { useContext } from 'react'
import { LanguageCurrencyContext } from '@/contexts/LanguageCurrencyContext'

const Title = ({ title, description, visibleButton = true, href = '' }) => {
    // Safely get context without throwing error
    const context = useContext(LanguageCurrencyContext)
    const viewMoreText = context?.t ? context.t('viewMore') : 'View more'

    return (
        <div className='flex flex-col items-center px-4'>
            <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-center'>{title}</h2>
            <Link to={href} className='flex flex-col sm:flex-row items-center gap-2 sm:gap-5 text-xs sm:text-sm text-slate-600 mt-2'>
                <p className='max-w-lg text-center'>{description}</p>
                {visibleButton && <button className='text-blue-600 font-medium flex items-center gap-1 text-xs sm:text-sm'>{viewMoreText} <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" /></button>}
            </Link>
        </div>
    )
}

export default Title