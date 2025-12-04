'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

const BestSelling = () => {
    const { t } = useLanguageCurrency()
    const displayQuantity = 8
    const products = useSelector(state => state.product.list)
    const showingCount = products.length < displayQuantity ? products.length : displayQuantity
    const description = t('showingProducts').replace('{count}', showingCount).replace('{total}', products.length)

    return (
        <div className='px-4 sm:px-6 my-16 sm:my-20 lg:my-30 max-w-6xl mx-auto'>
            <Title title={t('bestSelling')} description={description} href='/shop' />
            <div className='mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8'>
                {products.slice().sort((a, b) => b.rating.length - a.rating.length).slice(0, displayQuantity).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSelling