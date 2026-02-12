'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, X, MessageCircle, Bot } from 'lucide-react'
import { assets } from '@/assets/assets'

const AIAssistantModal = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            sender: 'ai',
            text: 'Hello! I am your AI Assistant. How can I help you today?',
            timestamp: new Date().toISOString()
        }
    ])
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    if (!isOpen) return null

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!message.trim()) return

        const userMsg = {
            id: Date.now().toString(),
            sender: 'user',
            text: message,
            timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, userMsg])
        setMessage('')

        // Simple mock response
        setTimeout(() => {
            const aiMsg = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: 'Thank you for your message! I am a demonstration AI. How else can I assist you with our store?',
                timestamp: new Date().toISOString()
            }
            setMessages(prev => [...prev, aiMsg])
        }, 1000)
    }

    return (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-[60] flex flex-col border border-gray-200 dark:border-gray-700 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 overflow-hidden">
                        <img src={assets.ChatIcon} alt="AI" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">AI Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-xs text-blue-100">Online</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-tl-none'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors shadow-md"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AIAssistantModal
