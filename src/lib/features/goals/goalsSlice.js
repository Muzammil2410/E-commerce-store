import { createSlice } from '@reduxjs/toolkit'
import { startOfWeek, endOfWeek } from 'date-fns'

const initialState = {
    weeklyGoals: {} // { userId: { weekStart: [goals] } }
}

const goalsSlice = createSlice({
    name: 'goals',
    initialState,
    reducers: {
        // Load goals from localStorage
        loadGoals: (state, action) => {
            const { userId } = action.payload
            const stored = localStorage.getItem(`goals_${userId}`)
            if (stored) {
                const data = JSON.parse(stored)
                state.weeklyGoals[userId] = data.weeklyGoals || {}
            } else {
                state.weeklyGoals[userId] = {}
            }
        },
        
        // Get current week's goals
        getCurrentWeekGoals: (state, action) => {
            const { userId } = action.payload
            const now = new Date()
            const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString().split('T')[0]
            
            if (!state.weeklyGoals[userId]) {
                state.weeklyGoals[userId] = {}
            }
            
            if (!state.weeklyGoals[userId][weekStart]) {
                state.weeklyGoals[userId][weekStart] = []
            }
        },
        
        // Add a goal for the current week
        addGoal: (state, action) => {
            const { userId, title, description, targetValue, currentValue } = action.payload
            const now = new Date()
            const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString().split('T')[0]
            
            if (!state.weeklyGoals[userId]) {
                state.weeklyGoals[userId] = {}
            }
            
            if (!state.weeklyGoals[userId][weekStart]) {
                state.weeklyGoals[userId][weekStart] = []
            }
            
            const newGoal = {
                id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title,
                description: description || '',
                targetValue: targetValue || 1,
                currentValue: currentValue || 0,
                completed: false,
                createdAt: new Date().toISOString()
            }
            
            state.weeklyGoals[userId][weekStart].push(newGoal)
            
            // Save to localStorage
            goalsSlice.caseReducers.saveToLocalStorage(state, userId)
        },
        
        // Update goal progress
        updateGoalProgress: (state, action) => {
            const { userId, goalId, currentValue } = action.payload
            const now = new Date()
            const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString().split('T')[0]
            
            if (state.weeklyGoals[userId] && state.weeklyGoals[userId][weekStart]) {
                const goal = state.weeklyGoals[userId][weekStart].find(g => g.id === goalId)
                if (goal) {
                    goal.currentValue = currentValue
                    goal.completed = goal.currentValue >= goal.targetValue
                    
                    // Save to localStorage
                    goalsSlice.caseReducers.saveToLocalStorage(state, userId)
                }
            }
        },
        
        // Delete a goal
        deleteGoal: (state, action) => {
            const { userId, goalId } = action.payload
            const now = new Date()
            const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString().split('T')[0]
            
            if (state.weeklyGoals[userId] && state.weeklyGoals[userId][weekStart]) {
                state.weeklyGoals[userId][weekStart] = state.weeklyGoals[userId][weekStart].filter(
                    g => g.id !== goalId
                )
                
                // Save to localStorage
                goalsSlice.caseReducers.saveToLocalStorage(state, userId)
            }
        },
        
        // Save to localStorage helper
        saveToLocalStorage: (state, userId) => {
            if (userId && state.weeklyGoals[userId]) {
                localStorage.setItem(`goals_${userId}`, JSON.stringify({
                    weeklyGoals: state.weeklyGoals[userId]
                }))
            }
        }
    }
})

export const {
    loadGoals,
    getCurrentWeekGoals,
    addGoal,
    updateGoalProgress,
    deleteGoal
} = goalsSlice.actions

export default goalsSlice.reducer

