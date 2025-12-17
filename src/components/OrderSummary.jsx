import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react'
import AddressModal from './AddressModal';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext';

const OrderSummary = ({ totalPrice, items }) => {

    const { formatCurrency } = useLanguageCurrency();

    const navigate = useNavigate();

    const addressList = useSelector(state => state.address.list);

    // const [paymentMethod, setPaymentMethod] = useState('COD');
    const [paymentMethod, setPaymentMethod] = useState('CARD');

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');

    const handleCouponCode = async (event) => {
        event.preventDefault();
        
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        navigate('/orders')
    }

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-300 text-sm rounded-xl p-4 sm:p-6 lg:p-7 transition-colors duration-200'>
            <h2 className='text-lg sm:text-xl font-medium text-slate-600 dark:text-gray-200'>Payment Summary</h2>
            <p className='text-slate-400 dark:text-gray-400 text-xs my-4'>Payment Method</p>
            <div className='flex gap-2 items-center'>
                <input type="radio" id="CARD" onChange={() => setPaymentMethod('CARD')} checked={paymentMethod === 'CARD'} className='accent-gray-500 dark:accent-gray-400' />
<label htmlFor="CARD" className='cursor-pointer dark:text-gray-300'>Credit/Debit Card</label>

            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-gray-500 dark:accent-gray-400' />
                <label htmlFor="STRIPE" className='cursor-pointer dark:text-gray-300'>Stripe Payment</label>
            </div>
            <div className='my-4 py-4 border-y border-slate-200 dark:border-gray-700 text-slate-400 dark:text-gray-400'>
                <p>Address</p>
                {
                    selectedAddress ? (
                        <div className='flex gap-2 items-center'>
                            <p className='dark:text-gray-300'>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                            <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer dark:text-gray-400 dark:hover:text-gray-300' size={18} />
                        </div>
                    ) : (
                        <div>
                            <button className='flex items-center gap-1 text-slate-600 dark:text-gray-300 dark:hover:text-gray-100 mt-1 transition-colors duration-200' onClick={() => setShowAddressModal(true)} >Add Address <PlusIcon size={18} /></button>
                        </div>
                    )
                }
            </div>
            <div className='pb-4 border-b border-slate-200 dark:border-gray-700'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-400 dark:text-gray-400'>
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {coupon && <p>Coupon:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right dark:text-gray-200'>
                        <p>{formatCurrency(totalPrice)}</p>
                        <p>Free</p>
                        {coupon && <p>{`-${formatCurrency(coupon.discount / 100 * totalPrice)}`}</p>}
                    </div>
                </div>
                {
                    !coupon ? (
                        <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })} className='flex justify-center gap-3 mt-3'>
                            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon Code' className='border border-slate-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 p-1.5 rounded w-full outline-none transition-colors duration-200' />
                            <button className='bg-slate-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>Apply</button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-center gap-2 text-xs mt-2 dark:text-gray-300'>
                            <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                            <p>{coupon.description}</p>
                            <XIcon size={18} onClick={() => setCoupon('')} className='hover:text-red-700 dark:hover:text-red-400 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between py-4 dark:text-gray-200'>
                <p>Total:</p>
                <p className='font-medium text-right'>{formatCurrency(coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)) : totalPrice)}</p>
            </div>
            <button onClick={e => toast.promise(handlePlaceOrder(e), { loading: 'placing Order...' })} className='w-full bg-slate-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'>Place Order</button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}

        </div>
    )
}

export default OrderSummary