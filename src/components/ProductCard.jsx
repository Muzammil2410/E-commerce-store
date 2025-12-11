'use client'
import { StarIcon } from 'lucide-react'
import Image from '@/components/Image'
import { Link } from 'react-router-dom'
import React, { memo, useMemo } from 'react'
import WishlistButton from './WishlistButton'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

const ProductCard = memo(({ product }) => {

    const { formatCurrency, translateProductName } = useLanguageCurrency()

    // calculate the average rating of the product - memoized for performance
    const rating = useMemo(() => {
        if (!product.rating || product.rating.length === 0) return 0;
        return Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length);
    }, [product.rating]);

    return (
        <article className='group w-full max-w-[280px] mx-auto transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 relative overflow-hidden'>
            <Link to={`/product/${product.id}`} aria-label={`View details for ${translateProductName(product.name)}`}>
                <div className='bg-[#F5F5F5] dark:bg-gray-800 h-32 sm:h-40 md:h-48 rounded-lg flex items-center justify-center overflow-hidden shadow-sm dark:shadow-gray-900/50 group-hover:shadow-lg transition-all duration-300'>
                    <Image 
                        width={500} 
                        height={500} 
                        className='max-h-24 sm:max-h-32 md:max-h-40 w-auto h-auto group-hover:scale-125 transition-all duration-500 ease-out object-contain' 
                        src={product.images[0]} 
                        alt={`${translateProductName(product.name)} product image`}
                        loading="lazy"
                    />
                </div>
                <div className='flex justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-slate-800 dark:text-gray-100 pt-2'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 font-medium truncate'>{translateProductName(product.name)}</h3>
                        <div className='flex group-hover:scale-110 transition-transform duration-300 mt-1' role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
                            {Array(5).fill('').map((_, index) => (
                                <StarIcon 
                                    key={index} 
                                    size={12} 
                                    className='text-transparent group-hover:scale-110 transition-transform duration-300' 
                                    style={{transitionDelay: `${index * 50}ms`}} 
                                    fill={rating >= index + 1 ? "#FCD34D" : "#D1D5DB"}
                                    aria-hidden="true"
                                />
                            ))}
                        </div>
                    </div>
                    <p className='group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:font-semibold transition-all duration-300 text-sm sm:text-base font-medium flex-shrink-0' aria-label={`Price: ${formatCurrency(product.price)}`}>
                        {formatCurrency(product.price)}
                    </p>
                </div>
            </Link>
            
            {/* Wishlist Button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <WishlistButton product={product} size={16} />
            </div>
        </article>
    )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard