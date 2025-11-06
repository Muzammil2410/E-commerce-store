'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import PictureBoxes from "@/components/PictureBoxes";
import SportsSection from "@/components/SportsSection";
import ShopByCategory from "@/components/ShopByCategory";

export default function Home() {
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
