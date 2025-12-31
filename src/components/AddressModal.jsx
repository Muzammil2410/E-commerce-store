'use client'
import React, { useState, useEffect, useRef } from "react"
import { XIcon } from "lucide-react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addAddress } from "@/lib/features/address/addressSlice"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const AddressModal = ({ setShowAddressModal, onAddressAdded }) => {

    const dispatch = useDispatch()

    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
    })

    const phoneInputRef = useRef(null)

    // Apply dark mode styles to PhoneInput select dropdown
    useEffect(() => {
        const applyDarkModeStyles = () => {
            const isDarkMode = document.documentElement.classList.contains('dark')
            if (!isDarkMode) return

            // Find all PhoneInputCountrySelect elements
            const selects = document.querySelectorAll('select.PhoneInputCountrySelect')
            selects.forEach(select => {
                // Apply inline styles to the select element
                select.style.backgroundColor = '#374151'
                select.style.color = 'white'
                select.style.borderColor = '#4b5563'
                
                // Apply styles to all options
                const options = select.querySelectorAll('option')
                options.forEach(option => {
                    option.style.backgroundColor = '#374151'
                    option.style.color = 'white'
                })
            })
        }

        // Apply immediately
        applyDarkModeStyles()

        // Watch for DOM changes (when PhoneInput renders)
        const observer = new MutationObserver(() => {
            applyDarkModeStyles()
        })

        // Observe the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        })

        // Also apply on any click (when dropdown opens)
        const handleClick = () => {
            setTimeout(applyDarkModeStyles, 10)
        }
        document.addEventListener('click', handleClick)

        return () => {
            observer.disconnect()
            document.removeEventListener('click', handleClick)
        }
    }, [])

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newAddress = {
            id: 'addr_' + Date.now(),
            ...address,
            createdAt: new Date().toISOString()
        }

        dispatch(addAddress(newAddress))
        toast.success('Address added successfully')
        
        if (onAddressAdded) {
            onAddressAdded(newAddress)
        }

        setShowAddressModal(false)
    }

    return (
        <form onSubmit={e => toast.promise(handleSubmit(e), { loading: 'Adding Address...' })} className="fixed inset-0 z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur h-screen flex items-center justify-center transition-colors duration-200 dark">
            <div className="flex flex-col gap-5 text-slate-700 dark:text-gray-200 w-full max-w-sm mx-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/50 p-6 border border-slate-200 dark:border-gray-700 transition-colors duration-200">
                <h2 className="text-3xl text-slate-800 dark:text-gray-100">Add New <span className="font-semibold">Address</span></h2>
                <input name="name" onChange={handleAddressChange} value={address.name} className="p-2 px-4 outline-none border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 rounded w-full transition-colors duration-200" type="text" placeholder="Enter your name" required />
                <input name="email" onChange={handleAddressChange} value={address.email} className="p-2 px-4 outline-none border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 rounded w-full transition-colors duration-200" type="email" placeholder="Email address" required />
                <input name="street" onChange={handleAddressChange} value={address.street} className="p-2 px-4 outline-none border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 rounded w-full transition-colors duration-200" type="text" placeholder="Street" required />
                <div className="flex gap-4">
                    <input name="city" onChange={handleAddressChange} value={address.city} className="p-2 px-4 outline-none border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 rounded w-full transition-colors duration-200" type="text" placeholder="City" required />
                    <input name="state" onChange={handleAddressChange} value={address.state} className="p-2 px-4 outline-none border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 rounded w-full transition-colors duration-200" type="text" placeholder="State" required />
                </div>
                <div className="flex gap-4">
                    <input name="zip" onChange={handleAddressChange} value={address.zip} className="p-2 px-4 outline-none border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 rounded w-full transition-colors duration-200" type="text" placeholder="Zip code" required />
                    <input name="country" onChange={handleAddressChange} value={address.country} className="p-2 px-4 outline-none border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 rounded w-full transition-colors duration-200" type="text" placeholder="Country" required />
                </div>
                <div className="phone-input">
                    <PhoneInput
                        value={address.phone}
                        onChange={(value) => setAddress({...address, phone: value})}
                        defaultCountry="PK"
                        international
                        countryCallingCodeEditable={false}
                        placeholder="Enter your phone number"
                        className="phone-input"
                        style={{
                            '--PhoneInput-color--focus': '#60a5fa',
                            '--PhoneInputCountrySelect-marginRight': '0.5rem',
                        }}
                    />
                </div>
                <button className="bg-slate-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-slate-900 active:scale-95 transition-all">SAVE ADDRESS</button>
            </div>
            <XIcon size={30} className="absolute top-5 right-5 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200" onClick={() => setShowAddressModal(false)} />
        </form>
    )
}

export default AddressModal