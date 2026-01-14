'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Package, MapPin, Phone, User, Camera, PenTool, CheckCircle, X, AlertCircle, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function EmployeeDeliveries() {
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.employees)
    
    const [deliveries, setDeliveries] = useState([])
    const [selectedDelivery, setSelectedDelivery] = useState(null)
    const [showDeliveryModal, setShowDeliveryModal] = useState(false)
    const [showProofModal, setShowProofModal] = useState(false)
    const [deliverySignature, setDeliverySignature] = useState(null)
    const [deliveryPhoto, setDeliveryPhoto] = useState(null)
    const [deliveryNotes, setDeliveryNotes] = useState('')
    const signatureCanvasRef = useRef(null)
    
    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('employeeUser')
        if (!userData) {
            navigate('/employee/login')
            return
        }
        
        // Set current user from localStorage if not in Redux
        if (!currentUser) {
            try {
                const user = JSON.parse(userData)
                if (user.role !== 'employee' && user.role !== 'admin') {
                    navigate('/employee/login')
                }
            } catch (error) {
                navigate('/employee/login')
            }
        }
    }, [navigate, currentUser])
    
    useEffect(() => {
        if (!currentUser) return
        loadDeliveries()
    }, [currentUser])
    
    useEffect(() => {
        if (!signatureCanvasRef.current || !showProofModal) return
        
        const canvas = signatureCanvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        
        let isDrawing = false
        let lastX = 0
        let lastY = 0
        
        const getCoordinates = (e) => {
            const rect = canvas.getBoundingClientRect()
            if (e.touches) {
                return {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                }
            }
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        }
        
        const startDraw = (e) => {
            e.preventDefault()
            isDrawing = true
            const coords = getCoordinates(e)
            lastX = coords.x
            lastY = coords.y
        }
        
        const draw = (e) => {
            if (!isDrawing) return
            e.preventDefault()
            const coords = getCoordinates(e)
            ctx.beginPath()
            ctx.moveTo(lastX, lastY)
            ctx.lineTo(coords.x, coords.y)
            ctx.stroke()
            lastX = coords.x
            lastY = coords.y
            setDeliverySignature(canvas.toDataURL())
        }
        
        const stopDraw = (e) => {
            if (isDrawing) {
                isDrawing = false
                setDeliverySignature(canvas.toDataURL())
            }
        }
        
        canvas.addEventListener('mousedown', startDraw)
        canvas.addEventListener('mousemove', draw)
        canvas.addEventListener('mouseup', stopDraw)
        canvas.addEventListener('mouseout', stopDraw)
        canvas.addEventListener('touchstart', startDraw)
        canvas.addEventListener('touchmove', draw)
        canvas.addEventListener('touchend', stopDraw)
        
        return () => {
            canvas.removeEventListener('mousedown', startDraw)
            canvas.removeEventListener('mousemove', draw)
            canvas.removeEventListener('mouseup', stopDraw)
            canvas.removeEventListener('mouseout', stopDraw)
            canvas.removeEventListener('touchstart', startDraw)
            canvas.removeEventListener('touchmove', draw)
            canvas.removeEventListener('touchend', stopDraw)
        }
    }, [showProofModal])
    
    const loadDeliveries = () => {
        if (!currentUser) return
        
        // Load deliveries from localStorage or create sample data
        const storedDeliveries = localStorage.getItem(`deliveries_${currentUser.id}`)
        if (storedDeliveries) {
            setDeliveries(JSON.parse(storedDeliveries))
        } else {
            // Sample deliveries for demo
            const sampleDeliveries = [
                {
                    id: 'DEL-001',
                    orderId: 'ORD-12345',
                    employeeId: currentUser.id,
                    customerName: 'John Smith',
                    customerPhone: '+1 234-567-8900',
                    deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
                    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    deliveryTime: '10:00 AM - 12:00 PM',
                    status: 'pending',
                    specialInstructions: 'Please ring doorbell twice. Leave package at door if no answer.',
                    orderDetails: {
                        items: ['Product A x2', 'Product B x1'],
                        total: '$149.99'
                    },
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'DEL-002',
                    orderId: 'ORD-12346',
                    employeeId: currentUser.id,
                    customerName: 'Sarah Johnson',
                    customerPhone: '+1 234-567-8901',
                    deliveryAddress: '456 Oak Avenue, Suite 200, Los Angeles, CA 90001',
                    deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    deliveryTime: '2:00 PM - 4:00 PM',
                    status: 'pending',
                    specialInstructions: 'Fragile items. Handle with care.',
                    orderDetails: {
                        items: ['Product C x1', 'Product D x3'],
                        total: '$299.99'
                    },
                    createdAt: new Date().toISOString()
                }
            ]
            setDeliveries(sampleDeliveries)
            localStorage.setItem(`deliveries_${currentUser.id}`, JSON.stringify(sampleDeliveries))
        }
    }
    
    const handleDeliveryStatusUpdate = (deliveryId, newStatus) => {
        const updatedDeliveries = deliveries.map(del => 
            del.id === deliveryId ? { ...del, status: newStatus, updatedAt: new Date().toISOString() } : del
        )
        setDeliveries(updatedDeliveries)
        localStorage.setItem(`deliveries_${currentUser.id}`, JSON.stringify(updatedDeliveries))
        toast.success(`Delivery status updated to ${newStatus}`)
        
        // Sync with admin/client (in real app, this would be an API call)
        const allDeliveries = JSON.parse(localStorage.getItem('allDeliveries') || '[]')
        const updatedAllDeliveries = allDeliveries.map(del => 
            del.id === deliveryId ? { ...del, status: newStatus, updatedAt: new Date().toISOString() } : del
        )
        localStorage.setItem('allDeliveries', JSON.stringify(updatedAllDeliveries))
    }
    
    const handleProofOfDelivery = (deliveryId) => {
        if (!deliverySignature && !deliveryPhoto && !deliveryNotes.trim()) {
            toast.error('Please provide at least one proof of delivery (signature, photo, or notes)')
            return
        }
        
        const updatedDeliveries = deliveries.map(del => 
            del.id === deliveryId ? {
                ...del,
                status: 'delivered',
                proofOfDelivery: {
                    signature: deliverySignature,
                    photo: deliveryPhoto,
                    notes: deliveryNotes,
                    deliveredAt: new Date().toISOString(),
                    deliveredBy: currentUser.id
                },
                updatedAt: new Date().toISOString()
            } : del
        )
        setDeliveries(updatedDeliveries)
        localStorage.setItem(`deliveries_${currentUser.id}`, JSON.stringify(updatedDeliveries))
        
        // Sync with admin/client
        const allDeliveries = JSON.parse(localStorage.getItem('allDeliveries') || '[]')
        const updatedAllDeliveries = allDeliveries.map(del => 
            del.id === deliveryId ? {
                ...del,
                status: 'delivered',
                proofOfDelivery: {
                    signature: deliverySignature,
                    photo: deliveryPhoto,
                    notes: deliveryNotes,
                    deliveredAt: new Date().toISOString(),
                    deliveredBy: currentUser.id
                },
                updatedAt: new Date().toISOString()
            } : del
        )
        localStorage.setItem('allDeliveries', JSON.stringify(updatedAllDeliveries))
        
        toast.success('Proof of delivery submitted successfully!')
        setShowProofModal(false)
        setShowDeliveryModal(false)
        setDeliverySignature(null)
        setDeliveryPhoto(null)
        setDeliveryNotes('')
    }
    
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setDeliveryPhoto(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }
    
    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }
    
    const activeDeliveries = deliveries.filter(d => d.status !== 'delivered')
    const pendingDeliveries = deliveries.filter(d => d.status === 'pending')
    const outForDelivery = deliveries.filter(d => d.status === 'out-for-delivery')
    const delivered = deliveries.filter(d => d.status === 'delivered')
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <button
                        onClick={() => navigate('/employee/dashboard')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                My Deliveries
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                                Manage your assigned deliveries
                            </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="text-center sm:text-right">
                                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{activeDeliveries.length}</p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pending</p>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{pendingDeliveries.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Out for Delivery</p>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{outForDelivery.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Delivered</p>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{delivered.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</p>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{deliveries.length}</p>
                    </div>
                </div>
                
                {/* Deliveries List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Assigned Deliveries
                        </h2>
                    </div>
                    
                    {deliveries.length === 0 ? (
                        <div className="text-center py-12 sm:py-16">
                            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">No deliveries assigned</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {deliveries.map(delivery => (
                                <div
                                    key={delivery.id}
                                    className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex flex-col gap-4">
                                        {/* Header Row */}
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                                        {delivery.orderId}
                                                    </h3>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                                        delivery.status === 'delivered'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : delivery.status === 'out-for-delivery'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : delivery.status === 'failed'
                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}>
                                                        {delivery.status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                
                                                {/* Delivery Information */}
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <User size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">{delivery.customerName}</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-600 dark:text-gray-400 break-words">{delivery.deliveryAddress}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            {format(new Date(delivery.deliveryDate), 'MMM d, yyyy')} • {delivery.deliveryTime}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedDelivery(delivery)
                                                        setShowDeliveryModal(true)
                                                    }}
                                                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors border whitespace-nowrap"
                                                    style={{ backgroundColor: '#3977ED', borderColor: '#3977ED' }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                                >
                                                    View Details
                                                </button>
                                                {delivery.status === 'pending' && (
                                                    <select
                                                        onChange={(e) => handleDeliveryStatusUpdate(delivery.id, e.target.value)}
                                                        className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                                        value={delivery.status}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="out-for-delivery">Out for Delivery</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="failed">Failed/Rescheduled</option>
                                                    </select>
                                                )}
                                                {delivery.status === 'out-for-delivery' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedDelivery(delivery)
                                                            setShowProofModal(true)
                                                        }}
                                                        className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors border whitespace-nowrap"
                                                        style={{ backgroundColor: '#3977ED', borderColor: '#3977ED' }}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Delivery Details Modal */}
            {showDeliveryModal && selectedDelivery && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{selectedDelivery.orderId}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Delivery ID: {selectedDelivery.id}</p>
                                </div>
                                <button
                                    onClick={() => setShowDeliveryModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                {selectedDelivery.status.replace('-', ' ')}
                            </span>
                        </div>
                        
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Customer Information */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <User size={18} />
                                    Customer Information
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name:</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{selectedDelivery.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-gray-400" />
                                        <a href={`tel:${selectedDelivery.customerPhone}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                            {selectedDelivery.customerPhone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Delivery Address */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <MapPin size={18} />
                                    Delivery Address
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{selectedDelivery.deliveryAddress}</p>
                            </div>
                            
                            {/* Delivery Date & Time */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Calendar size={18} />
                                    Delivery Schedule
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {format(new Date(selectedDelivery.deliveryDate), 'EEEE, MMMM d, yyyy')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time:</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{selectedDelivery.deliveryTime}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Order Details */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Package size={18} />
                                    Order Details
                                </h4>
                                <div className="space-y-2">
                                    {selectedDelivery.orderDetails.items.map((item, idx) => (
                                        <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                            • {item}
                                        </div>
                                    ))}
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Total: {selectedDelivery.orderDetails.total}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Special Instructions */}
                            {selectedDelivery.specialInstructions && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <AlertCircle size={18} />
                                        Special Instructions
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg break-words">
                                        {selectedDelivery.specialInstructions}
                                    </p>
                                </div>
                            )}
                            
                            {/* Status Update */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Update Status</h4>
                                <select
                                    onChange={(e) => {
                                        handleDeliveryStatusUpdate(selectedDelivery.id, e.target.value)
                                        if (e.target.value === 'out-for-delivery') {
                                            setShowDeliveryModal(false)
                                        }
                                    }}
                                    className="w-full px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    value={selectedDelivery.status}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="out-for-delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="failed">Failed/Rescheduled</option>
                                </select>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                {selectedDelivery.status === 'out-for-delivery' && (
                                    <button
                                        onClick={() => {
                                            setShowDeliveryModal(false)
                                            setShowProofModal(true)
                                        }}
                                        className="flex-1 px-4 py-2 text-white rounded-lg transition-colors text-sm font-semibold"
                                        style={{ backgroundColor: '#3977ED' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                    >
                                        Submit Proof of Delivery
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowDeliveryModal(false)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-semibold"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Proof of Delivery Modal */}
            {showProofModal && selectedDelivery && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Proof of Delivery</h3>
                                <button
                                    onClick={() => {
                                        setShowProofModal(false)
                                        setDeliverySignature(null)
                                        setDeliveryPhoto(null)
                                        setDeliveryNotes('')
                                    }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Order: {selectedDelivery.orderId}</p>
                        </div>
                        
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Customer Signature */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <PenTool size={18} />
                                    Customer Signature
                                </h4>
                                <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                                    <canvas
                                        ref={signatureCanvasRef}
                                        width={600}
                                        height={200}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded cursor-crosshair touch-none"
                                        style={{ maxWidth: '100%', height: '200px' }}
                                    />
                                    <button
                                        onClick={() => {
                                            setDeliverySignature(null)
                                            if (signatureCanvasRef.current) {
                                                const ctx = signatureCanvasRef.current.getContext('2d')
                                                ctx.clearRect(0, 0, signatureCanvasRef.current.width, signatureCanvasRef.current.height)
                                            }
                                        }}
                                        className="mt-3 text-sm text-red-600 dark:text-red-400 hover:underline"
                                    >
                                        Clear Signature
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Please have the customer sign above</p>
                            </div>
                            
                            {/* Photo Upload */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Camera size={18} />
                                    Delivery Photo
                                </h4>
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    {deliveryPhoto ? (
                                        <div className="relative w-full h-full">
                                            <img src={deliveryPhoto} alt="Delivery" className="w-full h-full object-cover rounded-lg" />
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setDeliveryPhoto(null)
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Camera size={48} className="text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload photo</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoUpload}
                                    />
                                </label>
                            </div>
                            
                            {/* Notes/Comments */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    Notes / Comments
                                </h4>
                                <textarea
                                    value={deliveryNotes}
                                    onChange={(e) => setDeliveryNotes(e.target.value)}
                                    placeholder="Add any notes or comments about the delivery..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors resize-none"
                                    rows={4}
                                />
                            </div>
                            
                            {/* Submit Button */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => handleProofOfDelivery(selectedDelivery.id)}
                                    className="flex-1 px-4 py-3 text-white rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                                    style={{ backgroundColor: '#3977ED' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5fc7'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3977ED'}
                                >
                                    <CheckCircle size={20} />
                                    Submit Proof of Delivery
                                </button>
                                <button
                                    onClick={() => {
                                        setShowProofModal(false)
                                        setDeliverySignature(null)
                                        setDeliveryPhoto(null)
                                        setDeliveryNotes('')
                                    }}
                                    className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

