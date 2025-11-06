'use client'

import Loading from "@/components/Loading"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function LoadingPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const url = params.get('nextUrl')

        if (url) {
            setTimeout(() => {
                navigate(url)
            }, 8000)
        }
    }, [navigate])

    return <Loading />
}
