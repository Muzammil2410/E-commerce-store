'use client'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginRedirect() {
    const navigate = useNavigate()

    useEffect(() => {
        // Redirect to the new auth login page
        navigate('/auth/login', { replace: true })
    }, [navigate])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to login...</p>
            </div>
        </div>
    )
}
