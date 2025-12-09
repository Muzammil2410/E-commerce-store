'use client'
import { useEffect } from 'react'
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
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }, [])

    return (
        <div>
            <Hero />
            <LatestProducts />
            <PictureBoxes />
            <BestSelling />
            <SportsSection />
            <ShopByCategory />
            <OurSpecs />
            <Testimonials />
        </div>
    );
}
