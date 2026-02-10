'use client'
import { Search, ShoppingCart, ChevronDown, User, LogOut, Heart, Menu, X, Sun, Moon, Bell } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Image from "@/components/Image";
import { assets } from '@/assets/assets';
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/lib/features/cart/cartSlice";
import toast from "react-hot-toast";
import { useLanguageCurrency } from "@/contexts/LanguageCurrencyContext";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, language, currency, updateLanguage, updateCurrency } = useLanguageCurrency();
    const { isDarkMode, toggleTheme } = useTheme();

    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [user, setUser] = useState(null)
    const { pathname } = useLocation()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const cartCount = useSelector(state => state.cart.total)
    const wishlistCount = useSelector(state => state.wishlist.total)
    const dropdownRef = useRef(null)
    const dropdownContainerRef = useRef(null)
    const userMenuRef = useRef(null)
    const mobileMenuRef = useRef(null)
    const [showMobileAuth, setShowMobileAuth] = useState(false)
    const [showMobileSearch, setShowMobileSearch] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [showLanguageModal, setShowLanguageModal] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState(language)
    const [selectedCurrency, setSelectedCurrency] = useState(currency)
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false)
    const [hoveredCategory, setHoveredCategory] = useState(null)
    const [showNotificationModal, setShowNotificationModal] = useState(false)
    const languageModalRef = useRef(null)
    const languageDropdownRef = useRef(null)
    const currencyDropdownRef = useRef(null)
    const notificationModalRef = useRef(null)

    // Update local state when context changes
    useEffect(() => {
        setSelectedLanguage(language)
        setSelectedCurrency(currency)
    }, [language, currency])

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

    const languages = [
        'English',
        'Spanish',
        'French',
        'German',
        'Italian',
        'Portuguese',
        'Chinese',
        'Japanese',
        'Korean',
        'Arabic',
        'Hindi',
        'Urdu'
    ]

    const currencies = [
        'USD - US Dollar',
        'PKR - Pakistani Rupee',
        'EUR - Euro',
        'GBP - British Pound',
        'INR - Indian Rupee',
        'CNY - Chinese Yuan',
        'JPY - Japanese Yen',
        'AED - UAE Dirham',
        'SAR - Saudi Riyal',
        'BHD - Bahraini Dinar',
        'KWD - Kuwaiti Dinar',
        'QAR - Qatari Riyal'
    ]


    const handleSearch = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const searchTerm = search.trim()
        if (searchTerm) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}`)
            // Clear search after navigation
            setSearch('')
        }
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category)
        setIsDropdownOpen(false)
        setHoveredCategory(null)
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
        if (!isDropdownOpen) return; // Don't set up listeners if dropdown is closed

        const handleClickOutside = (event) => {
            // Check if click is outside both the dropdown button and the dropdown container
            const isOutsideButton = dropdownRef.current && !dropdownRef.current.contains(event.target);
            const isOutsideContainer = dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target);

            // Only close if click is outside both the button and the container
            if (isOutsideButton && isOutsideContainer) {
                setIsDropdownOpen(false);
                setHoveredCategory(null);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false)
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setShowMobileAuth(false)
                setShowMobileSearch(false)
            }
            if (notificationModalRef.current && !notificationModalRef.current.contains(event.target)) {
                setShowNotificationModal(false)
            }
            if (languageModalRef.current && !languageModalRef.current.contains(event.target)) {
                // Don't close if clicking on language or currency dropdown inside modal
                if (!languageDropdownRef.current?.contains(event.target) && !currencyDropdownRef.current?.contains(event.target)) {
                    setIsLanguageDropdownOpen(false)
                    setIsCurrencyDropdownOpen(false)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [isDropdownOpen])

    const handleSaveLanguage = () => {
        // Update context which will update the whole website
        updateLanguage(selectedLanguage)
        updateCurrency(selectedCurrency)
        setShowLanguageModal(false)
        setIsLanguageDropdownOpen(false)
        setIsCurrencyDropdownOpen(false)
        toast.success('Language and currency updated')
    }

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

    // Top categories with their subcategories
    const topCategories = [
        'Mobiles & Tablets',
        'Men\'s Fashion',
        'Women Fashion',
        'Appliances',
        'TV & Video',
        'Kidsmart',
        'Home & Living',
        'Computer & Gaming',
        'Automotive',
        'Health & Care',
        'Camera',
        'Home Audio & Theatre'
    ]

    // Subcategories for each top category
    const categorySubmenus = {
        'Women Fashion': [
            {
                title: 'Winter Wear',
                items: ['Sweaters', 'Hoodies', 'Jackets & Coats', 'Shrugs & Blazer'],
                viewMore: true
            },
            {
                title: 'Eyewear',
                items: ['Sunglasses', 'Frames', 'Contact Lenses'],
                viewMore: true
            },
            {
                title: 'Footwear',
                items: ['Sandals & Slippers', 'Heels', 'Khussas & Kolhapuri', 'Pumps'],
                viewMore: true
            },
            {
                title: 'Accessories',
                items: ['Bags', 'Clutches', 'Bags & Wallet', 'Caps'],
                viewMore: true
            },
            {
                title: 'Jewellery',
                items: ['Earrings', 'Necklaces', 'Jewellery Sets', 'Bracelets'],
                viewMore: true
            },
            {
                title: 'Makeup',
                items: ['Tools & Accessories', 'Lips', 'Face', 'Eyes'],
                viewMore: true
            },
            {
                title: 'Fragrances',
                items: ['Attar', 'Pocket Perfumes', 'Colognes & Perfumes', 'Body Spray & Deo Sticks'],
                viewMore: true
            },
            {
                title: 'Watches',
                items: ['Analog', 'Smart Watches', 'Digital', 'Chronograph'],
                viewMore: true
            }
        ],
        'Men\'s Fashion': [
            {
                title: 'Winter Wear',
                items: ['Sweaters', 'Hoodies', 'Jackets & Coats', 'Blazers'],
                viewMore: true
            },
            {
                title: 'Footwear',
                items: ['Casual Shoes', 'Formal Shoes', 'Sneakers', 'Sandals'],
                viewMore: true
            },
            {
                title: 'Accessories',
                items: ['Belts', 'Wallets', 'Ties', 'Caps'],
                viewMore: true
            },
            {
                title: 'Watches',
                items: ['Analog', 'Smart Watches', 'Digital', 'Chronograph'],
                viewMore: true
            }
        ],
        'Mobiles & Tablets': [
            {
                title: 'Mobile Phones',
                items: ['Smartphones', 'Feature Phones', 'Refurbished'],
                viewMore: true
            },
            {
                title: 'Tablets',
                items: ['Android Tablets', 'iPads', 'Windows Tablets'],
                viewMore: true
            },
            {
                title: 'Accessories',
                items: ['Cases & Covers', 'Screen Protectors', 'Chargers', 'Power Banks'],
                viewMore: true
            }
        ],
        'Appliances': [
            {
                title: 'Kitchen Appliances',
                items: ['Microwaves', 'Refrigerators', 'Dishwashers', 'Blenders'],
                viewMore: true
            },
            {
                title: 'Home Appliances',
                items: ['Washing Machines', 'Air Conditioners', 'Vacuum Cleaners', 'Irons'],
                viewMore: true
            }
        ],
        'TV & Video': [
            {
                title: 'Televisions',
                items: ['Smart TVs', 'LED TVs', '4K TVs', 'OLED TVs'],
                viewMore: true
            },
            {
                title: 'Accessories',
                items: ['TV Mounts', 'Remote Controls', 'HDMI Cables', 'Streaming Devices'],
                viewMore: true
            }
        ],
        'Computer & Gaming': [
            {
                title: 'Laptops & Computers',
                items: ['Laptops', 'Desktop PCs', 'Monitors', 'Keyboards & Mice'],
                viewMore: true
            },
            {
                title: 'Gaming',
                items: ['Gaming Consoles', 'Gaming Laptops', 'Controllers', 'Games'],
                viewMore: true
            }
        ],
        'Kidsmart': [
            {
                title: 'Baby & Toddler',
                items: ['Diapers', 'Baby Food', 'Baby Care', 'Strollers & Carriers'],
                viewMore: true
            },
            {
                title: 'Kids Clothing',
                items: ['Boys Clothing', 'Girls Clothing', 'Baby Clothing', 'Shoes'],
                viewMore: true
            },
            {
                title: 'Toys & Games',
                items: ['Action Figures', 'Board Games', 'Educational Toys', 'Outdoor Toys'],
                viewMore: true
            },
            {
                title: 'School Supplies',
                items: ['Backpacks', 'Stationery', 'Art Supplies', 'Lunch Boxes'],
                viewMore: true
            }
        ],
        'Home & Living': [
            {
                title: 'Furniture',
                items: ['Living Room', 'Bedroom', 'Dining Room', 'Office Furniture'],
                viewMore: true
            },
            {
                title: 'Home Decor',
                items: ['Wall Art', 'Curtains & Blinds', 'Rugs & Carpets', 'Decorative Items'],
                viewMore: true
            },
            {
                title: 'Kitchen & Dining',
                items: ['Cookware', 'Dinnerware', 'Kitchen Tools', 'Storage Solutions'],
                viewMore: true
            },
            {
                title: 'Bedding & Bath',
                items: ['Bed Sheets', 'Pillows', 'Towels', 'Bath Accessories'],
                viewMore: true
            }
        ],
        'Automotive': [
            {
                title: 'Car Parts',
                items: ['Engine Parts', 'Brake Parts', 'Suspension', 'Filters'],
                viewMore: true
            },
            {
                title: 'Car Accessories',
                items: ['Car Covers', 'Seat Covers', 'Floor Mats', 'Dash Cams'],
                viewMore: true
            },
            {
                title: 'Tools & Equipment',
                items: ['Car Jacks', 'Tool Kits', 'Battery Chargers', 'Diagnostic Tools'],
                viewMore: true
            },
            {
                title: 'Car Care',
                items: ['Car Wash', 'Wax & Polish', 'Interior Cleaners', 'Tire Care'],
                viewMore: true
            }
        ],
        'Health & Care': [
            {
                title: 'Personal Care',
                items: ['Hair Care', 'Skin Care', 'Oral Care', 'Body Care'],
                viewMore: true
            },
            {
                title: 'Health & Wellness',
                items: ['Vitamins & Supplements', 'Fitness Equipment', 'Medical Devices', 'First Aid'],
                viewMore: true
            },
            {
                title: 'Baby & Child Care',
                items: ['Baby Care Products', 'Child Health', 'Baby Feeding', 'Safety Products'],
                viewMore: true
            },
            {
                title: 'Senior Care',
                items: ['Mobility Aids', 'Health Monitors', 'Personal Care', 'Comfort Products'],
                viewMore: true
            }
        ],
        'Camera': [
            {
                title: 'Digital Cameras',
                items: ['DSLR Cameras', 'Mirrorless Cameras', 'Point & Shoot', 'Action Cameras'],
                viewMore: true
            },
            {
                title: 'Camera Lenses',
                items: ['Wide Angle', 'Telephoto', 'Macro', 'Prime Lenses'],
                viewMore: true
            },
            {
                title: 'Camera Accessories',
                items: ['Camera Bags', 'Tripods', 'Memory Cards', 'Batteries & Chargers'],
                viewMore: true
            },
            {
                title: 'Photography Equipment',
                items: ['Lighting', 'Filters', 'Remote Controls', 'Studio Equipment'],
                viewMore: true
            }
        ],
        'Home Audio & Theatre': [
            {
                title: 'Audio System',
                items: ['Soundbars', 'Home Theater Systems', 'Stereo Systems', 'Speakers'],
                viewMore: true
            },
            {
                title: 'Headphones & Earbuds',
                items: ['Over-Ear Headphones', 'In-Ear Earbuds', 'Wireless Headphones', 'Gaming Headsets'],
                viewMore: true
            },
            {
                title: 'Audio Accessories',
                items: ['Amplifiers', 'Receivers', 'Cables & Connectors', 'Mounts & Stands'],
                viewMore: true
            },
            {
                title: 'Smart Audio',
                items: ['Smart Speakers', 'Voice Assistants', 'Multi-Room Audio', 'Streaming Devices'],
                viewMore: true
            }
        ]
    }

    return (
        <nav className="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 w-full transition-colors duration-200" style={{ overflow: 'visible', zIndex: 100 }}>
            <div className="px-3 sm:px-4 md:px-6 lg:px-8" style={{ overflow: 'visible' }}>
                <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto py-2.5 sm:py-3 md:py-4 transition-all relative" style={{ overflow: 'visible' }}>

                    {/* Mobile: Logo on left */}
                    <Link to="/" className="sm:hidden hover:scale-105 transition-transform duration-200 flex-shrink-0">
                        <div className="bg-transparent dark:bg-gray-900 px-2 py-1 rounded transition-colors duration-200 overflow-hidden flex items-center justify-center" style={{ height: '4.5rem', maxHeight: '4.5rem' }}>
                            <Image
                                src={isDarkMode ? assets.helloLogo : assets.zizla_logo}
                                alt="Zizla Logo"
                                width={350}
                                height={140}
                                className="h-18 w-auto"
                                style={{
                                    backgroundColor: isDarkMode ? '#111827' : 'transparent',
                                    display: 'block',
                                    objectFit: 'contain',
                                    maxHeight: '4.5rem',
                                    height: '4.5rem',
                                    width: 'auto',
                                    maxWidth: 'none',
                                    ...(isDarkMode ? {} : { filter: 'contrast(1.2) brightness(1.1)' })
                                }}
                            />
                        </div>
                    </Link>

                    {/* Desktop: Logo */}
                    <Link to="/" className="hidden sm:block hover:scale-105 transition-transform duration-200 flex-shrink-0">
                        <div className="bg-transparent dark:bg-gray-900 px-2 py-1 rounded transition-colors duration-200 overflow-hidden flex items-center justify-center">
                            <Image
                                src={isDarkMode ? assets.helloLogo : assets.zizla_logo}
                                alt="Zizla Logo"
                                width={350}
                                height={140}
                                className="h-14 md:h-16 lg:h-20 w-auto"
                                style={{
                                    backgroundColor: isDarkMode ? '#111827' : 'transparent',
                                    display: 'block',
                                    objectFit: 'contain',
                                    width: 'auto',
                                    maxWidth: 'none',
                                    ...(isDarkMode ? {} : { filter: 'contrast(1.2) brightness(1.1)' })
                                }}
                            />
                        </div>
                    </Link>

                    {/* Desktop Search Bar - Centered */}
                    <div className="hidden sm:flex items-center flex-1 justify-center mx-4 md:mx-6 lg:mx-8 relative" style={{ zIndex: 50 }}>
                        <form onSubmit={handleSearch} className="flex items-center w-full max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1200px] h-11 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:border-blue-300 dark:focus-within:border-blue-600 focus-within:shadow-sm relative" style={{ overflow: 'visible' }} id="search-form">
                            {/* Category Dropdown */}
                            <div className="relative flex-shrink-0" ref={dropdownRef} style={{ zIndex: 100 }}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsDropdownOpen(!isDropdownOpen);
                                    }}
                                    onTouchStart={(e) => {
                                        e.stopPropagation();
                                    }}
                                    aria-label={`Select category, currently: ${selectedCategory}`}
                                    aria-expanded={isDropdownOpen}
                                    aria-haspopup="listbox"
                                    className={`flex items-center gap-1.5 h-full px-3 sm:px-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white active:text-gray-900 dark:active:text-white transition-all duration-200 border-r border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-l-full touch-manipulation ${selectedCategory.length > 15
                                            ? 'min-w-[80px] sm:min-w-[100px]'
                                            : ''
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
                            </div>

                            {/* Search Input */}
                            <div className="flex items-center gap-2 px-2 sm:px-3 md:px-4 flex-1 min-w-[120px] sm:min-w-[150px] relative">
                                <Search size={16} className="sm:w-[18px] sm:h-[18px] text-gray-500 dark:text-gray-400 flex-shrink-0 transition-colors duration-300 pointer-events-none" />
                                <input
                                    id="search-input"
                                    className="flex-1 w-full min-w-[100px] sm:min-w-[150px] bg-transparent outline-none placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:placeholder-gray-400 dark:focus:placeholder-gray-500 transition-colors duration-200 rounded text-xs sm:text-sm md:text-base touch-manipulation py-2"
                                    type="search"
                                    placeholder={t('search')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.focus();
                                    }}
                                    onFocus={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.style.opacity = '1';
                                        e.currentTarget.style.visibility = 'visible';
                                    }}
                                    onTouchStart={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.focus();
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSearch(e);
                                        }
                                    }}
                                    style={{
                                        minWidth: '100px',
                                        width: '100%',
                                        display: 'block',
                                        visibility: 'visible',
                                        opacity: 1,
                                        flex: '1 1 auto'
                                    }}
                                    aria-label="Search products"
                                    autoComplete="off"
                                />
                            </div>
                            {suggestions.length > 0 && (
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 z-50 max-h-72 overflow-y-auto transition-colors duration-300">
                                    {suggestions.map(s => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => {
                                                setSearch(s.name)
                                                navigate(`/shop?search=${encodeURIComponent(s.name)}&category=${encodeURIComponent('All')}`)
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                                        >
                                            <span className="block font-medium text-gray-800 dark:text-gray-200 truncate transition-colors duration-300">{s.name}</span>
                                            <span className="block text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{s.category}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Right Navigation */}
                    <div className="hidden sm:flex items-center gap-5 md:gap-6 lg:gap-7 text-gray-700 dark:text-gray-300 flex-shrink-0">
                        {/* Language/Currency Dropdown */}
                        <button
                            onClick={() => setShowLanguageModal(true)}
                            className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200 font-medium text-base whitespace-nowrap"
                        >
                            <span>{language.substring(0, 2).toUpperCase()}</span>
                            <ChevronDown size={16} />
                        </button>

                        <Link to="/shop" className="text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200 font-medium text-base whitespace-nowrap">{t('shop')}</Link>

                        <Link to="/cart" className="relative flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200 font-medium whitespace-nowrap">
                            <ShoppingCart size={20} className="hover:scale-110 transition-transform duration-200" />
                            <span className="text-base">{t('cart')}</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 left-3 text-[8px] text-white bg-blue-600 dark:bg-blue-500 size-3.5 rounded-full hover:bg-blue-800 dark:hover:bg-blue-600 hover:scale-110 transition-all duration-200 flex items-center justify-center font-medium">{cartCount}</span>
                            )}
                        </Link>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleTheme();
                            }}
                            className="relative group flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:rounded-full transition-all duration-300"
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            type="button"
                        >
                            {isDarkMode ? (
                                <Sun size={20} className="hover:scale-110 transition-transform duration-300" />
                            ) : (
                                <Moon size={20} className="hover:scale-110 transition-transform duration-300" />
                            )}
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                {isDarkMode ? 'Light mode' : 'Dark mode'}
                            </span>
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* Notifications */}
                                <button
                                    onClick={() => setShowNotificationModal(!showNotificationModal)}
                                    className="relative flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 hover:px-2 sm:hover:px-3 hover:py-1.5 sm:hover:py-2 hover:rounded-full hover:scale-105 transition-all duration-200 font-medium text-xs sm:text-sm"
                                    aria-label="Notifications"
                                >
                                    <Bell size={16} className="sm:w-[18px] sm:h-[18px] hover:scale-110 transition-transform duration-200" />
                                    <span className="hidden sm:inline">Notifications</span>
                                </button>

                                {/* Wishlist */}
                                <Link to="/wishlist" className="relative flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-blue-800 hover:bg-blue-50 hover:px-2 sm:hover:px-3 hover:py-1.5 sm:hover:py-2 hover:rounded-full hover:scale-105 transition-all duration-200 font-medium text-xs sm:text-sm">
                                    <Heart size={16} className="sm:w-[18px] sm:h-[18px] hover:scale-110 transition-transform duration-200" />
                                    <span className="hidden sm:inline">{t('wishlist')}</span>
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 left-3 text-[8px] text-white bg-red-500 size-3.5 rounded-full hover:bg-red-600 hover:scale-110 transition-all duration-200 flex items-center justify-center font-medium">{wishlistCount}</span>
                                    )}
                                </Link>

                                {/* User Menu */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 hover:rounded-full transition-all duration-200"
                                    >
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-colors duration-200">
                                            <User size={16} className="text-blue-600 dark:text-blue-400 transition-colors duration-200" />
                                        </div>
                                        <span className="hidden sm:block font-medium">{user.name}</span>
                                        <ChevronDown size={16} className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {showUserMenu && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 z-50 transition-colors duration-200">
                                            <div className="p-3 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                                <p className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{user.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{user.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <User size={16} />
                                                    {t('profile')}
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <ShoppingCart size={16} />
                                                    {t('orders')}
                                                </Link>
                                                <Link
                                                    to="/wishlist"
                                                    className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <Heart size={16} />
                                                    {t('wishlist')}
                                                </Link>
                                                <hr className="my-2 border-gray-200 dark:border-gray-700 transition-colors duration-200" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                                                >
                                                    <LogOut size={16} />
                                                    {t('logout')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 md:gap-3">
                                <Link
                                    to="/auth/login"
                                    className="relative px-4 md:px-5 py-2 md:py-2.5 hover:scale-105 active:scale-95 transition-all duration-300 text-white rounded-full font-semibold shadow-sm hover:shadow-md group overflow-hidden text-sm md:text-base flex items-center gap-2 whitespace-nowrap"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                                >
                                    <User size={18} className="md:w-5 md:h-5 group-hover:scale-110 transition-transform duration-300" />
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to="/auth"
                                    className="relative px-4 md:px-5 py-2 md:py-2.5 hover:scale-105 active:scale-95 transition-all duration-300 text-white rounded-full font-semibold shadow-sm hover:shadow-md group overflow-hidden text-sm md:text-base flex items-center gap-2 whitespace-nowrap"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                                >
                                    <span>Register</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: Search and Menu on right */}
                    <div className="flex sm:hidden items-center gap-2 sm:gap-3 flex-shrink-0">
                        {/* Mobile Category Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDropdownOpen(!isDropdownOpen);
                            }}
                            onTouchStart={(e) => {
                                e.stopPropagation();
                            }}
                            aria-label={`Select category, currently: ${selectedCategory}`}
                            aria-expanded={isDropdownOpen}
                            className="flex items-center gap-0.5 px-1.5 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 active:text-blue-800 dark:active:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded touch-manipulation min-h-[44px]"
                            type="button"
                        >
                            <span className="text-xs font-medium truncate max-w-[60px]">{selectedCategory.length > 8 ? selectedCategory.substring(0, 8) + '...' : selectedCategory}</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Mobile Language/Currency Button */}
                        <button
                            onClick={() => setShowLanguageModal(true)}
                            className="flex items-center gap-0.5 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 transition-colors p-1.5 touch-manipulation min-h-[44px]"
                            aria-label="Select language and currency"
                        >
                            <span className="text-xs font-medium">{language.substring(0, 2).toUpperCase()}</span>
                            <ChevronDown size={14} />
                        </button>

                        {/* Mobile Dark Mode Toggle */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleTheme();
                            }}
                            className="relative group flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 transition-colors touch-manipulation min-h-[44px]"
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            type="button"
                        >
                            {isDarkMode ? (
                                <Sun size={20} />
                            ) : (
                                <Moon size={20} />
                            )}
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                {isDarkMode ? 'Light mode' : 'Dark mode'}
                            </span>
                        </button>

                        {/* Mobile Search Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowMobileSearch(!showMobileSearch);
                            }}
                            onTouchStart={(e) => {
                                e.stopPropagation();
                            }}
                            aria-label="Open search"
                            aria-expanded={showMobileSearch}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 active:text-blue-800 dark:active:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded touch-manipulation min-h-[44px]"
                            type="button"
                        >
                            <Search size={20} aria-hidden="true" />
                        </button>

                        {/* Mobile Menu Button */}
                        {user ? (
                            <Link to="/profile" className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 transition-colors touch-manipulation">
                                <User size={20} />
                            </Link>
                        ) : (
                            <button
                                aria-label="Open menu"
                                onClick={() => setShowMobileAuth(!showMobileAuth)}
                                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 transition-colors touch-manipulation"
                            >
                                <Menu size={20} />
                            </button>
                        )}
                    </div>

                    {/* Mobile Backdrop */}
                    {(showMobileSearch || showMobileAuth) && (
                        <div
                            className="sm:hidden fixed inset-0 bg-black/50 dark:bg-black/70 z-[9998] transition-opacity duration-300"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowMobileSearch(false)
                                setShowMobileAuth(false)
                            }}
                            onTouchStart={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowMobileSearch(false)
                                setShowMobileAuth(false)
                            }}
                        />
                    )}

                    {/* Mobile Search Dropdown */}
                    {showMobileSearch && (
                        <div
                            className="sm:hidden fixed left-4 right-4 top-20 z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl dark:shadow-gray-900/50 p-4 transition-all duration-300 animate-in fade-in slide-in-from-top-2"
                            ref={mobileMenuRef}
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Search Products</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowMobileSearch(false)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                    aria-label="Close search"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch(e);
                                setShowMobileSearch(false);
                            }} className="flex items-center gap-2 mb-2">
                                <div className="flex-1 relative">
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                                    <input
                                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white pl-10 pr-3 py-2.5 transition-colors duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        type="search"
                                        placeholder={t('search')}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onFocus={(e) => e.stopPropagation()}
                                        autoFocus
                                        aria-label="Search products"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    aria-label="Submit search"
                                    className="px-4 py-2.5 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors touch-manipulation"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                                >
                                    {t('go')}
                                </button>
                            </form>
                            {suggestions.length > 0 && (
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-2 max-h-56 overflow-y-auto transition-colors duration-300">
                                    {suggestions.map(s => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => {
                                                setSearch(s.name)
                                                navigate(`/shop?search=${encodeURIComponent(s.name)}&category=${encodeURIComponent('All')}`)
                                                setShowMobileSearch(false)
                                            }}
                                            className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors duration-300"
                                        >
                                            <span className="block font-medium text-gray-800 dark:text-gray-200 truncate transition-colors duration-300">{s.name}</span>
                                            <span className="block text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{s.category}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Auth Menu Dropdown */}
                    {showMobileAuth && !user && (
                        <div className="sm:hidden fixed right-4 top-16 z-[101] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-40 py-2" ref={mobileMenuRef}>
                            <Link
                                to="/auth/login"
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => setShowMobileAuth(false)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/auth"
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => setShowMobileAuth(false)}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Dropdown Menu - Outside container so visible on both mobile and desktop */}
            {isDropdownOpen && (
                <>
                    {/* Backdrop - Always visible when dropdown is open */}
                    <div
                        className="fixed inset-0 bg-black/30 dark:bg-black/50 sm:bg-black/20 sm:dark:bg-black/40 z-[9997] sm:z-[9998]"
                        onClick={(e) => {
                            // Only close if clicking directly on backdrop, not if event came from dropdown
                            if (e.target === e.currentTarget) {
                                setIsDropdownOpen(false);
                            }
                        }}
                        onTouchStart={(e) => {
                            // Only close if touching directly on backdrop, not if event came from dropdown
                            if (e.target === e.currentTarget) {
                                setIsDropdownOpen(false);
                            }
                        }}
                    />
                    <div
                        ref={dropdownContainerRef}
                        data-dropdown-container
                        className="fixed sm:absolute top-[70px] sm:top-[calc(100%+0.5rem)] left-1/2 sm:left-auto sm:right-auto -translate-x-1/2 sm:translate-x-0 mt-0 sm:mt-0 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 flex flex-col sm:flex-row z-[9999] w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[min(800px,95vw)] max-w-[calc(100vw-2rem)] sm:max-w-[95vw] max-h-[calc(100vh-90px)] sm:max-h-[80vh] overflow-hidden"
                        style={{
                            ...(window.innerWidth >= 640 && dropdownRef.current ? {
                                left: `${dropdownRef.current.getBoundingClientRect().left}px`,
                                transform: 'none'
                            } : {})
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        onTouchStart={(e) => {
                            e.stopPropagation();
                        }}
                        onTouchEnd={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {/* Left Side - Top Categories */}
                        <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto max-h-[50vh] sm:max-h-none flex-shrink-0">
                            <div className="flex items-center justify-between mb-4 sm:mb-3 sticky top-0 bg-white dark:bg-gray-800 pb-2 z-10">
                                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wide transition-colors duration-300">Top Categories</h4>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsDropdownOpen(false);
                                    }}
                                    className="sm:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    aria-label="Close categories"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <ul className="space-y-2 sm:space-y-1">
                                {topCategories.map((category, idx) => (
                                    <li key={idx}>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // Prevent event from bubbling to backdrop
                                                if (e.target === e.currentTarget || e.currentTarget.contains(e.target)) {
                                                    if (categorySubmenus[category]) {
                                                        setHoveredCategory(category);
                                                        // Keep dropdown open when category has subcategories
                                                    } else {
                                                        handleCategorySelect(category);
                                                        setIsDropdownOpen(false);
                                                    }
                                                }
                                            }}
                                            onMouseEnter={() => {
                                                if (window.innerWidth >= 640) {
                                                    setHoveredCategory(category);
                                                }
                                            }}
                                            onTouchStart={(e) => {
                                                e.stopPropagation();
                                                // Set hovered category immediately on touch start for better UX
                                                if (categorySubmenus[category]) {
                                                    setHoveredCategory(category);
                                                }
                                            }}
                                            onTouchEnd={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // Prevent event from bubbling to backdrop
                                                if (categorySubmenus[category]) {
                                                    setHoveredCategory(category);
                                                    // Keep dropdown open when category has subcategories
                                                } else {
                                                    handleCategorySelect(category);
                                                    setIsDropdownOpen(false);
                                                }
                                            }}
                                            className={`text-left w-full px-4 py-3.5 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between group touch-manipulation min-h-[48px] sm:min-h-[44px] border border-transparent ${category === selectedCategory
                                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold border-blue-300 dark:border-blue-600'
                                                    : hoveredCategory === category
                                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 border-gray-200 dark:border-gray-600'
                                                }`}
                                        >
                                            <span className="text-base sm:text-sm font-semibold">{category}</span>
                                            {categorySubmenus[category] && (
                                                <ChevronDown size={18} className="sm:w-3.5 sm:h-3.5 rotate-[-90deg] sm:rotate-0 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0 text-gray-600 dark:text-gray-400" />
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Side - Subcategories (shown on hover/click) */}
                        <div className="flex-1 p-4 min-h-[200px] sm:min-h-[300px] md:min-h-[400px] overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-none">
                            {hoveredCategory && categorySubmenus[hoveredCategory] ? (
                                <div>
                                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-gray-800 pb-2 z-10">
                                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-sm uppercase tracking-wide transition-colors duration-300">
                                            {hoveredCategory}
                                        </h4>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setHoveredCategory(null);
                                            }}
                                            className="sm:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                                            aria-label="Back to categories"
                                        >
                                            ← Back
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4 md:gap-6">
                                        {categorySubmenus[hoveredCategory].map((section, idx) => (
                                            <div key={idx} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-2">
                                                <h5 className="font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-2 text-base sm:text-sm transition-colors duration-300">
                                                    {section.title}
                                                </h5>
                                                <ul className="space-y-2 sm:space-y-1">
                                                    {section.items.map((item, i) => (
                                                        <li key={i}>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleCategorySelect(item);
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                                onTouchStart={(e) => e.stopPropagation()}
                                                                className="text-left w-full text-sm sm:text-xs py-2.5 sm:py-1.5 px-2 transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 active:text-blue-600 dark:active:text-blue-400 touch-manipulation min-h-[44px] sm:min-h-0 rounded-md hover:bg-white dark:hover:bg-gray-600/50 active:bg-blue-50 dark:active:bg-blue-900/20 font-medium"
                                                            >
                                                                {item}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400 dark:text-gray-500 px-4 text-center">
                                    <div className="mb-4">
                                        <ChevronDown size={32} className="mx-auto text-gray-300 dark:text-gray-600 animate-bounce" />
                                    </div>
                                    <p className="text-base sm:text-sm font-medium mb-1">Select a category</p>
                                    <p className="text-sm sm:text-xs">Tap a category from the left to see subcategories</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            <hr className="border-gray-300" />

            {/* Language and Currency Modal */}
            {showLanguageModal && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-[9998]"
                        onClick={() => setShowLanguageModal(false)}
                    />

                    {/* Modal */}
                    <div
                        ref={languageModalRef}
                        className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-md w-full p-6 sm:p-8 relative transition-colors duration-200">
                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setShowLanguageModal(false)}
                                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 pr-8 transition-colors duration-200">{t('setLanguageCurrency')}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm transition-colors duration-200">
                                {t('selectPreferred')}
                            </p>

                            {/* Language Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">{t('language')}</label>
                                <div className="relative" ref={languageDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                                            setIsCurrencyDropdownOpen(false)
                                        }}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-left flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    >
                                        <span className="text-gray-900 dark:text-white transition-colors duration-200">{selectedLanguage}</span>
                                        <ChevronDown
                                            size={20}
                                            className={`text-gray-500 dark:text-gray-400 transition-all duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {isLanguageDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 z-50 max-h-60 overflow-y-auto transition-colors duration-200">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedLanguage(lang)
                                                        setIsLanguageDropdownOpen(false)
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedLanguage === lang ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                                        }`}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Currency Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">{t('currency')}</label>
                                <div className="relative" ref={currencyDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)
                                            setIsLanguageDropdownOpen(false)
                                        }}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-left flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    >
                                        <span className="text-gray-900 dark:text-white transition-colors duration-200">{selectedCurrency}</span>
                                        <ChevronDown
                                            size={20}
                                            className={`text-gray-500 dark:text-gray-400 transition-all duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {isCurrencyDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 z-50 max-h-60 overflow-y-auto transition-colors duration-200">
                                            {currencies.map((curr) => (
                                                <button
                                                    key={curr}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCurrency(curr)
                                                        setIsCurrencyDropdownOpen(false)
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedCurrency === curr ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                                        }`}
                                                >
                                                    {curr}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSaveLanguage}
                                className="w-full text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                                style={{ backgroundColor: '#3977ED' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5fcc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3977ED'}
                            >
                                {t('save')}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Notification Modal */}
            {showNotificationModal && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[9998] transition-colors duration-200"
                        onClick={() => setShowNotificationModal(false)}
                    />

                    {/* Modal */}
                    <div
                        ref={notificationModalRef}
                        className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-md w-full p-6 sm:p-8 relative transition-colors duration-200">
                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setShowNotificationModal(false)}
                                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                                aria-label="Close notifications"
                            >
                                <X size={24} />
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <Bell size={24} className="text-blue-600 dark:text-blue-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">Notifications</h2>
                            </div>

                            {/* Empty State */}
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 transition-colors duration-200">
                                    <Bell size={32} className="text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">No notifications yet</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm transition-colors duration-200">
                                    When you have new notifications, they'll appear here.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    )
}

export default Navbar