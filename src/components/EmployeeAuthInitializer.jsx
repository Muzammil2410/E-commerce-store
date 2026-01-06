'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '@/lib/features/employees/employeesSlice'

export default function EmployeeAuthInitializer() {
    const dispatch = useDispatch()
    
    useEffect(() => {
        // Initialize current user from localStorage
        const userData = localStorage.getItem('employeeUser')
        if (userData) {
            try {
                const user = JSON.parse(userData)
                dispatch(setCurrentUser(user))
            } catch (error) {
                console.error('Error parsing user data:', error)
                localStorage.removeItem('employeeUser')
            }
        }
    }, [dispatch])
    
    return null
}

