import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    workLogs: [], // Daily work logs
    currentTimer: null, // Current active timer: { startTime, employeeId, date }
    dailySummary: null // Today's work summary
}

const workLogSlice = createSlice({
    name: 'workLog',
    initialState,
    reducers: {
        // Load work logs from localStorage
        loadWorkLogs: (state, action) => {
            const { employeeId } = action.payload
            const stored = localStorage.getItem(`workLogs_${employeeId}`)
            if (stored) {
                const data = JSON.parse(stored)
                state.workLogs = data.workLogs || []
                state.currentTimer = data.currentTimer || null
                state.dailySummary = data.dailySummary || null
            }
        },
        
        // Start work timer
        startTimer: (state, action) => {
            const { employeeId, startTime } = action.payload
            state.currentTimer = {
                employeeId,
                startTime: startTime || new Date().toISOString(),
                date: new Date().toISOString().split('T')[0]
            }
            
            // Save to localStorage
            workLogSlice.caseReducers.saveToLocalStorage(state, employeeId)
        },
        
        // Stop work timer and create work log entry
        stopTimer: (state, action) => {
            const { employeeId, summary, tasksCompleted } = action.payload
            
            if (state.currentTimer && state.currentTimer.employeeId === employeeId) {
                const startTime = new Date(state.currentTimer.startTime)
                const endTime = new Date()
                const duration = Math.round((endTime - startTime) / 1000 / 60) // Duration in minutes
                
                const workLog = {
                    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    employeeId,
                    date: state.currentTimer.date,
                    startTime: state.currentTimer.startTime,
                    endTime: endTime.toISOString(),
                    duration, // in minutes
                    summary: summary || '',
                    tasksCompleted: tasksCompleted || [],
                    createdAt: new Date().toISOString()
                }
                
                state.workLogs.unshift(workLog)
                state.currentTimer = null
                state.dailySummary = workLog
                
                // Save to localStorage
                workLogSlice.caseReducers.saveToLocalStorage(state, employeeId)
            }
        },
        
        // Update daily summary
        updateDailySummary: (state, action) => {
            const { employeeId, summary } = action.payload
            const today = new Date().toISOString().split('T')[0]
            
            // Find today's log or create new
            let todayLog = state.workLogs.find(
                log => log.employeeId === employeeId && log.date === today
            )
            
            if (todayLog) {
                todayLog.summary = summary
                state.dailySummary = todayLog
            } else {
                state.dailySummary = {
                    id: `log_${Date.now()}`,
                    employeeId,
                    date: today,
                    summary,
                    tasksCompleted: [],
                    createdAt: new Date().toISOString()
                }
            }
            
            // Save to localStorage
            workLogSlice.caseReducers.saveToLocalStorage(state, employeeId)
        },
        
        // Get today's summary
        getTodaySummary: (state, action) => {
            const { employeeId } = action.payload
            const today = new Date().toISOString().split('T')[0]
            
            state.dailySummary = state.workLogs.find(
                log => log.employeeId === employeeId && log.date === today
            ) || null
        },
        
        // Save to localStorage helper
        saveToLocalStorage: (state, employeeId) => {
            if (employeeId) {
                localStorage.setItem(`workLogs_${employeeId}`, JSON.stringify({
                    workLogs: state.workLogs,
                    currentTimer: state.currentTimer,
                    dailySummary: state.dailySummary
                }))
            }
        }
    }
})

export const {
    loadWorkLogs,
    startTimer,
    stopTimer,
    updateDailySummary,
    getTodaySummary
} = workLogSlice.actions

export default workLogSlice.reducer

