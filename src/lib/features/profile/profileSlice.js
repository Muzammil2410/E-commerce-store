import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    profileCompletion: 0,
    language: 'en', // 'en' or other language codes
    emergencyContact: null
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        // Load profile data from localStorage
        loadProfile: (state, action) => {
            const { userId } = action.payload
            const stored = localStorage.getItem(`profile_${userId}`)
            if (stored) {
                const data = JSON.parse(stored)
                state.profileCompletion = data.profileCompletion || 0
                state.language = data.language || 'en'
                state.emergencyContact = data.emergencyContact || null
            }
        },
        
        // Update profile completion percentage
        updateProfileCompletion: (state, action) => {
            const { userId, completion } = action.payload
            state.profileCompletion = Math.min(100, Math.max(0, completion))
            
            // Save to localStorage
            profileSlice.caseReducers.saveToLocalStorage(state, userId)
        },
        
        // Update language preference
        updateLanguage: (state, action) => {
            const { userId, language } = action.payload
            state.language = language
            
            // Save to localStorage
            profileSlice.caseReducers.saveToLocalStorage(state, userId)
        },
        
        // Update emergency contact
        updateEmergencyContact: (state, action) => {
            const { userId, emergencyContact } = action.payload
            state.emergencyContact = emergencyContact
            
            // Save to localStorage
            profileSlice.caseReducers.saveToLocalStorage(state, userId)
        },
        
        // Calculate profile completion based on employee data
        calculateProfileCompletion: (state, action) => {
            const { employee } = action.payload
            let completion = 0
            const fields = [
                { key: 'name', weight: 15 },
                { key: 'email', weight: 15 },
                { key: 'phone', weight: 15 },
                { key: 'department', weight: 10 },
                { key: 'position', weight: 10 },
                { key: 'avatar', weight: 10 },
                { key: 'joinDate', weight: 10 }
            ]
            
            fields.forEach(field => {
                if (employee && employee[field.key]) {
                    completion += field.weight
                }
            })
            
            // Check emergency contact separately (from profile state)
            if (state.emergencyContact && state.emergencyContact.name && state.emergencyContact.phone) {
                completion += 15
            }
            
            state.profileCompletion = completion
        },
        
        // Save to localStorage helper
        saveToLocalStorage: (state, userId) => {
            if (userId) {
                localStorage.setItem(`profile_${userId}`, JSON.stringify({
                    profileCompletion: state.profileCompletion,
                    language: state.language,
                    emergencyContact: state.emergencyContact
                }))
            }
        }
    }
})

export const {
    loadProfile,
    updateProfileCompletion,
    updateLanguage,
    updateEmergencyContact,
    calculateProfileCompletion
} = profileSlice.actions

export default profileSlice.reducer

