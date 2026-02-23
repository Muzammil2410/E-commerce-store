'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OrderItem from "@/components/OrderItem";
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext';
import { fetchMyOrders } from '@/lib/features/orders/ordersSlice';
import { getAuthToken } from '@/lib/api/auth';

export default function Orders() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { formatCurrency } = useLanguageCurrency();
    const { orders = [], loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        if (!getAuthToken()) {
            navigate('/auth/login');
            return;
        }
        dispatch(fetchMyOrders());
    }, [dispatch, navigate]);

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-[70vh] mx-3 sm:mx-4 md:mx-6 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] mx-3 sm:mx-4 md:mx-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {orders.length > 0 ? (
                (
                    <div className="my-8 sm:my-12 md:my-20 max-w-7xl mx-auto">
                        <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />

                        {/* Desktop Table */}
                        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                            <div className="overflow-x-auto">
                                <table className="w-full text-slate-500 dark:text-gray-300 table-auto transition-colors duration-200 text-base">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                        <tr className="text-slate-700 dark:text-gray-200">
                                            <th className="text-left py-4 px-6 font-semibold text-base">Product</th>
                                            <th className="text-center py-4 px-6 font-semibold text-base">Total Price</th>
                                            <th className="text-left py-4 px-6 font-semibold text-base">Address</th>
                                            <th className="text-left py-4 px-6 font-semibold text-base">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {orders.map((order) => (
                                            <OrderItem order={order} key={order.id} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="md:hidden space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm dark:shadow-gray-900/50 transition-colors duration-200">
                                    <div className="space-y-4">
                                        {/* Products */}
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-200">Products</h3>
                                            {order.orderItems.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4 mb-4 last:mb-0 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg transition-colors duration-200">
                                                    <div className="w-20 h-20 bg-white dark:bg-gray-700 flex items-center justify-center rounded-lg flex-shrink-0 shadow-sm transition-colors duration-200">
                                                        <img
                                                            className="h-14 w-auto object-contain"
                                                            src={item.product.images[0]}
                                                            alt={item.product.name}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-slate-800 dark:text-gray-100 text-base truncate transition-colors duration-200">{item.product.name}</p>
                                                        <p className="text-sm text-slate-600 dark:text-gray-400 mt-1 transition-colors duration-200">{formatCurrency(item.price)} × {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total Price */}
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <span className="text-base font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">Total:</span>
                                            <span className="text-xl font-bold text-slate-800 dark:text-gray-100 transition-colors duration-200">{formatCurrency(order.total)}</span>
                                        </div>

                                        {/* Address */}
                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-200">Delivery Address</h3>
                                            <div className="space-y-1 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg transition-colors duration-200">
                                                <p className="text-base font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">{order.address.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{order.address.street}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{order.address.city}, {order.address.state} {order.address.zip}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{order.address.country}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{order.address.phone}</p>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-base font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">Status:</span>
                                                <span className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
                                                    order.status === 'confirmed' || order.status === 'CONFIRMED'
                                                        ? 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
                                                        : order.status === 'delivered' || order.status === 'DELIVERED'
                                                        ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                                                        : 'text-slate-700 dark:text-gray-400 bg-slate-100 dark:bg-gray-700'
                                                }`}>
                                                    {order.status.replace(/_/g, ' ').toLowerCase()}
                                                </span>
                                            </div>
                                            {/* Order Date */}
                                            <div className="pt-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                                    Ordered: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
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