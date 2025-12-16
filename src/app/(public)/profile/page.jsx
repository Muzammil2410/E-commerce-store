'use client'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from "@/lib/features/cart/cartSlice"
import { User, MapPin, ShoppingBag, Heart, LogOut, Edit, Plus, Trash2, Eye, Truck, Package, RotateCcw, Bell, Camera } from 'lucide-react'
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
import { useLanguageCurrency } from '@/contexts/LanguageCurrencyContext'

export default function ProfilePage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { formatCurrency, t, translateProductName } = useLanguageCurrency()
    const [activeTab, setActiveTab] = useState('profile')
    const [user, setUser] = useState(null)
    const [orders, setOrders] = useState([])
    const [addresses, setAddresses] = useState([])
    const [profilePicture, setProfilePicture] = useState(null)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: ''
    })
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
    const contentRef = useRef(null)

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user')
        if (!userData) {
            navigate('/auth/login')
            return
        }

        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setOrders(orderDummyData)
        
        // Load profile picture from user data
        if (parsedUser.profilePicture) {
            setProfilePicture(parsedUser.profilePicture)
        }
        
        // Initialize profile form with user data
        setProfileForm({
            name: parsedUser.name || '',
            email: parsedUser.email || ''
        })
        
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

    const handleProfilePictureUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB')
            return
        }

        // Read file and convert to base64
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result
            setProfilePicture(base64String)
            
            // Update user object with profile picture
            const updatedUser = { ...user, profilePicture: base64String }
            setUser(updatedUser)
            
            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser))
            toast.success('Profile picture updated successfully')
        }
        reader.onerror = () => {
            toast.error('Error reading image file')
        }
        reader.readAsDataURL(file)
    }

    const handleEditProfile = () => {
        setIsEditingProfile(true)
        setProfileForm({
            name: user.name || '',
            email: user.email || ''
        })
    }

    const handleCancelEdit = () => {
        setIsEditingProfile(false)
        setProfileForm({
            name: user.name || '',
            email: user.email || ''
        })
    }

    const handleSaveProfile = () => {
        // Validate form
        if (!profileForm.name.trim()) {
            toast.error('Name is required')
            return
        }
        
        if (!profileForm.email.trim()) {
            toast.error('Email is required')
            return
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(profileForm.email)) {
            toast.error('Please enter a valid email address')
            return
        }

        // Update user object
        const updatedUser = {
            ...user,
            name: profileForm.name.trim(),
            email: profileForm.email.trim()
        }
        setUser(updatedUser)
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        setIsEditingProfile(false)
        toast.success('Profile updated successfully')
    }

    // Handle tab change with scroll to content on mobile
    const handleTabChange = (tabId) => {
        setActiveTab(tabId)
        // Scroll to content area on mobile devices
        if (window.innerWidth < 1024) { // lg breakpoint
            setTimeout(() => {
                if (contentRef.current) {
                    const elementPosition = contentRef.current.getBoundingClientRect().top
                    const offsetPosition = elementPosition + window.pageYOffset - 20 // 20px offset from top
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    })
                }
            }, 150)
        }
    }

    const tabs = [
        { id: 'profile', label: t('profileTab'), icon: User },
        { id: 'active-orders', label: t('activeOrdersTab'), icon: Package },
        { id: 'tracking', label: t('deliveryTrackingTab'), icon: Truck },
        { id: 'orders', label: t('orderHistoryTab'), icon: ShoppingBag },
        { id: 'returns', label: t('returnsRefundsTab'), icon: RotateCcw },
        { id: 'addresses', label: t('addressesTab'), icon: MapPin },
        { id: 'wishlist', label: t('wishlistTab'), icon: Heart }
    ]

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">Loading...</div>
    }

    return (
        <>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{t('myAccount')}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">{t('manageAccountSettings')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 transition-colors duration-300">
                            {/* User Info */}
                            <div className="text-center mb-6">
                                <div className="relative w-20 h-20 mx-auto mb-4">
                                    {profilePicture ? (
                                        <img 
                                            src={profilePicture} 
                                            alt="Profile" 
                                            className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700 transition-colors duration-300"
                                            style={{ objectPosition: 'center 25%' }}
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                                            <User className="w-10 h-10 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                                        </div>
                                    )}
                                    <label className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg">
                                        <Camera size={14} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfilePictureUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{user.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{user.email}</p>
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
                            >
                                <LogOut size={20} />
                                {t('logout')}
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div ref={contentRef} className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 transition-colors duration-300">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-300">{t('profileInformation')}</h2>
                                
                                {/* Profile Picture Section */}
                                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
                                        {t('profilePicture')}
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            {profilePicture ? (
                                                <img 
                                                    src={profilePicture} 
                                                    alt="Profile" 
                                                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700 transition-colors duration-300"
                                                    style={{ objectPosition: 'center 25%' }}
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                                                    <User className="w-12 h-12 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="cursor-pointer">
                                                <span className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                                    <Camera size={18} />
                                                    {profilePicture ? t('changePicture') : t('uploadPicture')}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleProfilePictureUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">JPG, PNG or GIF. Max size 5MB</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                            {t('fullNameLabel')}
                                        </label>
                                        <input
                                            type="text"
                                            value={isEditingProfile ? profileForm.name : user.name}
                                            onChange={(e) => isEditingProfile && setProfileForm({...profileForm, name: e.target.value})}
                                            className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                                                isEditingProfile ? '' : 'bg-gray-50 dark:bg-gray-700'
                                            }`}
                                            readOnly={!isEditingProfile}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                            {t('emailAddressLabel')}
                                        </label>
                                        <input
                                            type="email"
                                            value={isEditingProfile ? profileForm.email : user.email}
                                            onChange={(e) => isEditingProfile && setProfileForm({...profileForm, email: e.target.value})}
                                            className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors ${
                                                isEditingProfile ? '' : 'bg-gray-50 dark:bg-gray-700'
                                            }`}
                                            readOnly={!isEditingProfile}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-3">
                                    {isEditingProfile ? (
                                        <>
                                            <button 
                                                onClick={handleSaveProfile}
                                                className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                                            >
                                                {t('saveChanges')}
                                            </button>
                                            <button 
                                                onClick={handleCancelEdit}
                                                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                {t('cancelButton')}
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={handleEditProfile}
                                            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                                        >
                                            {t('editProfile')}
                                        </button>
                                    )}
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
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 transition-colors duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">{t('savedAddresses')}</h2>
                                    <button
                                        onClick={() => setShowAddressModal(true)}
                                        className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={20} />
                                        {t('addAddress')}
                                    </button>
                                </div>

                                {addresses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{address.name}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEditAddress(address)}
                                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAddress(address.id)}
                                                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-300"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 transition-colors duration-300">
                                                    <p className="font-medium">{address.street}</p>
                                                    <p>{address.city}, {address.state} {address.zip}</p>
                                                    <p>{inferCountryFromLocation(address.city, address.state) || ''}</p>
                                                    <p>{address.phone}</p>
                                                    {address.email && <p>{address.email}</p>}
                                                    {address.updatedAt && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
                                                            {t('updated')}: {new Date(address.updatedAt).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t('noAddressesSaved')}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">{t('addAddressToCheckout')}</p>
                                        <button
                                            onClick={() => setShowAddressModal(true)}
                                            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                                        >
                                            {t('addAddress')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 transition-colors duration-300">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-300">{t('wishlistTab')} ({wishlistArray.length})</h2>
                                
                                {wishlistArray.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {wishlistArray.map((item) => (
                                            <div key={item.productId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 group hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow">
                                                <div className="relative">
                                                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300">
                                                        <Image
                                                            src={item.product.images[0]}
                                                            alt={translateProductName(item.product.name)}
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
                                                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 transition-colors duration-300">{translateProductName(item.product.name)}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{item.product.category}</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{formatCurrency(item.product.price)}</p>
                                                    
                                                    <div className="flex items-center gap-2 pt-2">
                                                        <Link
                                                            to={`/product/${item.product.id}`}
                                                            className="flex-1 bg-blue-600 dark:bg-blue-500 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm"
                                                        >
                                                            {t('viewProduct')}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Heart className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t('yourWishlistEmpty')}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">{t('saveItemsForLater')}</p>
                                        <Link
                                            to="/shop"
                                            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                                        >
                                            {t('startShopping')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-colors duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 transition-colors duration-300">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                            {editingAddress ? t('editAddress') : t('addNewAddress')}
                        </h3>
                        
                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                    {t('fullNameLabel')} *
                                </label>
                                <input
                                    type="text"
                                    value={addressForm.name}
                                    onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                        {t('emailAddressLabel')} *
                                    </label>
                                    <input
                                        type="email"
                                        value={addressForm.email}
                                        onChange={(e) => setAddressForm({...addressForm, email: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                        {t('phone')} *
                                    </label>
                                    <PhoneInput
                                        value={addressForm.phone}
                                        onChange={(value) => setAddressForm({...addressForm, phone: value})}
                                        defaultCountry="PK"
                                        international
                                        countryCallingCodeEditable={false}
                                        placeholder={t('enterYourPhoneNumber')}
                                        className="phone-input"
                                        style={{
                                            '--PhoneInput-color--focus': '#3b82f6',
                                            '--PhoneInputCountrySelect-marginRight': '0.5rem',
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                    {t('streetAddress')} *
                                </label>
                                <textarea
                                    value={addressForm.street}
                                    onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-colors"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                        {t('cityLabel')} *
                                    </label>
                                    <input
                                        type="text"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                        {t('stateLabel')} *
                                    </label>
                                    <input
                                        type="text"
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                        {t('zipLabel')} *
                                    </label>
                                    <input
                                        type="text"
                                        value={addressForm.zip}
                                        onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                                >
                                    {editingAddress ? t('updateAddress') : t('addAddress')}
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
                                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {t('cancelButton')}
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
