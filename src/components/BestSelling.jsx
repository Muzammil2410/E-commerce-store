'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

const BestSelling = () => {
    const { t } = useLanguageCurrency()
    const displayQuantity = 12
    const products = useSelector(state => state.product.list)
    const showingCount = products.length < displayQuantity ? products.length : displayQuantity
    const description = t('showingProducts').replace('{count}', showingCount).replace('{total}', products.length)

    return (
        <div className='px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 mt-0 mb-0 max-w-[1920px] mx-auto'>
            <Title title={t('bestSelling')} description={description} href='/shop' />
            <div className='mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-5'>
                {products.slice().sort((a, b) => b.rating.length - a.rating.length).slice(0, displayQuantity).map((product, index) => (
                    <ProductCard key={index} product={product} hideDiscount={true} />
                ))}
            </div>
        </div>
    )
}

export default BestSelling