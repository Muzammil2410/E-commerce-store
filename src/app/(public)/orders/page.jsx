'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { orderDummyData } from "@/assets/assets";
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext';

export default function Orders() {
    const { formatCurrency } = useLanguageCurrency();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setOrders(orderDummyData)
    }, []);

    return (
        <div className="min-h-[70vh] mx-3 sm:mx-4 md:mx-6 dark:bg-gray-900 transition-colors duration-200">
            {orders.length > 0 ? (
                (
                    <div className="my-8 sm:my-12 md:my-20 max-w-7xl mx-auto">
                        <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />

                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <table className="w-full max-w-5xl text-slate-500 dark:text-gray-300 table-auto border-separate border-spacing-y-6 border-spacing-x-4 transition-colors duration-200">
                                <thead>
                                    <tr className="text-slate-600 dark:text-gray-300">
                                        <th className="text-left">Product</th>
                                        <th className="text-center">Total Price</th>
                                        <th className="text-left">Address</th>
                                        <th className="text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <OrderItem order={order} key={order.id} />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="md:hidden space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm dark:shadow-gray-900/50 transition-colors duration-200">
                                    <div className="space-y-4">
                                        {/* Products */}
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-200">Products</h3>
                                            {order.orderItems.map((item, index) => (
                                                <div key={index} className="flex items-center gap-3 mb-4 last:mb-0">
                                                    <div className="w-16 h-16 bg-slate-100 dark:bg-gray-700 flex items-center justify-center rounded-md flex-shrink-0 transition-colors duration-200">
                                                        <img
                                                            className="h-12 w-auto object-contain"
                                                            src={item.product.images[0]}
                                                            alt={item.product.name}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-800 dark:text-gray-100 text-sm truncate transition-colors duration-200">{item.product.name}</p>
                                                        <p className="text-xs text-slate-600 dark:text-gray-400 transition-colors duration-200">{formatCurrency(item.price)} × {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total Price */}
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Total:</span>
                                            <span className="text-lg font-semibold text-slate-800 dark:text-gray-100 transition-colors duration-200">{formatCurrency(order.total)}</span>
                                        </div>

                                        {/* Address */}
                                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Delivery Address</h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">{order.address.name}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">{order.address.street}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">{order.address.city}, {order.address.state} {order.address.zip}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">{order.address.country}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">{order.address.phone}</p>
                                        </div>

                                        {/* Status */}
                                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Status:</span>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                                                    order.status === 'confirmed' || order.status === 'CONFIRMED'
                                                        ? 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
                                                        : order.status === 'delivered' || order.status === 'DELIVERED'
                                                        ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                                                        : 'text-slate-700 dark:text-gray-400 bg-slate-100 dark:bg-gray-700'
                                                }`}>
                                                    {order.status.replace(/_/g, ' ').toLowerCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Order Date */}
                                        <div className="pt-2">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                                Ordered: {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ) : (
                <div className="min-h-[80vh] mx-3 sm:mx-6 flex items-center justify-center text-slate-400 dark:text-gray-500 transition-colors duration-200">
                    <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold px-4 text-center">You have no orders</h1>
                </div>
            )}
        </div>
    )
}