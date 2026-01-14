import { createSlice } from '@reduxjs/toolkit'

// Helper function to get today's date string
const getTodayString = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
}

// Initialize with some sample attendance records
const initialState = {
    records: [
        {
            id: 'att_1',
            employeeId: 'emp_1',
            date: '2025-01-15',
            clockIn: '2025-01-15T09:00:00Z',
            clockOut: '2025-01-15T18:00:00Z',
            status: 'present', // present, absent, late, half-day
            hoursWorked: 9,
            notes: ''
        },
        {
            id: 'att_2',
            employeeId: 'emp_1',
            date: '2025-01-16',
            clockIn: '2025-01-16T09:15:00Z',
            clockOut: '2025-01-16T17:45:00Z',
            status: 'late',
            hoursWorked: 8.5,
            notes: 'Arrived 15 minutes late'
        },
        {
            id: 'att_3',
            employeeId: 'emp_2',
            date: '2025-01-15',
            clockIn: '2025-01-15T08:55:00Z',
            clockOut: '2025-01-15T18:05:00Z',
            status: 'present',
            hoursWorked: 9.17,
            notes: ''
        }
    ],
    currentSessions: {} // Track active clock-in sessions: { employeeId: { clockIn: timestamp, date: dateString } }
}

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        clockIn: (state, action) => {
            const { employeeId, timestamp } = action.payload
            const date = timestamp ? timestamp.split('T')[0] : getTodayString()
            
            // Check if already clocked in today
            const existingRecord = state.records.find(
                record => record.employeeId === employeeId && 
                record.date === date && 
                !record.clockOut
            )
            
            if (!existingRecord) {
                const newRecord = {
                    id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    employeeId,
                    date,
                    clockIn: timestamp || new Date().toISOString(),
                    clockOut: null,
                    status: 'present',
                    hoursWorked: 0,
                    notes: ''
                }
                state.records.push(newRecord)
                state.currentSessions[employeeId] = {
                    clockIn: newRecord.clockIn,
                    date: date,
                    recordId: newRecord.id
                }
            }
        },
        clockOut: (state, action) => {
            const { employeeId, timestamp } = action.payload
            const date = timestamp ? timestamp.split('T')[0] : getTodayString()
            
            // Find today's record
            const recordIndex = state.records.findIndex(
                record => record.employeeId === employeeId && 
                record.date === date && 
                !record.clockOut
            )
            
            if (recordIndex !== -1) {
                const clockInTime = new Date(state.records[recordIndex].clockIn)
                const clockOutTime = timestamp ? new Date(timestamp) : new Date()
                const millisecondsWorked = clockOutTime - clockInTime
                const hoursWorked = millisecondsWorked / (1000 * 60 * 60)
                const minutesWorked = millisecondsWorked / (1000 * 60)
                
                // Round hours to 2 decimal places
                const roundedHours = Math.round(hoursWorked * 100) / 100
                
                state.records[recordIndex].clockOut = clockOutTime.toISOString()
                state.records[recordIndex].hoursWorked = roundedHours
                
                // Determine status based on hours worked with accurate thresholds
                // Minimum 0.1 hours (6 minutes) to be considered valid work
                if (hoursWorked < 0.1) {
                    // Less than 6 minutes - mark as absent (invalid/accidental session)
                    state.records[recordIndex].status = 'absent'
                    state.records[recordIndex].hoursWorked = Math.round(hoursWorked * 100) / 100 // Keep actual time for display
                } else if (hoursWorked >= 4 && hoursWorked < 8) {
                    // 4-8 hours - half day
                    state.records[recordIndex].status = 'half-day'
                } else if (hoursWorked >= 8) {
                    // 8 hours or more - full day
                    state.records[recordIndex].status = 'present'
                } else {
                    // Less than 4 hours but more than 6 minutes - mark as absent (not a valid work day)
                    state.records[recordIndex].status = 'absent'
                }
                
                // Remove from current sessions
                delete state.currentSessions[employeeId]
            }
        },
        markAbsent: (state, action) => {
            const { employeeId, date, notes } = action.payload
            const dateString = date || getTodayString()
            
            const existingRecord = state.records.find(
                record => record.employeeId === employeeId && record.date === dateString
            )
            
            if (!existingRecord) {
                const newRecord = {
                    id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    employeeId,
                    date: dateString,
                    clockIn: null,
                    clockOut: null,
                    status: 'absent',
                    hoursWorked: 0,
                    notes: notes || ''
                }
                state.records.push(newRecord)
            }
        },
        updateAttendance: (state, action) => {
            const { id, updates } = action.payload
            const recordIndex = state.records.findIndex(record => record.id === id)
            if (recordIndex !== -1) {
                state.records[recordIndex] = {
                    ...state.records[recordIndex],
                    ...updates
                }
            }
        }
    }
})

export const { clockIn, clockOut, markAbsent, updateAttendance } = attendanceSlice.actions

export default attendanceSlice.reducer

