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
    ).slice(0, 4) // Show only first 4 gadgets

    const description = t('showingGadgetsProducts').replace('{count}', gadgetsProducts.length)

    return (
        <div className='px-4 sm:px-6 my-16 sm:my-20 lg:my-30 max-w-6xl mx-auto'>
            <Title title={t('gadgets')} description={description} href='/shop?category=Gadgets' />
            <div className='mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
                {gadgetsProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default SportsSection
