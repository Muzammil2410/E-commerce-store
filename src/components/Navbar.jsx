'use client'
import { Search, ShoppingCart, ChevronDown, User, LogOut, Heart, Menu, Store } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Image from "@/components/Image";
import { assets } from '@/assets/assets';
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/lib/features/cart/cartSlice";
import toast from "react-hot-toast";

const Navbar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [user, setUser] = useState(null)
    const { pathname } = useLocation()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const cartCount = useSelector(state => state.cart.total)
    const wishlistCount = useSelector(state => state.wishlist.total)
    const dropdownRef = useRef(null)
    const userMenuRef = useRef(null)
    const mobileMenuRef = useRef(null)
    const [showMobileAuth, setShowMobileAuth] = useState(false)
    const [showMobileSearch, setShowMobileSearch] = useState(false)
    const [suggestions, setSuggestions] = useState([])

    const categories = [
        'All',
        'Appliances',
        'Automotive parts and accessories',
        'Baby',
        'Beauty and personal care',
        'Books',
        'Fashion',
        'Girls/women\'s clothing',
        'Groceries',
        'Health',
        'Housewares',
        'Men\'s/boys\' clothing',
        'Pet supplies',
        'Sports',
        'Technology',
        'Toys & games',
        'Travel'
    ]

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/shop?search=${encodeURIComponent(search)}&category=${encodeURIComponent(selectedCategory)}`)
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category)
        setIsDropdownOpen(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        setUser(null)
        dispatch(clearCart()) // Clear cart when user logs out
        toast.success('Logged out successfully')
        navigate('/auth/login')
    }

    // Check for user authentication
    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false)
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setShowMobileAuth(false)
                setShowMobileSearch(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Live suggestions as user types
    const products = useSelector(state => state.product.list)
    useEffect(() => {
        if (!search) { setSuggestions([]); return }
        const lower = search.toLowerCase()
        const list = products
            .filter(p => p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower))
            .slice(0, 6)
            .map(p => ({ id: p.id, name: p.name, category: p.category }))
        setSuggestions(list)
    }, [search, products])

    return (
        <nav className="relative bg-white">
            <div className="mx-3 sm:mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-3 sm:py-4 transition-all">

                    <Link to="/" className="hover:scale-105 transition-transform duration-200">
                        <Image 
                            src={assets.zizla_logo} 
                            alt="Zizla Logo" 
                            width={350} 
                            height={140} 
                            className="h-20 xs:h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 w-auto"
                            style={{ 
                                backgroundColor: 'transparent',
                                filter: 'contrast(1.2) brightness(1.1)'
                            }}
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-2 md:gap-4 lg:gap-8 text-gray-600 flex-1">
                        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-[500px] lg:max-w-[600px] text-sm bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 focus-within:bg-white focus-within:shadow-md relative">
                            {/* Category Dropdown */}
                            <div className="relative flex-shrink-0" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    aria-label={`Select category, currently: ${selectedCategory}`}
                                    aria-expanded={isDropdownOpen}
                                    aria-haspopup="listbox"
                                    className={`flex items-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 md:py-3 text-gray-600 hover:text-gray-800 transition-all duration-200 border-r border-gray-200 focus:outline-none ${
                                        selectedCategory.length > 15 
                                            ? 'min-w-[100px] sm:min-w-[120px] px-2 sm:px-3 md:px-4' 
                                            : 'px-2 sm:px-3'
                                    }`}
                                >
                                    <span className="text-xs sm:text-sm font-medium truncate">
                                        {selectedCategory.length > 15 
                                            ? selectedCategory.substring(0, 15) + '...' 
                                            : selectedCategory
                                        }
                                    </span>
                                    <ChevronDown size={14} className={`sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                                </button>
                                
                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div 
                                        role="listbox" 
                                        className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                                        aria-label="Category selection"
                                    >
                                        {categories.map((category, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                role="option"
                                                aria-selected={category === selectedCategory}
                                                onClick={() => handleCategorySelect(category)}
                                                className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    category === selectedCategory 
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                        : 'text-gray-700'
                                                }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Search Input */}
                            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 flex-1 min-w-0">
                                <Search size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600 flex-shrink-0" />
                                <input 
                                    className="w-full bg-transparent outline-none placeholder-gray-600 focus:placeholder-gray-400 transition-colors duration-200 min-w-0 rounded text-xs sm:text-sm" 
                                    type="search" 
                                    placeholder="Search..." 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)} 
                                    aria-label="Search products"
                                    required 
                                />
                            </div>
                            {suggestions.length > 0 && (
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                                    {suggestions.map(s => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => {
                                                setSearch(s.name)
                                                navigate(`/shop?search=${encodeURIComponent(s.name)}&category=${encodeURIComponent('All')}`)
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                        >
                                            <span className="block font-medium text-gray-800 truncate">{s.name}</span>
                                            <span className="block text-xs text-gray-500">{s.category}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </form>

                        <Link to="/shop" className="hover:text-blue-800 hover:bg-blue-50 hover:px-2 sm:hover:px-3 hover:py-1.5 sm:hover:py-2 hover:rounded-full hover:scale-105 transition-all duration-200 font-medium text-xs sm:text-sm md:text-base">Shop</Link>

                        <Link to="/seller" className="group relative inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden text-[10px] sm:text-xs md:text-sm">
                            <span className="relative z-10 flex items-center gap-1 sm:gap-1.5 md:gap-2">
                                <Store size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="hidden md:inline">Become a Seller</span>
                                <span className="md:hidden">Seller</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                        </Link>

                        <Link to="/cart" className="relative flex items-center gap-1 sm:gap-1.5 md:gap-2 text-gray-600 hover:text-blue-800 hover:bg-blue-50 hover:px-2 sm:hover:px-3 hover:py-1.5 sm:hover:py-2 hover:rounded-full hover:scale-105 transition-all duration-200 font-medium">
                            <ShoppingCart size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] hover:scale-110 transition-transform duration-200" />
                            <span className="hidden md:inline text-xs sm:text-sm md:text-base">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 left-3 text-[8px] text-white bg-blue-600 size-3.5 rounded-full hover:bg-blue-800 hover:scale-110 transition-all duration-200 flex items-center justify-center">{cartCount}</span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* Wishlist */}
                                <Link to="/profile?tab=wishlist" className="relative flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-blue-800 hover:bg-blue-50 hover:px-2 sm:hover:px-3 hover:py-1.5 sm:hover:py-2 hover:rounded-full hover:scale-105 transition-all duration-200 font-medium text-xs sm:text-sm">
                                    <Heart size={16} className="sm:w-[18px] sm:h-[18px] hover:scale-110 transition-transform duration-200" />
                                    <span className="hidden sm:inline">Wishlist</span>
                                    {wishlistCount > 0 && (
                                        <button className="absolute -top-1 left-3 text-[8px] text-white bg-red-500 size-3.5 rounded-full hover:bg-red-600 hover:scale-110 transition-all duration-200">{wishlistCount}</button>
                                    )}
                                </Link>

                                {/* User Menu */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-800 hover:bg-blue-50 hover:rounded-full transition-all duration-200"
                                    >
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User size={16} className="text-blue-600" />
                                        </div>
                                        <span className="hidden sm:block font-medium">{user.name}</span>
                                        <ChevronDown size={16} className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {showUserMenu && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                            <div className="p-3 border-b border-gray-100">
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <User size={16} />
                                                    My Profile
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <ShoppingCart size={16} />
                                                    My Orders
                                                </Link>
                                                <Link
                                                    to="/profile?tab=wishlist"
                                                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <Heart size={16} />
                                                    Wishlist
                                                </Link>
                                                <hr className="my-2" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                                >
                                                    <LogOut size={16} />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Link to="/auth/login" className="relative px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 text-white rounded-full font-semibold shadow-md hover:shadow-blue-500/25 group overflow-hidden text-xs sm:text-sm md:text-base">
                                <span className="relative z-10 flex items-center gap-1 sm:gap-1.5 md:gap-2">
                                    <svg className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="hidden md:inline">Login / Register</span>
                                    <span className="md:hidden">Login</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                            </Link>
                        )}

                    </div>

                    {/* Mobile Menu */}
                    <div className="sm:hidden flex items-center gap-1 xs:gap-2 relative" ref={mobileMenuRef}>
                        {/* Mobile Search Button */}
                        <button 
                            onClick={() => setShowMobileSearch(!showMobileSearch)} 
                            aria-label="Open search"
                            aria-expanded={showMobileSearch}
                            className="p-1.5 xs:p-2 text-gray-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        >
                            <Search size={18} className="xs:w-5 xs:h-5" aria-hidden="true" />
                        </button>
                        {showMobileSearch && (
                            <div className="absolute right-0 top-9 z-50 bg-white border border-gray-200 rounded-lg shadow-md w-[85vw] max-w-sm p-2 sm:p-3">
                                <form onSubmit={handleSearch} className="flex items-center gap-1.5 sm:gap-2">
                                    <Search size={14} className="sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                                    <input 
                                        className="flex-1 bg-transparent outline-none text-xs sm:text-sm placeholder-gray-500 rounded px-1.5 sm:px-2"
                                        type="search"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        aria-label="Search products"
                                        required
                                    />
                                    <button 
                                        type="submit" 
                                        aria-label="Submit search"
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white text-[10px] sm:text-xs rounded-md hover:bg-blue-700 focus:outline-none transition-colors"
                                    >
                                        Go
                                    </button>
                                </form>
                                {suggestions.length > 0 && (
                                    <div className="mt-2 border-t border-gray-100 pt-2 max-h-56 overflow-y-auto">
                                        {suggestions.map(s => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => {
                                                    setSearch(s.name)
                                                    navigate(`/shop?search=${encodeURIComponent(s.name)}&category=${encodeURIComponent('All')}`)
                                                    setShowMobileSearch(false)
                                                }}
                                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded"
                                            >
                                                <span className="block font-medium text-gray-800 truncate">{s.name}</span>
                                                <span className="block text-xs text-gray-500">{s.category}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {user ? (
                            <div className="flex items-center gap-0.5 xs:gap-1">
                                <Link to="/seller" className="group relative inline-flex items-center gap-1 px-2 xs:px-2.5 py-1.5 xs:py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden text-[10px] xs:text-xs">
                                    <span className="relative z-10 flex items-center gap-1">
                                        <Store size={12} className="xs:w-3.5 xs:h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                                        <span className="hidden xs:inline">Seller</span>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                </Link>
                                <Link to="/cart" className="relative p-1.5 xs:p-2 text-gray-600 hover:text-blue-800 transition-colors">
                                    <ShoppingCart size={18} className="xs:w-5 xs:h-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 text-[8px] text-white bg-blue-600 size-3.5 xs:size-4 rounded-full flex items-center justify-center font-medium">{cartCount}</span>
                                    )}
                                </Link>
                                <Link to="/profile?tab=wishlist" className="relative p-1.5 xs:p-2 text-gray-600 hover:text-blue-800 transition-colors">
                                    <Heart size={18} className="xs:w-5 xs:h-5" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 text-[8px] text-white bg-red-500 size-3.5 xs:size-4 rounded-full flex items-center justify-center font-medium">{wishlistCount}</span>
                                    )}
                                </Link>
                                <Link to="/profile" className="p-1.5 xs:p-2 text-gray-600 hover:text-blue-800 transition-colors">
                                    <User size={18} className="xs:w-5 xs:h-5" />
                                </Link>
                            </div>
                        ) : (
                            // On home page, show a three-lines (hamburger) menu with Login and Register
                            pathname === '/' ? (
                                <>
                                    <Link to="/seller" className="group relative inline-flex items-center gap-1 px-2 xs:px-2.5 py-1.5 xs:py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden text-[10px] xs:text-xs mr-1">
                                        <span className="relative z-10 flex items-center gap-1">
                                            <Store size={12} className="xs:w-3.5 xs:h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                                            <span className="hidden xs:inline">Seller</span>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    </Link>
                                    <button
                                        aria-label="Open auth menu"
                                        onClick={() => setShowMobileAuth(!showMobileAuth)}
                                        className="p-1.5 xs:p-2 text-gray-600 hover:text-blue-800 transition-colors"
                                    >
                                        <Menu size={20} className="xs:w-5 xs:h-5" />
                                    </button>
                                    {showMobileAuth && (
                                        <div className="absolute right-0 top-9 z-50 bg-white border border-gray-200 rounded-lg shadow-md w-40 py-2">
                                            <Link
                                                to="/auth/login"
                                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setShowMobileAuth(false)}
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/auth/register"
                                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setShowMobileAuth(false)}
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link to="/seller" className="group relative inline-flex items-center gap-1 px-2 xs:px-2.5 py-1.5 xs:py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden text-[10px] xs:text-xs mr-1">
                                        <span className="relative z-10 flex items-center gap-1">
                                            <Store size={12} className="xs:w-3.5 xs:h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                                            <span className="hidden xs:inline">Seller</span>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    </Link>
                                    <Link to="/auth/login" className="relative px-3 xs:px-4 py-1.5 xs:py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 text-white rounded-full font-semibold shadow-md hover:shadow-blue-500/25 group overflow-hidden text-xs xs:text-sm">
                                        <span className="relative z-10 flex items-center gap-1 xs:gap-1.5">
                                            <svg className="w-3 xs:w-3.5 h-3 xs:h-3.5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="hidden xs:inline">Login</span>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    </Link>
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar