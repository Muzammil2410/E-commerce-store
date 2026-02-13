'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { useContext } from 'react'
import { LanguageCurrencyContext } from '@/contexts/LanguageCurrencyContext'

const SportsSection = () => {
    const allProducts = useSelector(state => state.product.list)
    const context = useContext(LanguageCurrencyContext)
    const t = context?.t || ((key) => key)

    // Filter products that are gadget-related based on actual categories
    const gadgetsProducts = allProducts.filter(product =>
        product.category === "Watch" ||
        product.category === "Headphones" ||
        product.category === "Speakers" ||
        product.category === "Earbuds" ||
        product.category === "Mouse" ||
        product.category === "Camera"
    ).slice(0, 10) // Show 10 gadgets (2 rows of 5)

    const description = t('showingGadgetsProducts').replace('{count}', gadgetsProducts.length)

    return (
        <div className='px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 mt-2 sm:mt-3 lg:mt-4 mb-1 sm:mb-2 lg:mb-2 max-w-[1920px] mx-auto'>
            <Title title={t('gadgets')} description={description} href='/shop?category=Gadgets' />
            <div className='mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4'>
                {gadgetsProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} hideDiscount={true} />
                ))}
            </div>
        </div>
    )
}

export default SportsSection
