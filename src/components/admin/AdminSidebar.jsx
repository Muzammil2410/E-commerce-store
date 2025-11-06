'use client'

import { useLocation } from "react-router-dom"
import { HomeIcon, ShieldCheckIcon, StoreIcon, TicketPercentIcon } from "lucide-react"
import Image from "@/components/Image"
import { Link } from "react-router-dom"
import { assets } from "@/assets/assets"

const AdminSidebar = () => {

    const { pathname } = useLocation()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Stores', href: '/admin/stores', icon: StoreIcon },
        { name: 'Approve Store', href: '/admin/approve', icon: ShieldCheckIcon },
        { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon  },
    ]

    return (
        <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 w-14 sm:w-60 flex-shrink-0">
            <div className="flex flex-col gap-3 justify-center items-center pt-6 sm:pt-8 max-sm:hidden">
                <Image className="w-12 h-12 sm:w-14 sm:h-14 rounded-full" src={assets.gs_logo} alt="" width={80} height={80} />
                <p className="text-slate-700">Hi, GreatStack</p>
            </div>

            <div className="mt-3 sm:mt-6">
                {
                    sidebarLinks.map((link, index) => (
                        <Link key={index} to={link.href} className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-2 sm:p-2.5 transition ${pathname === link.href && 'bg-slate-100 sm:text-slate-600'}`}>
                            <link.icon size={18} className="mx-auto sm:ml-5" />
                            <p className="hidden sm:block">{link.name}</p>
                            {pathname === link.href && <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>}
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default AdminSidebar