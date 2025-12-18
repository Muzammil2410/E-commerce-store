'use client'
import React, { useEffect, useState } from "react";
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "@/components/Image";
import { useDispatch, useSelector } from "react-redux";
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext';
import { Link } from "react-router-dom";

export default function Cart() {

    const { formatCurrency } = useLanguageCurrency();
    
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                cartArray.push({
                    ...product,
                    quantity: value,
                });
                setTotalPrice(prev => prev + product.price * value);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-3 sm:mx-4 md:mx-6 text-slate-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 transition-colors duration-200">

            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />

                <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-5">

                    <div className="w-full lg:max-w-4xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-sm dark:shadow-gray-900/50 p-3 sm:p-4 overflow-x-auto transition-colors duration-200">
                        {/* Desktop Table */}
                        <table className="hidden md:table w-full text-slate-600 dark:text-gray-300 table-auto transition-colors duration-200">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-gray-700">
                                    <th className="text-left py-2 px-2 sm:px-4 font-semibold text-slate-700 dark:text-gray-200 text-sm">Product</th>
                                    <th className="py-2 px-2 sm:px-4 font-semibold text-slate-700 dark:text-gray-200 text-sm">Quantity</th>
                                    <th className="py-2 px-2 sm:px-4 font-semibold text-slate-700 dark:text-gray-200 text-sm">Total Price</th>
                                    <th className="py-2 px-2 sm:px-4 font-semibold text-slate-700 dark:text-gray-200 text-sm">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cartArray.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-100 dark:border-gray-700">
                                            <td className="flex gap-3 my-4 px-2 sm:px-4">
                                                <div className="flex gap-3 items-center justify-center bg-slate-100 dark:bg-gray-700 size-16 sm:size-18 rounded-md flex-shrink-0 transition-colors duration-200">
                                                    <Image src={item.images[0]} className="h-12 sm:h-14 w-auto" alt="" width={45} height={45} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-gray-100 truncate">{item.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-gray-400">{item.category}</p>
                                                    <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300">{formatCurrency(item.price)}</p>
                                                </div>
                                            </td>
                                            <td className="text-center px-2 sm:px-4">
                                                <Counter productId={item.id} />
                                            </td>
                                            <td className="text-center px-2 sm:px-4 text-sm sm:text-base dark:text-gray-200">{formatCurrency(item.price * item.quantity)}</td>
                                            <td className="text-center px-2 sm:px-4">
                                                <button onClick={() => handleDeleteItemFromCart(item.id)} className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2.5 rounded-full active:scale-95 transition-all">
                                                    <Trash2Icon size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                        {/* Mobile Card Layout */}
                        <div className="md:hidden space-y-4">
                            {
                                cartArray.map((item, index) => (
                                    <div key={index} className="border border-slate-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 transition-colors duration-200">
                                        <div className="flex gap-3 mb-3">
                                            <div className="flex items-center justify-center bg-slate-100 dark:bg-gray-700 size-16 rounded-md flex-shrink-0 transition-colors duration-200">
                                                <Image src={item.images[0]} className="h-12 w-auto" alt="" width={45} height={45} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800 dark:text-gray-100 truncate">{item.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-gray-400">{item.category}</p>
                                                <p className="text-sm text-slate-700 dark:text-gray-300 mt-1">{formatCurrency(item.price)}</p>
                                            </div>
                                            <button onClick={() => handleDeleteItemFromCart(item.id)} className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-full active:scale-95 transition-all flex-shrink-0">
                                                <Trash2Icon size={18} />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-gray-700">
                                            <span className="text-xs text-slate-600 dark:text-gray-400">Quantity:</span>
                                            <Counter productId={item.id} />
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Total:</span>
                                            <span className="text-sm font-semibold text-slate-800 dark:text-gray-100">{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="w-full lg:w-auto lg:min-w-[320px]">
                        <OrderSummary totalPrice={totalPrice} items={cartArray} />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-3 sm:mx-6 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="max-w-md w-full text-center px-4 py-8">
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-blue-50 dark:bg-blue-900/20 rounded-full p-6">
                            <ShoppingBag className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-gray-100 mb-4 transition-colors duration-200">
                    Your cart is waiting to be filled!
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 mb-2 transition-colors duration-200">
                    Discover amazing products and exclusive deals
                </p>
                
                <p className="text-base text-slate-500 dark:text-gray-400 mb-8 transition-colors duration-200">
                    Start shopping now and find something special just for you
                </p>
                
                <Link 
                    to="/shop"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2"
                >
                    <span>Start Shopping</span>
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    )
}