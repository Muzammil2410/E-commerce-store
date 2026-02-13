'use client'
import { StarIcon } from 'lucide-react'
import Image from '@/components/Image'
import { Link } from 'react-router-dom'
import React, { memo, useMemo, useState } from 'react'
import WishlistButton from './WishlistButton'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

const ProductCard = memo(({ product, hideDiscount = false }) => {

    const { formatCurrency, translateProductName } = useLanguageCurrency()
    const imageSrc = product.images?.[0] || product.image || '';
    const [imageError, setImageError] = useState(!imageSrc);

    // calculate the average rating of the product - memoized for performance
    const rating = useMemo(() => {
        if (!product.rating || product.rating.length === 0) return 0;
        return Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length);
    }, [product.rating]);

    return (
        <article className='group w-full max-w-none mx-auto transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 relative'>
            <Link to={`/product/${product.id}`} aria-label={`View details for ${translateProductName(product.name || product.title)}`}>
                <div className='bg-[#F5F5F5] dark:bg-gray-800 h-36 sm:h-44 md:h-52 lg:h-60 xl:h-64 rounded-lg flex items-center justify-center overflow-hidden shadow-sm dark:shadow-gray-900/50 group-hover:shadow-lg transition-all duration-300 relative'>
                    {imageSrc && !imageError ? (
                        <Image
                            width={500}
                            height={500}
                            className='max-h-28 sm:max-h-36 md:max-h-44 lg:max-h-52 xl:max-h-56 w-auto h-auto group-hover:scale-125 transition-all duration-500 ease-out object-contain'
                            src={imageSrc}
                            alt={`${translateProductName(product.name || product.title || 'Product')} product image`}
                            loading="lazy"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className='absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 px-2'>
                            <div className='flex flex-col items-center gap-2'>
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className='text-gray-400 dark:text-gray-500 text-xs text-center max-w-full px-2'>{translateProductName(product.name || product.title || 'Product')}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-slate-800 dark:text-gray-100 pt-2'>
                    <div className='flex-1 min-w-0 overflow-visible'>
                        <h3 className='group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 font-medium truncate'>{translateProductName(product.name || product.title)}</h3>
                        <div className='flex group-hover:scale-110 transition-transform duration-300 mt-1 pl-0.5 overflow-visible' role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
                            {Array(5).fill('').map((_, index) => (
                                <StarIcon
                                    key={index}
                                    size={12}
                                    className='text-transparent group-hover:scale-110 transition-transform duration-300 flex-shrink-0'
                                    style={{ transitionDelay: `${index * 50}ms` }}
                                    fill={rating >= index + 1 ? "#FCD34D" : "#D1D5DB"}
                                    aria-hidden="true"
                                />
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col items-end flex-shrink-0'>
                        {hideDiscount ? (
                            // Show only regular price when hideDiscount is true
                            <p className='group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:font-semibold transition-all duration-300 text-sm sm:text-base font-medium' aria-label={`Price: ${formatCurrency(product.price || product.mrp || 0)}`}>
                                {formatCurrency(product.price || product.mrp || 0)}
                            </p>
                        ) : (
                            (() => {
                                // Check if product has salePrice
                                if (product.salePrice && product.salePrice > 0) {
                                    return (
                                        <div className='flex flex-col items-end'>
                                            <p className='group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:font-semibold transition-all duration-300 text-sm sm:text-base font-bold text-green-600 dark:text-green-400' aria-label={`Sale Price: ${formatCurrency(product.salePrice)}`}>
                                                {formatCurrency(product.salePrice)}
                                            </p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400 line-through transition-all duration-300' aria-label={`Original Price: ${formatCurrency(product.price || product.mrp || 0)}`}>
                                                {formatCurrency(product.price || product.mrp || 0)}
                                            </p>
                                        </div>
                                    )
                                }
                                // Check if product has discount (mrp > price)
                                else if (product.mrp && product.price && product.mrp > product.price) {
                                    return (
                                        <div className='flex flex-col items-end'>
                                            <p className='group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:font-semibold transition-all duration-300 text-sm sm:text-base font-bold text-green-600 dark:text-green-400' aria-label={`Sale Price: ${formatCurrency(product.price)}`}>
                                                {formatCurrency(product.price)}
                                            </p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400 line-through transition-all duration-300' aria-label={`Original Price: ${formatCurrency(product.mrp)}`}>
                                                {formatCurrency(product.mrp)}
                                            </p>
                                        </div>
                                    )
                                }
                                // No discount
                                else {
                                    return (
                                        <p className='group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:font-semibold transition-all duration-300 text-sm sm:text-base font-medium' aria-label={`Price: ${formatCurrency(product.price || 0)}`}>
                                            {formatCurrency(product.price || 0)}
                                        </p>
                                    )
                                }
                            })()
                        )}
                    </div>
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