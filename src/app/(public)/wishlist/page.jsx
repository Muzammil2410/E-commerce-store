'use client'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import Image from '@/components/Image'
import WishlistButton from '@/components/WishlistButton'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function WishlistPage() {
    const navigate = useNavigate()
    const { formatCurrency, t, translateProductName } = useLanguageCurrency()
    const wishlistItems = useSelector(state => state.wishlist.items)
    const wishlistArray = Object.values(wishlistItems)

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user')
        if (!userData) {
            navigate('/auth/login')
            return
        }
    }, [navigate])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 md:py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                        {t('wishlist')} ({wishlistArray.length})
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
                        {t('yourSavedItems') || 'Your saved items'}
                    </p>
                </div>

                {/* Wishlist Products */}
                {wishlistArray.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {wishlistArray.map((item) => (
                            <div 
                                key={item.productId} 
                                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-5 group hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300"
                            >
                                {/* Product Image Container */}
                                <div className="relative mb-4">
                                    <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-3 transition-colors duration-300">
                                        <Image
                                            src={item.product.images?.[0] || item.product.image || '/placeholder-image.jpg'}
                                            alt={translateProductName(item.product.name)}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    {/* Wishlist Heart Icon */}
                                    <div className="absolute top-2 right-2">
                                        <WishlistButton product={item.product} size={20} />
                                    </div>
                                </div>
                                
                                {/* Product Details */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[3rem] transition-colors duration-300">
                                        {translateProductName(item.product.name)}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                        {item.product.category || 'Uncategorized'}
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                                        {formatCurrency(item.product.price || item.product.salePrice || 0)}
                                    </p>
                                    
                                    {/* View Product Button */}
                                    <Link
                                        to={`/product/${item.product.id}`}
                                        className="block w-full bg-blue-600 dark:bg-blue-500 text-white text-center py-2.5 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium mt-3"
                                    >
                                        {t('viewProduct') || 'View Product'}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-8 sm:p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                                <Heart className="w-10 h-10 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                {t('yourWishlistEmpty') || 'Your wishlist is empty'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
                                {t('saveItemsForLater') || 'Save items you love for later'}
                            </p>
                            <Link
                                to="/shop"
                                className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
                            >
                                {t('startShopping') || 'Start Shopping'}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

