import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    conversations: [], // All conversations between admin and employees
    activeConversation: null, // Currently active conversation ID
    messages: {}, // Messages grouped by conversation ID: { conversationId: [messages] }
    unreadCounts: {} // Unread message counts per conversation: { conversationId: count }
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // Initialize or load conversations
        loadConversations: (state, action) => {
            const stored = localStorage.getItem('chat_conversations')
            if (stored) {
                const data = JSON.parse(stored)
                state.conversations = data.conversations || []
                state.messages = data.messages || {}
                state.unreadCounts = data.unreadCounts || {}
            } else {
                // Initialize with sample conversations
                state.conversations = []
                state.messages = {}
                state.unreadCounts = {}
            }
        },
        
        // Create a new conversation
        createConversation: (state, action) => {
            const { adminId, employeeId, employeeName, adminName } = action.payload
            // Use consistent format: conv_admin_employeeId
            const conversationId = `conv_${adminId || 'admin'}_${employeeId}`
            
            const existingConv = state.conversations.find(
                conv => conv.id === conversationId
            )
            
            if (!existingConv) {
                const newConversation = {
                    id: conversationId,
                    adminId: adminId || 'admin',
                    employeeId,
                    adminName: adminName || 'Admin',
                    employeeName: employeeName || 'Employee',
                    lastMessage: null,
                    lastMessageTime: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                }
                state.conversations.push(newConversation)
                if (!state.messages[conversationId]) {
                    state.messages[conversationId] = []
                }
                if (!state.unreadCounts[conversationId]) {
                    state.unreadCounts[conversationId] = 0
                }
            }
            
            // Save to localStorage
            chatSlice.caseReducers.saveToLocalStorage(state)
        },
        
        // Send a message
        sendMessage: (state, action) => {
            const { conversationId, senderId, senderName, senderRole, message, timestamp, attachment } = action.payload
            
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = []
            }
            
            const newMessage = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                conversationId,
                senderId,
                senderName,
                senderRole, // 'admin' or 'employee'
                message,
                attachment: attachment || null,
                timestamp: timestamp || new Date().toISOString(),
                read: false
            }
            
            state.messages[conversationId].push(newMessage)
            
            // Update conversation last message
            const conversation = state.conversations.find(conv => conv.id === conversationId)
            if (conversation) {
                conversation.lastMessage = message
                conversation.lastMessageTime = newMessage.timestamp
            }
            
            // Increment unread count for the recipient
            const currentUser = JSON.parse(localStorage.getItem('employeeUser') || '{}')
            if (senderRole !== currentUser.role) {
                state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1
            }
            
            // Save to localStorage
            chatSlice.caseReducers.saveToLocalStorage(state)
        },
        
        // Mark messages as read
        markAsRead: (state, action) => {
            const { conversationId, userId } = action.payload
            
            if (state.messages[conversationId]) {
                state.messages[conversationId].forEach(msg => {
                    if (msg.senderId !== userId) {
                        msg.read = true
                    }
                })
            }
            
            state.unreadCounts[conversationId] = 0
            
            // Save to localStorage
            chatSlice.caseReducers.saveToLocalStorage(state)
        },
        
        // Set active conversation
        setActiveConversation: (state, action) => {
            state.activeConversation = action.payload
        },
        
        // Save to localStorage helper
        saveToLocalStorage: (state) => {
            localStorage.setItem('chat_conversations', JSON.stringify({
                conversations: state.conversations,
                messages: state.messages,
                unreadCounts: state.unreadCounts
            }))
        }
    }
})

export const {
    loadConversations,
    createConversation,
    sendMessage,
    markAsRead,
    setActiveConversation
} = chatSlice.actions

export default chatSlice.reducer

