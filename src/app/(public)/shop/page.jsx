'use client'
import React, { Suspense, useState, useEffect, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon, Filter, SlidersHorizontal, X } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"

function ShopContent() {
    const [searchParams] = useSearchParams()
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const showFiltersParam = searchParams.get('showFilters')
    const navigate = useNavigate()
    const [showFilters, setShowFilters] = useState(showFiltersParam === 'true')
    const [sortBy, setSortBy] = useState('name')
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
    const [selectedCategories, setSelectedCategories] = useState([])

    const products = useSelector(state => state.product.list)

    // Get unique categories - memoized for performance
    const categories = useMemo(() => {
        if (!products || products.length === 0) return ['All']
        const uniqueCategories = new Set(products.map(product => product.category).filter(Boolean))
        return ['All', ...Array.from(uniqueCategories).sort()]
    }, [products])

    // Filter and sort products - memoized for performance
    const filteredProducts = useMemo(() => {
        if (!products || products.length === 0) return []

        return products.filter(product => {
            const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase())
            const matchesCategory = !category || category === 'All' || product.category === category
            const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
            const matchesSelectedCategories = selectedCategories.length === 0 || selectedCategories.includes(product.category)

            return matchesSearch && matchesCategory && matchesPrice && matchesSelectedCategories
        }).sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price
                case 'price-high':
                    return b.price - a.price
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'rating':
                    const aRating = a.rating && a.rating.length > 0
                        ? a.rating.reduce((acc, curr) => acc + curr.rating, 0) / a.rating.length
                        : 0
                    const bRating = b.rating && b.rating.length > 0
                        ? b.rating.reduce((acc, curr) => acc + curr.rating, 0) / b.rating.length
                        : 0
                    return bRating - aRating
                default:
                    return 0
            }
        })
    }, [products, search, category, priceRange, selectedCategories, sortBy])

    const handleCategoryToggle = (cat) => {
        if (cat === 'All') {
            setSelectedCategories([])
        } else {
            setSelectedCategories(prev =>
                prev.includes(cat)
                    ? prev.filter(c => c !== cat)
                    : [...prev, cat]
            )
        }
    }

    // Update selected categories when category URL parameter changes
    useEffect(() => {
        if (category && category !== 'All') {
            setSelectedCategories([category])
        } else {
            setSelectedCategories([])
        }
    }, [category])

    // Open filters when showFilters param is true
    useEffect(() => {
        if (showFiltersParam === 'true') {
            setShowFilters(true)
            // Remove the query parameter after opening filters
            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.delete('showFilters')
            const newUrl = newSearchParams.toString()
                ? `/shop?${newSearchParams.toString()}`
                : '/shop'
            navigate(newUrl, { replace: true })
        }
    }, [showFiltersParam, searchParams, navigate])

    const clearFilters = () => {
        setSortBy('name')
        setPriceRange({ min: 0, max: 1000 })
        setSelectedCategories([])
        // Clear URL parameters
        navigate('/shop')
    }

    return (
        <div className="min-h-[70vh] mx-0 sm:mx-2 md:mx-3 lg:mx-4 xl:mx-6">
            <div className="max-w-full sm:max-w-[95%] xl:max-w-[98%] mx-auto px-2 sm:px-3 md:px-4 lg:px-0">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between my-3 sm:my-4 md:my-5 lg:my-6 gap-3 sm:gap-4 px-1 sm:px-0">
                    <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-500 dark:text-gray-400 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 transition-colors duration-200">
                        <span className="truncate">
                            {search ? `Search Results for "${search}"` : 'All'}
                            <span className="text-slate-700 dark:text-gray-200 font-medium transition-colors duration-200"> Products</span>
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap transition-colors duration-200">({filteredProducts.length} items)</span>
                    </h1>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full sm:w-auto min-w-[160px] px-3 sm:px-4 py-2.5 sm:py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm sm:text-base appearance-none cursor-pointer touch-manipulation"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '12px',
                                paddingRight: '2.5rem'
                            }}
                        >
                            <option value="name" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2">Sort by Name</option>
                            <option value="price-low" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2">Price: Low to High</option>
                            <option value="price-high" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2">Price: High to Low</option>
                            <option value="rating" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2">Highest Rated</option>
                        </select>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-100 dark:active:bg-gray-500 transition-colors text-sm sm:text-base touch-manipulation"
                        >
                            <SlidersHorizontal size={18} className="flex-shrink-0" />
                            <span className="hidden sm:inline">Filters</span>
                            <span className="sm:hidden">Filters</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <div className="w-full lg:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 h-fit order-2 lg:order-1 transition-colors duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">Categories</h4>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <label key={cat} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    cat === 'All'
                                                        ? selectedCategories.length === 0
                                                        : selectedCategories.includes(cat)
                                                }
                                                onChange={() => handleCategoryToggle(cat)}
                                                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 transition-colors duration-200"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">Price Range</h4>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                        ${priceRange.min} - ${priceRange.max}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="flex-1 order-1 lg:order-2">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 mx-auto mb-20 sm:mb-24 md:mb-32">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} hideDiscount={true} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 dark:text-gray-600 mb-4 transition-colors duration-200">
                                    <Filter size={48} className="mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">
                                    {category ? `No products found in "${category}" category` : 'No products found'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
                                    {category
                                        ? `We don't have any products in the "${category}" category yet. Try browsing other categories.`
                                        : 'Try adjusting your search or filter criteria.'
                                    }
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={clearFilters}
                                        className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                                    >
                                        Clear Filters
                                    </button>
                                    <button
                                        onClick={() => navigate('/shop')}
                                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        View All Products
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default function Shop() {
    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}