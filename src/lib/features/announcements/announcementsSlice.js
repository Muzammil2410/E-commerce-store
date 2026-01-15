import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    announcements: [],
    unreadCount: 0
}

const announcementsSlice = createSlice({
    name: 'announcements',
    initialState,
    reducers: {
        // Load announcements from localStorage
        loadAnnouncements: (state) => {
            const stored = localStorage.getItem('announcements')
            if (stored) {
                const data = JSON.parse(stored)
                state.announcements = data.announcements || []
                state.unreadCount = data.unreadCount || 0
            } else {
                // Initialize with sample announcements
                state.announcements = [
                    {
                        id: 'ann_1',
                        title: 'Welcome to the Team!',
                        content: 'We are excited to have you on board. Please complete your profile to get started.',
                        authorId: 'admin',
                        authorName: 'Admin',
                        createdAt: new Date().toISOString(),
                        priority: 'normal', // 'high', 'normal', 'low'
                        readBy: []
                    }
                ]
                state.unreadCount = 1
                announcementsSlice.caseReducers.saveToLocalStorage(state)
            }
        },
        
        // Create a new announcement (admin only)
        createAnnouncement: (state, action) => {
            const { title, content, authorId, authorName, priority } = action.payload
            
            const newAnnouncement = {
                id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title,
                content,
                authorId,
                authorName: authorName || 'Admin',
                createdAt: new Date().toISOString(),
                priority: priority || 'normal',
                readBy: []
            }
            
            state.announcements.unshift(newAnnouncement)
            state.unreadCount += 1
            
            // Save to localStorage
            announcementsSlice.caseReducers.saveToLocalStorage(state)
        },
        
        // Mark announcement as read
        markAnnouncementAsRead: (state, action) => {
            const { announcementId, userId } = action.payload
            
            const announcement = state.announcements.find(ann => ann.id === announcementId)
            if (announcement && !announcement.readBy.includes(userId)) {
                announcement.readBy.push(userId)
                state.unreadCount = Math.max(0, state.unreadCount - 1)
                
                // Save to localStorage
                announcementsSlice.caseReducers.saveToLocalStorage(state)
            }
        },
        
        // Mark all announcements as read
        markAllAsRead: (state, action) => {
            const { userId } = action.payload
            
            state.announcements.forEach(announcement => {
                if (!announcement.readBy.includes(userId)) {
                    announcement.readBy.push(userId)
                }
            })
            
            state.unreadCount = 0
            
            // Save to localStorage
            announcementsSlice.caseReducers.saveToLocalStorage(state)
        },
        
        // Delete announcement (admin only)
        deleteAnnouncement: (state, action) => {
            const announcementId = action.payload
            const announcement = state.announcements.find(ann => ann.id === announcementId)
            
            if (announcement) {
                const wasUnread = announcement.readBy.length === 0
                state.announcements = state.announcements.filter(ann => ann.id !== announcementId)
                
                if (wasUnread) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1)
                }
                
                // Save to localStorage
                announcementsSlice.caseReducers.saveToLocalStorage(state)
            }
        },
        
        // Save to localStorage helper
        saveToLocalStorage: (state) => {
            localStorage.setItem('announcements', JSON.stringify({
                announcements: state.announcements,
                unreadCount: state.unreadCount
            }))
        }
    }
})

export const {
    loadAnnouncements,
    createAnnouncement,
    markAnnouncementAsRead,
    markAllAsRead,
    deleteAnnouncement
} = announcementsSlice.actions

export default announcementsSlice.reducer

