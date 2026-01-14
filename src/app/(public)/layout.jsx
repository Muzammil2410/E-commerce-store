'use client'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoriesMarquee from "@/components/CategoriesMarquee";
import ScrollToTop from "@/components/ScrollToTop";

export default function PublicLayout({ children }) {
    const { pathname } = useLocation()
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user')
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    // Check if current path is an auth page
    const isAuthPage = pathname.startsWith('/auth/')
    
    // Check if current path is home page
    const isHomePage = pathname === '/'
    
    // Check if current path is seller dashboard (but not the main seller page)
    const isSellerPage = pathname.startsWith('/seller/')
    
    // Check if current path is the main seller choice page
    const isSellerChoicePage = pathname === '/seller'

    // Check if current path is profile page
    const isProfilePage = pathname === '/profile'

    // Check if current path is employee page
    const isEmployeePage = pathname.startsWith('/employee/')

    // Check if current path is admin page
    const isAdminPage = pathname.startsWith('/admin/')

    // Check if user is logged in (check localStorage directly to avoid first render issue)
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const isUserLoggedIn = userData !== null

    // For auth pages, seller dashboard pages, employee pages, and admin pages (including login), show ONLY the content (no navbar, banner, footer, or categories)
    if (isAuthPage || isSellerPage || isEmployeePage || isAdminPage) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                <ScrollToTop />
                {children}
            </div>
        )
    }

    // If user is logged in and NOT on home page, auth page, or profile page, don't show navbar/header/banner
    if (isUserLoggedIn && !isAuthPage && !isHomePage && !isProfilePage) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                <ScrollToTop />
                {children}
            </div>
        )
    }

    // For seller choice page, show header and navbar but NO footer
    if (isSellerChoicePage) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                <ScrollToTop />
                <Banner />
                <Navbar />
                <CategoriesMarquee />
                {children}
            </div>
        )
    }

    // For non-logged in users and home page, show full layout
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <ScrollToTop />
            <Banner />
            <Navbar />
            <CategoriesMarquee />
            {children}
            <Footer />
        </div>
    );
}
