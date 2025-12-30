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
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: ''
    });
    const [cardErrors, setCardErrors] = useState({});

    const handleCouponCode = async (event) => {
        event.preventDefault();
        
    }

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number (only digits, add spaces every 4 digits)
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length > 16) formattedValue = formattedValue.slice(0, 16);
            formattedValue = formattedValue.replace(/(.{4})/g, '$1 ').trim();
        }
        // Format expiry date (MM/YY)
        else if (name === 'expiryDate') {
            let digitsOnly = value.replace(/\D/g, '');
            
            if (digitsOnly.length >= 2) {
                const month = parseInt(digitsOnly.slice(0, 2));
                if (month === 0 || month > 12) {
                    digitsOnly = digitsOnly.slice(0, 1);
                }
            }
            
            if (digitsOnly.length >= 2) {
                formattedValue = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4);
            } else {
                formattedValue = digitsOnly;
            }
            
            if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
        }
        // Format CVV (only numbers, max 4 digits)
        else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }
        // Card name - only letters and spaces
        else if (name === 'cardName') {
            formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
        }

        setCardInfo({ ...cardInfo, [name]: formattedValue });
        // Clear error when user starts typing
        if (cardErrors[name]) {
            setCardErrors({ ...cardErrors, [name]: '' });
        }
    };

    const validateCardInfo = () => {
        const newErrors = {};

        // Validate card number (should be 16 digits after removing spaces)
        const cardNumberDigits = cardInfo.cardNumber.replace(/\s/g, '');
        if (!cardNumberDigits || cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
            newErrors.cardNumber = 'Please enter a valid card number';
        }

        // Validate expiry date (MM/YY format)
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!cardInfo.expiryDate || !expiryRegex.test(cardInfo.expiryDate)) {
            newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        } else {
            const [month, year] = cardInfo.expiryDate.split('/');
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            
            if (monthNum < 1 || monthNum > 12) {
                newErrors.expiryDate = 'Month must be between 01-12';
            } else {
                const expiryDate = new Date(2000 + yearNum, monthNum - 1);
                const today = new Date();
                if (expiryDate < today) {
                    newErrors.expiryDate = 'Card has expired';
                }
            }
        }

        // Validate CVV (3-4 digits)
        if (!cardInfo.cvv || cardInfo.cvv.length < 3 || cardInfo.cvv.length > 4) {
            newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
        }

        // Validate cardholder name
        if (!cardInfo.cardName || cardInfo.cardName.trim().length < 2) {
            newErrors.cardName = 'Please enter the cardholder name';
        }

        setCardErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // Validate card info if payment method is CARD
        if (paymentMethod === 'CARD') {
            if (!validateCardInfo()) {
                toast.error('Please fix the errors in the card information');
                return;
            }
        }

        navigate('/orders')
    }

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-300 text-sm rounded-xl p-4 sm:p-6 lg:p-7 transition-colors duration-200'>
            <h2 className='text-lg sm:text-xl font-medium text-slate-600 dark:text-gray-200'>Payment Method</h2>
            <div className='flex gap-2 items-center mt-4'>
                <input type="radio" id="CARD" onChange={() => setPaymentMethod('CARD')} checked={paymentMethod === 'CARD'} className='accent-gray-500 dark:accent-gray-400' />
                <label htmlFor="CARD" className='cursor-pointer dark:text-gray-300'>Credit/Debit Card</label>
            </div>
            
            {/* Card Input Fields */}
            {paymentMethod === 'CARD' && (
                <div className='mt-4 space-y-3'>
                    <div>
                        <label htmlFor="cardNumber" className='block text-xs text-slate-600 dark:text-gray-400 mb-1'>Card Number</label>
                        <input
                            id="cardNumber"
                            name="cardNumber"
                            type="text"
                            inputMode="numeric"
                            placeholder="1234 5678 9012 3456"
                            value={cardInfo.cardNumber}
                            onChange={handleCardChange}
                            onKeyPress={(e) => {
                                if (!/[0-9\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            maxLength="19"
                            className={`w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 outline-none transition-colors duration-200 ${
                                cardErrors.cardNumber 
                                    ? 'border-red-500 dark:border-red-400 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400' 
                                    : 'border-slate-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
                            }`}
                        />
                        {cardErrors.cardNumber && (
                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">{cardErrors.cardNumber}</p>
                        )}
                    </div>
                    
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <label htmlFor="expiryDate" className='block text-xs text-slate-600 dark:text-gray-400 mb-1'>MM/YY</label>
                            <input
                                id="expiryDate"
                                name="expiryDate"
                                type="text"
                                placeholder="MM/YY"
                                value={cardInfo.expiryDate}
                                onChange={handleCardChange}
                                maxLength="5"
                                className={`w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 outline-none transition-colors duration-200 ${
                                    cardErrors.expiryDate 
                                        ? 'border-red-500 dark:border-red-400 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400' 
                                        : 'border-slate-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
                                }`}
                            />
                            {cardErrors.expiryDate && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{cardErrors.expiryDate}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="cvv" className='block text-xs text-slate-600 dark:text-gray-400 mb-1'>CVV</label>
                            <input
                                id="cvv"
                                name="cvv"
                                type="text"
                                inputMode="numeric"
                                placeholder="123"
                                value={cardInfo.cvv}
                                onChange={handleCardChange}
                                maxLength="4"
                                className={`w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 outline-none transition-colors duration-200 ${
                                    cardErrors.cvv 
                                        ? 'border-red-500 dark:border-red-400 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400' 
                                        : 'border-slate-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
                                }`}
                            />
                            {cardErrors.cvv && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{cardErrors.cvv}</p>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="cardName" className='block text-xs text-slate-600 dark:text-gray-400 mb-1'>Cardholder Name</label>
                        <input
                            id="cardName"
                            name="cardName"
                            type="text"
                            placeholder="John Doe"
                            value={cardInfo.cardName}
                            onChange={handleCardChange}
                            className={`w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 outline-none transition-colors duration-200 ${
                                cardErrors.cardName 
                                    ? 'border-red-500 dark:border-red-400 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400' 
                                    : 'border-slate-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
                            }`}
                        />
                        {cardErrors.cardName && (
                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">{cardErrors.cardName}</p>
                        )}
                    </div>
                </div>
            )}
            <div className='my-4 py-4 border-y border-slate-200 dark:border-gray-700 text-slate-400 dark:text-gray-400'>
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