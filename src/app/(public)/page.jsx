'use client'
import React, { useEffect } from 'react'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import PictureBoxes from "@/components/PictureBoxes";
import SportsSection from "@/components/SportsSection";
import ShopByCategory from "@/components/ShopByCategory";

export default function Home() {
    // Scroll to top on page load/refresh
    useEffect(() => {
        // Immediately scroll to top
        window.scrollTo(0, 0);
        // Also use scrollTo with options as fallback
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

        // Handle browser scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Additional scroll after a small delay to ensure it works
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);

        return () => clearTimeout(timer);
    }, [])

    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
            <Hero />
            <LatestProducts />
            <PictureBoxes />
            <BestSelling />
            <SportsSection />
            <ShopByCategory />
            <OurSpecs />
            <Testimonials />

            {/* AI Assistant Icon */}
            <div
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer z-50"
                title="AI Assistant"
            >
                <span className="text-xl sm:text-2xl">✨</span>
            </div>
        </div>
    );
}
