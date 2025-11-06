'use client'

import { Send, X, MessageCircle } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast';

const ChatModal = ({ chatModal, setChatModal, userType = 'buyer' }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Load existing messages from localStorage
        if (chatModal?.orderId) {
            const chatKey = `chat_${chatModal.orderId}`;
            const existingMessages = JSON.parse(localStorage.getItem(chatKey) || '[]');
            setMessages(existingMessages);
        }
    }, [chatModal]);

    useEffect(() => {
        // Auto scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!message.trim()) {
            return toast.error('Please enter a message');
        }

        const chatKey = `chat_${chatModal.orderId}`;
        const existingMessages = JSON.parse(localStorage.getItem(chatKey) || '[]');
        
        const newMessage = {
            id: `msg_${Date.now()}`,
            sender: userType,
            senderName: chatModal.senderName || (userType === 'buyer' ? 'Buyer' : 'Seller'),
            message: message.trim(),
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...existingMessages, newMessage];
        localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
        setMessages(updatedMessages);
        setMessage('');
        inputRef.current?.focus();
        
        toast.success('Message sent!');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const groupedMessages = messages.reduce((acc, msg) => {
        const date = new Date(msg.timestamp).toDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(msg);
        return acc;
    }, {});

    return (
        <div 
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
            onClick={(e) => e.target === e.currentTarget && setChatModal(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
        >
            <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col relative'>
                {/* Header */}
                <div className='bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between'>
                    <div className="flex items-center gap-3">
                        <MessageCircle size={24} aria-hidden="true" />
                        <div>
                            <h2 id="chat-title" className='text-lg font-semibold'>
                                Order Chat
                            </h2>
                            <p className='text-sm text-blue-100'>
                                Order #{chatModal?.orderId?.slice(-8) || ''} • {chatModal?.otherPartyName || 'Chat'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setChatModal(null)} 
                        className='text-white hover:bg-blue-700 p-1 rounded focus:outline-none focus:ring-2 focus:ring-white rounded'
                        aria-label="Close chat"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
                    {Object.keys(groupedMessages).length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                                <div key={date}>
                                    <div className="text-center my-4">
                                        <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                            {formatDate(dateMessages[0].timestamp)}
                                        </span>
                                    </div>
                                    {dateMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'} mb-2`}
                                        >
                                            <div
                                                className={`max-w-[75%] rounded-lg p-3 ${
                                                    msg.sender === userType
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-800 border border-gray-200'
                                                }`}
                                            >
                                                {msg.sender !== userType && (
                                                    <p className="text-xs font-semibold mb-1 opacity-75">
                                                        {msg.senderName}
                                                    </p>
                                                )}
                                                <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                                <p
                                                    className={`text-xs mt-1 ${
                                                        msg.sender === userType ? 'text-blue-100' : 'text-gray-500'
                                                    }`}
                                                >
                                                    {formatTime(msg.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className='border-t border-gray-200 p-4 bg-white'>
                    <div className="flex gap-2">
                        <textarea
                            ref={inputRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder='Type your message...'
                            className='flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
                            rows="2"
                            aria-label="Message input"
                        />
                        <button
                            onClick={handleSendMessage}
                            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2'
                            aria-label="Send message"
                        >
                            <Send size={18} />
                            <span className="hidden sm:inline">Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatModal

