'use client'

import React, { useState, useEffect, useRef } from "react";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Image from "@/components/Image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext';

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const { formatCurrency, t, translateProductName } = useLanguageCurrency();

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState(null)
    const [mainImage, setMainImage] = useState(product.images?.[0]);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const imageRef = useRef(null);
    const zoomRef = useRef(null);

    useEffect(() => {
        if (product?.images?.length) {
            setMainImage(product.images[0])
        }
    }, [product])

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user')
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    const addToCartHandler = () => {
        // Check if user is logged in
        if (!user) {
            toast.error('Please login first to add items to cart!')
            navigate('/auth/login')
            return
        }
        
        dispatch(addToCart({ productId }))
        toast.success('Added to cart!')
    }

    const buyItNowHandler = () => {
        // Directly navigate to checkout page with this product
        navigate('/checkout', { state: { buyNowProduct: { ...product, quantity: 1 } } });
    }

    const handleImageClick = () => {
        setShowZoom(true);
        setZoomPosition({ x: 50, y: 50 });
    }

    const handleMouseMove = (e) => {
        if (!imageRef.current || !showZoom) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setZoomPosition({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y))
        });
    }

    const handleCloseZoom = () => setShowZoom(false);

    const averageRating = product.rating?.length
        ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length
        : 0;

    return (
        <div className="flex flex-col gap-4 lg:gap-5">
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-3">
                {/* Left Side - Images */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:gap-2 lg:w-1/2">
                    <div className="flex flex-row sm:flex-col gap-2 order-2 sm:order-1">
                        {(product.images || []).map((image, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => {
                                    setMainImage(product.images[index]);
                                    setShowZoom(true);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setMainImage(product.images[index]);
                                        setShowZoom(true);
                                    }
                                }}
                                aria-label={`View product image ${index + 1} of ${product.images.length}: ${translateProductName(product.name)}`}
                                className="bg-slate-100 dark:bg-gray-700 flex items-center justify-center w-14 h-14 sm:w-18 sm:h-18 rounded-lg group cursor-pointer flex-shrink-0 hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                            >
                                <Image 
                                    src={image} 
                                    className="group-hover:scale-103 group-active:scale-95 transition w-9 h-9 sm:w-11 sm:h-11 object-contain" 
                                    alt={`Product thumbnail ${index + 1}`} 
                                    width={48} 
                                    height={48} 
                                    loading={index === 0 ? "eager" : "lazy"}
                                />
                            </button>
                        ))}
                    </div>
                    <div 
                        ref={imageRef}
                        onClick={handleImageClick}
                        onMouseMove={handleMouseMove}
                        className="flex justify-center items-center w-full h-56 sm:h-72 lg:h-80 bg-slate-100 dark:bg-gray-700 rounded-lg order-1 sm:order-2 cursor-zoom-in overflow-hidden transition-colors duration-200" 
                        role="img" 
                        aria-label={`Main product image: ${translateProductName(product.name)}`}
                    >
                        <Image 
                            src={mainImage} 
                            alt={product.name} 
                            width={300} 
                            height={300} 
                            className="w-full h-full object-contain" 
                            loading="eager"
                            priority
                        />
                    </div>
                </div>

                {/* Right Side - Zoom View */}
                <div className="hidden lg:flex lg:w-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg h-56 sm:h-72 lg:h-80 overflow-hidden transition-colors duration-200">
                    {showZoom ? (
                        <div 
                            ref={zoomRef}
                            className="relative w-full h-full"
                        >
                            <div 
                                className="absolute inset-0 bg-cover bg-no-repeat transition-all duration-200"
                                style={{
                                    backgroundImage: `url(${mainImage})`,
                                    backgroundSize: '400%',
                                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center transition-colors duration-200">Click the product image to zoom here</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 mt-4 lg:mt-0">
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-gray-100 transition-colors duration-200">{translateProductName(product.name)}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#FCD34D" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500 dark:text-gray-400 transition-colors duration-200">{t('reviewsCount').replace('{count}', product.rating?.length ?? 0)}</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800 dark:text-gray-100 transition-colors duration-200">
                    <button
                        type="button"
                        onClick={() => navigate('/bargain', { state: { from: location.pathname } })}
                        className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                        style={{ backgroundColor: '#3977ED' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                        aria-label="Bargain"
                    >
                        💬 Bargain
                    </button>
                    <p> {formatCurrency(product.price)} </p>
                    <p className="text-xl text-slate-500 dark:text-gray-400 line-through transition-colors duration-200">{formatCurrency(product.mrp)}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 transition-colors duration-200">
                    <TagIcon size={14} className="dark:text-gray-400" />
                    <p>{t('savePercentage').replace('{percentage}', ((product.mrp - product.price) / product.mrp * 100).toFixed(0))}</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5 mt-8 sm:mt-10">
                    {
                        cart[productId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 dark:text-gray-100 font-semibold transition-colors duration-200">{t('quantity')}</p>
                                <Counter productId={productId} />
                            </div>
                        )
                    }

                    {/* Add to Cart / View Cart Button */}
                    <button 
                        onClick={() => !cart[productId] ? addToCartHandler() : navigate('/cart')} 
                        aria-label={!cart[productId] ? `Add ${translateProductName(product.name)} to cart` : 'View cart'}
                        className="text-white px-8 sm:px-10 py-3 text-sm font-medium rounded active:scale-95 transition w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ backgroundColor: '#3977ED' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                    >
                        {!cart[productId] ? t('addToCart') : t('viewCart')}
                    </button>

                    {/* Buy It Now Button */}
                    <button
                        onClick={buyItNowHandler}
                        aria-label={`Buy ${translateProductName(product.name)} now`}
                        className="text-white px-8 sm:px-10 py-3 text-sm font-medium rounded active:scale-95 transition w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ backgroundColor: '#3977ED' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                    >
                        {t('buyItNow')}
                    </button>
                </div>
                <hr className="border-gray-300 dark:border-gray-700 my-5 transition-colors duration-200" />
                <div className="flex flex-col gap-4 text-slate-500 dark:text-gray-400 transition-colors duration-200">
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400 dark:text-gray-500" /> {t('securedPayment')} </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400 dark:text-gray-500" /> {t('trustedByTopBrands')} </p>
                </div>

            </div>
        </div>
    )
}

export default ProductDetails
