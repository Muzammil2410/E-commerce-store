'use client'
import React, { Suspense, useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon, Filter, SlidersHorizontal, X } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"

function ShopContent() {
    const [searchParams] = useSearchParams()
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const navigate = useNavigate()
    const [showFilters, setShowFilters] = useState(false)
    const [sortBy, setSortBy] = useState('name')
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
    const [selectedCategories, setSelectedCategories] = useState([])

    const products = useSelector(state => state.product.list)

    // Get unique categories
    const categories = ['All', ...new Set(products.map(product => product.category))]

    // Filter and sort products
    const filteredProducts = products.filter(product => {
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
                const aRating = a.rating.reduce((acc, curr) => acc + curr.rating, 0) / a.rating.length
                const bRating = b.rating.reduce((acc, curr) => acc + curr.rating, 0) / b.rating.length
                return bRating - aRating
            default:
                return 0
        }
    })

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

    const clearFilters = () => {
        setSortBy('name')
        setPriceRange({ min: 0, max: 1000 })
        setSelectedCategories([])
        // Clear URL parameters
        navigate('/shop')
    }

    return (
        <div className="min-h-[70vh] mx-3 sm:mx-6">
            <div className="max-w-[95%] xl:max-w-[98%] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between my-6 gap-4">
                    <h1 className="text-xl sm:text-2xl text-slate-500 dark:text-gray-400 flex items-center gap-2 transition-colors duration-200">
                        <span className="truncate">
                            {search ? `Search Results for "${search}"` : 'All'} 
                            <span className="text-slate-700 dark:text-gray-200 font-medium transition-colors duration-200"> Products</span>
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap transition-colors duration-200">({filteredProducts.length} items)</span>
                    </h1>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm transition-colors duration-200"
                        >
                            <option value="name" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Sort by Name</option>
                            <option value="price-low" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Price: Low to High</option>
                            <option value="price-high" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Price: High to Low</option>
                            <option value="rating" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Highest Rated</option>
                        </select>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
                        >
                            <SlidersHorizontal size={18} />
                            <span className="hidden sm:inline">Filters</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <div className="w-full lg:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 lg:p-6 h-fit order-2 lg:order-1 transition-colors duration-200">
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-7 mx-auto mb-32">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
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