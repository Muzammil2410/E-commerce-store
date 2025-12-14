'use client'

import { Send, X, MessageCircle, Plus, Camera, Image as ImageIcon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast';

const ChatModal = ({ chatModal, setChatModal, userType = 'buyer' }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const attachmentMenuRef = useRef(null);

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

    useEffect(() => {
        // Close attachment menu when clicking outside
        const handleClickOutside = (event) => {
            if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
                setShowAttachmentMenu(false);
            }
        };

        if (showAttachmentMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAttachmentMenu]);

    const handleTakePhoto = () => {
        setShowAttachmentMenu(false);
        // Ensure camera input has capture attribute set before clicking
        if (cameraInputRef.current) {
            cameraInputRef.current.setAttribute('capture', 'environment');
            cameraInputRef.current.setAttribute('accept', 'image/*');
            // Small delay to ensure attributes are set
            setTimeout(() => {
                cameraInputRef.current?.click();
            }, 10);
        }
    };

    const handleAttachPhoto = () => {
        setShowAttachmentMenu(false);
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e, isCamera = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage({
                file: file,
                preview: reader.result,
                type: isCamera ? 'camera' : 'gallery'
            });
        };
        reader.readAsDataURL(file);
        
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
    };

    const handleSendMessage = () => {
        if (!message.trim() && !selectedImage) {
            return toast.error('Please enter a message or attach an image');
        }

        const chatKey = `chat_${chatModal.orderId}`;
        const existingMessages = JSON.parse(localStorage.getItem(chatKey) || '[]');
        
        const newMessage = {
            id: `msg_${Date.now()}`,
            sender: userType,
            senderName: chatModal.senderName || (userType === 'buyer' ? 'Buyer' : 'Seller'),
            message: message.trim(),
            image: selectedImage?.preview || null,
            imageName: selectedImage?.file?.name || null,
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...existingMessages, newMessage];
        localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
        setMessages(updatedMessages);
        setMessage('');
        setSelectedImage(null);
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
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4 transition-colors duration-200'
            onClick={(e) => e.target === e.currentTarget && setChatModal(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
        >
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 w-full max-w-2xl h-[600px] flex flex-col relative transition-colors duration-200'>
                {/* Header */}
                <div className='bg-blue-600 dark:bg-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between transition-colors duration-200'>
                    <div className="flex items-center gap-3">
                        <MessageCircle size={24} aria-hidden="true" />
                        <div>
                            <h2 id="chat-title" className='text-lg font-semibold'>
                                Order Chat
                            </h2>
                            <p className='text-sm text-blue-100 dark:text-blue-200'>
                                Order #{chatModal?.orderId?.slice(-8) || ''} • {chatModal?.otherPartyName || 'Chat'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setChatModal(null)} 
                        className='text-white hover:bg-blue-700 dark:hover:bg-blue-600 p-1 rounded focus:outline-none focus:ring-2 focus:ring-white rounded transition-colors duration-200'
                        aria-label="Close chat"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className='flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
                    {Object.keys(groupedMessages).length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            <div className="text-center">
                                <MessageCircle size={48} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                <p className="transition-colors duration-200">No messages yet. Start the conversation!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                                <div key={date}>
                                    <div className="text-center my-4">
                                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full transition-colors duration-200">
                                            {formatDate(dateMessages[0].timestamp)}
                                        </span>
                                    </div>
                                    {dateMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'} mb-2`}
                                        >
                                            <div
                                                className={`max-w-[75%] rounded-lg p-3 transition-colors duration-200 ${
                                                    msg.sender === userType
                                                        ? 'bg-blue-600 dark:bg-blue-700 text-white'
                                                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                                                }`}
                                            >
                                                {msg.sender !== userType && (
                                                    <p className="text-xs font-semibold mb-1 opacity-75 dark:opacity-90">
                                                        {msg.senderName}
                                                    </p>
                                                )}
                                                {msg.image && (
                                                    <div className="mb-2">
                                                        <img 
                                                            src={msg.image} 
                                                            alt={msg.imageName || 'Attached image'} 
                                                            className="max-w-full h-auto rounded-lg cursor-pointer"
                                                            onClick={() => {
                                                                // Open image in new tab for full view
                                                                const newWindow = window.open();
                                                                if (newWindow) {
                                                                    newWindow.document.write(`<img src="${msg.image}" style="max-width:100%;height:auto;" />`);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                {msg.message && (
                                                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                                )}
                                                <p
                                                    className={`text-xs mt-1 transition-colors duration-200 ${
                                                        msg.sender === userType ? 'text-blue-100 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'
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
                <div className='border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200'>
                    {/* Selected Image Preview */}
                    {selectedImage && (
                        <div className="px-4 pt-4">
                            <div className="relative inline-block">
                                <img 
                                    src={selectedImage.preview} 
                                    alt="Preview" 
                                    className="max-w-xs h-32 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-md transition-colors duration-200"
                                />
                                <button
                                    onClick={removeSelectedImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                                    aria-label="Remove image"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="p-4">
                        <div className="flex items-end gap-3">
                            {/* Attachment Button */}
                            <div className="relative flex-shrink-0" ref={attachmentMenuRef}>
                                <button
                                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                                    className='bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-200 p-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md'
                                    aria-label="Attach file"
                                >
                                    <Plus size={20} />
                                </button>
                                
                                {/* Attachment Menu */}
                                {showAttachmentMenu && (
                                    <div className="absolute bottom-full left-0 mb-3 bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 py-2 min-w-[200px] z-10 overflow-hidden transition-colors duration-200">
                                        <button
                                            onClick={handleTakePhoto}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left group"
                                        >
                                            <div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg p-2 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                                                <Camera size={18} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Take a photo</span>
                                        </button>
                                        <button
                                            onClick={handleAttachPhoto}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors text-left group"
                                        >
                                            <div className="bg-purple-100 dark:bg-purple-900/50 rounded-lg p-2 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                                                <ImageIcon size={18} className="text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Attach a photo</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Hidden File Inputs */}
                            <input
                                ref={cameraInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(e) => handleFileSelect(e, true)}
                                className="hidden"
                                aria-label="Camera input"
                            />
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e, false)}
                                className="hidden"
                                aria-label="File input"
                            />

                            {/* Message Input */}
                            <div className="flex-1 min-w-0">
                                <textarea
                                    ref={inputRef}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder='Type your message...'
                                    className='w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 text-sm'
                                    rows="1"
                                    style={{ minHeight: '44px', maxHeight: '120px' }}
                                    aria-label="Message input"
                                />
                            </div>

                            {/* Send Button */}
                            <button
                                onClick={handleSendMessage}
                                className='bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex-shrink-0'
                                aria-label="Send message"
                            >
                                <Send size={18} />
                                <span className="hidden sm:inline font-semibold">Send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatModal

