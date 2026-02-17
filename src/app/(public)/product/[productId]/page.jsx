'use client'
import React, { useEffect, useContext } from "react";
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LanguageCurrencyContext } from "@/contexts/LanguageCurrencyContext";
import { fetchProductById } from "@/lib/features/product/productSlice";

export default function Product() {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { currentProduct: product, loading, error } = useSelector(state => state.product);
    const context = useContext(LanguageCurrencyContext);
    const t = context?.t || ((key) => key);

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductById(productId));
        }
        scrollTo(0, 0);
    }, [productId, dispatch]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">{t('loading') || 'Loading product...'}</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        const errorMessage = typeof error === 'string' 
            ? error 
            : error?.message || 'Failed to load product';
        const isNotFound = error?.status === 404 || errorMessage.toLowerCase().includes('not found');
        
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <p className={`mb-4 ${isNotFound ? 'text-gray-600 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}`}>
                        {isNotFound ? (t('productNotFound') || 'Product not found') : errorMessage}
                    </p>
                    {!isNotFound && (
                        <button
                            onClick={() => dispatch(fetchProductById(productId))}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t('retry') || 'Retry'}
                        </button>
                    )}
                    <div className="mt-4">
                        <a 
                            href="/shop" 
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {t('backToShop') || '← Back to Shop'}
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Product not found
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{t('productNotFound') || 'Product not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-3 sm:mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumbs */}
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-4 sm:mt-5 mb-3 sm:mb-4 transition-colors duration-200">
                    {t('home')} / {t('products')} / {product?.category}
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}