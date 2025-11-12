'use client'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from "@/lib/features/cart/cartSlice"
import { User, MapPin, ShoppingBag, Heart, Settings, LogOut, Edit, Plus, Trash2, Eye, Truck, Package, RotateCcw, Bell } from 'lucide-react'
import Image from '@/components/Image'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { orderDummyData, addressDummyData } from '@/assets/assets'
import WishlistButton from '@/components/WishlistButton'
import ActiveOrdersTab from '@/components/ActiveOrdersTab'
import DeliveryTrackingTab from '@/components/DeliveryTrackingTab'
import OrderHistoryTab from '@/components/OrderHistoryTab'
import ReturnsRefundsTab from '@/components/ReturnsRefundsTab'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function ProfilePage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState('profile')
    const [user, setUser] = useState(null)
    const [orders, setOrders] = useState([])
    const [addresses, setAddresses] = useState([])
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)
    const [addressForm, setAddressForm] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    })
    
    const wishlistItems = useSelector(state => state.wishlist.items)
    const wishlistArray = Object.values(wishlistItems)

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user')
        if (!userData) {
            navigate('/auth/login')
            return
        }

        setUser(JSON.parse(userData))
        setOrders(orderDummyData)
        
        // Load addresses from localStorage or use default
        const savedAddresses = localStorage.getItem('userAddresses')
        if (savedAddresses) {
            setAddresses(JSON.parse(savedAddresses))
        } else {
            setAddresses([addressDummyData])
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('user')
        dispatch(clearCart()) // Clear cart when user logs out
        toast.success('Logged out successfully')
        navigate('/auth/login')
    }

    const handleAddressSubmit = (e) => {
        e.preventDefault()
        
        let updatedAddresses
        
        if (editingAddress) {
            // Update existing address
            updatedAddresses = addresses.map(addr => 
                addr.id === editingAddress.id 
                    ? { ...addr, ...addressForm, updatedAt: new Date().toISOString() }
                    : addr
            )
            setAddresses(updatedAddresses)
            toast.success('Address updated successfully')
        } else {
            // Add new address
            const newAddress = {
                id: 'addr_' + Date.now(),
                ...addressForm,
                createdAt: new Date().toISOString()
            }
            updatedAddresses = [...addresses, newAddress]
            setAddresses(updatedAddresses)
            toast.success('Address added successfully')
        }
        
        // Save to localStorage
        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses))
        
        setShowAddressModal(false)
        setEditingAddress(null)
        setAddressForm({
            name: '',
            email: '',
            phone: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        })
    }

    const handleEditAddress = (address) => {
        setEditingAddress(address)
        // Infer country from provided city/state; fall back to existing or blank
        const inferred = inferCountryFromLocation(address.city, address.state)
        setAddressForm({ ...address, country: inferred || address.country || '' })
        setShowAddressModal(true)
    }

    // Infer country name from city/state heuristics
    const inferCountryFromLocation = (city, state) => {
        const value = (state || '').trim().toLowerCase()
        if (!value) return ''

        // USA states (full and abbreviations)
        const usStates = new Set([
            'al','alabama','ak','alaska','az','arizona','ar','arkansas','ca','california','co','colorado','ct','connecticut','de','delaware','fl','florida','ga','georgia','hi','hawaii','id','idaho','il','illinois','in','indiana','ia','iowa','ks','kansas','ky','kentucky','la','louisiana','me','maine','md','maryland','ma','massachusetts','mi','michigan','mn','minnesota','ms','mississippi','mo','missouri','mt','montana','ne','nebraska','nv','nevada','nh','new hampshire','nj','new jersey','nm','new mexico','ny','new york','nc','north carolina','nd','north dakota','oh','ohio','ok','oklahoma','or','oregon','pa','pennsylvania','ri','rhode island','sc','south carolina','sd','south dakota','tn','tennessee','tx','texas','ut','utah','vt','vermont','va','virginia','wa','washington','wv','west virginia','wi','wisconsin','wy','wyoming','dc','district of columbia'
        ])
        if (usStates.has(value)) return 'United States'

        // Pakistan provinces/regions
        const pkRegions = new Set(['punjab','sindh','khyber pakhtunkhwa','kpk','balochistan','gilgit-baltistan','gilgit baltistan','azad jammu and kashmir','ajk','islamabad'])
        if (pkRegions.has(value)) return 'Pakistan'

        // India states/UTs (subset of common ones)
        const inStates = new Set(['maharashtra','delhi','dl','karnataka','tamil nadu','tamilnadu','telangana','uttar pradesh','up','gujarat','west bengal','wb','kerala','rajasthan','madhya pradesh','mp','andhra pradesh','bihar','punjab (in)'])
        if (inStates.has(value)) return 'India'

        // UAE emirates
        const uae = new Set(['dubai','abu dhabi','sharjah','ajman','umm al quwain','ras al khaimah','fujairah'])
        if (uae.has(value)) return 'United Arab Emirates'

        // Canada provinces/territories
        const caProvinces = new Set(['ontario','on','quebec','qc','british columbia','bc','alberta','ab','manitoba','mb','saskatchewan','sk','nova scotia','ns','new brunswick','nb','newfoundland and labrador','nl','prince edward island','pei','yukon','yt','nunavut','nu','northwest territories','nt'])
        if (caProvinces.has(value)) return 'Canada'

        // UK countries
        const ukRegions = new Set(['england','scotland','wales','northern ireland'])
        if (ukRegions.has(value)) return 'United Kingdom'

        return ''
    }

    // Keep country in sync with city/state when user edits
    useEffect(() => {
        const inferred = inferCountryFromLocation(addressForm.city, addressForm.state)
        if (inferred !== addressForm.country) {
            setAddressForm(prev => ({ ...prev, country: inferred }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressForm.city, addressForm.state])

    const handleDeleteAddress = (addressId) => {
        const updatedAddresses = addresses.filter(addr => addr.id !== addressId)
        setAddresses(updatedAddresses)
        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses))
        toast.success('Address deleted successfully')
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'active-orders', label: 'Active Orders', icon: Package },
        { id: 'tracking', label: 'Delivery Tracking', icon: Truck },
        { id: 'orders', label: 'Order History', icon: ShoppingBag },
        { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'settings', label: 'Settings', icon: Settings }
    ]

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <>
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {/* User Info */}
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <tab.icon size={20} />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors mt-4"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={user.name}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Active Orders Tab */}
                        {activeTab === 'active-orders' && (
                            <ActiveOrdersTab orders={orders} setOrders={setOrders} />
                        )}

                        {/* Delivery Tracking Tab */}
                        {activeTab === 'tracking' && (
                            <DeliveryTrackingTab orders={orders} />
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <OrderHistoryTab orders={orders} />
                        )}

                        {/* Returns & Refunds Tab */}
                        {activeTab === 'returns' && (
                            <ReturnsRefundsTab orders={orders} />
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
                                    <button
                                        onClick={() => setShowAddressModal(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={20} />
                                        Add Address
                                    </button>
                                </div>

                                {addresses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="font-medium text-gray-900">{address.name}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEditAddress(address)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAddress(address.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p className="font-medium">{address.street}</p>
                                                    <p>{address.city}, {address.state} {address.zip}</p>
                                                    <p>{inferCountryFromLocation(address.city, address.state) || ''}</p>
                                                    <p className="text-blue-600">{address.phone}</p>
                                                    {address.email && <p className="text-blue-600">{address.email}</p>}
                                                    {address.updatedAt && (
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            Updated: {new Date(address.updatedAt).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                                        <p className="text-gray-600 mb-4">Add an address to make checkout faster.</p>
                                        <button
                                            onClick={() => setShowAddressModal(true)}
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Add Address
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Wishlist ({wishlistArray.length})</h2>
                                
                                {wishlistArray.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {wishlistArray.map((item) => (
                                            <div key={item.productId} className="border border-gray-200 rounded-lg p-4 group hover:shadow-md transition-shadow">
                                                <div className="relative">
                                                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                                        <Image
                                                            src={item.product.images[0]}
                                                            alt={item.product.name}
                                                            width={200}
                                                            height={200}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="absolute top-2 right-2">
                                                        <WishlistButton product={item.product} size={20} />
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <h3 className="font-medium text-gray-900 line-clamp-2">{item.product.name}</h3>
                                                    <p className="text-sm text-gray-600">{item.product.category}</p>
                                                    <p className="font-semibold text-gray-900">${item.product.price}</p>
                                                    
                                                    <div className="flex items-center gap-2 pt-2">
                                                        <Link
                                                            to={`/product/${item.product.id}`}
                                                            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                        >
                                                            View Product
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                                        <p className="text-gray-600 mb-4">Save items you love for later.</p>
                                        <Link
                                            to="/shop"
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Start Shopping
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-3">Notifications</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center">
                                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                                <span className="ml-3 text-gray-700">Email notifications</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                                <span className="ml-3 text-gray-700">SMS notifications</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                <span className="ml-3 text-gray-700">Push notifications</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-3">Privacy</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center">
                                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                                <span className="ml-3 text-gray-700">Make profile public</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                <span className="ml-3 text-gray-700">Allow marketing emails</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                            Save Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        
                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={addressForm.name}
                                    onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={addressForm.email}
                                        onChange={(e) => setAddressForm({...addressForm, email: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone *
                                    </label>
                                    <PhoneInput
                                        value={addressForm.phone}
                                        onChange={(value) => setAddressForm({...addressForm, phone: value})}
                                        defaultCountry="PK"
                                        international
                                        countryCallingCodeEditable={false}
                                        placeholder="Enter your phone number"
                                        className="phone-input"
                                        style={{
                                            '--PhoneInput-color--focus': '#3b82f6',
                                            '--PhoneInputCountrySelect-marginRight': '0.5rem',
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street Address *
                                </label>
                                <textarea
                                    value={addressForm.street}
                                    onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ZIP *
                                    </label>
                                    <input
                                        type="text"
                                        value={addressForm.zip}
                                        onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingAddress ? 'Update Address' : 'Add Address'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddressModal(false)
                                        setEditingAddress(null)
                                        setAddressForm({
                                            name: '',
                                            email: '',
                                            phone: '',
                                            street: '',
                                            city: '',
                                            state: '',
                                            zip: '',
                                            country: ''
                                        })
                                    }}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        </>
    )
}
