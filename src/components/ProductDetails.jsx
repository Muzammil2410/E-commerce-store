'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Image from "@/components/Image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [mainImage, setMainImage] = useState(product.images[0]);

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

    const averageRating = product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length;
    
    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:gap-3">
                <div className="flex flex-row sm:flex-col gap-3 order-2 sm:order-1">
                    {product.images.map((image, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setMainImage(product.images[index])}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setMainImage(product.images[index]);
                                }
                            }}
                            aria-label={`View product image ${index + 1} of ${product.images.length}: ${product.name}`}
                            className="bg-slate-100 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-lg group cursor-pointer flex-shrink-0 hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                        >
                            <Image 
                                src={image} 
                                className="group-hover:scale-103 group-active:scale-95 transition w-10 h-10 sm:w-12 sm:h-12 object-contain" 
                                alt={`Product thumbnail ${index + 1}`} 
                                width={48} 
                                height={48} 
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                        </button>
                    ))}
                </div>
                <div className="flex justify-center items-center w-full h-64 sm:h-80 lg:h-96 bg-slate-100 rounded-lg order-1 sm:order-2" role="img" aria-label={`Main product image: ${product.name}`}>
                    <Image 
                        src={mainImage} 
                        alt={product.name} 
                        width={300} 
                        height={300} 
                        className="w-auto h-auto max-w-full max-h-full object-contain" 
                        loading="eager"
                        priority
                    />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#FCD34D" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{product.rating.length} Reviews</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{product.price} </p>
                    <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5 mt-8 sm:mt-10">
                    {
                        cart[productId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                                <Counter productId={productId} />
                            </div>
                        )
                    }

                    {/* Add to Cart / View Cart Button */}
                    <button 
                        onClick={() => !cart[productId] ? addToCartHandler() : navigate('/cart')} 
                        aria-label={!cart[productId] ? `Add ${product.name} to cart` : 'View cart'}
                        className="bg-slate-800 text-white px-8 sm:px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
                    >
                        {!cart[productId] ? 'Add to Cart' : 'View Cart'}
                    </button>

                    {/* Buy It Now Button */}
                    <button
                        onClick={buyItNowHandler}
                        aria-label={`Buy ${product.name} now`}
                        className="bg-yellow-500 text-slate-900 px-8 sm:px-10 py-3 text-sm font-medium rounded hover:bg-yellow-400 active:scale-95 transition w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                        Buy It Now
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
                </div>

            </div>
        </div>
    )
}

export default ProductDetails
