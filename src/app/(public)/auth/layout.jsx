'use client'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthLayout({ children }) {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Check if user is already logged in
        const userData = localStorage.getItem('user')
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    // If user is logged in, redirect to profile
    useEffect(() => {
        if (user) {
            navigate('/profile')
        }
    }, [user, router])

    // Show loading while checking authentication
    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Redirecting...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {children}
        </div>
    )
}
