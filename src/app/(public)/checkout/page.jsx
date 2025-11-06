'use client'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CreditCard, MapPin, User, Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react'
import Image from '@/components/Image'
import toast from 'react-hot-toast'
import { clearCart } from '@/lib/features/cart/cartSlice'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function CheckoutPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.cart)
    const products = useSelector(state => state.product.list)

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

    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$'
    const taxRate = 0.1 // 10% tax

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
    const finalTotal = totalPrice + taxAmount

    const handleShippingChange = (e) => setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value })
    const handleCardChange = (e) => setCardInfo({ ...cardInfo, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
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
            <div className="min-h-screen bg-green-50 flex items-center justify-center p-4" role="status" aria-live="polite" aria-atomic="true">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
                    <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
                    <p className="text-sm text-gray-500 mb-8">
                        Order ID: <span aria-label={`Order ID ${orderId}`}>{orderId}</span>
                    </p>
                    <div className="space-y-3">
                        <Link 
                            to="/orders" 
                            className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            aria-label="View your orders"
                        >
                            View Orders
                        </Link>
                        <Link 
                            to="/" 
                            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
                    <Link 
                        to="/shop" 
                        className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <Link to={isBuyNow ? "/" : "/cart"} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">
                    <ArrowLeft size={20} aria-hidden="true" /> 
                    <span>{isBuyNow ? "Back to Home" : "Back to Cart"}</span>
                </Link>
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className={`grid ${isBuyNow ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-8`}>
                    {/* Checkout Form */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Shipping & Payment</h2>
                        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Checkout form">
                            {/* Shipping Fields */}
                            <fieldset>
                                <legend className="sr-only">Shipping Information</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
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
                                            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                                            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="sr-only">Phone Number</label>
                                        <PhoneInput 
                                            id="phone"
                                            defaultCountry="PK" 
                                            value={shippingInfo.phone} 
                                            onChange={val => setShippingInfo({ ...shippingInfo, phone: val })} 
                                            className="p-3 border rounded w-full focus-within:ring-2 focus-within:ring-blue-500" 
                                            aria-label="Phone number"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
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
                                        className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                                            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
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
                                            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
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
                                            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                        />
                            </div>
                            </div>
                            </fieldset>

                            {/* Payment - only Card */}
                            <fieldset>
                                <legend className="sr-only">Payment Information</legend>
                                <label htmlFor="paymentMethod" className="sr-only">Payment Method</label>
                                <select id="paymentMethod" value="card" disabled aria-label="Payment method: Credit/Debit Card" className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="card">Credit/Debit Card</option>
                            </select>

                            <div className="space-y-4 mt-2">
                                    <div>
                                        <label htmlFor="cardNumber" className="sr-only">Card Number</label>
                                        <input 
                                            id="cardNumber"
                                            name="cardNumber" 
                                            placeholder="Card Number" 
                                            value={cardInfo.cardNumber} 
                                            onChange={handleCardChange} 
                                            required 
                                            aria-required="true"
                                            autoComplete="cc-number"
                                            maxLength="19"
                                            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                        />
                                    </div>
                                <div className="grid grid-cols-2 gap-4">
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
                                                className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                            />
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
                                                className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                            />
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
                                            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                        />
                                    </div>
                                </div>
                            </fieldset>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                aria-label={`Place order for ${currency}${finalTotal.toFixed(2)}`}
                                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : `Place Order - ${currency}${finalTotal.toFixed(2)}`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <ul className="space-y-4" aria-label="Order items">
                        {cartArray.map(item => (
                                <li key={item.id} className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded flex-shrink-0">
                                        <Image src={item.images[0]} alt={`${item.name} product image`} width={60} height={60} className="object-cover rounded" loading="lazy" />
                                </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{item.name}</p>
                                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                </div>
                                    <p className="font-medium flex-shrink-0" aria-label={`Price: ${currency}${(item.price * item.quantity).toFixed(2)}`}>
                                        {currency}{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t pt-4 space-y-2" role="group" aria-label="Order summary totals">
                            <div className="flex justify-between text-gray-600" aria-label={`Subtotal: ${currency}${totalPrice.toFixed(2)}`}>
                                <span>Subtotal</span>
                                <span>{currency}{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600" aria-label="Shipping: Free">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-gray-600" aria-label={`Tax: ${currency}${taxAmount.toFixed(2)}`}>
                                <span>Tax</span>
                                <span>{currency}{taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900 border-t pt-2" aria-label={`Total: ${currency}${finalTotal.toFixed(2)}`}>
                                <span>Total</span>
                                <span>{currency}{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
