'use client'
import { Link } from "react-router-dom"

const AdminNavbar = () => {


    return (
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-2 sm:py-3 border-b border-gray-200 transition-all">
            <Link to="/" className="relative text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
                <span className="text-blue-600">Ziz</span>la<span className="text-blue-600 text-4xl sm:text-5xl leading-0">.</span>
                <p className="absolute text-[10px] sm:text-xs font-semibold -top-1 -right-10 sm:-right-13 px-2 sm:px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-blue-600">
                    Admin
                </p>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                <p>Hi, Admin</p>
            </div>
        </div>
    )
}

export default AdminNavbar