'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "@/components/Image"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useContext } from "react"
import { LanguageCurrencyContext } from "@/contexts/LanguageCurrencyContext"

const ProductDescription = ({ product }) => {
    const context = useContext(LanguageCurrencyContext)
    const t = context?.t || ((key) => key)
    
    const [selectedTab, setSelectedTab] = useState('productDescriptionTab')

    return (
        <div className="my-18 text-sm text-slate-600 dark:text-gray-300 transition-colors duration-200">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-gray-700 mb-6 max-w-2xl transition-colors duration-200">
                {['productDescriptionTab', 'reviews'].map((tabKey) => (
                    <button 
                        className={`${tabKey === selectedTab ? 'border-b-[1.5px] font-semibold text-slate-600 dark:text-gray-200' : 'text-slate-400 dark:text-gray-500'} px-3 py-2 font-medium transition-colors duration-200`} 
                        key={tabKey} 
                        onClick={() => setSelectedTab(tabKey)}
                    >
                        {t(tabKey)}
                    </button>
                ))}
            </div>

            {/* Description */}
            {selectedTab === 'productDescriptionTab' && (
                <p className="max-w-xl dark:text-gray-300 transition-colors duration-200">{product.description}</p>
            )}

            {/* Reviews */}
            {selectedTab === 'reviews' && (
                <div className="flex flex-col gap-3 mt-14">
                    {product.rating.map((item,index) => (
                        <div key={index} className="flex gap-5 mb-10">
                            <Image src={item.user.image} alt="" className="size-10 rounded-full" width={100} height={100} />
                            <div>
                                <div className="flex items-center" >
                                    {Array(5).fill('').map((_, index) => (
                                        <StarIcon key={index} size={18} className='text-transparent mt-0.5' fill={item.rating >= index + 1 ? "#FCD34D" : "#D1D5DB"} />
                                    ))}
                                </div>
                                <p className="text-sm max-w-lg my-4 dark:text-gray-300 transition-colors duration-200">{item.review}</p>
                                <p className="font-medium text-slate-800 dark:text-gray-200 transition-colors duration-200">{item.user.name}</p>
                                <p className="mt-3 font-light dark:text-gray-400 transition-colors duration-200">{new Date(item.createdAt).toDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Store Page */}
            <div className="flex gap-3 mt-14">
                <Image src={product.store.logo} alt="" className="size-11 rounded-full ring ring-slate-400" width={100} height={100} />
                <div>
                    <p className="font-medium text-slate-600 dark:text-gray-300 transition-colors duration-200">{t('productBy')} {product.store.name}</p>
                    <Link to={`/shop/${product.store.username}`} className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"> {t('viewStoreLink')} <ArrowRight size={14} /></Link>
                </div>
            </div>
        </div>
    )
}

export default ProductDescription