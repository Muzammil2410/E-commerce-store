'use client'
import Image from "@/components/Image";
import { DotIcon, MessageCircle, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import ChatModal from "./ChatModal";
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext';

const OrderItem = ({ order }) => {

    const { formatCurrency, translateProductName } = useLanguageCurrency();
    const [ratingModal, setRatingModal] = useState(null);
    const [chatModal, setChatModal] = useState(null);

    const { ratings } = useSelector(state => state.rating);

    // Check if order is delayed (more than expected delivery date)
    const isOrderDelayed = () => {
        if (!order.expectedDeliveryDate) return false;
        const expectedDate = new Date(order.expectedDeliveryDate);
        const today = new Date();
        return today > expectedDate && order.status !== 'DELIVERED' && order.status !== 'CANCELLED';
    };

    // Get seller info from order
    const getSellerInfo = () => {
        // Try to get seller info from order items or order
        const seller = order.store || order.seller || {};
        return {
            id: seller.id || order.storeId || 'seller_unknown',
            name: seller.name || 'Seller',
            email: seller.email || ''
        };
    };

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 dark:bg-gray-700 flex items-center justify-center rounded-md transition-colors duration-200">
                                    <Image
                                        className="h-14 w-auto"
                                        src={item.product.images[0]}
                                        alt="product_img"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 dark:text-gray-200 text-base transition-colors duration-200">{translateProductName(item.product.name)}</p>
                                    <p className="dark:text-gray-300 transition-colors duration-200">{formatCurrency(item.price)} Qty : {item.quantity} </p>
                                    <p className="mb-1 dark:text-gray-400 transition-colors duration-200">{new Date(order.createdAt).toDateString()}</p>
                                    <div>
                                        {ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId)
                                            ? <Rating value={ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId).rating} />
                                            : <button onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })} className={`text-green-500 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition ${order.status !== "DELIVERED" && 'hidden'}`}>Rate Product</button>
                                        }</div>
                                    {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center max-md:hidden dark:text-gray-200 transition-colors duration-200">{formatCurrency(order.total)}</td>

                <td className="text-left max-md:hidden dark:text-gray-300 transition-colors duration-200">
                    <p>{order.address.name}, {order.address.street},</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div className="flex flex-col gap-2">
                        <div
                            className={`flex items-center justify-center gap-1 rounded-full p-1 transition-colors duration-200 ${order.status === 'confirmed'
                                ? 'text-yellow-500 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
                                : order.status === 'delivered'
                                    ? 'text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                                    : 'text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-700'
                                }`}
                        >
                            <DotIcon size={10} className="scale-250" />
                            {order.status.split('_').join(' ').toLowerCase()}
                        </div>
                        
                        {/* Chat Button for Delayed Orders */}
                        {isOrderDelayed() && (
                            <button
                                onClick={() => {
                                    const seller = getSellerInfo();
                                    setChatModal({
                                        orderId: order.id,
                                        sellerId: seller.id,
                                        sellerName: seller.name,
                                        sellerEmail: seller.email,
                                        otherPartyName: seller.name,
                                        senderName: 'Buyer'
                                    });
                                }}
                                className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Chat with seller about delayed order"
                            >
                                <MessageCircle size={14} />
                                <span>Chat with Seller</span>
                            </button>
                        )}

                        {/* Delay Warning */}
                        {isOrderDelayed() && (
                            <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded transition-colors duration-200">
                                <AlertCircle size={12} />
                                <span>Delayed</span>
                            </div>
                        )}
                    </div>
                </td>
            </tr>
            {/* Mobile */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p className="dark:text-gray-300 transition-colors duration-200">{order.address.name}, {order.address.street}</p>
                    <p className="dark:text-gray-300 transition-colors duration-200">{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                    <p className="dark:text-gray-300 transition-colors duration-200">{order.address.phone}</p>
                    <br />
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center">
                            <span className='text-center px-6 py-1.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 transition-colors duration-200' >
                                {order.status.replace(/_/g, ' ').toLowerCase()}
                            </span>
                        </div>
                        
                        {/* Chat Button for Delayed Orders - Mobile */}
                        {isOrderDelayed() && (
                            <>
                                <button
                                    onClick={() => {
                                        const seller = getSellerInfo();
                                        setChatModal({
                                            orderId: order.id,
                                            sellerId: seller.id,
                                            sellerName: seller.name,
                                            sellerEmail: seller.email,
                                            otherPartyName: seller.name,
                                            senderName: 'Buyer'
                                        });
                                    }}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-label="Chat with seller about delayed order"
                                >
                                    <MessageCircle size={16} />
                                    <span>Chat with Seller</span>
                                </button>
                                <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded transition-colors duration-200">
                                    <AlertCircle size={14} />
                                    <span>Order is delayed</span>
                                </div>
                            </>
                        )}
                    </div>
                </td>
            </tr>
            {/* Chat Modal */}
            {chatModal && (
                <ChatModal 
                    chatModal={chatModal} 
                    setChatModal={setChatModal}
                    userType="buyer"
                />
            )}
        </>
    )
}

export default OrderItem