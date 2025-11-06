'use client'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
	const { pathname } = useLocation()

	useEffect(() => {
		try {
			window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
		} catch (_) {
			window.scrollTo(0, 0)
		}
	}, [pathname])

	return null
}

export default ScrollToTop


