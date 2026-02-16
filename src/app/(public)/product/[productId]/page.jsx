'use client'
import React, { useEffect, useState, useContext } from "react";
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { LanguageCurrencyContext } from "@/contexts/LanguageCurrencyContext";

export default function Product() {
    const { productId } = useParams();
    const [product, setProduct] = useState();
    const products = useSelector(state => state.product.list);
    const context = useContext(LanguageCurrencyContext);
    const t = context?.t || ((key) => key);

    const fetchProduct = async () => {
        const product = products.find((p) => (p.id || p._id) === productId);
        setProduct(product);
    }

    useEffect(() => {
        if (products.length > 0) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId,products]);

    return (
        <div className="mx-3 sm:mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums */}
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