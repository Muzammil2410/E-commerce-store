'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CreditCard, MapPin, User, Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react'
import Image from '@/components/Image'
import toast from 'react-hot-toast'
import { clearCart } from '@/lib/features/cart/cartSlice'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'
import { useTheme } from '@/contexts/ThemeContext'

export default function CheckoutPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.cart)
    const products = useSelector(state => state.product.list)
    const { formatCurrency } = useLanguageCurrency()
    const { isDarkMode } = useTheme()
    const phoneInputRef = useRef(null)

    const [loading, setLoading] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)
    const [cartArray, setCartArray] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [shippingInfo, setShippingInfo] = useState({
        firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', country: 'USA'
    })
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '', expiryDate: '', cvv: '', cardName: ''
    })
    const [deliveryOption, setDeliveryOption] = useState('')
    const [errors, setErrors] = useState({})

    const taxRate = 0.1 // 10% tax
    const platformDeliveryFee = 10 // Platform delivery fee

    // Check if Buy It Now product exists
    const buyNowProduct = location.state?.buyNowProduct || null

    useEffect(() => {
        if (buyNowProduct) {
            setCartArray([buyNowProduct])
            setTotalPrice(buyNowProduct.price * buyNowProduct.quantity)
        } else if (Object.keys(cartItems).length === 0) {
            navigate('/cart')
        } else {
            let total = 0
            const cartArrayTemp = []
            for (const [key, value] of Object.entries(cartItems)) {
                const product = products.find(product => product.id === key)
                if (product) {
                    cartArrayTemp.push({ ...product, quantity: value })
                    total += product.price * value
                }
            }
            setCartArray(cartArrayTemp)
            setTotalPrice(total)
        }
    }, [cartItems, products, buyNowProduct])

    const taxAmount = totalPrice * taxRate
    const deliveryFee = deliveryOption === 'platform-delivery' ? platformDeliveryFee : 0
    const finalTotal = totalPrice + taxAmount + deliveryFee

    // Apply dark mode styles to phone input dropdown
    useEffect(() => {
        if (!isDarkMode) return

        const applyDarkModeStyles = () => {
            // Find all PhoneInputCountrySelect elements
            const selects = document.querySelectorAll('.PhoneInputCountrySelect, select.PhoneInputCountrySelect')
            selects.forEach(select => {
                // Apply color-scheme for native dropdown
                select.style.colorScheme = 'dark'
                select.style.backgroundColor = '#374151'
                select.style.color = 'white'
                select.style.borderColor = '#4b5563'
                
                // Style options
                const options = select.querySelectorAll('option')
                options.forEach(option => {
                    option.style.backgroundColor = '#374151'
                    option.style.color = 'white'
                })
            })
        }

        // Apply immediately
        applyDarkModeStyles()

        // Watch for new select elements (if component re-renders)
        const observer = new MutationObserver(applyDarkModeStyles)
        observer.observe(document.body, { childList: true, subtree: true })

        // Also apply on focus/click events
        const handleSelectInteraction = (e) => {
            if (e.target.classList.contains('PhoneInputCountrySelect') || 
                e.target.closest('.PhoneInputCountrySelect')) {
                setTimeout(applyDarkModeStyles, 0)
            }
        }

        document.addEventListener('focus', handleSelectInteraction, true)
        document.addEventListener('click', handleSelectInteraction, true)
        document.addEventListener('mousedown', handleSelectInteraction, true)

        return () => {
            observer.disconnect()
            document.removeEventListener('focus', handleSelectInteraction, true)
            document.removeEventListener('click', handleSelectInteraction, true)
            document.removeEventListener('mousedown', handleSelectInteraction, true)
        }
    }, [isDarkMode])

    const handleShippingChange = (e) => {
        const { name, value } = e.target
        setShippingInfo({ ...shippingInfo, [name]: value })
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' })
        }
    }

    const handleCardChange = (e) => {
        const { name, value } = e.target
        let formattedValue = value

        // Format card number (only digits, add spaces every 4 digits)
        if (name === 'cardNumber') {
            // Remove all non-digit characters first
            formattedValue = value.replace(/\D/g, '')
            // Limit to 16 digits
            if (formattedValue.length > 16) formattedValue = formattedValue.slice(0, 16)
            // Add spaces every 4 digits
            formattedValue = formattedValue.replace(/(.{4})/g, '$1 ').trim()
        }
        // Format expiry date (MM/YY)
        else if (name === 'expiryDate') {
            // Remove all non-digit characters
            let digitsOnly = value.replace(/\D/g, '')
            
            // Validate month as user types
            if (digitsOnly.length >= 2) {
                const month = parseInt(digitsOnly.slice(0, 2))
                // If month is 00 or > 12, reject the second digit
                if (month === 0 || month > 12) {
                    // Keep only the first digit
                    digitsOnly = digitsOnly.slice(0, 1)
                }
            }
            
            // Format with slash after month
            if (digitsOnly.length >= 2) {
                formattedValue = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4)
            } else {
                formattedValue = digitsOnly
            }
            
            // Limit total length to 5 (MM/YY)
            if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5)
        }
        // Format CVV (only numbers, max 4 digits)
        else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4)
        }
        // Card name - only letters and spaces
        else if (name === 'cardName') {
            formattedValue = value.replace(/[^a-zA-Z\s]/g, '')
        }

        setCardInfo({ ...cardInfo, [name]: formattedValue })
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' })
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!shippingInfo.email || !emailRegex.test(shippingInfo.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        // Validate phone number
        if (!shippingInfo.phone || shippingInfo.phone.length < 10) {
            newErrors.phone = 'Please enter a valid phone number'
        }

        // Validate card number (should be 16 digits after removing spaces)
        const cardNumberDigits = cardInfo.cardNumber.replace(/\s/g, '')
        if (!cardNumberDigits || cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
            newErrors.cardNumber = 'Please enter a valid card number'
        }

        // Validate expiry date (MM/YY format)
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
        if (!cardInfo.expiryDate || !expiryRegex.test(cardInfo.expiryDate)) {
            newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY). Month must be 01-12'
        } else {
            // Check if card is expired
            const [month, year] = cardInfo.expiryDate.split('/')
            const monthNum = parseInt(month)
            const yearNum = parseInt(year)
            
            // Double-check month is valid (should already be validated by regex, but extra safety)
            if (monthNum < 1 || monthNum > 12) {
                newErrors.expiryDate = 'Month must be between 01-12'
            } else {
                const expiryDate = new Date(2000 + yearNum, monthNum - 1)
                const today = new Date()
                if (expiryDate < today) {
                    newErrors.expiryDate = 'Card has expired'
                }
            }
        }

        // Validate CVV (3-4 digits)
        if (!cardInfo.cvv || cardInfo.cvv.length < 3 || cardInfo.cvv.length > 4) {
            newErrors.cvv = 'Please enter a valid CVV (3-4 digits)'
        }

        // Validate cardholder name
        if (!cardInfo.cardName || cardInfo.cardName.trim().length < 2) {
            newErrors.cardName = 'Please enter the cardholder name'
        }

        // Validate delivery option
        if (!deliveryOption) {
            newErrors.deliveryOption = 'Please select a delivery option'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form')
            return
        }

        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success('Order placed successfully!')
        if (!buyNowProduct) dispatch(clearCart())
        setOrderPlaced(true)
        setLoading(false)
    }

    if (orderPlaced) {
        const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
        return (
            <div className="min-h-screen bg-green-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200" role="status" aria-live="polite" aria-atomic="true">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 text-center transition-colors duration-200">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-200" aria-hidden="true">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4 dark:text-gray-100 transition-colors duration-200">Order Placed Successfully!</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-200">Thank you for your purchase. Your order has been confirmed.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 transition-colors duration-200">
                        Order ID: <span aria-label={`Order ID ${orderId}`}>{orderId}</span>
                    </p>
                    <div className="space-y-3">
                        <Link 
                            to="/orders" 
                            className="block w-full bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:ring-offset-2"
                            aria-label="View your orders"
                        >
                            View Orders
                        </Link>
                        <Link 
                            to="/" 
                            className="block w-full bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-600 focus:ring-offset-2"
                            aria-label="Continue shopping"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (cartArray.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 transition-colors duration-200">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-4 dark:text-gray-100 transition-colors duration-200">Your cart is empty</h1>
                    <Link 
                        to="/shop" 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1 transition-colors duration-200"
                        aria-label="Continue shopping"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    const isBuyNow = !!buyNowProduct

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-3 sm:py-4 md:py-6 lg:py-8 transition-colors duration-200">
            <div className="max-w-5xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
                <Link to={isBuyNow ? "/" : "/cart"} className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 sm:mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-2 rounded text-sm sm:text-base transition-colors duration-200">
                    <ArrowLeft size={18} className="sm:w-5 sm:h-5" aria-hidden="true" /> 
                    <span>{isBuyNow ? "Back to Home" : "Back to Cart"}</span>
                </Link>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 dark:text-gray-100 transition-colors duration-200">Checkout</h1>

                <div className={`grid ${isBuyNow ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-3 sm:gap-4 md:gap-6 lg:gap-8`}>
                    {/* Checkout Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-3 sm:p-4 md:p-6 transition-colors duration-200">
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 md:mb-6 dark:text-gray-100 transition-colors duration-200">Shipping & Payment</h2>
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6" aria-label="Checkout form">
                            {/* Shipping Fields */}
                            <fieldset>
                                <legend className="sr-only">Shipping Information</legend>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="sr-only">First Name</label>
                                        <input 
                                            id="firstName"
                                            name="firstName" 
                                            placeholder="First Name" 
                                            value={shippingInfo.firstName} 
                                            onChange={handleShippingChange} 
                                            required 
                                            aria-required="true"
                                            className="p-2.5 sm:p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base" 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="sr-only">Last Name</label>
                                        <input 
                                            id="lastName"
                                            name="lastName" 
                                            placeholder="Last Name" 
                                            value={shippingInfo.lastName} 
                                            onChange={handleShippingChange} 
                                            required 
                                            aria-required="true"
                                            className="p-2.5 sm:p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base" 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                                    <div>
                                        <label htmlFor="email" className="sr-only">Email</label>
                                        <input 
                                            id="email"
                                            type="email" 
                                            name="email" 
                                            placeholder="Email" 
                                            value={shippingInfo.email} 
                                            onChange={handleShippingChange} 
                                            required 
                                            aria-required="true"
                                            autoComplete="email"
                                            className={`p-3 border ${errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400`}
                                            aria-invalid={errors.email ? 'true' : 'false'}
                                            aria-describedby={errors.email ? 'email-error' : undefined}
                                        />
                                        {errors.email && (
                                            <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="sr-only">Phone Number</label>
                                        <div className={`phone-input border ${errors.phone ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} rounded`} ref={phoneInputRef}>
                                            <PhoneInput 
                                                id="phone"
                                                defaultCountry="PK" 
                                                value={shippingInfo.phone} 
                                                onChange={val => {
                                                    setShippingInfo({ ...shippingInfo, phone: val })
                                                    if (errors.phone) {
                                                        setErrors({ ...errors, phone: '' })
                                                    }
                                                }} 
                                                className="p-2.5 sm:p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base" 
                                                aria-label="Phone number"
                                                aria-invalid={errors.phone ? 'true' : 'false'}
                                                aria-describedby={errors.phone ? 'phone-error' : undefined}
                                                style={{
                                                    '--PhoneInput-color--focus': isDarkMode ? '#60a5fa' : '#3b82f6',
                                                    '--PhoneInputCountrySelect-marginRight': '0.5rem',
                                                }}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p id="phone-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-4">
                                    <label htmlFor="address" className="sr-only">Address</label>
                                    <input 
                                        id="address"
                                        name="address" 
                                        placeholder="Address" 
                                        value={shippingInfo.address} 
                                        onChange={handleShippingChange} 
                                        required 
                                        aria-required="true"
                                        autoComplete="street-address"
                                        className="p-2.5 sm:p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base" 
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                                    <div>
                                        <label htmlFor="city" className="sr-only">City</label>
                                        <input 
                                            id="city"
                                            name="city" 
                                            placeholder="City" 
                                            value={shippingInfo.city} 
                                            onChange={handleShippingChange} 
                                            required 
                                            aria-required="true"
                                            autoComplete="address-level2"
                                            className="p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400" 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="sr-only">State</label>
                                        <input 
                                            id="state"
                                            name="state" 
                                            placeholder="State" 
                                            value={shippingInfo.state} 
                                            onChange={handleShippingChange} 
                                            required 
                                            aria-required="true"
                                            autoComplete="address-level1"
                                            className="p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400" 
                                        />
                            </div>
                                    <div>
                                        <label htmlFor="zipCode" className="sr-only">ZIP Code</label>
                                        <input 
                                            id="zipCode"
                                            name="zipCode" 
                                            placeholder="ZIP" 
                                            value={shippingInfo.zipCode} 
                                            onChange={handleShippingChange} 
                                            required 
                                            aria-required="true"
                                            autoComplete="postal-code"
                                            className="p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400" 
                                        />
                            </div>
                            </div>
                            </fieldset>

                            {/* Delivery Options */}
                            <fieldset>
                                <legend className="sr-only">Delivery Options</legend>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-200">Delivery Options *</label>
                                <div className="space-y-3">
                                    <label className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                        deliveryOption === 'self-delivery' 
                                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="self-delivery"
                                            checked={deliveryOption === 'self-delivery'}
                                            onChange={(e) => {
                                                setDeliveryOption(e.target.value)
                                                if (errors.deliveryOption) {
                                                    setErrors({ ...errors, deliveryOption: '' })
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 mt-1"
                                            aria-label="Self-Delivery option"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Self-Delivery</div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">
                                                The seller handles delivery directly. Free shipping included.
                                            </p>
                                        </div>
                                    </label>

                                    <label className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                        deliveryOption === 'platform-delivery' 
                                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="platform-delivery"
                                            checked={deliveryOption === 'platform-delivery'}
                                            onChange={(e) => {
                                                setDeliveryOption(e.target.value)
                                                if (errors.deliveryOption) {
                                                    setErrors({ ...errors, deliveryOption: '' })
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 mt-1"
                                            aria-label="Platform-Delivery option"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Platform-Delivery</div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">
                                                Zizla handles delivery for you. Fast and reliable shipping service.
                                            </p>
                                            <div className="mt-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md transition-colors duration-200">
                                                <p className="text-xs text-yellow-800 dark:text-yellow-200 transition-colors duration-200">
                                                    <strong>Note:</strong> Additional delivery fee of {formatCurrency(platformDeliveryFee)} will be charged per order.
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                {errors.deliveryOption && (
                                    <p className="text-red-500 dark:text-red-400 text-sm mt-2 transition-colors duration-200" role="alert">
                                        {errors.deliveryOption}
                                    </p>
                                )}
                            </fieldset>

                            {/* Payment - only Card */}
                            <fieldset>
                                <legend className="sr-only">Payment Information</legend>
                                <label htmlFor="paymentMethod" className="sr-only">Payment Method</label>
                                <input 
                                    id="paymentMethod" 
                                    type="text" 
                                    value="Credit/Debit Card" 
                                    disabled 
                                    readOnly
                                    aria-label="Payment method: Credit/Debit Card" 
                                    className="p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200 font-sans cursor-default" 
                                    style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
                                />

                            <div className="space-y-3 sm:space-y-4 mt-2">
                                    <div>
                                        <label htmlFor="cardNumber" className="sr-only">Card Number</label>
                                        <input 
                                            id="cardNumber"
                                            name="cardNumber" 
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9\s]*"
                                            placeholder="Card Number" 
                                            value={cardInfo.cardNumber} 
                                            onChange={handleCardChange} 
                                            onKeyPress={(e) => {
                                                // Only allow digits and space
                                                if (!/[0-9\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                                    e.preventDefault()
                                                }
                                            }}
                                            required 
                                            aria-required="true"
                                            autoComplete="cc-number"
                                            maxLength="19"
                                            className={`p-2.5 sm:p-3 border ${errors.cardNumber ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base`}
                                            aria-invalid={errors.cardNumber ? 'true' : 'false'}
                                            aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
                                        />
                                        {errors.cardNumber && (
                                            <p id="cardNumber-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                                                {errors.cardNumber}
                                            </p>
                                        )}
                                    </div>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label htmlFor="expiryDate" className="sr-only">Expiry Date</label>
                                            <input 
                                                id="expiryDate"
                                                name="expiryDate" 
                                                placeholder="MM/YY" 
                                                value={cardInfo.expiryDate} 
                                                onChange={handleCardChange} 
                                                required 
                                                aria-required="true"
                                                autoComplete="cc-exp"
                                                maxLength="5"
                                                className={`p-3 border ${errors.expiryDate ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400`}
                                                aria-invalid={errors.expiryDate ? 'true' : 'false'}
                                                aria-describedby={errors.expiryDate ? 'expiryDate-error' : undefined}
                                            />
                                            {errors.expiryDate && (
                                                <p id="expiryDate-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                                                    {errors.expiryDate}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="cvv" className="sr-only">CVV</label>
                                            <input 
                                                id="cvv"
                                                name="cvv" 
                                                placeholder="CVV" 
                                                value={cardInfo.cvv} 
                                                onChange={handleCardChange} 
                                                required 
                                                aria-required="true"
                                                autoComplete="cc-csc"
                                                maxLength="4"
                                                className={`p-3 border ${errors.cvv ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400`}
                                                aria-invalid={errors.cvv ? 'true' : 'false'}
                                                aria-describedby={errors.cvv ? 'cvv-error' : undefined}
                                            />
                                            {errors.cvv && (
                                                <p id="cvv-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                                                    {errors.cvv}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="cardName" className="sr-only">Cardholder Name</label>
                                        <input 
                                            id="cardName"
                                            name="cardName" 
                                            placeholder="Cardholder Name" 
                                            value={cardInfo.cardName} 
                                            onChange={handleCardChange} 
                                            required 
                                            aria-required="true"
                                            autoComplete="cc-name"
                                            className={`p-3 border ${errors.cardName ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400`}
                                            aria-invalid={errors.cardName ? 'true' : 'false'}
                                            aria-describedby={errors.cardName ? 'cardName-error' : undefined}
                                        />
                                        {errors.cardName && (
                                            <p id="cardName-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                                                {errors.cardName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </fieldset>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                aria-label={`Place order for ${formatCurrency(finalTotal)}`}
                                className="w-full bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : `Place Order - ${formatCurrency(finalTotal)}`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 sm:p-6 transition-colors duration-200">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 dark:text-gray-100 transition-colors duration-200">Order Summary</h2>
                        <ul className="space-y-4" aria-label="Order items">
                        {cartArray.map(item => (
                                <li key={item.id} className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded flex-shrink-0 transition-colors duration-200">
                                        <Image src={item.images[0]} alt={`${item.name} product image`} width={60} height={60} className="object-cover rounded" loading="lazy" />
                                </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate dark:text-gray-200 transition-colors duration-200">{item.name}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">Qty: {item.quantity}</p>
                                </div>
                                    <p className="font-medium flex-shrink-0 dark:text-gray-200 transition-colors duration-200" aria-label={`Price: ${formatCurrency(item.price * item.quantity)}`}>
                                        {formatCurrency(item.price * item.quantity)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 transition-colors duration-200" role="group" aria-label="Order summary totals">
                            <div className="flex justify-between text-gray-600 dark:text-gray-300 transition-colors duration-200" aria-label={`Subtotal: ${formatCurrency(totalPrice)}`}>
                                <span>Subtotal</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300 transition-colors duration-200" aria-label={`Delivery: ${deliveryOption === 'platform-delivery' ? formatCurrency(deliveryFee) : 'Free'}`}>
                                <span>Delivery</span>
                                <span>{deliveryOption === 'platform-delivery' ? formatCurrency(deliveryFee) : 'Free'}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300 transition-colors duration-200" aria-label={`Tax: ${formatCurrency(taxAmount)}`}>
                                <span>Tax</span>
                                <span>{formatCurrency(taxAmount)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700 pt-2 transition-colors duration-200" aria-label={`Total: ${formatCurrency(finalTotal)}`}>
                                <span>Total</span>
                                <span>{formatCurrency(finalTotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
